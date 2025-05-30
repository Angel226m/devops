package controladores

import (
	"net/http"
	"sistema-toursseft/internal/entidades"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"
	"strconv"

	"github.com/gin-gonic/gin"
)

// TipoTourGaleriaController maneja los endpoints de la galería de tipos de tour
type TipoTourGaleriaController struct {
	galeriaService *servicios.TipoTourGaleriaService
}

// NewTipoTourGaleriaController crea una nueva instancia de TipoTourGaleriaController
func NewTipoTourGaleriaController(galeriaService *servicios.TipoTourGaleriaService) *TipoTourGaleriaController {
	return &TipoTourGaleriaController{
		galeriaService: galeriaService,
	}
}

// Create crea una nueva imagen en la galería
func (c *TipoTourGaleriaController) Create(ctx *gin.Context) {
	var galeriaReq entidades.NuevaTipoTourGaleriaRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&galeriaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(galeriaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Crear imagen en la galería
	id, err := c.galeriaService.Create(&galeriaReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al crear imagen en la galería", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusCreated, utils.SuccessResponse("Imagen en la galería creada exitosamente", gin.H{"id": id}))
}

// GetByID obtiene una imagen de la galería por su ID
func (c *TipoTourGaleriaController) GetByID(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Obtener imagen de la galería
	galeria, err := c.galeriaService.GetByID(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Imagen de galería no encontrada", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Imagen de galería obtenida", galeria))
}

// Update actualiza una imagen en la galería
func (c *TipoTourGaleriaController) Update(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	var galeriaReq entidades.ActualizarTipoTourGaleriaRequest

	// Parsear request
	if err := ctx.ShouldBindJSON(&galeriaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Datos inválidos", err))
		return
	}

	// Validar datos
	if err := utils.ValidateStruct(galeriaReq); err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error de validación", err))
		return
	}

	// Actualizar imagen en la galería
	err = c.galeriaService.Update(id, &galeriaReq)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al actualizar imagen en la galería", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Imagen en la galería actualizada exitosamente", nil))
}

// Delete elimina una imagen de la galería (borrado lógico)
func (c *TipoTourGaleriaController) Delete(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Eliminar imagen de la galería (borrado lógico)
	err = c.galeriaService.Delete(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Error al eliminar imagen de la galería", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Imagen en la galería eliminada exitosamente", nil))
}

// HardDelete elimina físicamente una imagen de la galería
func (c *TipoTourGaleriaController) HardDelete(ctx *gin.Context) {
	// Parsear ID de la URL
	id, err := strconv.Atoi(ctx.Param("id"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID inválido", err))
		return
	}

	// Eliminar físicamente la imagen de la galería
	err = c.galeriaService.HardDelete(id)
	if err != nil {
		ctx.JSON(http.StatusNotFound, utils.ErrorResponse("Error al eliminar físicamente la imagen de la galería", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Imagen en la galería eliminada físicamente exitosamente", nil))
}

// List lista todas las imágenes de la galería
func (c *TipoTourGaleriaController) List(ctx *gin.Context) {
	// Listar imágenes de la galería
	galerias, err := c.galeriaService.List()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error al listar imágenes de la galería", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Imágenes de la galería listadas exitosamente", galerias))
}

// ListByTipoTour lista todas las imágenes de la galería de un tipo de tour específico
func (c *TipoTourGaleriaController) ListByTipoTour(ctx *gin.Context) {
	// Parsear ID del tipo de tour de la URL
	idTipoTour, err := strconv.Atoi(ctx.Param("idTipoTour"))
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("ID de tipo de tour inválido", err))
		return
	}

	// Listar imágenes de la galería del tipo de tour
	galerias, err := c.galeriaService.ListByTipoTour(idTipoTour)
	if err != nil {
		ctx.JSON(http.StatusBadRequest, utils.ErrorResponse("Error al listar imágenes de la galería del tipo de tour", err))
		return
	}

	// Respuesta exitosa
	ctx.JSON(http.StatusOK, utils.SuccessResponse("Imágenes de la galería del tipo de tour listadas exitosamente", galerias))
}
