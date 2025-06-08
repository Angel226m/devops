 
import { PaquetePasajes, FiltrosPaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";

export interface RepositorioPaquetePasajes {
  listar(): Promise<PaquetePasajes[]>;
  obtenerPorId(id: number): Promise<PaquetePasajes | null>;
  listarPorSede(idSede: number): Promise<PaquetePasajes[]>;
  listarPorTipoTour(idTipoTour: number): Promise<PaquetePasajes[]>;
}