import { Embarcacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class ObtenerEmbarcacionPorId {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(id: number): Promise<Embarcacion | null> {
    return await this.embarcacionRepository.obtenerPorId(id);
  }
}