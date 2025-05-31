import { NuevoPaquetePasajesRequest } from '../../../domain/entities/PaquetePasajes';
import { PaquetePasajesRepository } from '../../ports/out/PaquetePasajesRepository';

export class CrearPaquetePasajes {
  constructor(private paquetePasajesRepository: PaquetePasajesRepository) {}

  async execute(paquetePasajes: NuevoPaquetePasajesRequest): Promise<number> {
    return this.paquetePasajesRepository.create(paquetePasajes);
  }
}