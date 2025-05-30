import { Embarcacion, EmbarcacionCreacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class CrearEmbarcacion {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(embarcacion: EmbarcacionCreacion): Promise<Embarcacion> {
    return await this.embarcacionRepository.crear(embarcacion);
  }
}