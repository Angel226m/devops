 
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';
import { NuevoHorarioTourRequest } from '../../../domain/entities/HorarioTour';

export class CrearHorarioTour {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(request: NuevoHorarioTourRequest): Promise<number> {
    return this.repository.create(request);
  }
}