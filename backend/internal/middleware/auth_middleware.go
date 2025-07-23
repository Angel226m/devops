package middleware

import (
	"database/sql"
	"fmt"
	"net/http"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/repositorios"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"strconv"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v4"
)

// AuthMiddleware crea un middleware para autenticación JWT de usuarios administrativos
// AuthMiddleware crea un middleware para autenticación JWT de usuarios administrativos
func AuthMiddleware(config *config.Config, db *sql.DB) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		fmt.Println("AuthMiddleware: Iniciando verificación de autenticación")
		fmt.Printf("Headers recibidos: %v\n", ctx.Request.Header)
		fmt.Printf("Cookies recibidas: %v\n", ctx.Request.Cookies())

		// Obtener token de la cookie
		tokenString, err := ctx.Cookie("access_token")
		if err != nil {
			fmt.Printf("AuthMiddleware: Cookie access_token no encontrada: %v\n", err)
		} else if len(tokenString) > 20 {
			fmt.Printf("Token de cookie (primeros 20 caracteres): %s...\n", tokenString[:20]+"...")
		} else {
			fmt.Printf("Token de cookie: %v\n", tokenString)
		}

		// Si no hay cookie, intentar obtenerlo del header Authorization
		if err != nil || tokenString == "" {
			authHeader := ctx.GetHeader("Authorization")
			fmt.Printf("AuthMiddleware: Authorization header: %v\n", authHeader != "")

			if authHeader == "" {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token no proporcionado", nil))
				ctx.Abort()
				return
			}

			// Verificar formato Bearer
			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Formato de token inválido", nil))
				ctx.Abort()
				return
			}

			// Extraer token
			tokenString = tokenParts[1]
			fmt.Printf("AuthMiddleware: Token obtenido del header Authorization\n")
		}

		// Parsear y validar el token
		token, err := jwt.ParseWithClaims(tokenString, &utils.TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
			// Verificar que el algoritmo de firma es el esperado
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("Algoritmo de firma no esperado", jwt.ValidationErrorSignatureInvalid)
			}
			return []byte(config.JWTSecret), nil
		})

		// Mejorar el manejo de errores para mostrar más detalles
		if err != nil {
			fmt.Printf("AuthMiddleware: Error validando token: %v, tipo: %T\n", err, err)

			// Verificar causas comunes de error
			if validationErr, ok := err.(*jwt.ValidationError); ok {
				if validationErr.Errors&jwt.ValidationErrorExpired != 0 {
					fmt.Println("AuthMiddleware: El token ha expirado")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token expirado", nil))
				} else if validationErr.Errors&jwt.ValidationErrorSignatureInvalid != 0 {
					fmt.Println("AuthMiddleware: La firma del token es inválida")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Firma del token inválida", nil))
				} else if validationErr.Errors&jwt.ValidationErrorMalformed != 0 {
					fmt.Println("AuthMiddleware: El token está malformado")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token malformado", nil))
				} else if validationErr.Errors&jwt.ValidationErrorClaimsInvalid != 0 {
					fmt.Println("AuthMiddleware: Los claims del token son inválidos")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Claims del token inválidos", nil))
				} else {
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token inválido", nil))
				}
			} else {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token inválido", nil))
			}

			ctx.Abort()
			return
		}

		// Verificar que el token es válido y obtener los claims
		if claims, ok := token.Claims.(*utils.TokenClaims); ok && token.Valid {
			fmt.Printf("AuthMiddleware: Token válido para usuario ID: %d, Rol: %s\n", claims.UserID, claims.Role)

			// NUEVO: Verificar el rol contra la base de datos
			userRepo := repositorios.NewUsuarioRepository(db)
			usuario, err := userRepo.GetByID(claims.UserID)

			var userRole string
			var sedeID int = 0

			if err == nil && usuario != nil {
				// Si pudimos obtener el usuario, verificar si hay discrepancia de rol
				if usuario.Rol != claims.Role {
					fmt.Printf("AuthMiddleware: Discrepancia de rol detectada: Token=%s, BD=%s\n",
						claims.Role, usuario.Rol)

					// Usar el rol de la base de datos (el correcto)
					userRole = usuario.Rol

					// Si el usuario tiene una sede asignada, usarla
					if usuario.Rol != "ADMIN" && usuario.IdSede != nil {
						sedeID = *usuario.IdSede
					} else if claims.SedeID > 0 && usuario.Rol == "ADMIN" {
						// Si es admin y el token tiene una sede seleccionada, respetarla
						sedeID = claims.SedeID
					}

					// Generar nuevos tokens con el rol correcto
					authService := servicios.NewAuthService(userRepo, nil, config)

					var newToken, newRefreshToken string
					var tokenErr error

					// Determinar si el refresh token tiene remember_me activo
					refreshToken, _ := ctx.Cookie("refresh_token")
					var isRememberMe bool = false

					if refreshToken != "" {
						refreshClaims, _ := utils.GetRefreshTokenClaims(refreshToken, config)
						if refreshClaims != nil {
							issuedAt := refreshClaims.IssuedAt.Time
							expiresAt := refreshClaims.ExpiresAt.Time
							isRememberMe = expiresAt.Sub(issuedAt) > 24*time.Hour
						}
					}

					// Generar tokens según el rol y sede
					if sedeID > 0 {
						newToken, newRefreshToken, tokenErr = authService.GenerateTokensForAdminWithSede(
							claims.UserID, sedeID, isRememberMe)
					} else {
						newToken, newRefreshToken, tokenErr = authService.GenerateTokensWithoutDb(
							claims.UserID, userRole, isRememberMe)
					}

					if tokenErr == nil {
						// Actualizar cookies con los nuevos tokens
						fmt.Println("AuthMiddleware: Regenerando tokens con rol correcto")

						ctx.SetSameSite(http.SameSiteNoneMode)
						ctx.SetCookie(
							"access_token", // Nombre
							newToken,       // Valor
							60*15,          // Tiempo de vida (15 min)
							"/",            // Path
							"",             // Domain
							true,           // Secure
							false,          // HttpOnly
						)

						var refreshExpiry int
						if isRememberMe {
							refreshExpiry = 60 * 60 * 24 * 7 // 7 días
						} else {
							refreshExpiry = 60 * 60 // 1 hora
						}

						ctx.SetSameSite(http.SameSiteNoneMode)
						ctx.SetCookie(
							"refresh_token", // Nombre
							newRefreshToken, // Valor
							refreshExpiry,   // Tiempo de vida
							"/",             // Path
							"",              // Domain
							true,            // Secure
							false,           // HttpOnly
						)
					} else {
						fmt.Printf("AuthMiddleware: Error al regenerar tokens: %v\n", tokenErr)
					}
				} else {
					// No hay discrepancia, usar los valores del token
					userRole = claims.Role
					sedeID = claims.SedeID
				}
			} else {
				// Si no pudimos obtener el usuario, usar el rol del token (pero loguear el error)
				fmt.Printf("AuthMiddleware: No se pudo verificar el usuario en BD: %v\n", err)
				userRole = claims.Role
				sedeID = claims.SedeID
			}

			// Guardar claims en el contexto (con valores posiblemente corregidos)
			ctx.Set("userID", claims.UserID)
			ctx.Set("userRole", userRole) // Puede ser diferente del token

			// Para administradores con sede seleccionada
			if userRole == "ADMIN" && sedeID > 0 {
				// El admin ha seleccionado una sede específica
				ctx.Set("sedeID", sedeID)
				ctx.Set("adminConSede", true) // Bandera para indicar admin con sede específica
				fmt.Printf("AuthMiddleware: Admin con sede seleccionada: %d\n", sedeID)
			} else if userRole == "ADMIN" {
				// Admin sin sede específica (puede ver todas)
				ctx.Set("adminSinSede", true) // Bandera para indicar admin sin sede específica
				fmt.Println("AuthMiddleware: Admin sin sede específica")
			} else if sedeID > 0 {
				// Otros roles solo pueden ver su sede asignada
				ctx.Set("sedeID", sedeID)
				fmt.Printf("AuthMiddleware: Usuario con sede asignada: %d\n", sedeID)
			}

			fmt.Printf("AuthMiddleware: Contexto establecido - userID: %d, userRole: %s\n",
				claims.UserID, userRole)

			ctx.Next()
		} else {
			fmt.Println("AuthMiddleware: Error: token inválido o claims no coinciden con el tipo esperado")
			ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token inválido", nil))
			ctx.Abort()
			return
		}
	}
}

/*
func AuthMiddleware(config *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Agregar logs para depuración
		fmt.Println("AuthMiddleware: Iniciando verificación de autenticación")
		fmt.Printf("Headers recibidos: %v\n", ctx.Request.Header)
		fmt.Printf("Cookies recibidas: %v\n", ctx.Request.Cookies())

		// Obtener token de la cookie
		tokenString, err := ctx.Cookie("access_token")
		if err != nil {
			fmt.Printf("AuthMiddleware: Cookie access_token no encontrada: %v\n", err)
		} else if len(tokenString) > 20 {
			fmt.Printf("Token de cookie (primeros 20 caracteres): %s...\n", tokenString[:20]+"...")
		} else {
			fmt.Printf("Token de cookie: %v\n", tokenString)
		}

		// Si no hay cookie, intentar obtenerlo del header Authorization
		if err != nil || tokenString == "" {
			authHeader := ctx.GetHeader("Authorization")
			fmt.Printf("AuthMiddleware: Authorization header: %v\n", authHeader != "")

			if authHeader == "" {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token no proporcionado", nil))
				ctx.Abort()
				return
			}

			// Verificar formato Bearer
			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Formato de token inválido", nil))
				ctx.Abort()
				return
			}

			// Extraer token
			tokenString = tokenParts[1]
			fmt.Printf("AuthMiddleware: Token obtenido del header Authorization\n")
		}

		// Parsear y validar el token
		token, err := jwt.ParseWithClaims(tokenString, &utils.TokenClaims{}, func(token *jwt.Token) (interface{}, error) {
			// Verificar que el algoritmo de firma es el esperado
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.NewValidationError("Algoritmo de firma no esperado", jwt.ValidationErrorSignatureInvalid)
			}
			return []byte(config.JWTSecret), nil
		})

		// Mejorar el manejo de errores para mostrar más detalles
		if err != nil {
			fmt.Printf("AuthMiddleware: Error validando token: %v, tipo: %T\n", err, err)

			// Verificar causas comunes de error
			if validationErr, ok := err.(*jwt.ValidationError); ok {
				if validationErr.Errors&jwt.ValidationErrorExpired != 0 {
					fmt.Println("AuthMiddleware: El token ha expirado")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token expirado", nil))
				} else if validationErr.Errors&jwt.ValidationErrorSignatureInvalid != 0 {
					fmt.Println("AuthMiddleware: La firma del token es inválida")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Firma del token inválida", nil))
				} else if validationErr.Errors&jwt.ValidationErrorMalformed != 0 {
					fmt.Println("AuthMiddleware: El token está malformado")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token malformado", nil))
				} else if validationErr.Errors&jwt.ValidationErrorClaimsInvalid != 0 {
					fmt.Println("AuthMiddleware: Los claims del token son inválidos")
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Claims del token inválidos", nil))
				} else {
					ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token inválido", nil))
				}
			} else {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token inválido", nil))
			}

			ctx.Abort()
			return
		}

		// Verificar que el token es válido y obtener los claims
		if claims, ok := token.Claims.(*utils.TokenClaims); ok && token.Valid {
			fmt.Printf("AuthMiddleware: Token válido para usuario ID: %d, Rol: %s\n", claims.UserID, claims.Role)

			// Guardar claims en el contexto
			ctx.Set("userID", claims.UserID)
			ctx.Set("userRole", claims.Role)

			// Para administradores con sede seleccionada
			if claims.Role == "ADMIN" && claims.SedeID > 0 {
				// El admin ha seleccionado una sede específica
				ctx.Set("sedeID", claims.SedeID)
				ctx.Set("adminConSede", true) // Bandera para indicar admin con sede específica
				fmt.Printf("AuthMiddleware: Admin con sede seleccionada: %d\n", claims.SedeID)
			} else if claims.Role == "ADMIN" {
				// Admin sin sede específica (puede ver todas)
				ctx.Set("adminSinSede", true) // Bandera para indicar admin sin sede específica
				fmt.Println("AuthMiddleware: Admin sin sede específica")
			} else if claims.SedeID > 0 {
				// Otros roles solo pueden ver su sede asignada
				ctx.Set("sedeID", claims.SedeID)
				fmt.Printf("AuthMiddleware: Usuario con sede asignada: %d\n", claims.SedeID)
			}

			ctx.Next()

			fmt.Printf("AuthMiddleware: Contexto establecido - userID: %d, userRole: %s\n",
				claims.UserID, claims.Role)
		} else {
			fmt.Println("AuthMiddleware: Error: token inválido o claims no coinciden con el tipo esperado")
			ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token inválido", nil))
			ctx.Abort()
			return
		}
	}
}*/

// ClienteAuthMiddleware crea un middleware para autenticación JWT de clientes
func ClienteAuthMiddleware(config *config.Config) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Agregar logs para depuración
		fmt.Println("ClienteAuthMiddleware: Iniciando verificación de autenticación de cliente")
		fmt.Printf("Headers recibidos: %v\n", ctx.Request.Header)
		fmt.Printf("Cookies recibidas: %v\n", ctx.Request.Cookies())

		// Obtener token de la cookie
		tokenString, err := ctx.Cookie("access_token")
		if err != nil {
			fmt.Printf("ClienteAuthMiddleware: Cookie access_token no encontrada: %v\n", err)
		} else if len(tokenString) > 20 {
			fmt.Printf("Token de cookie (primeros 20 caracteres): %s...\n", tokenString[:20]+"...")
		} else {
			fmt.Printf("Token de cookie: %v\n", tokenString)
		}

		// Si no hay cookie, intentar obtenerlo del header Authorization
		if err != nil || tokenString == "" {
			authHeader := ctx.GetHeader("Authorization")
			fmt.Printf("ClienteAuthMiddleware: Authorization header: %v\n", authHeader != "")

			if authHeader == "" {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token no proporcionado", nil))
				ctx.Abort()
				return
			}

			// Verificar formato Bearer
			tokenParts := strings.Split(authHeader, " ")
			if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
				ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Formato de token inválido", nil))
				ctx.Abort()
				return
			}

			// Extraer token
			tokenString = tokenParts[1]
			fmt.Printf("ClienteAuthMiddleware: Token obtenido del header Authorization\n")
		}

		// Usar ValidateClienteToken para validar tokens de clientes
		claims, err := utils.ValidateClienteToken(tokenString, config)
		if err != nil {
			fmt.Printf("ClienteAuthMiddleware: Error validando token de cliente: %v\n", err)
			ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Token de cliente inválido", nil))
			ctx.Abort()
			return
		}

		// Si llegamos aquí, el token es válido
		fmt.Printf("ClienteAuthMiddleware: Token válido para cliente ID: %d, Correo: %s\n",
			claims.ClienteID, claims.Correo)

		// Guardar claims en el contexto
		ctx.Set("userID", claims.ClienteID)
		ctx.Set("userEmail", claims.Correo)
		ctx.Set("userType", "CLIENTE") // Para distinguir de usuarios administrativos

		ctx.Next()
	}
}

// RoleMiddleware crea un middleware para restricción por rol
func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Obtener rol del contexto (establecido por AuthMiddleware)
		userRole, exists := ctx.Get("userRole")
		if !exists {
			ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Usuario no autenticado", nil))
			ctx.Abort()
			return
		}

		// Verificar si tiene acceso
		hasAccess := false
		for _, role := range roles {
			if userRole.(string) == role {
				hasAccess = true
				break
			}
		}

		if !hasAccess {
			ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permisos para acceder a este recurso", nil))
			ctx.Abort()
			return
		}

		ctx.Next()
	}
}

// SedeMiddleware verifica que el usuario tenga acceso a la sede solicitada
func SedeMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		// Obtener la sede solicitada del parámetro de la URL
		sedeIDParam := ctx.Param("idSede")
		if sedeIDParam == "" {
			// Si no hay parámetro de sede, continuar (algunas rutas no necesitan este parámetro)
			ctx.Next()
			return
		}

		// Verificar si es admin sin sede específica (puede acceder a cualquier sede)
		adminSinSede, existsFlag := ctx.Get("adminSinSede")
		if existsFlag && adminSinSede.(bool) {
			// Los admins sin sede específica pueden acceder a cualquier sede
			ctx.Next()
			return
		}

		// Obtener sedeID del token
		sedeIDToken, existsSedeToken := ctx.Get("sedeID")
		if !existsSedeToken {
			ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene una sede asignada", nil))
			ctx.Abort()
			return
		}

		// Si es admin con sede, debe coincidir con la sede solicitada
		// Si es otro rol, debe ser la sede asignada
		if sedeIDParam != "" && sedeIDToken.(int) != 0 {
			// Convertir sedeIDParam a entero
			sedeIDSolicitada, err := strconv.Atoi(sedeIDParam)
			if err != nil {
				ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de sede inválido", err))
				ctx.Abort()
				return
			}

			// Verificar si coincide con la sede del token
			if sedeIDSolicitada != sedeIDToken.(int) {
				ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene acceso a esta sede", nil))
				ctx.Abort()
				return
			}
		}

		ctx.Next()
	}
}
