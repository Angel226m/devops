import { 
  TourProgramado, 
  NuevoTourProgramadoRequest, 
  ActualizarTourProgramadoRequest,
  AsignarChoferRequest,
  FiltrosTourProgramado,
  DisponibilidadHorario
} from '../../../domain/entities/TourProgramado';

export interface TourProgramadoController {
  // CRUD básico
  crear(tourProgramado: NuevoTourProgramadoRequest): Promise<number>;
  obtenerPorId(id: number): Promise<TourProgramado>;
  actualizar(id: number, tourProgramado: ActualizarTourProgramadoRequest): Promise<void>;
  eliminar(id: number): Promise<void>;
  listar(filtros: FiltrosTourProgramado): Promise<TourProgramado[]>;
  
  // Operaciones específicas
  asignarChofer(id: number, request: AsignarChoferRequest): Promise<void>;
  cambiarEstado(id: number, estado: string): Promise<void>;
  
  // Consultas específicas
  obtenerProgramacionSemanal(fechaInicio: string, idSede?: number): Promise<TourProgramado[]>;
  obtenerToursDisponiblesEnFecha(fecha: string, idSede?: number): Promise<TourProgramado[]>;
  obtenerToursDisponiblesEnRangoFechas(fechaInicio: string, fechaFin: string, idSede?: number): Promise<TourProgramado[]>;
  verificarDisponibilidadHorario(idHorario: number, fecha: string): Promise<DisponibilidadHorario>;
  listarToursProgramadosDisponibles(fechaInicio?: string, fechaFin?: string, idSede?: number): Promise<TourProgramado[]>;
  listarPorFecha(fecha: string): Promise<TourProgramado[]>;
  listarPorRangoFechas(fechaInicio: string, fechaFin: string): Promise<TourProgramado[]>;
  listarPorEstado(estado: string): Promise<TourProgramado[]>;
  listarPorEmbarcacion(idEmbarcacion: number): Promise<TourProgramado[]>;
  listarPorChofer(idChofer: number): Promise<TourProgramado[]>;
  listarPorTipoTour(idTipoTour: number): Promise<TourProgramado[]>;
  listarPorSede(idSede: number): Promise<TourProgramado[]>;
  obtenerToursVigentes(): Promise<TourProgramado[]>;
  obtenerDisponibilidadDia(fecha: string, idSede?: number): Promise<TourProgramado[]>;
  programarTourSemanal(fechaInicio: string, tourBase: NuevoTourProgramadoRequest, cantidadDias: number): Promise<number[]>;
}