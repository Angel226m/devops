 
import { TipoPasaje, NuevoTipoPasajeRequest, ActualizarTipoPasajeRequest } from '../../../domain/entities/TipoPasaje';

export interface TipoPasajeRepository {
  findAll(): Promise<TipoPasaje[]>;
  findById(id: number): Promise<TipoPasaje>;
  create(tipoPasaje: NuevoTipoPasajeRequest): Promise<number>;
  update(id: number, tipoPasaje: ActualizarTipoPasajeRequest): Promise<void>;
  delete(id: number): Promise<void>;
  findBySede(idSede: number): Promise<TipoPasaje[]>;
  findByTipoTour(idTipoTour: number): Promise<TipoPasaje[]>;
}