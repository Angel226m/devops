/*import { axiosClient } from '../api/axiosClient';
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
}*/
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
  constructor(private userRole: string = 'VENDEDOR') {}

  private getEndpoint(adminEndpoint: string, vendedorEndpoint: string): string {
    return this.userRole === 'ADMIN' ? adminEndpoint : vendedorEndpoint;
  }

  async getMetricasCompletas(): Promise<DashboardMetricas> {
    const endpoint = this.getEndpoint(
      endpoints.dashboard.metricas,
      endpoints.dashboard.vendedorMetricas
    );
    const response = await axiosClient.get<DashboardApiResponse>(endpoint);
    return response.data.data;
  }

  async getResumenGeneral(): Promise<ResumenGeneral> {
    const endpoint = this.getEndpoint(
      endpoints.dashboard.resumen,
      endpoints.dashboard.vendedorResumen
    );
    const response = await axiosClient.get<ResumenGeneralApiResponse>(endpoint);
    return response.data.data;
  }

  async getVentasPorMes(): Promise<VentasMensuales[]> {
    const endpoint = this.getEndpoint(
      endpoints.dashboard.ventasMes,
      endpoints.dashboard.vendedorVentasMes
    );
    const response = await axiosClient.get<VentasMensualesApiResponse>(endpoint);
    return response.data.data;
  }

  async getEstadisticasSedes(): Promise<EstadisticasSede[]> {
    // Solo los admins pueden acceder a estadísticas de sedes
    if (this.userRole !== 'ADMIN') {
      return [];
    }
    const response = await axiosClient.get<EstadisticasSedesApiResponse>(endpoints.dashboard.sedes);
    return response.data.data;
  }
}