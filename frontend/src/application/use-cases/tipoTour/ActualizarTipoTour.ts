import { TipoTourRepository } from '../../ports/out/TipoTourRepository';
import { ActualizarTipoTourRequest } from '../../../domain/entities/TipoTour';

export class ActualizarTipoTour {
  private repository: TipoTourRepository;

  constructor(repository: TipoTourRepository) {
    this.repository = repository;
  }

  async execute(id: number, request: ActualizarTipoTourRequest): Promise<void> {
    return this.repository.update(id, request);
  }
}