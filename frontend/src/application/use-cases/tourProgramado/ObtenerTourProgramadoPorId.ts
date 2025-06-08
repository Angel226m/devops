import { TourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerTourProgramadoPorId {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(id: number): Promise<TourProgramado> {
    return this.tourProgramadoRepository.obtenerPorId(id);
  }
}