 
// application/use-cases/reserva/ActualizarReserva.ts
import { ActualizarReservaRequest } from '../../../domain/entities/Reserva';
import { ReservaRepository } from '../../ports/out/ReservaRepository';

export class ActualizarReserva {
  constructor(private reservaRepository: ReservaRepository) {}

  async execute(id: number, reserva: ActualizarReservaRequest): Promise<void> {
    return this.reservaRepository.update(id, reserva);
  }
}