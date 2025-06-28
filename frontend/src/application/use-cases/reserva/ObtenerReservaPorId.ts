 
// application/use-cases/reserva/ObtenerReservaPorId.ts
import { Reserva } from '../../../domain/entities/Reserva';
import { ReservaRepository } from '../../ports/out/ReservaRepository';

export class ObtenerReservaPorId {
  constructor(private reservaRepository: ReservaRepository) {}

  async execute(id: number): Promise<Reserva> {
    return this.reservaRepository.findById(id);
  }
}