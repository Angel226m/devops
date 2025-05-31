import { PaquetePasajes } from '../../../domain/entities/PaquetePasajes';
import { PaquetePasajesRepository } from '../../ports/out/PaquetePasajesRepository';

export class ObtenerPaquetePasajesPorId {
  constructor(private paquetePasajesRepository: PaquetePasajesRepository) {}

  async execute(id: number): Promise<PaquetePasajes> {
    return this.paquetePasajesRepository.findById(id);
  }
}