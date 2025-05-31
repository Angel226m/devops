import { Embarcacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class ListarEmbarcacionesPorChofer {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(idChofer: number): Promise<Embarcacion[]> {
    return await this.embarcacionRepository.listarPorChofer(idChofer);
  }
}