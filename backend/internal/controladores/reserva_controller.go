/*
package controladores

import (

	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"strconv"
	"strings"
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
		// Agregar logs para depuración
		fmt.Println("ListMyReservas: Iniciando obtención de reservas del cliente")
		fmt.Printf("ListMyReservas: Contexto disponible: %v\n", ctx.Keys)

		// Obtener token de la cookie para procesarlo manualmente si es necesario
		tokenString, err := ctx.Cookie("access_token")
		if err != nil {
			fmt.Printf("ListMyReservas: Error al obtener cookie access_token: %v\n", err)
		} else if len(tokenString) > 20 {
			fmt.Printf("ListMyReservas: Token encontrado (primeros 20 caracteres): %s...\n", tokenString[:20])
		}

		// Intentar obtener el ID del cliente del contexto
		clienteIDValue, exists := ctx.Get("userID")
		fmt.Printf("ListMyReservas: userID del contexto: %v, existe: %v\n", clienteIDValue, exists)

		var clienteID int

		if exists {
			// Intentar convertir al tipo correcto
			var ok bool
			clienteID, ok = clienteIDValue.(int)
			if !ok {
				fmt.Printf("ListMyReservas: No se pudo convertir userID a int: %v, tipo: %T\n", clienteIDValue, clienteIDValue)

				// Intentar otras conversiones
				if floatID, okFloat := clienteIDValue.(float64); okFloat {
					clienteID = int(floatID)
					fmt.Printf("ListMyReservas: Convertido float64 a int: %d\n", clienteID)
				} else {
					// Si todo falla, intentar extraer del token manualmente
					if tokenString != "" {
						extractedID, extractErr := extractClienteIDFromToken(tokenString)
						if extractErr == nil && extractedID > 0 {
							clienteID = extractedID
							fmt.Printf("ListMyReservas: ID extraído manualmente del token: %d\n", clienteID)
						} else if extractErr != nil {
							fmt.Printf("ListMyReservas: Error al extraer ID del token: %v\n", extractErr)
						}
					}
				}
			}
		} else {
			// Si no existe en el contexto, intentar extraer del token
			if tokenString != "" {
				extractedID, extractErr := extractClienteIDFromToken(tokenString)
				if extractErr == nil && extractedID > 0 {
					clienteID = extractedID
					fmt.Printf("ListMyReservas: ID extraído manualmente del token: %d\n", clienteID)
				} else if extractErr != nil {
					fmt.Printf("ListMyReservas: Error al extraer ID del token: %v\n", extractErr)
				}
			}
		}

		// Verificar que tenemos un ID de cliente válido
		if clienteID <= 0 {
			fmt.Printf("ListMyReservas: ID de cliente inválido: %d\n", clienteID)
			ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Cliente no autenticado o ID inválido", nil))
			return
		}

		fmt.Printf("ListMyReservas: Usando ID de cliente: %d\n", clienteID)

		// Obtener reservas del cliente
		reservas, err := c.reservaService.ListByCliente(clienteID)
		if err != nil {
			fmt.Printf("ListMyReservas: Error al obtener reservas: %v\n", err)
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar reservas del cliente", err))
			return
		}

		// Si no hay reservas, devolver array vacío
		if reservas == nil {
			reservas = []*entidades.Reserva{}
		}

		fmt.Printf("ListMyReservas: Se encontraron %d reservas para el cliente ID: %d\n", len(reservas), clienteID)
		ctx.JSON(http.StatusOK, utils.SuccessResponse("Mis reservas listadas exitosamente", reservas))
	}

// Función auxiliar para extraer el ID del cliente del token JWT

	func extractClienteIDFromToken(tokenString string) (int, error) {
		// Dividir el token en sus partes
		parts := strings.Split(tokenString, ".")
		if len(parts) != 3 {
			return 0, fmt.Errorf("formato de token inválido")
		}

		// Decodificar la parte del payload (claims)
		payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
		if err != nil {
			return 0, fmt.Errorf("error al decodificar payload: %v", err)
		}

		// Parsear el JSON
		var claims map[string]interface{}
		err = json.Unmarshal(payloadBytes, &claims)
		if err != nil {
			return 0, fmt.Errorf("error al parsear claims: %v", err)
		}

		// Extraer cliente_id
		if clienteIDFloat, ok := claims["cliente_id"].(float64); ok {
			return int(clienteIDFloat), nil
		}

		return 0, fmt.Errorf("cliente_id no encontrado en el token")
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
		// Registrar la URL completa para diagnóstico
		fmt.Printf("WebhookMercadoPago: URL recibida: %s\n", ctx.Request.URL.String())

		// Intentar obtener parámetros de diferentes formas
		topic := ctx.Query("topic")
		id := ctx.Query("id")

		// Si no están en el formato esperado, probar con el formato alternativo
		if topic == "" {
			topic = ctx.Query("type")
		}

		if id == "" {
			id = ctx.Query("data.id")
		}

		fmt.Printf("WebhookMercadoPago: Procesando con topic/type=%s, id/data.id=%s\n", topic, id)

		// Validar que tenemos los parámetros necesarios
		if topic == "" || id == "" {
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Parámetros inválidos: se requiere topic/type e id/data.id", nil))
			return
		}

		// Si es una notificación de pago, procesar el pago
		if topic == "payment" {
			paymentInfo, err := c.mercadoPagoService.GetPaymentInfo(id)
			if err != nil {
				fmt.Printf("WebhookMercadoPago: Error al obtener información del pago: %v\n", err)
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener información del pago", err))
				return
			}

			fmt.Printf("WebhookMercadoPago: Información del pago obtenida: status=%s, external_reference=%s\n",
				paymentInfo.Status, paymentInfo.ExternalReference)

			// Extraer ID de reserva del external_reference (formato "RESERVA-12345")
			idReservaStr := ""
			if paymentInfo.ExternalReference != "" {
				idReservaStr = strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
			}

			if idReservaStr == "" {
				fmt.Println("WebhookMercadoPago: Referencia externa vacía o inválida")
				ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Referencia externa inválida", nil))
				return
			}

			idReserva, err := strconv.Atoi(idReservaStr)
			if err != nil {
				fmt.Printf("WebhookMercadoPago: Error al convertir ID de reserva: %v\n", err)
				ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
				return
			}

			fmt.Printf("WebhookMercadoPago: Procesando reserva ID=%d con estado de pago=%s\n", idReserva, paymentInfo.Status)

			// Procesar según el estado del pago
			switch paymentInfo.Status {
			case "approved":
				err = c.reservaService.ConfirmarPagoReserva(idReserva, id, paymentInfo.TransactionAmount)
				if err != nil {
					fmt.Printf("WebhookMercadoPago: Error al confirmar reserva: %v\n", err)
					ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al confirmar reserva", err))
					return
				}
				fmt.Printf("WebhookMercadoPago: Reserva %d confirmada exitosamente\n", idReserva)

			case "rejected", "cancelled":
				err = c.reservaService.UpdateEstado(idReserva, "CANCELADA")
				if err != nil {
					fmt.Printf("WebhookMercadoPago: Error al cancelar reserva: %v\n", err)
					ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al cancelar reserva", err))
					return
				}
				fmt.Printf("WebhookMercadoPago: Reserva %d cancelada por pago rechazado\n", idReserva)

			default:
				// Para otros estados (pending, in_process), no cambiar el estado de la reserva
				fmt.Printf("WebhookMercadoPago: Reserva %d mantiene estado actual (pago en estado %s)\n",
					idReserva, paymentInfo.Status)
			}
		}

		// Siempre responder con éxito para que MercadoPago no reintente
		ctx.JSON(http.StatusOK, utils.SuccessResponse("Webhook procesado exitosamente", nil))
	}

// VerificarYConfirmarPago - versión simplificada que solo actualiza el estado de la reserva

	func (c *ReservaController) VerificarYConfirmarPago(ctx *gin.Context) {
		// Obtener parámetros
		idReservaStr := ctx.Query("id_reserva")
		status := ctx.Query("status")

		fmt.Printf("VerificarYConfirmarPago: id_reserva=%s, status=%s\n", idReservaStr, status)
		fmt.Printf("VerificarYConfirmarPago: Iniciando verificación para reserva=%s con status=%s\n", idReservaStr, status)

		// Validar que tenemos el ID de reserva
		if idReservaStr == "" {
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Se requiere id_reserva", nil))
			return
		}

		// Convertir ID de reserva a entero
		idReserva, err := strconv.Atoi(idReservaStr)
		if err != nil {
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
			return
		}

		// Intentar obtener la reserva
		reserva, err := c.reservaService.GetByID(idReserva)
		if err != nil {
			ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Reserva no encontrada", err))
			return
		}
		fmt.Printf("VerificarYConfirmarPago: Reserva ID=%d encontrada en estado=%s\n", idReserva, reserva.Estado)

		// Si la reserva ya está confirmada, no hacer nada
		if reserva.Estado == "CONFIRMADA" {
			ctx.JSON(http.StatusOK, utils.SuccessResponse("La reserva ya está confirmada", reserva))
			return
		}

		// Si el status es "approved", confirmar la reserva
		if status == "approved" {
			// Actualizar el estado de la reserva directamente
			err = c.reservaService.UpdateEstado(idReserva, "CONFIRMADA")
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al confirmar la reserva", err))
				return
			}

			// Obtener la reserva actualizada
			reservaActualizada, err := c.reservaService.GetByID(idReserva)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
				return
			}

			ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva confirmada exitosamente", reservaActualizada))
			return
		} else if status == "pending" {
			// Si el pago está pendiente, mantener el estado actual
			ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago pendiente, reserva sin cambios", reserva))
			return
		} else if status == "rejected" || status == "failure" {
			// Si el pago fue rechazado, cambiar el estado a CANCELADA
			err = c.reservaService.UpdateEstado(idReserva, "CANCELADA")
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al cancelar la reserva", err))
				return
			}

			// Obtener la reserva actualizada
			reservaActualizada, err := c.reservaService.GetByID(idReserva)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
				return
			}

			ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva cancelada debido a pago rechazado", reservaActualizada))
			return
		}

		// Si el status no es ninguno de los esperados, devolver error
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Estado de pago no válido", nil))
	}
*/
package controladores

import (
	"encoding/base64"
	"encoding/json"
	"fmt"
	"net/http"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"strconv"
	"strings"
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
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar reservas", err))
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

	// Si no hay reservas, devolver array vacío
	if reservas == nil {
		reservas = []*entidades.Reserva{}
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

	// Si no hay reservas, devolver array vacío
	if reservas == nil {
		reservas = []*entidades.Reserva{}
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

	// Si no hay reservas, devolver array vacío
	if reservas == nil {
		reservas = []*entidades.Reserva{}
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

	// Si no hay reservas, devolver array vacío
	if reservas == nil {
		reservas = []*entidades.Reserva{}
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Reservas por estado listadas exitosamente", reservas))
}

// ListMyReservas lista todas las reservas del cliente autenticado
func (c *ReservaController) ListMyReservas(ctx *gin.Context) {
	// Registrar contexto y token para depuración
	fmt.Println("ListMyReservas: Iniciando obtención de reservas del cliente")
	fmt.Printf("ListMyReservas: Contexto disponible: %v\n", ctx.Keys)

	// Obtener ID del cliente utilizando múltiples estrategias
	var clienteID int
	var err error

	// Estrategia 1: Obtener del contexto
	clienteIDValue, exists := ctx.Get("userID")
	if exists {
		// Intentar conversión directa o desde float64
		switch v := clienteIDValue.(type) {
		case int:
			clienteID = v
		case float64:
			clienteID = int(v)
		default:
			fmt.Printf("ListMyReservas: Tipo inesperado en userID: %T\n", clienteIDValue)
		}
	}

	// Estrategia 2: Si no se obtuvo del contexto, extraer del token
	if clienteID <= 0 {
		tokenString, cookieErr := ctx.Cookie("access_token")
		if cookieErr == nil {
			clienteID, err = extractClienteIDFromToken(tokenString)
			if err != nil {
				fmt.Printf("ListMyReservas: Error al extraer ID del token: %v\n", err)
			}
		}
	}

	// Verificar que tenemos un ID válido
	if clienteID <= 0 {
		ctx.JSON(http.StatusUnauthorized, utils.ErrorResponse("Cliente no autenticado o ID inválido", nil))
		return
	}

	fmt.Printf("ListMyReservas: Usando ID de cliente: %d\n", clienteID)

	// Obtener reservas del cliente
	reservas, err := c.reservaService.ListByCliente(clienteID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar reservas del cliente", err))
		return
	}

	// Si no hay reservas, devolver array vacío
	if reservas == nil {
		reservas = []*entidades.Reserva{}
	}

	fmt.Printf("ListMyReservas: Se encontraron %d reservas para el cliente ID: %d\n", len(reservas), clienteID)
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Mis reservas listadas exitosamente", reservas))
}

// extractClienteIDFromToken extrae el ID del cliente de un token JWT
func extractClienteIDFromToken(tokenString string) (int, error) {
	// Dividir el token en sus partes (header.payload.signature)
	parts := strings.Split(tokenString, ".")
	if len(parts) != 3 {
		return 0, fmt.Errorf("formato de token inválido")
	}

	// Decodificar la parte del payload (claims)
	payloadBytes, err := base64.RawURLEncoding.DecodeString(parts[1])
	if err != nil {
		return 0, fmt.Errorf("error al decodificar payload: %v", err)
	}

	// Parsear el JSON de los claims
	var claims map[string]interface{}
	if err := json.Unmarshal(payloadBytes, &claims); err != nil {
		return 0, fmt.Errorf("error al parsear claims: %v", err)
	}

	// Intentar extraer cliente_id de diferentes formas posibles
	// Primero intentamos con la clave exacta "cliente_id"
	if clienteIDFloat, ok := claims["cliente_id"].(float64); ok {
		return int(clienteIDFloat), nil
	}

	// También podría estar como "sub" o "user_id" dependiendo de la implementación
	if subFloat, ok := claims["sub"].(float64); ok {
		return int(subFloat), nil
	}

	if userIDFloat, ok := claims["user_id"].(float64); ok {
		return int(userIDFloat), nil
	}

	return 0, fmt.Errorf("identificador de cliente no encontrado en el token")
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

	// Parsear y validar la solicitud
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
		frontendURL = "https://reservas.angelproyect.com" // URL predeterminada
	}

	// Crear reserva y generar preferencia de pago
	response, err := c.reservaService.ReservarConMercadoPago(&request, c.mercadoPagoService, frontendURL)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al crear reserva con Mercado Pago", err))
		return
	}

	// Registrar la creación exitosa de la preferencia
	fmt.Printf("ReservarConMercadoPago: Preferencia creada correctamente para reserva ID=%d, preferenceID=%s\n",
		response.IDReserva, response.PreferenceID)

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

	// Confirmar pago y actualizar reserva
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

	// Registrar confirmación exitosa
	fmt.Printf("ConfirmarPagoReserva: Pago confirmado para reserva ID=%d, transacción=%s, monto=%.2f\n",
		request.IDReserva, request.IDTransaccion, request.Monto)

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago confirmado exitosamente", reserva))
}

// WebhookMercadoPago procesa las notificaciones de webhook de Mercado Pago
func (c *ReservaController) WebhookMercadoPago(ctx *gin.Context) {
	// Registrar información completa del webhook para diagnóstico
	fmt.Printf("WebhookMercadoPago: URL recibida: %s\n", ctx.Request.URL.String())
	fmt.Printf("WebhookMercadoPago: Método: %s\n", ctx.Request.Method)
	fmt.Printf("WebhookMercadoPago: Headers: %v\n", ctx.Request.Header)

	// Obtener y registrar el cuerpo de la solicitud si es necesario
	/*
	   var bodyBytes []byte
	   if ctx.Request.Body != nil {
	       bodyBytes, _ = ioutil.ReadAll(ctx.Request.Body)
	       // Restaurar el body para que pueda ser leído nuevamente
	       ctx.Request.Body = ioutil.NopCloser(bytes.NewBuffer(bodyBytes))
	       fmt.Printf("WebhookMercadoPago: Body: %s\n", string(bodyBytes))
	   }
	*/

	// Estrategia 1: Intentar obtener parámetros estándar
	topic := ctx.Query("topic")
	id := ctx.Query("id")

	// Estrategia 2: Intentar obtener parámetros en formato alternativo
	if topic == "" {
		topic = ctx.Query("type")
	}

	if id == "" {
		id = ctx.Query("data.id")
	}

	// Registrar los parámetros extraídos
	fmt.Printf("WebhookMercadoPago: Procesando con topic/type=%s, id/data.id=%s\n", topic, id)

	// Validar que tenemos los parámetros necesarios
	if topic == "" || id == "" {
		fmt.Println("WebhookMercadoPago: Parámetros inválidos o faltantes")
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Parámetros inválidos: se requiere topic/type e id/data.id", nil))
		return
	}

	// Procesar según el tipo de evento
	switch topic {
	case "payment":
		// Obtener información detallada del pago
		paymentInfo, err := c.mercadoPagoService.GetPaymentInfo(id)
		if err != nil {
			fmt.Printf("WebhookMercadoPago: Error al obtener información del pago: %v\n", err)
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener información del pago", err))
			return
		}

		fmt.Printf("WebhookMercadoPago: Información del pago obtenida: status=%s, external_reference=%s, payment_method_id=%s\n",
			paymentInfo.Status, paymentInfo.ExternalReference, paymentInfo.PaymentMethodId)

		// Extraer ID de reserva del external_reference (formato "RESERVA-12345")
		idReservaStr := ""
		if paymentInfo.ExternalReference != "" {
			idReservaStr = strings.TrimPrefix(paymentInfo.ExternalReference, "RESERVA-")
		}

		if idReservaStr == "" {
			fmt.Println("WebhookMercadoPago: Referencia externa vacía o inválida")
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Referencia externa inválida", nil))
			return
		}

		idReserva, err := strconv.Atoi(idReservaStr)
		if err != nil {
			fmt.Printf("WebhookMercadoPago: Error al convertir ID de reserva: %v\n", err)
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
			return
		}

		fmt.Printf("WebhookMercadoPago: Procesando reserva ID=%d con estado de pago=%s\n", idReserva, paymentInfo.Status)

		// Procesar según el estado del pago
		switch paymentInfo.Status {
		case "approved":
			// Confirmar la reserva si el pago está aprobado
			err = c.reservaService.ConfirmarPagoReserva(idReserva, id, paymentInfo.TransactionAmount)
			if err != nil {
				fmt.Printf("WebhookMercadoPago: Error al confirmar reserva: %v\n", err)
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al confirmar reserva", err))
				return
			}
			fmt.Printf("WebhookMercadoPago: Reserva %d confirmada exitosamente\n", idReserva)

		case "rejected", "cancelled":
			// Cancelar la reserva si el pago fue rechazado o cancelado
			err = c.reservaService.UpdateEstado(idReserva, "CANCELADA")
			if err != nil {
				fmt.Printf("WebhookMercadoPago: Error al cancelar reserva: %v\n", err)
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al cancelar reserva", err))
				return
			}
			fmt.Printf("WebhookMercadoPago: Reserva %d cancelada por pago rechazado\n", idReserva)

		case "pending", "in_process":
			// Actualizar fecha de expiración según el método de pago
			err = c.reservaService.UpdateExpirationByPaymentMethod(idReserva, paymentInfo.PaymentMethodId)
			if err != nil {
				fmt.Printf("WebhookMercadoPago: Error al actualizar fecha de expiración: %v\n", err)
				// No fallar el webhook por esto
			}
			fmt.Printf("WebhookMercadoPago: Fecha de expiración actualizada para reserva %d (método: %s)\n",
				idReserva, paymentInfo.PaymentMethodId)
		}

	case "merchant_order":
		// Procesar notificación de orden comercial si es necesario
		fmt.Printf("WebhookMercadoPago: Recibida notificación de merchant_order ID=%s\n", id)
		// La lógica de orden comercial podría implementarse aquí si es necesario
	}

	// Siempre responder con éxito para que MercadoPago no reintente
	// MercadoPago espera un código 200 OK, de lo contrario reintentará hasta 5 veces
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Webhook procesado exitosamente", nil))
}

// VerificarYConfirmarPago verifica el estado del pago y actualiza la reserva
func (c *ReservaController) VerificarYConfirmarPago(ctx *gin.Context) {
	// Obtener parámetros de la URL
	idReservaStr := ctx.Query("id_reserva")
	status := ctx.Query("status")
	paymentID := ctx.Query("payment_id")
	preferenceID := ctx.Query("preference_id")

	// Registrar información de la solicitud
	fmt.Printf("VerificarYConfirmarPago: Iniciando verificación con id_reserva=%s, status=%s, payment_id=%s, preference_id=%s\n",
		idReservaStr, status, paymentID, preferenceID)

	// Validar parámetros mínimos necesarios
	if idReservaStr == "" {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Se requiere el parámetro id_reserva", nil))
		return
	}

	// Convertir ID de reserva a entero
	idReserva, err := strconv.Atoi(idReservaStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
		return
	}

	// Intentar obtener la reserva
	reserva, err := c.reservaService.GetByID(idReserva)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Reserva no encontrada", err))
		return
	}
	fmt.Printf("VerificarYConfirmarPago: Reserva ID=%d encontrada en estado=%s\n", idReserva, reserva.Estado)

	// Si la reserva ya está confirmada, no hacer nada más
	if reserva.Estado == "CONFIRMADA" {
		ctx.JSON(http.StatusOK, utils.SuccessResponse("La reserva ya está confirmada", reserva))
		return
	}

	// Si tenemos más información (paymentID o preferenceID), verificar con MercadoPago
	var nuevoEstado string
	var mensaje string

	if paymentID != "" || preferenceID != "" || status != "" {
		// Usar el servicio para verificar con MercadoPago
		estadoResultante, err := c.reservaService.VerificarYConfirmarPago(
			idReserva, status, paymentID, preferenceID, c.mercadoPagoService)

		if err != nil {
			fmt.Printf("VerificarYConfirmarPago: Error: %v\n", err)
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al verificar el pago", err))
			return
		}

		fmt.Printf("VerificarYConfirmarPago: Estado resultante=%s para reserva ID=%d\n", estadoResultante, idReserva)
		nuevoEstado = estadoResultante

		// Obtener reserva actualizada después de la verificación
		reservaActualizada, err := c.reservaService.GetByID(idReserva)
		if err != nil {
			ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
			return
		}

		// Preparar respuesta según el estado resultante
		switch nuevoEstado {
		case "CONFIRMADA":
			mensaje = "Reserva confirmada exitosamente"
		case "CANCELADA":
			mensaje = "Reserva cancelada debido a pago rechazado"
		case "RESERVADO":
			if status == "pending" {
				mensaje = "Pago pendiente, reserva sin cambios"
			} else {
				mensaje = "Estado de la reserva verificado"
			}
		default:
			mensaje = "Estado de la reserva verificado"
		}

		ctx.JSON(http.StatusOK, utils.SuccessResponse(mensaje, gin.H{
			"reserva":         reservaActualizada,
			"estado_anterior": reserva.Estado,
			"estado_nuevo":    nuevoEstado,
		}))

	} else {
		// Manejo simple basado solo en el parámetro status
		switch status {
		case "approved":
			// Confirmar la reserva
			err = c.reservaService.UpdateEstado(idReserva, "CONFIRMADA")
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al confirmar la reserva", err))
				return
			}

			// Obtener la reserva actualizada
			reservaActualizada, err := c.reservaService.GetByID(idReserva)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
				return
			}

			ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva confirmada exitosamente", reservaActualizada))

		case "pending":
			// Mantener estado actual para pagos pendientes
			ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago pendiente, reserva sin cambios", reserva))

		case "rejected", "failure", "cancelled":
			// Cancelar la reserva si el pago fue rechazado
			err = c.reservaService.UpdateEstado(idReserva, "CANCELADA")
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al cancelar la reserva", err))
				return
			}

			// Obtener la reserva actualizada
			reservaActualizada, err := c.reservaService.GetByID(idReserva)
			if err != nil {
				ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al obtener la reserva actualizada", err))
				return
			}

			ctx.JSON(http.StatusOK, utils.SuccessResponse("Reserva cancelada debido a pago rechazado", reservaActualizada))

		default:
			// Estado no reconocido
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Estado de pago no válido o no proporcionado", nil))
		}
	}
}

// VerifyReservationExpiration verifica si una reserva ha expirado y la cancela si es necesario
func (c *ReservaController) VerifyReservationExpiration(ctx *gin.Context) {
	idReservaStr := ctx.Param("id")

	idReserva, err := strconv.Atoi(idReservaStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
		return
	}

	response, err := c.reservaService.VerifyReservationExpiration(idReserva)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al verificar expiración de la reserva", err))
		return
	}

	if response.Expirada {
		ctx.JSON(http.StatusOK, utils.SuccessResponse("La reserva ha expirado y ha sido cancelada", response))
	} else {
		ctx.JSON(http.StatusOK, utils.SuccessResponse("La reserva es válida", response))
	}
}

// ProcessExpiredReservations procesa manualmente todas las reservas expiradas
func (c *ReservaController) ProcessExpiredReservations(ctx *gin.Context) {
	// Verificar si el usuario tiene permiso (solo admin)
	if ctx.GetString("rol") != "ADMIN" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permisos para realizar esta acción", nil))
		return
	}

	count, err := c.reservaService.ProcessExpiredReservations()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al procesar reservas expiradas", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse(fmt.Sprintf("Se procesaron %d reservas expiradas", count), gin.H{
		"processed_count": count,
	}))
}
