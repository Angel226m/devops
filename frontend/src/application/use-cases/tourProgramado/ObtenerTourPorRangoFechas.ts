import { TourProgramado, FiltrosTourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerTourPorRangoFechas {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(fechaInicio: string, fechaFin: string): Promise<TourProgramado[]> {
    const filtros: FiltrosTourProgramado = {
      fecha_inicio: fechaInicio,
      fecha_fin: fechaFin
    };
    return this.tourProgramadoRepository.listar(filtros);
  }
}