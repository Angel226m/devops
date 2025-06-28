 
// application/ports/out/ReservaRepository.ts
import { 
  Reserva, 
  NuevaReservaRequest, 
  ActualizarReservaRequest, 
  CambiarEstadoReservaRequest,
  ConfirmarPagoRequest,
  FiltrosReserva 
} from '../../../domain/entities/Reserva';

export interface ReservaRepository {
  findAll(): Promise<Reserva[]>;
  findById(id: number): Promise<Reserva>;
  create(reserva: NuevaReservaRequest): Promise<number>;
  update(id: number, reserva: ActualizarReservaRequest): Promise<void>;
  delete(id: number): Promise<void>;
  changeStatus(id: number, cambioEstado: CambiarEstadoReservaRequest): Promise<void>;
  findByCliente(idCliente: number): Promise<Reserva[]>;
  findByInstancia(idInstancia: number): Promise<Reserva[]>;
  findByFecha(fecha: string): Promise<Reserva[]>;
  findByEstado(estado: string): Promise<Reserva[]>;
  filter(filtros: FiltrosReserva): Promise<Reserva[]>;
  confirmPayment(confirmarPago: ConfirmarPagoRequest): Promise<void>;
}