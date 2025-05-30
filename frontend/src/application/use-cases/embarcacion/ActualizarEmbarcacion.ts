import { Embarcacion, EmbarcacionActualizacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class ActualizarEmbarcacion {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(id: number, embarcacion: EmbarcacionActualizacion): Promise<Embarcacion> {
    return await this.embarcacionRepository.actualizar(id, embarcacion);
  }
}