import { InstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { RepositorioInstanciaTour } from "../../puertos/salida/RepositorioInstanciaTour";

export class ListarInstanciasTourDisponibles {
  constructor(private repositorioInstanciaTour: RepositorioInstanciaTour) {}

  async ejecutar(): Promise<InstanciaTour[]> {
    return await this.repositorioInstanciaTour.listarDisponibles();
  }
}