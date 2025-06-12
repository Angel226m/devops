import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  Cliente, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../../dominio/entidades/Cliente";

export interface RepositorioCliente {
  registrar(cliente: NuevoClienteRequest): Promise<number>;
  obtenerPorId(id: number): Promise<Cliente | null>;
  actualizar(id: number, datos: ActualizarClienteRequest): Promise<void>;
  autenticar(credenciales: LoginClienteRequest): Promise<RespuestaAutenticacion>;
  refrescarToken(refreshToken?: string): Promise<RespuestaAutenticacion>;
  cerrarSesion(): Promise<void>;
  cambiarContrasena(id: number, datos: CambiarContrasenaRequest): Promise<void>;
}