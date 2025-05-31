import { ActualizarPaquetePasajesRequest } from '../../../domain/entities/PaquetePasajes';
import { PaquetePasajesRepository } from '../../ports/out/PaquetePasajesRepository';

export class ActualizarPaquetePasajes {
  constructor(private paquetePasajesRepository: PaquetePasajesRepository) {}

  async execute(id: number, paquetePasajes: ActualizarPaquetePasajesRequest): Promise<void> {
    return this.paquetePasajesRepository.update(id, paquetePasajes);
  }
}