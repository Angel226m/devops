import { HorarioTour } from '../../../domain/entities/HorarioTour';
import { HorarioTourRepository } from '../../ports/out/HorarioTourRepository';

export class ListarHorariosTourPorDia {
  private repository: HorarioTourRepository;

  constructor(repository: HorarioTourRepository) {
    this.repository = repository;
  }

  async execute(dia: string): Promise<HorarioTour[]> {
    return this.repository.findByDia(dia);
  }
}