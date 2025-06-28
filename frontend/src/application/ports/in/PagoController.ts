 
// application/ports/in/PagoController.ts
import { 
  Pago, 
  NuevoPagoRequest, 
  ActualizarPagoRequest, 
  CambiarEstadoPagoRequest 
} from '../../../domain/entities/Pago';

export interface PagoController {
  obtenerPagos(): Promise<Pago[]>;
  obtenerPagoPorId(id: number): Promise<Pago>;
  crearPago(pago: NuevoPagoRequest): Promise<number>;
  actualizarPago(id: number, pago: ActualizarPagoRequest): Promise<void>;
  eliminarPago(id: number): Promise<void>;
  cambiarEstadoPago(id: number, cambioEstado: CambiarEstadoPagoRequest): Promise<void>;
  obtenerPagosPorReserva(idReserva: number): Promise<Pago[]>;
  obtenerPagosPorFecha(fecha: string): Promise<Pago[]>;
  obtenerPagosPorEstado(estado: string): Promise<Pago[]>;
  obtenerTotalPagadoPorReserva(idReserva: number): Promise<number>;
  obtenerPagosPorCliente(idCliente: number): Promise<Pago[]>;
  obtenerPagosPorSede(idSede: number): Promise<Pago[]>;
}