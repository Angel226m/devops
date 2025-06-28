 
// application/use-cases/pago/ObtenerPagoPorId.ts
import { Pago } from '../../../domain/entities/Pago';
import { PagoRepository } from '../../ports/out/PagoRepository';

export class ObtenerPagoPorId {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(id: number): Promise<Pago> {
    return this.pagoRepository.findById(id);
  }
}