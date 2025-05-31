 
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';

export class EliminarHorarioTour {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}