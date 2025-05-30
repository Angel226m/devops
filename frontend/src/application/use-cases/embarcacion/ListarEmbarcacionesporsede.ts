import { Embarcacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../ports/out/EmbarcacionRepository';

export class ListarEmbarcacionesPorSede {
  constructor(private embarcacionRepository: EmbarcacionRepository) {}

  async execute(idSede: number): Promise<Embarcacion[]> {
    return await this.embarcacionRepository.listarPorSede(idSede);
  }
}