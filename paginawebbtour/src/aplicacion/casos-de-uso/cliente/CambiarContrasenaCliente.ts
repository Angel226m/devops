import { CambiarContrasenaRequest } from "../../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class CambiarContrasenaCliente {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(id: number, datos: CambiarContrasenaRequest): Promise<void> {
    return await this.repositorioCliente.cambiarContrasena(id, datos);
  }
}