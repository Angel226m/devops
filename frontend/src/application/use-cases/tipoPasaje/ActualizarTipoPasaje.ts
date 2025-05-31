 
import { ActualizarTipoPasajeRequest } from '../../../domain/entities/TipoPasaje';
import { TipoPasajeRepository } from '../../ports/out/TipoPasajeRepository';

export class ActualizarTipoPasaje {
  constructor(private tipoPasajeRepository: TipoPasajeRepository) {}

  async execute(id: number, tipoPasaje: ActualizarTipoPasajeRequest): Promise<void> {
    return this.tipoPasajeRepository.update(id, tipoPasaje);
  }
}