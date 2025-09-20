import { DashboardMetricas, ResumenGeneral, VentasMensuales, EstadisticasSede } from '../../../domain/entities/Dashboard';

export interface DashboardRepository {
  getMetricasCompletas(): Promise<DashboardMetricas>;
  getResumenGeneral(): Promise<ResumenGeneral>;
  getVentasPorMes(): Promise<VentasMensuales[]>;
  getEstadisticasSedes(): Promise<EstadisticasSede[]>;
}