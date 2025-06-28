// application/use-cases/pago/ListarPagosPorReserva.ts
import { Pago } from '../../../domain/entities/Pago';
import { PagoRepository } from '../../ports/out/PagoRepository';

export class ListarPagosPorReserva {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(idReserva: number): Promise<Pago[]> {
    return this.pagoRepository.findByReserva(idReserva);
  }
}