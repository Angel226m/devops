 
// application/ports/in/ReservaController.ts
import { 
  Reserva, 
  NuevaReservaRequest, 
  ActualizarReservaRequest, 
  CambiarEstadoReservaRequest,
  ConfirmarPagoRequest,
  FiltrosReserva 
} from '../../../domain/entities/Reserva';

export interface ReservaController {
  obtenerReservas(): Promise<Reserva[]>;
  obtenerReservaPorId(id: number): Promise<Reserva>;
  crearReserva(reserva: NuevaReservaRequest): Promise<number>;
  actualizarReserva(id: number, reserva: ActualizarReservaRequest): Promise<void>;
  eliminarReserva(id: number): Promise<void>;
  cambiarEstadoReserva(id: number, cambioEstado: CambiarEstadoReservaRequest): Promise<void>;
  obtenerReservasPorCliente(idCliente: number): Promise<Reserva[]>;
  obtenerReservasPorInstancia(idInstancia: number): Promise<Reserva[]>;
  obtenerReservasPorFecha(fecha: string): Promise<Reserva[]>;
  obtenerReservasPorEstado(estado: string): Promise<Reserva[]>;
  filtrarReservas(filtros: FiltrosReserva): Promise<Reserva[]>;
  confirmarPago(confirmarPago: ConfirmarPagoRequest): Promise<void>;
}