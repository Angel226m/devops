package controladores

import (
	"encoding/json"
	"fmt"
	"net/http"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"strconv"
	"strings"

	"github.com/gin-gonic/gin"
)

// MercadoPagoController maneja las operaciones relacionadas con Mercado Pago
type MercadoPagoController struct {
	mercadoPagoService *servicios.MercadoPagoService
	pagoService        *servicios.PagoService
	reservaService     *servicios.ReservaService
	clienteService     *servicios.ClienteService
}

// NewMercadoPagoController crea una nueva instancia del controlador
func NewMercadoPagoController(
	mercadoPagoService *servicios.MercadoPagoService,
	pagoService *servicios.PagoService,
	reservaService *servicios.ReservaService,
	clienteService *servicios.ClienteService,
) *MercadoPagoController {
	return &MercadoPagoController{
		mercadoPagoService: mercadoPagoService,
		pagoService:        pagoService,
		reservaService:     reservaService,
		clienteService:     clienteService,
	}
}

// CreatePreferenceRequest estructura para la solicitud de creación de preferencia
type CreatePreferenceRequest struct {
	ReservaID   int     `json:"id_reserva" validate:"required"`
	TourNombre  string  `json:"tour_nombre" validate:"required"`
	Monto       float64 `json:"monto" validate:"required,min=0"`
	FrontendURL string  `json:"frontend_url" validate:"required,url"`
}

// CreatePreferenceResponse estructura para la respuesta de creación de preferencia
type CreatePreferenceResponse struct {
	PreferenceID     string `json:"preference_id"`
	InitPoint        string `json:"init_point"`
	SandboxInitPoint string `json:"sandbox_init_point"`
	PublicKey        string `json:"public_key"`
}

// CreatePreference crea una preferencia de pago para Mercado Pago
func (c *MercadoPagoController) CreatePreference(w http.ResponseWriter, r *http.Request) {
	var request CreatePreferenceRequest

	// Decodificar cuerpo de la solicitud
	err := json.NewDecoder(r.Body).Decode(&request)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Formato de solicitud inválido", err)
		return
	}

	// Validar datos de la solicitud
	if err := utils.ValidateStruct(request); err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Datos de solicitud inválidos", err)
		return
	}

	// Obtener la reserva para conseguir datos del cliente
	reserva, err := c.reservaService.GetByID(request.ReservaID)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Reserva no encontrada", err)
		return
	}

	// Obtener el cliente
	cliente, err := c.clienteService.GetByID(reserva.IDCliente)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error al obtener datos del cliente", err)
		return
	}

	// Crear preferencia en Mercado Pago
	preference, err := c.mercadoPagoService.CreatePreference(
		request.TourNombre,
		request.Monto,
		request.ReservaID,
		cliente,
		request.FrontendURL,
	)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error al crear preferencia de pago", err)
		return
	}

	// Preparar respuesta
	response := CreatePreferenceResponse{
		PreferenceID:     preference.ID,
		InitPoint:        preference.InitPoint,
		SandboxInitPoint: preference.SandboxInitPoint,
		PublicKey:        c.mercadoPagoService.PublicKey,
	}

	utils.RespondWithJSON(w, http.StatusCreated, response)
}

// ProcessWebhook procesa las notificaciones de webhook de Mercado Pago
// ProcessWebhook procesa las notificaciones de webhook de Mercado Pago
func (c *MercadoPagoController) ProcessWebhook(w http.ResponseWriter, r *http.Request) {
	// Verificar que sea un POST
	if r.Method != http.MethodPost {
		utils.RespondWithError(w, http.StatusMethodNotAllowed, "Método no permitido", nil)
		return
	}

	// Decodificar cuerpo de la notificación
	var notification servicios.PaymentNotification
	err := json.NewDecoder(r.Body).Decode(&notification)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Formato de notificación inválido", err)
		return
	}

	// Procesar la notificación solo si es de tipo payment
	if notification.Type != "payment" {
		// Respondemos 200 OK para notificaciones que no sean de pagos
		utils.RespondWithJSON(w, http.StatusOK, map[string]string{"status": "ignored"})
		return
	}

	// Obtener información del pago
	paymentInfo, err := c.mercadoPagoService.ProcessPaymentWebhook(&notification)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error al procesar notificación", err)
		return
	}

	// Extraer ID de reserva del external_reference (formato "RESERVA-12345")
	idReservaStr := strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
	idReserva, err := strconv.Atoi(idReservaStr)
	if err != nil {
		utils.RespondWithError(w, http.StatusBadRequest, "Referencia externa inválida", err)
		return
	}

	// Obtener la reserva
	// Verificar que la reserva existe
	_, err = c.reservaService.GetByID(idReserva)
	if err != nil {
		utils.RespondWithError(w, http.StatusNotFound, "Reserva no encontrada", err)
		return
	}

	// Mapear estado de Mercado Pago a estado interno
	estadoPago := c.mercadoPagoService.MapMercadoPagoStatusToInternal(paymentInfo.Status)

	// Crear o actualizar pago en el sistema
	// Para simplificar, asumimos que es un nuevo pago
	nuevoPago := &entidades.NuevoPagoRequest{
		IDReserva:    idReserva,
		IDMetodoPago: 1, // Asumimos que 1 es Mercado Pago en tu sistema
		Monto:        paymentInfo.TransactionAmount,
		Comprobante:  fmt.Sprintf("MP-%d", paymentInfo.ID), // Usar ID de MP como referencia
	}

	idPago, err := c.pagoService.Create(nuevoPago)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error al registrar pago", err)
		return
	}

	// Actualizar estado del pago según respuesta de Mercado Pago
	err = c.pagoService.UpdateEstado(idPago, estadoPago)
	if err != nil {
		utils.RespondWithError(w, http.StatusInternalServerError, "Error al actualizar estado del pago", err)
		return
	}

	// Si el pago fue aprobado, actualizar estado de la reserva a confirmada
	if estadoPago == "PROCESADO" {
		err = c.reservaService.UpdateEstado(idReserva, "CONFIRMADA")
		if err != nil {
			utils.RespondWithError(w, http.StatusInternalServerError, "Error al actualizar estado de la reserva", err)
			return
		}
	}

	utils.RespondWithJSON(w, http.StatusOK, map[string]interface{}{
		"status":         "success",
		"message":        "Pago procesado correctamente",
		"payment_id":     paymentInfo.ID,
		"payment_status": paymentInfo.Status,
		"pago_id":        idPago,
	})
}

// GetPaymentPublicKey devuelve la clave pública de Mercado Pago
func (c *MercadoPagoController) GetPaymentPublicKey(w http.ResponseWriter, r *http.Request) {
	utils.RespondWithJSON(w, http.StatusOK, map[string]string{
		"public_key": c.mercadoPagoService.PublicKey,
	})
}

// GetPublicKey devuelve la clave pública de Mercado Pago
func (c *MercadoPagoController) GetPublicKey(ctx *gin.Context) {
	ctx.JSON(http.StatusOK, gin.H{
		"public_key": c.mercadoPagoService.PublicKey,
	})
}

// opcional
// VerificarPago verifica el estado de un pago a través de su preferencia o ID de pago
func (c *MercadoPagoController) VerificarPago(ctx *gin.Context) {
	// Obtener parámetros
	preferenceID := ctx.Query("preference_id")
	paymentID := ctx.Query("payment_id")

	// Validar que tenemos al menos uno de los dos
	if preferenceID == "" && paymentID == "" {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Se requiere preference_id o payment_id", nil))
		return
	}

	// Verificar estado del pago
	status, paymentIDResult, reservationID, err := c.mercadoPagoService.VerificarEstadoPago(preferenceID, paymentID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al verificar estado del pago", err))
		return
	}

	// Preparar respuesta
	response := map[string]interface{}{
		"status":          status,
		"payment_id":      paymentIDResult,
		"reservation_id":  reservationID,
		"internal_status": c.mercadoPagoService.MapMercadoPagoStatusToInternal(status),
	}

	// Si el pago está aprobado y tenemos un ID de reserva, actualizar estado de la reserva
	if status == "approved" && reservationID > 0 {
		err := c.reservaService.ConfirmarPagoReserva(reservationID, paymentIDResult, 0)
		if err != nil {
			// No fallamos la API por esto, solo lo registramos
			fmt.Printf("Error al confirmar reserva %d: %v\n", reservationID, err)
			response["reservation_updated"] = false
		} else {
			response["reservation_updated"] = true
		}
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Estado del pago verificado", response))
}
