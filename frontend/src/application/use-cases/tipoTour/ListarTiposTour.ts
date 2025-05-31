import { TipoTour } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class ListarTiposTour {
  private repository: TipoTourRepository;

  constructor(repository: TipoTourRepository) {
    this.repository = repository;
  }

  async execute(): Promise<TipoTour[]> {
    return this.repository.findAll();
  }
}