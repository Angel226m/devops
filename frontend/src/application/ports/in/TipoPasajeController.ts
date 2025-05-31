 
import { TipoPasaje, NuevoTipoPasajeRequest, ActualizarTipoPasajeRequest } from '../../../domain/entities/TipoPasaje';

export interface TipoPasajeController {
  obtenerTodos(): Promise<TipoPasaje[]>;
  obtenerPorId(id: number): Promise<TipoPasaje>;
  crear(tipoPasaje: NuevoTipoPasajeRequest): Promise<number>;
  actualizar(id: number, tipoPasaje: ActualizarTipoPasajeRequest): Promise<void>;
  eliminar(id: number): Promise<void>;
  obtenerPorSede(idSede: number): Promise<TipoPasaje[]>;
  obtenerPorTipoTour(idTipoTour: number): Promise<TipoPasaje[]>;
}