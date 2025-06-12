import { LoginClienteRequest, RespuestaAutenticacion } from "../../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../puertos/salida/RepositorioCliente";

export class AutenticarCliente {
  constructor(private repositorioCliente: RepositorioCliente) {}

  async ejecutar(credenciales: LoginClienteRequest): Promise<RespuestaAutenticacion> {
    return await this.repositorioCliente.autenticar(credenciales);
  }
}