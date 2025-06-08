import { TourProgramado, FiltrosTourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerToursVigentes {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(): Promise<TourProgramado[]> {
    // Obtener fecha actual
    const fechaActual = new Date().toISOString().split('T')[0];
    
    // Usar filtros para obtener tours cuyo período de vigencia incluya la fecha actual
    const filtros: FiltrosTourProgramado = {
      vigencia_desde_ini: fechaActual, // vigencia_desde <= fechaActual
      vigencia_hasta_ini: fechaActual  // vigencia_hasta >= fechaActual
    };
    
    return this.tourProgramadoRepository.listar(filtros);
  }
}