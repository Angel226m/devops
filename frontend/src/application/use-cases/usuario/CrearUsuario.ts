import { NuevoUsuarioRequest } from '../../../domain/entities/Usuario';
import { UsuarioRepository } from '../../ports/out/UsuarioRepository';

export class CrearUsuario {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async execute(usuario: NuevoUsuarioRequest): Promise<number> {
    return this.usuarioRepository.create(usuario);
  }
}