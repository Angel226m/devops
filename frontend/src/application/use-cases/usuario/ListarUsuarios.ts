import { Usuario } from '../../../domain/entities/Usuario';
import { UsuarioRepository } from '../../ports/out/UsuarioRepository';

export class ListarUsuarios {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async execute(): Promise<Usuario[]> {
    return this.usuarioRepository.getAll();
  }
}