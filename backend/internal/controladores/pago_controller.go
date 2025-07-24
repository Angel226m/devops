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

// PagoController maneja los endpoints de pagos
type PagoController struct {
	pagoService *servicios.PagoService
}

// NewPagoController crea una nueva instancia de PagoController
func NewPagoController(pagoService *servicios.PagoService) *PagoController {
	return &PagoController{
		pagoService: pagoService,
	}
}

// Create crea un nuevo pago
func (c *PagoController) Create(ctx *gin.Context) {
	var pagoReq entidades.NuevoPagoRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&pagoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(pagoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Si no se especifica la sede y el usuario tiene sede asignada, usarla
	if pagoReq.IDSede == nil && ctx.GetInt("sede_id") > 0 {
		sedeID := ctx.GetInt("sede_id")
		pagoReq.IDSede = &sedeID
	}

	// Crear pago
	id, err := c.pagoService.Create(&pagoReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al crear pago", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusCreated, utils.SuccessResponse("Pago creado exitosamente", gin.H{"id": id}))
}

// GetByID obtiene un pago por su ID
func (c *PagoController) GetByID(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Obtener pago
	pago, err := c.pagoService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Pago no encontrado", err))
		return
	}

	// Verificar acceso según el rol
	sedeUsuario := ctx.GetInt("sede_id")
	if ctx.GetString("rol") != "ADMIN" &&
		pago.IDSede != nil &&
		*pago.IDSede != sedeUsuario &&
		pago.CanalPago != "WEB" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permiso para ver este pago", nil))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago obtenido", pago))
}

// Update actualiza un pago
func (c *PagoController) Update(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Verificar que el pago existe y el usuario tiene acceso
	pago, err := c.pagoService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Pago no encontrado", err))
		return
	}

	// Verificar acceso según el rol
	sedeUsuario := ctx.GetInt("sede_id")
	if ctx.GetString("rol") != "ADMIN" &&
		pago.IDSede != nil &&
		*pago.IDSede != sedeUsuario &&
		pago.CanalPago != "WEB" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permiso para modificar este pago", nil))
		return
	}

	var pagoReq entidades.ActualizarPagoRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&pagoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(pagoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Verificar que la sede es la misma del usuario para no-administradores
	if ctx.GetString("rol") != "ADMIN" &&
		pagoReq.IDSede != nil &&
		*pagoReq.IDSede != sedeUsuario &&
		pagoReq.CanalPago != "WEB" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permiso para cambiar la sede del pago", nil))
		return
	}

	// Actualizar pago
	err = c.pagoService.Update(id, &pagoReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al actualizar pago", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago actualizado exitosamente", nil))
}

// CambiarEstado cambia el estado de un pago
func (c *PagoController) CambiarEstado(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Verificar que el pago existe y el usuario tiene acceso
	pago, err := c.pagoService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Pago no encontrado", err))
		return
	}

	// Verificar acceso según el rol
	sedeUsuario := ctx.GetInt("sede_id")
	if ctx.GetString("rol") != "ADMIN" &&
		pago.IDSede != nil &&
		*pago.IDSede != sedeUsuario &&
		pago.CanalPago != "WEB" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permiso para modificar este pago", nil))
		return
	}

	var estadoReq entidades.CambiarEstadoPagoRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&estadoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(estadoReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Cambiar estado
	err = c.pagoService.CambiarEstado(id, estadoReq.Estado)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al cambiar estado del pago", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Estado del pago actualizado exitosamente", nil))
}

// Delete elimina un pago
func (c *PagoController) Delete(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Verificar que el pago existe y el usuario tiene acceso
	pago, err := c.pagoService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Pago no encontrado", err))
		return
	}

	// Verificar acceso según el rol
	sedeUsuario := ctx.GetInt("sede_id")
	if ctx.GetString("rol") != "ADMIN" &&
		pago.IDSede != nil &&
		*pago.IDSede != sedeUsuario &&
		pago.CanalPago != "WEB" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permiso para eliminar este pago", nil))
		return
	}

	// Eliminar pago
	err = c.pagoService.Delete(id)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al eliminar pago", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pago eliminado exitosamente", nil))
}

// List lista todos los pagos
func (c *PagoController) List(ctx *gin.Context) {
	var pagos []*entidades.Pago
	var err error

	// Si es ADMIN, listar todos los pagos
	if ctx.GetString("rol") == "ADMIN" {
		pagos, err = c.pagoService.List()
	} else {
		// Si no es ADMIN, listar solo los pagos de su sede
		sedeID := ctx.GetInt("sede_id")
		if sedeID <= 0 {
			ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Usuario no tiene sede asignada", nil))
			return
		}
		pagos, err = c.pagoService.ListBySede(sedeID)
	}

	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar pagos", err))
		return
	}

	// Si no hay pagos, devolver array vacío
	if pagos == nil {
		pagos = []*entidades.Pago{}
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pagos listados exitosamente", pagos))
}

// ListByReserva lista todos los pagos de una reserva específica
func (c *PagoController) ListByReserva(ctx *gin.Context) {
	// Parsear ID de reserva de la URL
	idReserva, err := strconv.Atoi(ctx.Param("idReserva"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
		return
	}

	// Listar pagos por reserva
	pagos, err := c.pagoService.ListByReserva(idReserva)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar pagos por reserva", err))
		return
	}

	// Verificar acceso según el rol para los pagos obtenidos
	if ctx.GetString("rol") != "ADMIN" && len(pagos) > 0 {
		sedeUsuario := ctx.GetInt("sede_id")
		pagosFiltrados := []*entidades.Pago{}

		for _, pago := range pagos {
			// Incluir pagos web o de la sede del usuario
			if pago.CanalPago == "WEB" || (pago.IDSede != nil && *pago.IDSede == sedeUsuario) {
				pagosFiltrados = append(pagosFiltrados, pago)
			}
		}
		pagos = pagosFiltrados
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pagos listados exitosamente", pagos))
}

// ListByFecha lista todos los pagos de una fecha específica
func (c *PagoController) ListByFecha(ctx *gin.Context) {
	// Parsear fecha de la URL (formato: YYYY-MM-DD)
	fechaStr := ctx.Param("fecha")
	fecha, err := time.Parse("2006-01-02", fechaStr)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Formato de fecha inválido, debe ser YYYY-MM-DD", err))
		return
	}

	// Listar pagos por fecha
	pagos, err := c.pagoService.ListByFecha(fecha)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar pagos por fecha", err))
		return
	}

	// Verificar acceso según el rol para los pagos obtenidos
	if ctx.GetString("rol") != "ADMIN" {
		sedeUsuario := ctx.GetInt("sede_id")
		pagosFiltrados := []*entidades.Pago{}

		for _, pago := range pagos {
			// Incluir pagos web o de la sede del usuario
			if pago.CanalPago == "WEB" || (pago.IDSede != nil && *pago.IDSede == sedeUsuario) {
				pagosFiltrados = append(pagosFiltrados, pago)
			}
		}
		pagos = pagosFiltrados
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pagos listados exitosamente", pagos))
}

// GetTotalPagadoByReserva obtiene el total pagado de una reserva específica
func (c *PagoController) GetTotalPagadoByReserva(ctx *gin.Context) {
	// Parsear ID de reserva de la URL
	idReserva, err := strconv.Atoi(ctx.Param("idReserva"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de reserva inválido", err))
		return
	}

	// Obtener total pagado
	totalPagado, err := c.pagoService.GetTotalPagadoByReserva(idReserva)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al obtener total pagado", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Total pagado obtenido exitosamente", gin.H{"total_pagado": totalPagado}))
}

// ListByEstado lista todos los pagos con un estado específico
func (c *PagoController) ListByEstado(ctx *gin.Context) {
	// Parsear estado de la URL
	estado := ctx.Param("estado")

	// Listar pagos por estado
	pagos, err := c.pagoService.ListByEstado(estado)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar pagos por estado", err))
		return
	}

	// Verificar acceso según el rol para los pagos obtenidos
	if ctx.GetString("rol") != "ADMIN" {
		sedeUsuario := ctx.GetInt("sede_id")
		pagosFiltrados := []*entidades.Pago{}

		for _, pago := range pagos {
			// Incluir pagos web o de la sede del usuario
			if pago.CanalPago == "WEB" || (pago.IDSede != nil && *pago.IDSede == sedeUsuario) {
				pagosFiltrados = append(pagosFiltrados, pago)
			}
		}
		pagos = pagosFiltrados
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pagos listados exitosamente", pagos))
}

// ListByCliente lista todos los pagos de un cliente específico
func (c *PagoController) ListByCliente(ctx *gin.Context) {
	// Parsear ID de cliente de la URL
	idCliente, err := strconv.Atoi(ctx.Param("idCliente"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de cliente inválido", err))
		return
	}

	// Listar pagos por cliente
	pagos, err := c.pagoService.ListByCliente(idCliente)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar pagos por cliente", err))
		return
	}

	// Verificar acceso según el rol para los pagos obtenidos
	if ctx.GetString("rol") != "ADMIN" {
		sedeUsuario := ctx.GetInt("sede_id")
		pagosFiltrados := []*entidades.Pago{}

		for _, pago := range pagos {
			// Incluir pagos web o de la sede del usuario
			if pago.CanalPago == "WEB" || (pago.IDSede != nil && *pago.IDSede == sedeUsuario) {
				pagosFiltrados = append(pagosFiltrados, pago)
			}
		}
		pagos = pagosFiltrados
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pagos listados exitosamente", pagos))
}

// ListBySede lista todos los pagos de una sede específica
func (c *PagoController) ListBySede(ctx *gin.Context) {
	// Parsear ID de sede de la URL
	idSede, err := strconv.Atoi(ctx.Param("idSede"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de sede inválido", err))
		return
	}

	// Verificar permisos
	if ctx.GetString("rol") != "ADMIN" && idSede != ctx.GetInt("sede_id") {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("No tiene permiso para ver pagos de otra sede", nil))
		return
	}

	// Listar pagos por sede
	pagos, err := c.pagoService.ListBySede(idSede)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar pagos por sede", err))
		return
	}

	// Si no hay pagos, devolver array vacío
	if pagos == nil {
		pagos = []*entidades.Pago{}
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Pagos de la sede listados exitosamente", pagos))
}

// CrearPagoMercadoPago crea un pago específico para MercadoPago
func (c *PagoController) CrearPagoMercadoPago(ctx *gin.Context) {
	// Estructura para la solicitud
	type MercadoPagoRequest struct {
		IDReserva      int     `json:"id_reserva" validate:"required"`
		Monto          float64 `json:"monto" validate:"required,min=0"`
		ReferenciaPago string  `json:"referencia_pago" validate:"required"`
	}

	var request MercadoPagoRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&request); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(request); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Crear pago de MercadoPago
	idPago, err := c.pagoService.CrearPagoMercadoPago(
		request.IDReserva,
		request.Monto,
		request.ReferenciaPago,
	)

	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al crear pago de MercadoPago", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusCreated, utils.SuccessResponse("Pago de MercadoPago registrado exitosamente", gin.H{
		"id_pago": idPago,
	}))
}

// ActualizarComprobantesFaltantes actualiza los comprobantes faltantes en los pagos existentes
func (c *PagoController) ActualizarComprobantesFaltantes(ctx *gin.Context) {
	// Verificar que solo los administradores puedan ejecutar esta acción
	if ctx.GetString("rol") != "ADMIN" {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("Solo los administradores pueden actualizar comprobantes faltantes", nil))
		return
	}

	// Actualizar comprobantes
	actualizados, err := c.pagoService.ActualizarComprobantesFaltantes()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al actualizar comprobantes faltantes", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Comprobantes actualizados exitosamente", gin.H{
		"pagos_actualizados": actualizados,
	}))
}
