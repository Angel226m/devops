import { TourProgramado } from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepository } from '../../ports/out/TourProgramadoRepository';

export class ObtenerToursDisponibles {
  constructor(private readonly tourProgramadoRepository: TourProgramadoRepository) {}

  async execute(fechaInicio?: string, fechaFin?: string, idSede?: number): Promise<TourProgramado[]> {
    // Si no se proporcionan fechas, usar fecha actual para inicio y +30 días para fin
    const hoy = new Date();
    const fechaInicioDefault = fechaInicio || hoy.toISOString().split('T')[0];
    
    if (!fechaFin) {
      const fechaFinDefault = new Date();
      fechaFinDefault.setDate(hoy.getDate() + 30);
      fechaFin = fechaFinDefault.toISOString().split('T')[0];
    }
    
    return this.tourProgramadoRepository.obtenerToursDisponiblesEnRangoFechas(fechaInicioDefault, fechaFin, idSede);
  }
}