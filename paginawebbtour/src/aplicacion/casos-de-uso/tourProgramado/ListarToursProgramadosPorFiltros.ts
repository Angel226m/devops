 
import { TourProgramado, FiltrosTourProgramado } from "../../../dominio/entidades/TourProgramado";
import { RepositorioTourProgramado } from "../../puertos/salida/RepositorioTourProgramado";

export class ListarToursProgramadosPorFiltros {
  constructor(private repositorioTourProgramado: RepositorioTourProgramado) {}

  async ejecutar(filtros: FiltrosTourProgramado): Promise<TourProgramado[]> {
    return await this.repositorioTourProgramado.listarPorFiltros(filtros);
  }
}