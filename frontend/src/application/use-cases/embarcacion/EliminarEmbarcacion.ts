import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class EliminarEmbarcacion {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(id: number): Promise<boolean> {
    return await this.embarcacionRepository.eliminar(id);
  }
}