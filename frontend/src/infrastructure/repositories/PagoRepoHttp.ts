 
// infrastructure/repositories/PagoRepoHttp.ts
import { AxiosInstance } from 'axios';
import { 
  Pago, 
  NuevoPagoRequest, 
  ActualizarPagoRequest, 
  CambiarEstadoPagoRequest 
} from '../../domain/entities/Pago';
import { PagoRepository } from '../../application/ports/out/PagoRepository';
import { endpoints } from '../api/endpoints';

export class PagoRepoHttp implements PagoRepository {
  constructor(private httpClient: AxiosInstance) {}

  async findAll(): Promise<Pago[]> {
    const response = await this.httpClient.get(endpoints.pago.vendedorList);
    return response.data.data || [];
  }

  async findById(id: number): Promise<Pago> {
    const response = await this.httpClient.get(endpoints.pago.vendedorGetById(id));
    return response.data.data;
  }

  async create(pago: NuevoPagoRequest): Promise<number> {
    const response = await this.httpClient.post(endpoints.pago.vendedorCreate, pago);
    return response.data.data.id_pago;
  }

  async update(id: number, pago: ActualizarPagoRequest): Promise<void> {
    await this.httpClient.put(endpoints.pago.vendedorUpdate(id), pago);
  }

  async updateEstado(id: number, cambioEstado: CambiarEstadoPagoRequest): Promise<void> {
    await this.httpClient.post(endpoints.pago.vendedorCambiarEstado(id), cambioEstado);
  }

  async delete(id: number): Promise<void> {
    await this.httpClient.delete(endpoints.pago.vendedorDelete(id));
  }

  async findByReserva(idReserva: number): Promise<Pago[]> {
    const response = await this.httpClient.get(endpoints.pago.vendedorListByReserva(idReserva));
    return response.data.data || [];
  }

  async findByFecha(fecha: string): Promise<Pago[]> {
    const response = await this.httpClient.get(endpoints.pago.vendedorListByFecha(fecha));
    return response.data.data || [];
  }

  async findByEstado(estado: string): Promise<Pago[]> {
    const response = await this.httpClient.get(endpoints.pago.vendedorListByEstado(estado));
    return response.data.data || [];
  }

  async getTotalPagadoByReserva(idReserva: number): Promise<number> {
    const response = await this.httpClient.get(endpoints.pago.vendedorGetTotalPagadoByReserva(idReserva));
    return response.data.data.total_pagado || 0;
  }

  async findByCliente(idCliente: number): Promise<Pago[]> {
    const response = await this.httpClient.get(endpoints.pago.vendedorListByCliente(idCliente));
    return response.data.data || [];
  }

  async findBySede(idSede: number): Promise<Pago[]> {
    const response = await this.httpClient.get(endpoints.pago.vendedorListBySede(idSede));
    return response.data.data || [];
  }
}