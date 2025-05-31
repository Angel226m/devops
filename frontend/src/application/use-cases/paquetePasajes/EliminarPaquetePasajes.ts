import { PaquetePasajesRepository } from '../../ports/out/PaquetePasajesRepository';

export class EliminarPaquetePasajes {
  constructor(private paquetePasajesRepository: PaquetePasajesRepository) {}

  async execute(id: number): Promise<void> {
    return this.paquetePasajesRepository.delete(id);
  }
}