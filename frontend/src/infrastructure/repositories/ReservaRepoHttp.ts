 
// infrastructure/repositories/ReservaRepoHttp.ts
import { AxiosInstance } from 'axios';
import { 
  Reserva,
  NuevaReservaRequest,
  ActualizarReservaRequest,
  CambiarEstadoReservaRequest,
  ConfirmarPagoRequest,
  FiltrosReserva
} from '../../domain/entities/Reserva';
import { ReservaRepository } from '../../application/ports/out/ReservaRepository';
import { endpoints } from '../api/endpoints';

export class ReservaRepoHttp implements ReservaRepository {
  constructor(private httpClient: AxiosInstance) {}

  async findAll(): Promise<Reserva[]> {
    const response = await this.httpClient.get(endpoints.reserva.vendedorList);
    return response.data.data || [];
  }

  async findById(id: number): Promise<Reserva> {
    const response = await this.httpClient.get(endpoints.reserva.vendedorGetById(id));
    return response.data.data;
  }

  async create(reserva: NuevaReservaRequest): Promise<number> {
    const response = await this.httpClient.post(endpoints.reserva.vendedorCreate, reserva);
    return response.data.data.id_reserva;
  }

  async update(id: number, reserva: ActualizarReservaRequest): Promise<void> {
    await this.httpClient.put(endpoints.reserva.vendedorUpdate(id), reserva);
  }

  async delete(id: number): Promise<void> {
    // Vendedor no puede eliminar reservas, solo admin
    throw new Error("Operación no permitida para vendedor");
  }

  async changeStatus(id: number, cambioEstado: CambiarEstadoReservaRequest): Promise<void> {
    await this.httpClient.post(endpoints.reserva.vendedorCambiarEstado(id), cambioEstado);
  }

  async findByCliente(idCliente: number): Promise<Reserva[]> {
    const response = await this.httpClient.get(endpoints.reserva.vendedorListByCliente(idCliente));
    return response.data.data || [];
  }

  async findByInstancia(idInstancia: number): Promise<Reserva[]> {
    const response = await this.httpClient.get(endpoints.reserva.vendedorListByInstancia(idInstancia));
    return response.data.data || [];
  }

  async findByFecha(fecha: string): Promise<Reserva[]> {
    const response = await this.httpClient.get(endpoints.reserva.vendedorListByFecha(fecha));
    return response.data.data || [];
  }

  async findByEstado(estado: string): Promise<Reserva[]> {
    const response = await this.httpClient.get(endpoints.reserva.vendedorListByEstado(estado));
    return response.data.data || [];
  }

  async filter(filtros: FiltrosReserva): Promise<Reserva[]> {
    // Implementar filtrado usando los endpoints existentes
    let response;
    
    if (filtros.id_cliente) {
      response = await this.httpClient.get(endpoints.reserva.vendedorListByCliente(filtros.id_cliente));
    } else if (filtros.id_instancia) {
      response = await this.httpClient.get(endpoints.reserva.vendedorListByInstancia(filtros.id_instancia));
    } else if (filtros.fecha_inicio) {
      response = await this.httpClient.get(endpoints.reserva.vendedorListByFecha(filtros.fecha_inicio));
    } else if (filtros.estado) {
      response = await this.httpClient.get(endpoints.reserva.vendedorListByEstado(filtros.estado));
    } else {
      response = await this.httpClient.get(endpoints.reserva.vendedorList);
    }
    
    return response.data.data || [];
  }

  async confirmPayment(confirmarPago: ConfirmarPagoRequest): Promise<void> {
    await this.httpClient.post(endpoints.reserva.vendedorConfirmarPago, confirmarPago);
  }
}