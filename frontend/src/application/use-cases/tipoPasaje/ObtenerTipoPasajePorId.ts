 
import { TipoPasaje } from '../../../domain/entities/TipoPasaje';
import { TipoPasajeRepository } from '../../ports/out/TipoPasajeRepository';

export class ObtenerTipoPasajePorId {
  constructor(private tipoPasajeRepository: TipoPasajeRepository) {}

  async execute(id: number): Promise<TipoPasaje> {
    return this.tipoPasajeRepository.findById(id);
  }
}