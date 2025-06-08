import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

// Este caso de uso es para situaciones donde se requiere eliminar un tour independientemente de su estado
export class ForzarEliminarTourProgramado {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(id: number): Promise<void> {
    // Aquí podrían ir validaciones específicas para la eliminación forzada
    return this.tourProgramadoRepository.eliminar(id);
  }
}