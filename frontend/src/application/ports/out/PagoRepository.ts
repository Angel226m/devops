 
// application/ports/out/PagoRepository.ts
import { 
  Pago, 
  NuevoPagoRequest, 
  ActualizarPagoRequest, 
  CambiarEstadoPagoRequest 
} from '../../../domain/entities/Pago';

export interface PagoRepository {
  findAll(): Promise<Pago[]>;
  findById(id: number): Promise<Pago>;
  create(pago: NuevoPagoRequest): Promise<number>;
  update(id: number, pago: ActualizarPagoRequest): Promise<void>;
  updateEstado(id: number, cambioEstado: CambiarEstadoPagoRequest): Promise<void>;
  delete(id: number): Promise<void>;
  findByReserva(idReserva: number): Promise<Pago[]>;
  findByFecha(fecha: string): Promise<Pago[]>;
  findByEstado(estado: string): Promise<Pago[]>;
  getTotalPagadoByReserva(idReserva: number): Promise<number>;
  findByCliente(idCliente: number): Promise<Pago[]>;
  findBySede(idSede: number): Promise<Pago[]>;
}