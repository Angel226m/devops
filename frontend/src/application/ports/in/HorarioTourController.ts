 
import {
  HorarioTour,
  NuevoHorarioTourRequest,
  ActualizarHorarioTourRequest
} from '../../../domain/entities/HorarioTour';

export interface HorarioTourController {
  crearHorarioTour(request: NuevoHorarioTourRequest): Promise<number>;
  obtenerHorarioTourPorId(id: number): Promise<HorarioTour>;
  actualizarHorarioTour(id: number, request: ActualizarHorarioTourRequest): Promise<void>;
  eliminarHorarioTour(id: number): Promise<void>;
  listarHorariosTour(): Promise<HorarioTour[]>;
  listarHorariosTourPorTipoTour(idTipoTour: number): Promise<HorarioTour[]>;
  listarHorariosTourPorDia(dia: string): Promise<HorarioTour[]>;
}