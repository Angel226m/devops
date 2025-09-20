import { DashboardRepository } from '../../ports/out/DashboardRepository';
import { DashboardMetricas } from '../../../domain/entities/Dashboard';

export class ObtenerMetricasCompletas {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<DashboardMetricas> {
    try {
      return await this.dashboardRepository.getMetricasCompletas();
    } catch (error) {
      throw new Error(`Error al obtener métricas completas: ${error}`);
    }
  }
}