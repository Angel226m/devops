 
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';
import { ActualizarHorarioTourRequest } from '../../../domain/entities/HorarioTour';

export class ActualizarHorarioTour {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(id: number, request: ActualizarHorarioTourRequest): Promise<void> {
    return this.repository.update(id, request);
  }
}