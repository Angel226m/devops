import { 
  TourProgramado, 
  NuevoTourProgramadoRequest, 
  ActualizarTourProgramadoRequest,
  FiltrosTourProgramado,
  DisponibilidadHorario
} from '../../../domain/entities/TourProgramado';

export interface TourProgramadoRepository {
  crear(tourProgramado: NuevoTourProgramadoRequest): Promise<number>;
  obtenerPorId(id: number): Promise<TourProgramado>;
  actualizar(id: number, tourProgramado: ActualizarTourProgramadoRequest): Promise<void>;
  eliminar(id: number): Promise<void>;
  listar(filtros: FiltrosTourProgramado): Promise<TourProgramado[]>;
  
  asignarChofer(id: number, idChofer: number): Promise<void>;
  cambiarEstado(id: number, estado: string): Promise<void>;
  
  obtenerProgramacionSemanal(fechaInicio: string, idSede?: number): Promise<TourProgramado[]>;
  obtenerToursDisponiblesEnFecha(fecha: string, idSede?: number): Promise<TourProgramado[]>;
  obtenerToursDisponiblesEnRangoFechas(fechaInicio: string, fechaFin: string, idSede?: number): Promise<TourProgramado[]>;
  verificarDisponibilidadHorario(idHorario: number, fecha: string): Promise<DisponibilidadHorario>;
  programarTourSemanal(fechaInicio: string, tourBase: NuevoTourProgramadoRequest, cantidadDias: number): Promise<number[]>;
}