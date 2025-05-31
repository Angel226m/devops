import { PaquetePasajes, NuevoPaquetePasajesRequest, ActualizarPaquetePasajesRequest } from '../../../domain/entities/PaquetePasajes';

export interface PaquetePasajesController {
  obtenerTodos(): Promise<PaquetePasajes[]>;
  obtenerPorId(id: number): Promise<PaquetePasajes>;
  crear(paquetePasajes: NuevoPaquetePasajesRequest): Promise<number>;
  actualizar(id: number, paquetePasajes: ActualizarPaquetePasajesRequest): Promise<void>;
  eliminar(id: number): Promise<void>;
  obtenerPorSede(idSede: number): Promise<PaquetePasajes[]>;
  obtenerPorTipoTour(idTipoTour: number): Promise<PaquetePasajes[]>;
}