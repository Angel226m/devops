import { Embarcacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class ListarEmbarcaciones {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(): Promise<Embarcacion[]> {
    return await this.embarcacionRepository.listar();
  }
}