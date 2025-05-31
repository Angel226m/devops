 
import { TipoPasaje } from '../../../domain/entities/TipoPasaje';
import { TipoPasajeRepository } from '../../ports/out/TipoPasajeRepository';

export class ListarTiposPasaje {
  constructor(private tipoPasajeRepository: TipoPasajeRepository) {}

  async execute(): Promise<TipoPasaje[]> {
    return this.tipoPasajeRepository.findAll();
  }

  async executeBySede(idSede: number): Promise<TipoPasaje[]> {
    return this.tipoPasajeRepository.findBySede(idSede);
  }

  async executeByTipoTour(idTipoTour: number): Promise<TipoPasaje[]> {
    return this.tipoPasajeRepository.findByTipoTour(idTipoTour);
  }
}