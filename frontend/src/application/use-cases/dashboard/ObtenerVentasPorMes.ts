import { DashboardRepository } from '../../ports/out/DashboardRepository';
import { VentasMensuales } from '../../../domain/entities/Dashboard';

export class ObtenerVentasPorMes {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<VentasMensuales[]> {
    try {
      return await this.dashboardRepository.getVentasPorMes();
    } catch (error) {
      throw new Error(`Error al obtener ventas por mes: ${error}`);
    }
  }
}