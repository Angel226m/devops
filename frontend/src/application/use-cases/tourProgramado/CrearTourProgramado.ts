import { NuevoTourProgramadoRequest } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class CrearTourProgramado {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(tourProgramado: NuevoTourProgramadoRequest): Promise<number> {
    // Validaciones adicionales podrían ir aquí
    return this.tourProgramadoRepository.crear(tourProgramado);
  }
}