 
import { NuevoTipoPasajeRequest } from '../../../domain/entities/TipoPasaje';
import { TipoPasajeRepository } from '../../ports/out/TipoPasajeRepository';

export class CrearTipoPasaje {
  constructor(private tipoPasajeRepository: TipoPasajeRepository) {}

  async execute(tipoPasaje: NuevoTipoPasajeRequest): Promise<number> {
    return this.tipoPasajeRepository.create(tipoPasaje);
  }
}