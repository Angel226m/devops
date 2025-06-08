import { TipoTour } from "../../../dominio/entidades/TipoTour";

export interface RepositorioTipoTour {
  listar(): Promise<TipoTour[]>;
  obtenerPorId(id: number): Promise<TipoTour | null>;
  listarPorSede(idSede: number): Promise<TipoTour[]>;
}