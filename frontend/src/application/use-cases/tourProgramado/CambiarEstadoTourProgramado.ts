import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class CambiarEstadoTourProgramado {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(id: number, estado: string): Promise<void> {
    // Validar estado
    if (!['PROGRAMADO', 'EN_CURSO', 'COMPLETADO', 'CANCELADO'].includes(estado)) {
      throw new Error('Estado no válido');
    }
    return this.tourProgramadoRepository.cambiarEstado(id, estado);
  }
}