import { InstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { RepositorioInstanciaTour } from "../../puertos/salida/RepositorioInstanciaTour";

export class ListarInstanciasTour {
  constructor(private repositorioInstanciaTour: RepositorioInstanciaTour) {}

  async ejecutar(): Promise<InstanciaTour[]> {
    return await this.repositorioInstanciaTour.listar();
  }
}