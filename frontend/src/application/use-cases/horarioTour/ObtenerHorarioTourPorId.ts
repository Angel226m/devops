 
import { HorarioTour } from '../../../domain/entities/HorarioTour';
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';

export class ObtenerHorarioTourPorId {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<HorarioTour> {
    return this.repository.findById(id);
  }
}