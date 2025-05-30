import { UsuarioRepository } from '../../ports/out/UsuarioRepository';

export class EliminarUsuario {
  constructor(private usuarioRepository: UsuarioRepository) {}

  async execute(id: number): Promise<void> {
    return this.usuarioRepository.delete(id);
  }
}