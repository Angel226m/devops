import { HorarioTour } from '../../../domain/entities/HorarioTour';
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';

export class ListarHorariosTourPorTipoTour {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(idTipoTour: number): Promise<HorarioTour[]> {
    return this.repository.findByTipoTour(idTipoTour);
  }
}