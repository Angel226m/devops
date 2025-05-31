 
import { TipoPasajeRepository } from '../../ports/out/TipoPasajeRepository';

export class EliminarTipoPasaje {
  constructor(private tipoPasajeRepository: TipoPasajeRepository) {}

  async execute(id: number): Promise<void> {
    return this.tipoPasajeRepository.delete(id);
  }
}