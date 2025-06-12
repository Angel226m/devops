import { RespuestaAutenticacion } from "../../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class RefrescarTokenCliente {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(refreshToken?: string): Promise<RespuestaAutenticacion> {
    return await this.repositorioCliente.refrescarToken(refreshToken);
  }
}