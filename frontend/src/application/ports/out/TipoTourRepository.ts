import {
  TipoTour,
  NuevoTipoTourRequest,
  ActualizarTipoTourRequest
} from '../../../domain/entities/TipoTour';

// TipoTour Repository
export interface TipoTourRepository {
  create(tipoTour: NuevoTipoTourRequest): Promise<number>;
  findById(id: number): Promise<TipoTour>;
  update(id: number, tipoTour: ActualizarTipoTourRequest): Promise<void>;
  delete(id: number): Promise<void>;
  findAll(): Promise<TipoTour[]>;
  findBySede(idSede: number): Promise<TipoTour[]>;
}