import { InstanciaTour, FiltrosInstanciaTour } from "../../../dominio/entidades/InstanciaTour";

export interface RepositorioInstanciaTour {
  listar(): Promise<InstanciaTour[]>;
  obtenerPorId(id: number): Promise<InstanciaTour | null>;
  listarPorFiltros(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]>;
  listarDisponibles(): Promise<InstanciaTour[]>;
  listarPorFecha(fecha: string): Promise<InstanciaTour[]>;
}