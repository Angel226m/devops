import { TourProgramado, FiltrosTourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerToursPorEstados {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(estado: string): Promise<TourProgramado[]> {
    const filtros: FiltrosTourProgramado = {
      estado: estado
    };
    return this.tourProgramadoRepository.listar(filtros);
  }
}