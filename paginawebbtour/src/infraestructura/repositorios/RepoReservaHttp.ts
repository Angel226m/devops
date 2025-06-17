 
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import { RepositorioReserva } from "../../aplicacion/puertos/salida/RepositorioReserva";
import { 
  Reserva, 
  NuevaReservaRequest, 
  ActualizarReservaRequest, 
  ReservaMercadoPagoRequest, 
  ReservaMercadoPagoResponse,
  ConfirmarPagoRequest,
  EstadoReserva
} from "../../dominio/entidades/Reserva";

export class RepoReservaHttp implements RepositorioReserva {
  async listar(): Promise<Reserva[]> {
    const response = await clienteAxios.get(endpoints.reserva.listar);
    return response.data.data || [];
  }

  async obtenerPorId(id: number): Promise<Reserva> {
    const response = await clienteAxios.get(endpoints.reserva.obtenerPorId(id));
    return response.data.data;
  }

  async crear(reserva: NuevaReservaRequest): Promise<Reserva> {
    const response = await clienteAxios.post(endpoints.reserva.crear, reserva);
    return response.data.data;
  }

  async actualizar(id: number, reserva: ActualizarReservaRequest): Promise<Reserva> {
    const response = await clienteAxios.put(endpoints.reserva.actualizar(id), reserva);
    return response.data.data;
  }

  async eliminar(id: number): Promise<boolean> {
    const response = await clienteAxios.delete(endpoints.reserva.eliminar(id));
    return response.status === 200;
  }

  async cambiarEstado(id: number, estado: EstadoReserva): Promise<Reserva> {
    const response = await clienteAxios.post(endpoints.reserva.cambiarEstado(id), { estado });
    return response.data.data;
  }

  async listarPorCliente(idCliente: number): Promise<Reserva[]> {
    const response = await clienteAxios.get(endpoints.reserva.listarPorCliente(idCliente));
    return response.data.data || [];
  }

  async listarPorInstancia(idInstancia: number): Promise<Reserva[]> {
    const response = await clienteAxios.get(endpoints.reserva.listarPorInstancia(idInstancia));
    return response.data.data || [];
  }

  async listarPorFecha(fecha: string): Promise<Reserva[]> {
    const response = await clienteAxios.get(endpoints.reserva.listarPorFecha(fecha));
    return response.data.data || [];
  }

  async listarPorEstado(estado: EstadoReserva): Promise<Reserva[]> {
    const response = await clienteAxios.get(endpoints.reserva.listarPorEstado(estado));
    return response.data.data || [];
  }

  async listarMisReservas(): Promise<Reserva[]> {
    const response = await clienteAxios.get(endpoints.reserva.listarMisReservas);
    return response.data.data || [];
  }

  async reservarConMercadoPago(request: ReservaMercadoPagoRequest): Promise<ReservaMercadoPagoResponse> {
    const response = await clienteAxios.post(endpoints.mercadoPago.reservar, request);
    return response.data.data;
  }

  async confirmarPagoReserva(datos: ConfirmarPagoRequest): Promise<Reserva> {
    const response = await clienteAxios.post(endpoints.mercadoPago.confirmarPago, {
      id_reserva: datos.id_reserva,
      id_transaccion: datos.id_transaccion,
      monto: datos.monto
    });
    return response.data.data;
  }
}