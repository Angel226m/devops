 
// application/use-cases/pago/ListarPagos.ts
import { Pago } from '../../../domain/entities/Pago';
import { PagoRepository } from '../../ports/out/PagoRepository';

export class ListarPagos {
  constructor(private pagoRepository: PagoRepository) {}

  async execute(): Promise<Pago[]> {
    return this.pagoRepository.findAll();
  }
}