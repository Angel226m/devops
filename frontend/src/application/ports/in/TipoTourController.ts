import {
  TipoTour,
  NuevoTipoTourRequest,
  ActualizarTipoTourRequest
} from '../../../domain/entities/TipoTour';

// TipoTour Controller
export interface TipoTourController {
  crearTipoTour(request: NuevoTipoTourRequest): Promise<number>;
  obtenerTipoTourPorId(id: number): Promise<TipoTour>;
  actualizarTipoTour(id: number, request: ActualizarTipoTourRequest): Promise<void>;
  eliminarTipoTour(id: number): Promise<void>;
  listarTiposTour(): Promise<TipoTour[]>;
  listarTiposTourPorSede(idSede: number): Promise<TipoTour[]>;
}