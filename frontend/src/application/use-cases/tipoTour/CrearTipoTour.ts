 
import { TipoTour, TipoTourCreacion } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class CrearTipoTour {
  constructor(private tipoTourRepository: TipoTourRepository) {}

  async execute(tipoTour: TipoTourCreacion): Promise<TipoTour> {
    return this.tipoTourRepository.crear(tipoTour);
  }
}