package controladores

import (
	"log"
	"net/http"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"

	"github.com/gin-gonic/gin"
)

// RecuperacionContrasenaController maneja las peticiones HTTP para recuperación de contraseña
type RecuperacionContrasenaController struct {
	recuperacionService *servicios.RecuperacionContrasenaService
}

// NewRecuperacionContrasenaController crea una nueva instancia del controlador
func NewRecuperacionContrasenaController(recuperacionService *servicios.RecuperacionContrasenaService) *RecuperacionContrasenaController {
	return &RecuperacionContrasenaController{
		recuperacionService: recuperacionService,
	}
}

// SolicitarRecuperacionUsuario maneja la solicitud de recuperación para usuarios administrativos
func (c *RecuperacionContrasenaController) SolicitarRecuperacionUsuario(ctx *gin.Context) {
	var solicitudRaw struct {
		Correo string `json:"correo" validate:"required,email"`
	}

	// Validar la solicitud
	if err := ctx.ShouldBindJSON(&solicitudRaw); err != nil {
		log.Printf("Error al validar solicitud de usuario: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	log.Printf("Solicitud de recuperación para usuario: %s", solicitudRaw.Correo)

	// Crear solicitud completa con tipo de entidad
	solicitud := &entidades.SolicitudRecuperacion{
		Correo:      solicitudRaw.Correo,
		TipoEntidad: entidades.EntidadUsuario,
	}

	// Validar el formato de los datos
	if err := utils.ValidateStruct(solicitud); err != nil {
		log.Printf("Error de validación: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Procesar la solicitud
	err := c.recuperacionService.SolicitarRecuperacion(solicitud)
	if err != nil {
		log.Printf("Error al procesar solicitud de usuario: %v", err)
		// Para no revelar información sensible, siempre enviar respuesta genérica
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al procesar la solicitud", nil))
		return
	}

	// Respuesta exitosa (incluso si el correo no existe, por seguridad)
	ctx.JSON(http.StatusOK, utils.SuccessResponse(
		"Si el correo existe en nuestros registros, recibirás instrucciones para restablecer tu contraseña",
		nil,
	))
}

// SolicitarRecuperacionCliente maneja la solicitud de recuperación para clientes
func (c *RecuperacionContrasenaController) SolicitarRecuperacionCliente(ctx *gin.Context) {
	var solicitudRaw struct {
		Correo string `json:"correo" validate:"required,email"`
	}

	// Validar la solicitud
	if err := ctx.ShouldBindJSON(&solicitudRaw); err != nil {
		log.Printf("Error al validar solicitud de cliente: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	log.Printf("Solicitud de recuperación para cliente: %s", solicitudRaw.Correo)

	// Crear solicitud completa con tipo de entidad
	solicitud := &entidades.SolicitudRecuperacion{
		Correo:      solicitudRaw.Correo,
		TipoEntidad: entidades.EntidadCliente,
	}

	// Validar el formato de los datos
	if err := utils.ValidateStruct(solicitud); err != nil {
		log.Printf("Error de validación: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Procesar la solicitud
	err := c.recuperacionService.SolicitarRecuperacion(solicitud)
	if err != nil {
		log.Printf("Error al procesar solicitud de cliente: %v", err)
		// Para no revelar información sensible, siempre enviar respuesta genérica
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al procesar la solicitud", nil))
		return
	}

	// Respuesta exitosa (incluso si el correo no existe, por seguridad)
	ctx.JSON(http.StatusOK, utils.SuccessResponse(
		"Si el correo existe en nuestros registros, recibirás instrucciones para restablecer tu contraseña",
		nil,
	))
}

// ValidarToken verifica si un token es válido
func (c *RecuperacionContrasenaController) ValidarToken(ctx *gin.Context) {
	token := ctx.Query("token")
	if token == "" {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Token requerido", nil))
		return
	}

	log.Printf("Validando token desde cliente: %s...", token[:10])

	// Validar el token
	recuperacion, err := c.recuperacionService.ValidarToken(token)
	if err != nil {
		log.Printf("Error al validar token: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err.Error(), nil))
		return
	}

	// Devolver información sobre el tipo de entidad para que el frontend muestre la interfaz adecuada
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Token válido", gin.H{
		"tipo_entidad": recuperacion.TipoEntidad,
	}))
}

// CambiarContrasena cambia la contraseña con un token válido
func (c *RecuperacionContrasenaController) CambiarContrasena(ctx *gin.Context) {
	var cambio entidades.ReseteoContrasena

	// Validar la solicitud
	if err := ctx.ShouldBindJSON(&cambio); err != nil {
		log.Printf("Error al validar datos de cambio de contraseña: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar el formato de los datos
	if err := utils.ValidateStruct(cambio); err != nil {
		log.Printf("Error de validación en cambio de contraseña: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	log.Printf("Procesando cambio de contraseña con token: %s...", cambio.Token[:10])

	// Procesar el cambio de contraseña
	err := c.recuperacionService.CambiarContrasena(&cambio)
	if err != nil {
		log.Printf("Error al cambiar contraseña: %v", err)
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse(err.Error(), nil))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Contraseña actualizada correctamente", nil))
}
