 
// application/use-cases/reserva/EliminarReserva.ts
import { ReservaRepository } from '../../ports/out/ReservaRepository';

export class EliminarReserva {
  constructor(private reservaRepository: ReservaRepository) {}

  async execute(id: number): Promise<void> {
    return this.reservaRepository.delete(id);
  }
}