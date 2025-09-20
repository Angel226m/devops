import { DashboardMetricas, ResumenGeneral, VentasMensuales, EstadisticasSede } from '../../../domain/entities/Dashboard';

export interface DashboardController {
  obtenerMetricasCompletas(): Promise<DashboardMetricas>;
  obtenerResumenGeneral(): Promise<ResumenGeneral>;
  obtenerVentasPorMes(): Promise<VentasMensuales[]>;
  obtenerEstadisticasSedes(): Promise<EstadisticasSede[]>; // Solo para admin
}