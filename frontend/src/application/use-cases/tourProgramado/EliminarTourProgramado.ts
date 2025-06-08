import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class EliminarTourProgramado {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(id: number): Promise<void> {
    return this.tourProgramadoRepository.eliminar(id);
  }
}