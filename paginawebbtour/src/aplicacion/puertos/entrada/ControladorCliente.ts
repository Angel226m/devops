import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  Cliente, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../../dominio/entidades/Cliente";
import { ActualizarCliente } from "../../casos-de-uso/cliente/ActualizarCliente";
import { AutenticarCliente } from "../../casos-de-uso/cliente/AutenticarCliente";
import { CambiarContrasenaCliente } from "../../casos-de-uso/cliente/CambiarContrasenaCliente";
import { CerrarSesionCliente } from "../../casos-de-uso/cliente/CerrarSesionCliente";
import { ObtenerClientePorId } from "../../casos-de-uso/cliente/ObtenerClientePorId";
import { RefrescarTokenCliente } from "../../casos-de-uso/cliente/RefrescarTokenCliente";
import { RegistrarCliente } from "../../casos-de-uso/cliente/RegistrarCliente";

export class ControladorCliente {
  constructor(
    private registrarCliente: RegistrarCliente,
    private obtenerClientePorId: ObtenerClientePorId,
    private actualizarCliente: ActualizarCliente,
    private autenticarCliente: AutenticarCliente,
    private refrescarTokenCliente: RefrescarTokenCliente,
    private cerrarSesionCliente: CerrarSesionCliente,
    private cambiarContrasenaCliente: CambiarContrasenaCliente
  ) {}

  async registrar(cliente: NuevoClienteRequest): Promise<number> {
    return await this.registrarCliente.ejecutar(cliente);
  }

  async obtenerPorId(id: number): Promise<Cliente | null> {
    return await this.obtenerClientePorId.ejecutar(id);
  }

  async actualizar(id: number, datos: ActualizarClienteRequest): Promise<void> {
    return await this.actualizarCliente.ejecutar(id, datos);
  }

  async autenticar(credenciales: LoginClienteRequest): Promise<RespuestaAutenticacion> {
    return await this.autenticarCliente.ejecutar(credenciales);
  }

  async refrescarToken(refreshToken?: string): Promise<RespuestaAutenticacion> {
    return await this.refrescarTokenCliente.ejecutar(refreshToken);
  }

  async cerrarSesion(): Promise<void> {
    return await this.cerrarSesionCliente.ejecutar();
  }

  async cambiarContrasena(id: number, datos: CambiarContrasenaRequest): Promise<void> {
    return await this.cambiarContrasenaCliente.ejecutar(id, datos);
  }
}