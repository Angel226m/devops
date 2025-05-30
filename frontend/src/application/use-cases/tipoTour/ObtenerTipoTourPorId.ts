 
import { TipoTour } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class ObtenerTipoTourPorId {
  constructor(private tipoTourRepository: TipoTourRepository) {}

  async execute(id: number): Promise<TipoTour | null> {
    return this.tipoTourRepository.obtenerPorId(id);
  }
}