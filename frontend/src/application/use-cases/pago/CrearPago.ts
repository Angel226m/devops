 
// application/use-cases/pago/CrearPago.ts
import { NuevoPagoRequest } from '../../../domain/entities/Pago';
import { PagoRepository } from '../../ports/out/PagoRepository';

export class CrearPago {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(pago: NuevoPagoRequest): Promise<number> {
    return this.pagoRepository.create(pago);
  }
}