import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';
import { NuevoTourProgramadoRequest } from '../../../domain/entities/TourProgramado';

export class ProgramarTourSemanal {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(fechaInicio: string, tourBase: NuevoTourProgramadoRequest, cantidadDias: number): Promise<number[]> {
    // Se podrían agregar validaciones adicionales aquí
    return this.tourProgramadoRepository.programarTourSemanal(fechaInicio, tourBase, cantidadDias);
  }
}