 
import { Usuario, NuevoUsuarioRequest, ActualizarUsuarioRequest } from '../../../domain/entities/Usuario';

export interface UsuarioController {
  listarUsuarios(): Promise<Usuario[]>;
  obtenerUsuarioPorId(id: number): Promise<Usuario>;
  listarUsuariosPorRol(rol: string): Promise<Usuario[]>;
  crearUsuario(usuario: NuevoUsuarioRequest): Promise<number>;
  actualizarUsuario(id: number, usuario: ActualizarUsuarioRequest): Promise<void>;
  eliminarUsuario(id: number): Promise<void>;
}