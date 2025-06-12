import { Cliente } from "../../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class ObtenerClientePorId {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(id: number): Promise<Cliente | null> {
    return await this.repositorioCliente.obtenerPorId(id);
  }
}