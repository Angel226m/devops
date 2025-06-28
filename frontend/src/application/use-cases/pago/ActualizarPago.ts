 
// application/use-cases/pago/ActualizarPago.ts
import { ActualizarPagoRequest } from '../../../domain/entities/Pago';
import { PagoRepository } from '../../ports/out/PagoRepository';

export class ActualizarPago {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(id: number, pago: ActualizarPagoRequest): Promise<void> {
    return this.pagoRepository.update(id, pago);
  }
}