import { PaquetePasajes, NuevoPaquetePasajesRequest, ActualizarPaquetePasajesRequest } from '../../../domain/entities/PaquetePasajes';

export interface PaquetePasajesRepository {
  findAll(): Promise<PaquetePasajes[]>;
  findById(id: number): Promise<PaquetePasajes>;
  create(paquetePasajes: NuevoPaquetePasajesRequest): Promise<number>;
  update(id: number, paquetePasajes: ActualizarPaquetePasajesRequest): Promise<void>;
  delete(id: number): Promise<void>;
  findBySede(idSede: number): Promise<PaquetePasajes[]>;
  findByTipoTour(idTipoTour: number): Promise<PaquetePasajes[]>;
}