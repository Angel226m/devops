 
import { TipoTour } from '../../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class ListarTiposTour {
  constructor(private tipoTourRepository: TipoTourRepository) {}

  async execute(): Promise<TipoTour[]> {
    return this.tipoTourRepository.listar();
  }
}