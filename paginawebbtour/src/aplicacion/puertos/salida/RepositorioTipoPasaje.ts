import { TipoPasaje, FiltrosTipoPasaje } from "../../../dominio/entidades/TipoPasaje";

export interface RepositorioTipoPasaje {
  listar(): Promise<TipoPasaje[]>;
  obtenerPorId(id: number): Promise<TipoPasaje | null>;
  listarPorSede(idSede: number): Promise<TipoPasaje[]>;
  listarPorTipoTour(idTipoTour: number): Promise<TipoPasaje[]>;
}