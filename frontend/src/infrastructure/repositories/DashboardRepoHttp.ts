import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import { DashboardRepository } from '../../application/ports/out/DashboardRepository';
import { 
  DashboardMetricas, 
  ResumenGeneral, 
  VentasMensuales, 
  EstadisticasSede,
  DashboardApiResponse,
  ResumenGeneralApiResponse,
  VentasMensualesApiResponse,
  EstadisticasSedesApiResponse
} from '../../domain/entities/Dashboard';

export class DashboardRepoHttp implements DashboardRepository {
  async getMetricasCompletas(): Promise<DashboardMetricas> {
    const response = await axiosClient.get<DashboardApiResponse>(endpoints.dashboard.metricas);
    return response.data.data;
  }

  async getResumenGeneral(): Promise<ResumenGeneral> {
    const response = await axiosClient.get<ResumenGeneralApiResponse>(endpoints.dashboard.resumen);
    return response.data.data;
  }

  async getVentasPorMes(): Promise<VentasMensuales[]> {
    const response = await axiosClient.get<VentasMensualesApiResponse>(endpoints.dashboard.ventasMes);
    return response.data.data;
  }

  async getEstadisticasSedes(): Promise<EstadisticasSede[]> {
    const response = await axiosClient.get<EstadisticasSedesApiResponse>(endpoints.dashboard.sedes);
    return response.data.data;
  }
}