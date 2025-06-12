import { ActualizarClienteRequest } from "../../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class ActualizarCliente {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(id: number, datos: ActualizarClienteRequest): Promise<void> {
    return await this.repositorioCliente.actualizar(id, datos);
  }
}