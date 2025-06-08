 
import { TourProgramado, FiltrosTourProgramado } from '../../../dominio/entidades/TourProgramado';

export interface RepositorioTourProgramado {
  listar(): Promise<TourProgramado[]>;
  obtenerPorId(id: number): Promise<TourProgramado | null>;
  listarDisponiblesSinDuplicados(): Promise<TourProgramado[]>;
  listarPorFiltros(filtros: FiltrosTourProgramado): Promise<TourProgramado[]>;
}