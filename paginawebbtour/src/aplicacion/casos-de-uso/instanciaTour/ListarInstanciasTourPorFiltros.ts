import { InstanciaTour, FiltrosInstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { RepositorioInstanciaTour } from "../../puertos/salida/RepositorioInstanciaTour";

export class ListarInstanciasTourPorFiltros {
  constructor(private repositorioInstanciaTour: RepositorioInstanciaTour) {}

  async ejecutar(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]> {
    return await this.repositorioInstanciaTour.listarPorFiltros(filtros);
  }
}