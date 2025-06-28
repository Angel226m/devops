 
// application/use-cases/reserva/CrearReserva.ts
import { NuevaReservaRequest } from '../../../domain/entities/Reserva';
import { ReservaRepository } from '../../ports/out/ReservaRepository';

export class CrearReserva {
  constructor(private reservaRepository: ReservaRepository) {}

  async execute(reserva: NuevaReservaRequest): Promise<number> {
    return this.reservaRepository.create(reserva);
  }
}