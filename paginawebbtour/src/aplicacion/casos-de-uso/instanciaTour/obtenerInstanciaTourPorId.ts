import { InstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { RepositorioInstanciaTour } from "../../puertos/salida/RepositorioInstanciaTour";

export class ObtenerInstanciaTourPorId {
  constructor(private repositorioInstanciaTour: RepositorioInstanciaTour) {}

  async ejecutar(id: number): Promise<InstanciaTour | null> {
    return await this.repositorioInstanciaTour.obtenerPorId(id);
  }
}