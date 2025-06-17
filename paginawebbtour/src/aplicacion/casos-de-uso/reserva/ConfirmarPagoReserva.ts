import { Reserva, ConfirmarPagoRequest } from '../../../dominio/entidades/Reserva';
import { RepositorioReserva } from '../../puertos/salida/RepositorioReserva';

export class ConfirmarPagoReserva {
  constructor(private repositorioReserva: RepositorioReserva) {}

  async ejecutar(datos: ConfirmarPagoRequest): Promise<Reserva> {
    return await this.repositorioReserva.confirmarPagoReserva(datos);
  }
}