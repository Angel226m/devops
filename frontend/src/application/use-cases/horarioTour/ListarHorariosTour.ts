import { HorarioTour } from '../../../domain/entities/HorarioTour';
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';

export class ListarHorariosTour {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(): Promise<HorarioTour[]> {
    return this.repository.findAll();
  }
}