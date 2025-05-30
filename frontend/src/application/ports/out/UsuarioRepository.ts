import { Usuario, NuevoUsuarioRequest, ActualizarUsuarioRequest } from '../../../domain/entities/Usuario';

export interface UsuarioRepository {
  getAll(): Promise<Usuario[]>;
  getById(id: number): Promise<Usuario>;
  getByRol(rol: string): Promise<Usuario[]>;
  create(usuario: NuevoUsuarioRequest): Promise<number>;
  update(id: number, usuario: ActualizarUsuarioRequest): Promise<void>;
  delete(id: number): Promise<void>;
}