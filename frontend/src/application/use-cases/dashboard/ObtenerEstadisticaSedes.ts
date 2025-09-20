import { DashboardRepository } from '../../ports/out/DashboardRepository';
import { EstadisticasSede } from '../../../domain/entities/Dashboard';

export class ObtenerEstadisticasSedes {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<EstadisticasSede[]> {
    try {
      return await this.dashboardRepository.getEstadisticasSedes();
    } catch (error) {
      throw new Error(`Error al obtener estadísticas de sedes: ${error}`);
    }
  }
}