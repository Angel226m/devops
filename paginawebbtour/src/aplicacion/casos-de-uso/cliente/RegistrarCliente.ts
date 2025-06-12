import { NuevoClienteRequest } from "../../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class RegistrarCliente {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(cliente: NuevoClienteRequest): Promise<number> {
    return await this.repositorioCliente.registrar(cliente);
  }
}