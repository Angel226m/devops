 
import { TourProgramado, FiltrosTourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ListarToursProgramados {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(filtros: FiltrosTourProgramado): Promise<TourProgramado[]> {
    return this.tourProgramadoRepository.listar(filtros);
  }
}