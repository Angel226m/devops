import { Reserva, ActualizarReservaRequest } from '../../../dominio/entidades/Reserva';
import { RepositorioReserva } from '../../puertos/salida/RepositorioReserva';

export class ActualizarReserva {
  constructor(private repositorioReserva: RepositorioReserva) {}

  async ejecutar(id: number, reserva: ActualizarReservaRequest): Promise<Reserva> {
    return await this.repositorioReserva.actualizar(id, reserva);
  }
}