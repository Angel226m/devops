 
// application/use-cases/pago/EliminarPago.ts
import { PagoRepository } from '../../ports/out/PagoRepository';

export class EliminarPago {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(id: number): Promise<void> {
    return this.pagoRepository.delete(id);
  }
}