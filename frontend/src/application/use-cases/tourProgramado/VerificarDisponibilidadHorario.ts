import { DisponibilidadHorario } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class VerificarDisponibilidadHorario {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(idHorario: number, fecha: string): Promise<DisponibilidadHorario> {
    return this.tourProgramadoRepository.verificarDisponibilidadHorario(idHorario, fecha);
  }
}