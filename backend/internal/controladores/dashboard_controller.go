package controladores

import (
	"net/http"
	"sistema-toursseft/internal/servicios"
	"sistema-toursseft/internal/utils"

	"github.com/gin-gonic/gin"
)

type DashboardController struct {
	dashboardService *servicios.DashboardService
}

func NewDashboardController(dashboardService *servicios.DashboardService) *DashboardController {
	return &DashboardController{
		dashboardService: dashboardService,
	}
}

// GetDashboardMetricas obtiene todas las métricas del dashboard
func (c *DashboardController) GetDashboardMetricas(ctx *gin.Context) {
	// Obtener información del usuario del contexto
	userRole, _ := ctx.Get("userRole")

	var sedeID *int

	// Verificar si es admin sin sede específica
	adminSinSede, existsFlag := ctx.Get("adminSinSede")
	if existsFlag && adminSinSede.(bool) {
		// Admin puede ver todas las sedes
		sedeID = nil
	} else {
		// Obtener sede del token para otros roles o admin con sede específica
		sedeIDValue, exists := ctx.Get("sedeID")
		if exists {
			sedeIDInt := sedeIDValue.(int)
			sedeID = &sedeIDInt
		}
	}

	// Obtener métricas
	metricas, err := c.dashboardService.GetDashboardMetricas(userRole.(string), sedeID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error obteniendo métricas del dashboard", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Métricas del dashboard obtenidas exitosamente", metricas))
}

// GetResumenGeneral obtiene solo el resumen general
func (c *DashboardController) GetResumenGeneral(ctx *gin.Context) {
	userRole, _ := ctx.Get("userRole")

	var sedeID *int
	adminSinSede, existsFlag := ctx.Get("adminSinSede")
	if existsFlag && adminSinSede.(bool) {
		sedeID = nil
	} else {
		sedeIDValue, exists := ctx.Get("sedeID")
		if exists {
			sedeIDInt := sedeIDValue.(int)
			sedeID = &sedeIDInt
		}
	}

	resumen, err := c.dashboardService.GetResumenGeneral(userRole.(string), sedeID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error obteniendo resumen general", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Resumen general obtenido exitosamente", resumen))
}

// GetVentasPorMes obtiene las ventas por mes
func (c *DashboardController) GetVentasPorMes(ctx *gin.Context) {
	userRole, _ := ctx.Get("userRole")

	var sedeID *int
	adminSinSede, existsFlag := ctx.Get("adminSinSede")
	if existsFlag && adminSinSede.(bool) {
		sedeID = nil
	} else {
		sedeIDValue, exists := ctx.Get("sedeID")
		if exists {
			sedeIDInt := sedeIDValue.(int)
			sedeID = &sedeIDInt
		}
	}

	ventas, err := c.dashboardService.GetVentasPorMes(userRole.(string), sedeID)
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error obteniendo ventas por mes", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Ventas por mes obtenidas exitosamente", ventas))
}

// GetEstadisticasSedes obtiene estadísticas de todas las sedes (solo admin)
func (c *DashboardController) GetEstadisticasSedes(ctx *gin.Context) {
	// Verificar que sea admin sin sede específica
	adminSinSede, existsFlag := ctx.Get("adminSinSede")
	if !existsFlag || !adminSinSede.(bool) {
		ctx.JSON(http.StatusForbidden, utils.ErrorResponse("Solo los administradores pueden acceder a las estadísticas de todas las sedes", nil))
		return
	}

	estadisticas, err := c.dashboardService.GetEstadisticasSedes()
	if err != nil {
		ctx.JSON(http.StatusInternalServerError, utils.ErrorResponse("Error obteniendo estadísticas de sedes", err))
		return
	}

	ctx.JSON(http.StatusOK, utils.SuccessResponse("Estadísticas de sedes obtenidas exitosamente", estadisticas))
}
