import { ActualizarTourProgramadoRequest } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ActualizarTourProgramado {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(id: number, tourProgramado: ActualizarTourProgramadoRequest): Promise<void> {
    return this.tourProgramadoRepository.actualizar(id, tourProgramado);
  }
}