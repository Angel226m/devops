package servicios

import (
	"database/sql"
	"fmt"
	"sistema-toursseft/internal/repositorios"
	"time"
)

type DashboardService struct {
	usuarioRepo        *repositorios.UsuarioRepository
	sedeRepo           *repositorios.SedeRepository
	reservaRepo        *repositorios.ReservaRepository
	tourProgramadoRepo *repositorios.TourProgramadoRepository
	clienteRepo        *repositorios.ClienteRepository
	pagoRepo           *repositorios.PagoRepository
	instanciaTourRepo  *repositorios.InstanciaTourRepository
	tipoTourRepo       *repositorios.TipoTourRepository
	embarcacionRepo    *repositorios.EmbarcacionRepository
	db                 *sql.DB
}

func NewDashboardService(
	usuarioRepo *repositorios.UsuarioRepository,
	sedeRepo *repositorios.SedeRepository,
	reservaRepo *repositorios.ReservaRepository,
	tourProgramadoRepo *repositorios.TourProgramadoRepository,
	clienteRepo *repositorios.ClienteRepository,
	pagoRepo *repositorios.PagoRepository,
	instanciaTourRepo *repositorios.InstanciaTourRepository,
	tipoTourRepo *repositorios.TipoTourRepository,
	embarcacionRepo *repositorios.EmbarcacionRepository,
	db *sql.DB,
) *DashboardService {
	return &DashboardService{
		usuarioRepo:        usuarioRepo,
		sedeRepo:           sedeRepo,
		reservaRepo:        reservaRepo,
		tourProgramadoRepo: tourProgramadoRepo,
		clienteRepo:        clienteRepo,
		pagoRepo:           pagoRepo,
		instanciaTourRepo:  instanciaTourRepo,
		tipoTourRepo:       tipoTourRepo,
		embarcacionRepo:    embarcacionRepo,
		db:                 db,
	}
}

// Estructuras para las métricas del dashboard
type DashboardMetricas struct {
	ResumenGeneral    ResumenGeneral      `json:"resumen_general"`
	VentasPorMes      []VentasMensuales   `json:"ventas_por_mes"`
	ReservasPorEstado []ReservasPorEstado `json:"reservas_por_estado"`
	ToursMasVendidos  []TourMasVendido    `json:"tours_mas_vendidos"`
	IngresosHoy       IngresosDiarios     `json:"ingresos_hoy"`
	ProximosTours     []ProximoTour       `json:"proximos_tours"`
	EstadisticasSedes []EstadisticasSede  `json:"estadisticas_sedes,omitempty"`
}

type ResumenGeneral struct {
	TotalReservas      int     `json:"total_reservas"`
	ReservasHoy        int     `json:"reservas_hoy"`
	IngresosTotal      float64 `json:"ingresos_total"`
	IngresosHoy        float64 `json:"ingresos_hoy"`
	ClientesActivos    int     `json:"clientes_activos"`
	ToursDisponibles   int     `json:"tours_disponibles"`
	TotalEmbarcaciones int     `json:"total_embarcaciones"`
	VendedoresActivos  int     `json:"vendedores_activos"`
}

type VentasMensuales struct {
	Mes      string  `json:"mes"`
	Ingresos float64 `json:"ingresos"`
	Reservas int     `json:"reservas"`
	Año      int     `json:"año"`
}

type ReservasPorEstado struct {
	Estado   string `json:"estado"`
	Cantidad int    `json:"cantidad"`
}

type TourMasVendido struct {
	NombreTour string  `json:"nombre_tour"`
	Cantidad   int     `json:"cantidad"`
	Ingresos   float64 `json:"ingresos"`
}

type IngresosDiarios struct {
	Fecha    string  `json:"fecha"`
	Ingresos float64 `json:"ingresos"`
	Meta     float64 `json:"meta"`
}

type ProximoTour struct {
	ID           int       `json:"id"`
	NombreTour   string    `json:"nombre_tour"`
	Fecha        time.Time `json:"fecha"`
	HoraInicio   string    `json:"hora_inicio"`
	HoraFin      string    `json:"hora_fin"`
	Cupo         int       `json:"cupo"`
	Reservados   int       `json:"reservados"`
	NombreChofer string    `json:"nombre_chofer"`
	Embarcacion  string    `json:"embarcacion"`
	NombreSede   string    `json:"nombre_sede"`
}

type EstadisticasSede struct {
	ID            int     `json:"id_sede"`
	NombreSede    string  `json:"nombre_sede"`
	TotalReservas int     `json:"total_reservas"`
	IngresosTotal float64 `json:"ingresos_total"`
	ToursActivos  int     `json:"tours_activos"`
	Vendedores    int     `json:"vendedores"`
	Embarcaciones int     `json:"embarcaciones"`
}

// GetDashboardMetricas obtiene todas las métricas del dashboard
func (s *DashboardService) GetDashboardMetricas(userRole string, sedeID *int) (*DashboardMetricas, error) {
	fmt.Printf("DashboardService: Obteniendo métricas para rol %s, sede %v\n", userRole, sedeID)

	metricas := &DashboardMetricas{}

	// Obtener resumen general
	resumen, err := s.getResumenGeneral(userRole, sedeID)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo resumen general: %v", err)
	}
	metricas.ResumenGeneral = *resumen

	// Obtener ventas por mes (últimos 6 meses)
	ventasMes, err := s.getVentasPorMes(sedeID, 6)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo ventas por mes: %v", err)
	}
	metricas.VentasPorMes = ventasMes

	// Obtener reservas por estado
	reservasEstado, err := s.getReservasPorEstado(sedeID)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo reservas por estado: %v", err)
	}
	metricas.ReservasPorEstado = reservasEstado

	// Obtener tours más vendidos
	toursMasVendidos, err := s.getToursMasVendidos(sedeID, 10)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo tours más vendidos: %v", err)
	}
	metricas.ToursMasVendidos = toursMasVendidos

	// Obtener ingresos de hoy
	ingresosHoy, err := s.getIngresosHoy(sedeID)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo ingresos de hoy: %v", err)
	}
	metricas.IngresosHoy = *ingresosHoy

	// Obtener próximos tours
	proximosTours, err := s.getProximosTours(sedeID, 10)
	if err != nil {
		return nil, fmt.Errorf("error obteniendo próximos tours: %v", err)
	}
	metricas.ProximosTours = proximosTours

	// Si es admin sin sede específica, obtener estadísticas de todas las sedes
	if userRole == "ADMIN" && sedeID == nil {
		estadisticasSedes, err := s.getEstadisticasSedes()
		if err != nil {
			return nil, fmt.Errorf("error obteniendo estadísticas de sedes: %v", err)
		}
		metricas.EstadisticasSedes = estadisticasSedes
	}

	return metricas, nil
}

// getResumenGeneral obtiene las métricas principales
func (s *DashboardService) getResumenGeneral(userRole string, sedeID *int) (*ResumenGeneral, error) {
	resumen := &ResumenGeneral{}

	// Total de reservas
	totalReservas, err := s.contarReservasPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.TotalReservas = totalReservas

	// Reservas de hoy
	reservasHoy, err := s.contarReservasHoyPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.ReservasHoy = reservasHoy

	// Ingresos total
	ingresosTotal, err := s.sumarIngresosPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.IngresosTotal = ingresosTotal

	// Ingresos de hoy
	ingresosHoy, err := s.sumarIngresosHoyPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.IngresosHoy = ingresosHoy

	// Clientes activos (que han hecho reservas en los últimos 30 días)
	clientesActivos, err := s.contarClientesActivosPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.ClientesActivos = clientesActivos

	// Tours disponibles (instancias futuras)
	toursDisponibles, err := s.contarToursDisponiblesPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.ToursDisponibles = toursDisponibles

	// Total embarcaciones
	totalEmbarcaciones, err := s.contarEmbarcacionesPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.TotalEmbarcaciones = totalEmbarcaciones

	// Vendedores activos
	vendedoresActivos, err := s.contarVendedoresPorSede(sedeID)
	if err != nil {
		return nil, err
	}
	resumen.VendedoresActivos = vendedoresActivos

	return resumen, nil
}

// Métodos auxiliares para las consultas SQL específicas

func (s *DashboardService) contarReservasPorSede(sedeID *int) (int, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT COUNT(*) 
			FROM reserva r
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 AND r.eliminado = false
		`
		args = append(args, *sedeID)
	} else {
		query = `SELECT COUNT(*) FROM reserva WHERE eliminado = false`
	}

	var count int
	err := s.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

func (s *DashboardService) contarReservasHoyPorSede(sedeID *int) (int, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT COUNT(*) 
			FROM reserva r
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 
			AND DATE(r.fecha_reserva) = CURRENT_DATE 
			AND r.eliminado = false
		`
		args = append(args, *sedeID)
	} else {
		query = `
			SELECT COUNT(*) 
			FROM reserva 
			WHERE DATE(fecha_reserva) = CURRENT_DATE 
			AND eliminado = false
		`
	}

	var count int
	err := s.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

func (s *DashboardService) sumarIngresosPorSede(sedeID *int) (float64, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT COALESCE(SUM(p.monto), 0) 
			FROM pago p
			INNER JOIN reserva r ON p.id_reserva = r.id_reserva
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 
			AND p.estado = 'PROCESADO' 
			AND p.eliminado = false
		`
		args = append(args, *sedeID)
	} else {
		query = `
			SELECT COALESCE(SUM(monto), 0) 
			FROM pago 
			WHERE estado = 'PROCESADO' 
			AND eliminado = false
		`
	}

	var total float64
	err := s.db.QueryRow(query, args...).Scan(&total)
	return total, err
}

func (s *DashboardService) sumarIngresosHoyPorSede(sedeID *int) (float64, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT COALESCE(SUM(p.monto), 0) 
			FROM pago p
			INNER JOIN reserva r ON p.id_reserva = r.id_reserva
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 
			AND DATE(p.fecha_pago) = CURRENT_DATE 
			AND p.estado = 'PROCESADO' 
			AND p.eliminado = false
		`
		args = append(args, *sedeID)
	} else {
		query = `
			SELECT COALESCE(SUM(monto), 0) 
			FROM pago 
			WHERE DATE(fecha_pago) = CURRENT_DATE 
			AND estado = 'PROCESADO' 
			AND eliminado = false
		`
	}

	var total float64
	err := s.db.QueryRow(query, args...).Scan(&total)
	return total, err
}

func (s *DashboardService) contarClientesActivosPorSede(sedeID *int) (int, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT COUNT(DISTINCT r.id_cliente) 
			FROM reserva r
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 
			AND r.fecha_reserva >= CURRENT_DATE - INTERVAL '30 days'
			AND r.eliminado = false
		`
		args = append(args, *sedeID)
	} else {
		query = `
			SELECT COUNT(DISTINCT id_cliente) 
			FROM reserva 
			WHERE fecha_reserva >= CURRENT_DATE - INTERVAL '30 days'
			AND eliminado = false
		`
	}

	var count int
	err := s.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

func (s *DashboardService) contarToursDisponiblesPorSede(sedeID *int) (int, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT COUNT(*) 
			FROM instancia_tour it
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 
			AND it.fecha_especifica >= CURRENT_DATE 
			AND it.cupo_disponible > 0
			AND it.eliminado = false
		`
		args = append(args, *sedeID)
	} else {
		query = `
			SELECT COUNT(*) 
			FROM instancia_tour 
			WHERE fecha_especifica >= CURRENT_DATE 
			AND cupo_disponible > 0
			AND eliminado = false
		`
	}

	var count int
	err := s.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

func (s *DashboardService) contarEmbarcacionesPorSede(sedeID *int) (int, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `SELECT COUNT(*) FROM embarcacion WHERE id_sede = $1 AND eliminado = false`
		args = append(args, *sedeID)
	} else {
		query = `SELECT COUNT(*) FROM embarcacion WHERE eliminado = false`
	}

	var count int
	err := s.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

func (s *DashboardService) contarVendedoresPorSede(sedeID *int) (int, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `SELECT COUNT(*) FROM usuario WHERE id_sede = $1 AND rol = 'VENDEDOR' AND eliminado = false`
		args = append(args, *sedeID)
	} else {
		query = `SELECT COUNT(*) FROM usuario WHERE rol = 'VENDEDOR' AND eliminado = false`
	}

	var count int
	err := s.db.QueryRow(query, args...).Scan(&count)
	return count, err
}

// getVentasPorMes obtiene las ventas de los últimos N meses
func (s *DashboardService) getVentasPorMes(sedeID *int, meses int) ([]VentasMensuales, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT 
				EXTRACT(YEAR FROM p.fecha_pago) as año,
				EXTRACT(MONTH FROM p.fecha_pago) as mes,
				TO_CHAR(p.fecha_pago, 'YYYY-MM') as mes_año,
				COALESCE(SUM(p.monto), 0) as ingresos,
				COUNT(DISTINCT p.id_reserva) as reservas
			FROM pago p
			INNER JOIN reserva r ON p.id_reserva = r.id_reserva
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 
			AND p.fecha_pago >= CURRENT_DATE - INTERVAL '%d months'
			AND p.estado = 'PROCESADO' 
			AND p.eliminado = false
			GROUP BY EXTRACT(YEAR FROM p.fecha_pago), EXTRACT(MONTH FROM p.fecha_pago), TO_CHAR(p.fecha_pago, 'YYYY-MM')
			ORDER BY año DESC, mes DESC
			LIMIT $2
		`
		// Usar fmt.Sprintf para formatear la consulta con el número de meses
		query = fmt.Sprintf(query, meses)
		args = append(args, *sedeID, meses)
	} else {
		query = fmt.Sprintf(`
			SELECT 
				EXTRACT(YEAR FROM fecha_pago) as año,
				EXTRACT(MONTH FROM fecha_pago) as mes,
				TO_CHAR(fecha_pago, 'YYYY-MM') as mes_año,
				COALESCE(SUM(monto), 0) as ingresos,
				COUNT(DISTINCT id_reserva) as reservas
			FROM pago 
			WHERE fecha_pago >= CURRENT_DATE - INTERVAL '%d months'
			AND estado = 'PROCESADO' 
			AND eliminado = false
			GROUP BY EXTRACT(YEAR FROM fecha_pago), EXTRACT(MONTH FROM fecha_pago), TO_CHAR(fecha_pago, 'YYYY-MM')
			ORDER BY año DESC, mes DESC
			LIMIT $1
		`, meses)
		args = append(args, meses)
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var ventas []VentasMensuales
	for rows.Next() {
		var venta VentasMensuales
		var año, mes int
		err := rows.Scan(&año, &mes, &venta.Mes, &venta.Ingresos, &venta.Reservas)
		if err != nil {
			return nil, err
		}
		venta.Año = año
		ventas = append(ventas, venta)
	}

	return ventas, nil
}

// getReservasPorEstado obtiene el conteo de reservas por estado
func (s *DashboardService) getReservasPorEstado(sedeID *int) ([]ReservasPorEstado, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT r.estado, COUNT(*) as cantidad
			FROM reserva r
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			WHERE tp.id_sede = $1 AND r.eliminado = false
			GROUP BY r.estado
			ORDER BY cantidad DESC
		`
		args = append(args, *sedeID)
	} else {
		query = `
			SELECT estado, COUNT(*) as cantidad
			FROM reserva 
			WHERE eliminado = false
			GROUP BY estado
			ORDER BY cantidad DESC
		`
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var reservas []ReservasPorEstado
	for rows.Next() {
		var reserva ReservasPorEstado
		err := rows.Scan(&reserva.Estado, &reserva.Cantidad)
		if err != nil {
			return nil, err
		}
		reservas = append(reservas, reserva)
	}

	return reservas, nil
}

// getToursMasVendidos obtiene los tours más vendidos
func (s *DashboardService) getToursMasVendidos(sedeID *int, limite int) ([]TourMasVendido, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT 
				tt.nombre as nombre_tour,
				COUNT(r.id_reserva) as cantidad,
				COALESCE(SUM(r.total_pagar), 0) as ingresos
			FROM reserva r
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
			WHERE tp.id_sede = $1 AND r.eliminado = false
			GROUP BY tt.id_tipo_tour, tt.nombre
			ORDER BY cantidad DESC
			LIMIT $2
		`
		args = append(args, *sedeID, limite)
	} else {
		query = `
			SELECT 
				tt.nombre as nombre_tour,
				COUNT(r.id_reserva) as cantidad,
				COALESCE(SUM(r.total_pagar), 0) as ingresos
			FROM reserva r
			INNER JOIN instancia_tour it ON r.id_instancia = it.id_instancia
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
			WHERE r.eliminado = false
			GROUP BY tt.id_tipo_tour, tt.nombre
			ORDER BY cantidad DESC
			LIMIT $1
		`
		args = append(args, limite)
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tours []TourMasVendido
	for rows.Next() {
		var tour TourMasVendido
		err := rows.Scan(&tour.NombreTour, &tour.Cantidad, &tour.Ingresos)
		if err != nil {
			return nil, err
		}
		tours = append(tours, tour)
	}

	return tours, nil
}

// getIngresosHoy obtiene los ingresos del día actual
func (s *DashboardService) getIngresosHoy(sedeID *int) (*IngresosDiarios, error) {
	ingresos, err := s.sumarIngresosHoyPorSede(sedeID)
	if err != nil {
		return nil, err
	}

	// Meta diaria (puedes ajustar esta lógica según tus necesidades)
	meta := 1000.0 // Meta base
	if sedeID != nil {
		// Podrías obtener meta específica de la sede si tienes esa funcionalidad
		meta = 1500.0 // Meta por sede
	}

	return &IngresosDiarios{
		Fecha:    time.Now().Format("2006-01-02"),
		Ingresos: ingresos,
		Meta:     meta,
	}, nil
}

// getProximosTours obtiene los próximos tours programados
func (s *DashboardService) getProximosTours(sedeID *int, limite int) ([]ProximoTour, error) {
	var query string
	var args []interface{}

	if sedeID != nil {
		query = `
			SELECT 
				it.id_instancia,
				tt.nombre as nombre_tour,
				it.fecha_especifica,
				it.hora_inicio,
				it.hora_fin,
				tp.cupo_maximo,
				(tp.cupo_maximo - it.cupo_disponible) as reservados,
				COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') as nombre_chofer,
				e.nombre as embarcacion,
				s.nombre as nombre_sede
			FROM instancia_tour it
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
			INNER JOIN embarcacion e ON it.id_embarcacion = e.id_embarcacion
			INNER JOIN sede s ON tp.id_sede = s.id_sede
			LEFT JOIN usuario u ON it.id_chofer = u.id_usuario
			WHERE tp.id_sede = $1 
			AND it.fecha_especifica >= CURRENT_DATE 
			AND it.eliminado = false
			ORDER BY it.fecha_especifica ASC, it.hora_inicio ASC
			LIMIT $2
		`
		args = append(args, *sedeID, limite)
	} else {
		query = `
			SELECT 
				it.id_instancia,
				tt.nombre as nombre_tour,
				it.fecha_especifica,
				it.hora_inicio,
				it.hora_fin,
				tp.cupo_maximo,
				(tp.cupo_maximo - it.cupo_disponible) as reservados,
				COALESCE(u.nombres || ' ' || u.apellidos, 'Sin asignar') as nombre_chofer,
				e.nombre as embarcacion,
				s.nombre as nombre_sede
			FROM instancia_tour it
			INNER JOIN tour_programado tp ON it.id_tour_programado = tp.id_tour_programado
			INNER JOIN tipo_tour tt ON tp.id_tipo_tour = tt.id_tipo_tour
			INNER JOIN embarcacion e ON it.id_embarcacion = e.id_embarcacion
			INNER JOIN sede s ON tp.id_sede = s.id_sede
			LEFT JOIN usuario u ON it.id_chofer = u.id_usuario
			WHERE it.fecha_especifica >= CURRENT_DATE 
			AND it.eliminado = false
			ORDER BY it.fecha_especifica ASC, it.hora_inicio ASC
			LIMIT $1
		`
		args = append(args, limite)
	}

	rows, err := s.db.Query(query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tours []ProximoTour
	for rows.Next() {
		var tour ProximoTour
		var horaInicio, horaFin time.Time
		err := rows.Scan(
			&tour.ID, &tour.NombreTour, &tour.Fecha, &horaInicio, &horaFin,
			&tour.Cupo, &tour.Reservados, &tour.NombreChofer, &tour.Embarcacion, &tour.NombreSede,
		)
		if err != nil {
			return nil, err
		}
		tour.HoraInicio = horaInicio.Format("15:04")
		tour.HoraFin = horaFin.Format("15:04")
		tours = append(tours, tour)
	}

	return tours, nil
}

// getEstadisticasSedes obtiene estadísticas de todas las sedes (solo para admin)
func (s *DashboardService) getEstadisticasSedes() ([]EstadisticasSede, error) {
	sedes, err := s.sedeRepo.GetAll()
	if err != nil {
		return nil, err
	}

	var estadisticas []EstadisticasSede
	for _, sede := range sedes {
		sedeID := sede.ID

		// Obtener estadísticas para cada sede
		totalReservas, _ := s.contarReservasPorSede(&sedeID)
		ingresosTotal, _ := s.sumarIngresosPorSede(&sedeID)
		toursActivos, _ := s.contarToursDisponiblesPorSede(&sedeID)
		vendedores, _ := s.contarVendedoresPorSede(&sedeID)
		embarcaciones, _ := s.contarEmbarcacionesPorSede(&sedeID)

		estadisticas = append(estadisticas, EstadisticasSede{
			ID:            sede.ID,
			NombreSede:    sede.Nombre,
			TotalReservas: totalReservas,
			IngresosTotal: ingresosTotal,
			ToursActivos:  toursActivos,
			Vendedores:    vendedores,
			Embarcaciones: embarcaciones,
		})
	}

	return estadisticas, nil
}

// Métodos públicos para endpoints específicos

func (s *DashboardService) GetResumenGeneral(userRole string, sedeID *int) (*ResumenGeneral, error) {
	return s.getResumenGeneral(userRole, sedeID)
}

func (s *DashboardService) GetVentasPorMes(userRole string, sedeID *int) ([]VentasMensuales, error) {
	return s.getVentasPorMes(sedeID, 6)
}

func (s *DashboardService) GetEstadisticasSedes() ([]EstadisticasSede, error) {
	return s.getEstadisticasSedes()
}
