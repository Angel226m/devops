import { TipoTour } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class ListarTiposTourPorSede {
  private repository: TipoTourRepository;

  constructor(repository: TipoTourRepository) {
    this.repository = repository;
  }

  async execute(idSede: number): Promise<TipoTour[]> {
    return this.repository.findBySede(idSede);
  }
}