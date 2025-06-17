package controladores

import (
	"net/http"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"strconv"
	"time"

	"github.com/gin-gonic/gin"
)

// ReservaController maneja los endpoints de reservas
type ReservaController struct {
	reservaService     *servicios.ReservaService
	mercadoPagoService *servicios.MercadoPagoService
}

// NewReservaController crea una nueva instancia de ReservaController
func NewReservaController(
	reservaService *servicios.ReservaService,
	mercadoPagoService *servicios.MercadoPagoService,
) *ReservaController {
	return &ReservaController{
		reservaService:     reservaService,
		mercadoPagoService: mercadoPagoService,
	}
}

// Create crea una nueva reserva
func (c *ReservaController) Create(ctx *gin.Context) {
	var reservaReq entidades.NuevaReservaRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&reservaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(reservaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Si es una reserva de vendedor, obtener el ID del vendedor del contexto
	if ctx.GetString("rol") == "VENDEDOR" {
		vendedorID := ctx.GetInt("user_id")
		reservaReq.IDVendedor = &vendedorID
	}

	// Crear reserva
	id, err := c.reservaService.Create(&reservaReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al crear reserva", err))
		return
	}

	// Obtener la reserva creada
	reserva, err := c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva creada", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusCreated, utils.SuccessResponse("Reserva creada exitosamente", reserva))
}

// GetByID obtiene una reserva por su ID
func (c *ReservaController) GetByID(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	reserva, err := c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Reserva no encontrada", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva obtenida", reserva))
}

// Update actualiza una reserva existente
func (c *ReservaController) Update(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Verificar que la reserva existe
	_, err = c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Reserva no encontrada", err))
		return
	}

	var reservaReq entidades.ActualizarReservaRequest
	if err := ctx.ShouldBindJSON(&reservaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	if err := utils.ValidateStruct(reservaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Si es una reserva de vendedor, obtener el ID del vendedor del contexto
	if ctx.GetString("rol") == "VENDEDOR" {
		vendedorID := ctx.GetInt("user_id")
		reservaReq.IDVendedor = &vendedorID
	}

	err = c.reservaService.Update(id, &reservaReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al actualizar reserva", err))
		return
	}

	// Obtener la reserva actualizada
	reserva, err := c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva actualizada exitosamente", reserva))
}

// List lista todas las reservas activas
func (c *ReservaController) List(ctx *gin.Context) {
	reservas, err := c.reservaService.List()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar reservas: "+err.Error(), err))
		return
	}

	// Si no hay reservas, devolver array vacío
	if reservas == nil {
		reservas = []*entidades.Reserva{}
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reservas listadas exitosamente", reservas))
}

// CambiarEstado cambia el estado de una reserva
func (c *ReservaController) CambiarEstado(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Verificar que la reserva existe
	_, err = c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Reserva no encontrada", err))
		return
	}

	var estadoReq entidades.CambiarEstadoReservaRequest
	if err := ctx.ShouldBindJSON(&estadoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	if err := utils.ValidateStruct(estadoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	err = c.reservaService.CambiarEstado(id, estadoReq.Estado)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al cambiar estado de la reserva", err))
		return
	}

	// Obtener la reserva actualizada
	reservaActualizada, err := c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Estado de la reserva actualizado exitosamente", reservaActualizada))
}

// Delete realiza una eliminación lógica de una reserva
func (c *ReservaController) Delete(ctx *gin.Context) {
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Verificar que la reserva existe
	_, err = c.reservaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Reserva no encontrada", err))
		return
	}

	err = c.reservaService.Delete(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al eliminar reserva", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva eliminada exitosamente", nil))
}

// ListByCliente lista todas las reservas de un cliente
func (c *ReservaController) ListByCliente(ctx *gin.Context) {
	idCliente, err := strconv.Atoi(ctx.Param("idCliente"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de cliente inválido", err))
		return
	}

	reservas, err := c.reservaService.ListByCliente(idCliente)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar reservas del cliente", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reservas del cliente listadas exitosamente", reservas))
}

// ListByInstancia lista todas las reservas para una instancia específica
func (c *ReservaController) ListByInstancia(ctx *gin.Context) {
	idInstancia, err := strconv.Atoi(ctx.Param("idInstancia"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de instancia inválido", err))
		return
	}

	reservas, err := c.reservaService.ListByInstancia(idInstancia)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar reservas de la instancia", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reservas de la instancia listadas exitosamente", reservas))
}

// ListByFecha lista todas las reservas para una fecha específica
func (c *ReservaController) ListByFecha(ctx *gin.Context) {
	fechaStr := ctx.Param("fecha")
	fecha, err := time.Parse("2006-01-02", fechaStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Formato de fecha inválido, debe ser YYYY-MM-DD", err))
		return
	}

	reservas, err := c.reservaService.ListByFecha(fecha)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar reservas por fecha", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reservas por fecha listadas exitosamente", reservas))
}

// ListByEstado lista todas las reservas por estado
func (c *ReservaController) ListByEstado(ctx *gin.Context) {
	estado := ctx.Param("estado")

	reservas, err := c.reservaService.ListByEstado(estado)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar reservas por estado", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reservas por estado listadas exitosamente", reservas))
}

// ListMyReservas lista todas las reservas del cliente autenticado
func (c *ReservaController) ListMyReservas(ctx *gin.Context) {
	clienteID := ctx.GetInt("userID")
	if clienteID == 0 {
		ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Cliente no autenticado", nil))
		return
	}

	reservas, err := c.reservaService.ListByCliente(clienteID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar reservas del cliente", err))
		return
	}

	if reservas == nil {
		reservas = []*entidades.Reserva{}
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Mis reservas listadas exitosamente", reservas))
}

// VerificarDisponibilidadInstancia verifica si hay suficiente cupo para una cantidad de pasajeros
func (c *ReservaController) VerificarDisponibilidadInstancia(ctx *gin.Context) {
	idInstancia, err := strconv.Atoi(ctx.Param("idInstancia"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de instancia inválido", err))
		return
	}

	cantidadStr := ctx.Query("cantidad")
	if cantidadStr == "" {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Debe especificar la cantidad de pasajeros", nil))
		return
	}

	cantidad, err := strconv.Atoi(cantidadStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Cantidad de pasajeros inválida", err))
		return
	}

	disponible, err := c.reservaService.VerificarDisponibilidadInstancia(idInstancia, cantidad)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al verificar disponibilidad", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Verificación de disponibilidad exitosa", map[string]interface{}{
		"disponible": disponible,
	}))
}

// ReservarConMercadoPago crea una reserva y genera una preferencia de pago
func (c *ReservaController) ReservarConMercadoPago(ctx *gin.Context) {
	var request entidades.ReservaMercadoPagoRequest

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	if err := utils.ValidateStruct(request); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Obtener URL base del frontend para redirecciones
	frontendURL := ctx.GetHeader("Origin")
	if frontendURL == "" {
		frontendURL = "https://reservas.angelproyect.com" // URL predeterminada si no se proporciona Origin
	}

	response, err := c.reservaService.ReservarConMercadoPago(&request, c.mercadoPagoService, frontendURL)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al crear reserva con Mercado Pago", err))
		return
	}

	ctx.JSON(http.StatusCreated, utils.SuccessResponse("Reserva creada exitosamente", response))
}

// ConfirmarPagoReserva confirma una reserva después de recibir el pago
func (c *ReservaController) ConfirmarPagoReserva(ctx *gin.Context) {
	var request struct {
		IDReserva     int     `json:"id_reserva" validate:"required"`
		IDTransaccion string  `json:"id_transaccion" validate:"required"`
		Monto         float64 `json:"monto" validate:"required,min=0"`
	}

	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	if err := utils.ValidateStruct(request); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	err := c.reservaService.ConfirmarPagoReserva(request.IDReserva, request.IDTransaccion, request.Monto)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al confirmar pago de la reserva", err))
		return
	}

	// Obtener la reserva actualizada
	reserva, err := c.reservaService.GetByID(request.IDReserva)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago confirmado exitosamente", reserva))
}

// WebhookMercadoPago procesa las notificaciones de webhook de Mercado Pago
func (c *ReservaController) WebhookMercadoPago(ctx *gin.Context) {
	// Los webhooks de Mercado Pago pueden ser notificaciones de pagos u otros eventos
	topic := ctx.Query("topic")
	id := ctx.Query("id")

	if topic == "" || id == "" {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Parámetros inválidos", nil))
		return
	}

	// Si es una notificación de pago, procesar el pago
	if topic == "payment" {
		paymentInfo, err := c.mercadoPagoService.GetPaymentInfo(id)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener información del pago", err))
			return
		}

		// Extraer ID de reserva del external_reference (formato "RESERVA-12345")
		idReservaStr := ""
		if len(paymentInfo.ExternalReference) > 8 {
			idReservaStr = paymentInfo.ExternalReference[8:]
		}

		if idReservaStr == "" {
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Referencia externa inválida", nil))
			return
		}

		idReserva, err := strconv.Atoi(idReservaStr)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
			return
		}

		// Si el pago está aprobado, confirmar la reserva
		if paymentInfo.Status == "approved" {
			err = c.reservaService.ConfirmarPagoReserva(idReserva, id, paymentInfo.TransactionAmount)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al confirmar reserva", err))
				return
			}
		}
	}

	// Siempre responder con éxito para que Mercado Pago no reintente
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Webhook procesado exitosamente", nil))
}
