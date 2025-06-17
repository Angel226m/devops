import { Reserva, EstadoReserva } from '../../../dominio/entidades/Reserva';
import { RepositorioReserva } from '../../puertos/salida/RepositorioReserva';

export class CambiarEstadoReserva {
  constructor(private repositorioReserva: RepositorioReserva) {}

  async ejecutar(id: number, estado: EstadoReserva): Promise<Reserva> {
    return await this.repositorioReserva.cambiarEstado(id, estado);
  }
}