import { TipoTour } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class ObtenerTipoTourPorId {
  private repository: TipoTourRepository;

  constructor(repository: TipoTourRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<TipoTour> {
    return this.repository.findById(id);
  }
}