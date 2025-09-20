import { DashboardRepository } from '../../ports/out/DashboardRepository';
import { ResumenGeneral } from '../../../domain/entities/Dashboard';

export class ObtenerResumenGeneral {
  constructor(private dashboardRepository: DashboardRepository) {}

  async execute(): Promise<ResumenGeneral> {
    try {
      return await this.dashboardRepository.getResumenGeneral();
    } catch (error) {
      throw new Error(`Error al obtener resumen general: ${error}`);
    }
  }
}