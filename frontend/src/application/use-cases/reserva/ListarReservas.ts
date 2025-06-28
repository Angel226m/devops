 
// application/use-cases/reserva/ListarReservas.ts
import { Reserva } from '../../../domain/entities/Reserva';
import { ReservaRepository } from '../../ports/out/ReservaRepository';

export class ListarReservas {
  constructor(private reservaRepository: ReservaRepository) {}

  async execute(): Promise<Reserva[]> {
    return this.reservaRepository.findAll();
  }
}