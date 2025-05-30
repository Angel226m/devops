 
import { TipoTourRepository } from '../../ports/out/TipoTourRepository';

export class EliminarTipoTour {
  constructor(private tipoTourRepository: TipoTourRepository) {}

  async execute(id: number): Promise<boolean> {
    return this.tipoTourRepository.eliminar(id);
  }
}