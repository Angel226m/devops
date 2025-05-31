import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class EliminarTipoTour {
  private repository: TipoTourRepository;

  constructor(repository: TipoTourRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}