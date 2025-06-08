import { TourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerToursDisponiblesEnFecha {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(fecha: string, idSede?: number): Promise<TourProgramado[]> {
    return this.tourProgramadoRepository.obtenerToursDisponiblesEnFecha(fecha, idSede);
  }
}