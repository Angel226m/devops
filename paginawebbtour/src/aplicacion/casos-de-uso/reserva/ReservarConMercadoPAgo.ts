import { ReservaMercadoPagoRequest, ReservaMercadoPagoResponse } from '../../../dominio/entidades/Reserva';
import { RepositorioReserva } from '../../puertos/salida/RepositorioReserva';

export class ReservarConMercadoPago {
  constructor(private repositorioReserva: RepositorioReserva) {}

  async ejecutar(request: ReservaMercadoPagoRequest): Promise<ReservaMercadoPagoResponse> {
    return await this.repositorioReserva.reservarConMercadoPago(request);
  }
}