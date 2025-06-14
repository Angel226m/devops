// Nombre del archivo: internal/utils/cliente_jwt.go
package utils

import (
	"errors"
	"fmt"
	"sistema-toursseft/internal/config"
	"sistema-toursseft/internal/entidades"
	"strconv"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
)

// ClienteTokenClaims define los claims específicos para clientes
type ClienteTokenClaims struct {
	ClienteID int    `json:"cliente_id"`
	Correo    string `json:"correo"`
	jwt.RegisteredClaims
}

// GenerateClienteJWT genera un token JWT para un cliente
func GenerateClienteJWT(cliente *entidades.Cliente, config *config.Config) (string, error) {
	claims := ClienteTokenClaims{
		ClienteID: cliente.ID,
		Correo:    cliente.Correo,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(time.Minute * 15)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "sistema-tours",
			Subject:   fmt.Sprintf("cliente:%d", cliente.ID),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.JWTSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// GenerateClienteRefreshToken genera un refresh token para un cliente
func GenerateClienteRefreshToken(cliente *entidades.Cliente, config *config.Config, rememberMe bool) (string, error) {
	var expTime time.Duration
	if rememberMe {
		expTime = time.Hour * 24 * 7 // 7 días
	} else {
		expTime = time.Hour // 1 hora
	}

	claims := ClienteTokenClaims{
		ClienteID: cliente.ID,
		Correo:    cliente.Correo,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(expTime)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "sistema-tours",
			Subject:   fmt.Sprintf("cliente:%d", cliente.ID),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(config.JWTRefreshSecret))
	if err != nil {
		return "", err
	}

	return tokenString, nil
}

// ValidateClienteToken valida un token JWT de cliente
func ValidateClienteToken(tokenString string, config *config.Config) (*ClienteTokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &ClienteTokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
		}
		return []byte(config.JWTSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token inválido")
	}

	claims, ok := token.Claims.(*ClienteTokenClaims)
	if !ok {
		return nil, errors.New("no se pudieron extraer los claims del token")
	}

	return claims, nil
}

// ValidateClienteRefreshToken valida un refresh token de cliente
func ValidateClienteRefreshToken(tokenString string, config *config.Config) (*ClienteTokenClaims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &ClienteTokenClaims{}, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("método de firma inesperado: %v", token.Header["alg"])
		}
		return []byte(config.JWTRefreshSecret), nil
	})

	if err != nil {
		return nil, err
	}

	if !token.Valid {
		return nil, errors.New("token de actualización inválido")
	}

	claims, ok := token.Claims.(*ClienteTokenClaims)
	if !ok {
		return nil, errors.New("no se pudieron extraer los claims del token")
	}

	// Verificar que el subject tiene el formato "cliente:ID"
	if !strings.HasPrefix(claims.Subject, "cliente:") {
		return nil, errors.New("token no pertenece a un cliente")
	}

	return claims, nil
}

// GetClienteIDFromSubject extrae el ID de cliente de un Subject con formato "cliente:ID"
func GetClienteIDFromSubject(subject string) (int, error) {
	parts := strings.Split(subject, ":")
	if len(parts) != 2 || parts[0] != "cliente" {
		return 0, errors.New("formato de subject inválido para cliente")
	}

	id, err := strconv.Atoi(parts[1])
	if err != nil {
		return 0, errors.New("ID de cliente inválido en el subject")
	}

	return id, nil
}
