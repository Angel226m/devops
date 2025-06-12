import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class CerrarSesionCliente {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(): Promise<void> {
    return await this.repositorioCliente.cerrarSesion();
  }
}