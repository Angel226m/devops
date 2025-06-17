 
import { 
  Reserva, 
  NuevaReservaRequest, 
  ActualizarReservaRequest,
  ReservaMercadoPagoRequest,
  ReservaMercadoPagoResponse,
  ConfirmarPagoRequest,
  EstadoReserva
} from '../../../dominio/entidades/Reserva';

export interface ControladorReserva {
  listar(): Promise<Reserva[]>;
  obtenerPorId(id: number): Promise<Reserva>;
  crear(reserva: NuevaReservaRequest): Promise<Reserva>;
  actualizar(id: number, reserva: ActualizarReservaRequest): Promise<Reserva>;
  eliminar(id: number): Promise<boolean>;
  cambiarEstado(id: number, estado: EstadoReserva): Promise<Reserva>;
  listarPorCliente(idCliente: number): Promise<Reserva[]>;
  listarPorInstancia(idInstancia: number): Promise<Reserva[]>;
  listarPorFecha(fecha: string): Promise<Reserva[]>;
  listarPorEstado(estado: EstadoReserva): Promise<Reserva[]>;
  listarMisReservas(): Promise<Reserva[]>;
  verificarDisponibilidadInstancia(idInstancia: number, cantidadPasajeros: number): Promise<boolean>;
  reservarConMercadoPago(request: ReservaMercadoPagoRequest): Promise<ReservaMercadoPagoResponse>;
  confirmarPagoReserva(datos: ConfirmarPagoRequest): Promise<Reserva>;
}