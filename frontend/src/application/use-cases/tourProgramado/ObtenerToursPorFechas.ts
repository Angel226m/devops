import { TourProgramado, FiltrosTourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerTourPorFechas {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(fecha: string): Promise<TourProgramado[]> {
    const filtros: FiltrosTourProgramado = {
      fecha_inicio: fecha,
      fecha_fin: fecha
    };
    return this.tourProgramadoRepository.listar(filtros);
  }
}