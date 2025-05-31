import { PaquetePasajes } from '../../../domain/entities/PaquetePasajes';
import { PaquetePasajesRepository } from '../../ports/out/PaquetePasajesRepository';

export class ListarPaquetesPasajes {
  constructor(private paquetePasajesRepository: PaquetePasajesRepository) {}

  async execute(): Promise<PaquetePasajes[]> {
    return this.paquetePasajesRepository.findAll();
  }

  async executeBySede(idSede: number): Promise<PaquetePasajes[]> {
    return this.paquetePasajesRepository.findBySede(idSede);
  }

  async executeByTipoTour(idTipoTour: number): Promise<PaquetePasajes[]> {
    return this.paquetePasajesRepository.findByTipoTour(idTipoTour);
  }
}