import { Reserva, NuevaReservaRequest } from '../../../dominio/entidades/Reserva';
import { RepositorioReserva } from '../../puertos/salida/RepositorioReserva';

export class CrearReserva {
  constructor(private repositorioReserva: RepositorioReserva) {}

  async ejecutar(reserva: NuevaReservaRequest): Promise<Reserva> {
    return await this.repositorioReserva.crear(reserva);
  }
}