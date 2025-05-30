import { ActualizarUsuarioRequest } from '../../../domain/entities/Usuario';
import { UsuarioRepository } from '../../ports/out/UsuarioRepository';

export class ActualizarUsuario {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async execute(id: number, usuario: ActualizarUsuarioRequest): Promise<void> {
    return this.usuarioRepository.update(id, usuario);
  }
}