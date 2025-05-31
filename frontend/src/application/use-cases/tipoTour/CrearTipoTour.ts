import { TipoTourRepository } from '../../ports/out/TipoTourRepository';
import { NuevoTipoTourRequest } from '../../../domain/entities/TipoTour';

export class CrearTipoTour {
  private repository: TipoTourRepository;

  constructor(repository: TipoTourRepository) {
    this.repository = repository;
  }

  async execute(request: NuevoTipoTourRequest): Promise<number> {
    return this.repository.create(request);
  }
}