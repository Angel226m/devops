 
import { TipoTour, TipoTourActualizacion } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class ActualizarTipoTour {
  constructor(private tipoTourRepository: TipoTourRepository) {}

  async execute(id: number, tipoTour: TipoTourActualizacion): Promise<TipoTour> {
    return this.tipoTourRepository.actualizar(id, tipoTour);
  }
}