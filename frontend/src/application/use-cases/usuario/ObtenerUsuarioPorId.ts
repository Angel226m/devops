import { Usuario } from '../../../domain/entities/Usuario';
import { UsuarioRepository } from '../../ports/out/UsuarioRepository';

export class ObtenerUsuarioPorId {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async execute(id: number): Promise<Usuario> {
    return this.usuarioRepository.getById(id);
  }
}