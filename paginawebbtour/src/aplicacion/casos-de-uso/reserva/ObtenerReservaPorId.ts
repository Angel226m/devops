import { Reserva } from '../../../dominio/entidades/Reserva';
import { RepositorioReserva } from '../../puertos/salida/RepositorioReserva';

export class ObtenerReservaPorId {
  constructor(private repositorioReserva: RepositorioReserva) {}

  async ejecutar(id: number): Promise<Reserva> {
    return await this.repositorioReserva.obtenerPorId(id);
  }
}