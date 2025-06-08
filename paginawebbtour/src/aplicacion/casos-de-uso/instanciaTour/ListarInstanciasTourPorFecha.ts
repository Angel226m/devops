import { InstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { RepositorioInstanciaTour } from "../../puertos/salida/RepositorioInstanciaTour";

export class ListarInstanciasTourPorFecha {
  constructor(private repositorioInstanciaTour: RepositorioInstanciaTour) {}

  async ejecutar(fecha: string): Promise<InstanciaTour[]> {
    return await this.repositorioInstanciaTour.listarPorFecha(fecha);
  }
}