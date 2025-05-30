 
import { TipoTour, TipoTourCreacion, TipoTourActualizacion } from '../../../domain/entities/TipoTour';

export interface TipoTourRepository {
  listar(): Promise<TipoTour[]>;
  listarPorSede(idSede: number): Promise<TipoTour[]>;
  listarPorIdioma(idIdioma: number): Promise<TipoTour[]>;
  obtenerPorId(id: number): Promise<TipoTour | null>;
  crear(tipoTour: TipoTourCreacion): Promise<TipoTour>;
  actualizar(id: number, tipoTour: TipoTourActualizacion): Promise<TipoTour>;
  eliminar(id: number): Promise<boolean>;
}