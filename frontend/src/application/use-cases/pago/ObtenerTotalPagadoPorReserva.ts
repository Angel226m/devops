// application/use-cases/pago/ObtenerTotalPagadoPorReserva.ts
import { PagoRepository } from '../../ports/out/PagoRepository';

export class ObtenerTotalPagadoPorReserva {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(idReserva: number): Promise<number> {
    return this.pagoRepository.getTotalPagadoByReserva(idReserva);
  }
}