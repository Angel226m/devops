 
import { AxiosInstance } from 'axios';
import {
  Cliente,
  NuevoClienteRequest,
  ActualizarClienteRequest,
  ActualizarDatosEmpresaRequest,
  ActualizarDatosFacturacionRequest,
  BusquedaClienteParams
} from '../../domain/entities/Cliente';
import { ClienteRepository } from '../../application/ports/out/ClienteRepository';
import { endpoints } from '../api/endpoints';
import { store } from '../store';

export class ClienteRepoHttp implements ClienteRepository {
  constructor(private http: AxiosInstance) {}

  // Obtener los endpoints correctos según el rol del usuario
  private getEndpoints() {
    const state = store.getState();
    const userRole = state.auth.user?.rol || '';
    
    // Si es vendedor, usar los endpoints de vendedor
    if (userRole === 'VENDEDOR') {
      return {
        list: endpoints.cliente.vendedorList,
        create: endpoints.cliente.vendedorCreate,
        byId: endpoints.cliente.vendedorById,
        byDocumento: endpoints.cliente.vendedorByDocumento,
        buscarDocumento: endpoints.cliente.vendedorBuscarDocumento,
        datosFacturacion: endpoints.cliente.vendedorDatosFacturacion,
        datosEmpresa: endpoints.cliente.vendedorDatosEmpresa
      };
    }
    
    // Por defecto, usar los endpoints de admin
    return {
      list: endpoints.cliente.list,
      create: endpoints.cliente.create,
      byId: endpoints.cliente.byId,
      byDocumento: endpoints.cliente.byDocumento,
      buscarDocumento: endpoints.cliente.buscarDocumento,
      datosFacturacion: endpoints.cliente.datosFacturacion,
      datosEmpresa: endpoints.cliente.datosEmpresa
    };
  }

  async create(cliente: NuevoClienteRequest): Promise<number> {
    const ep = this.getEndpoints();
    const response = await this.http.post(ep.create, cliente);
    return response.data.id;
  }

  async findById(id: number): Promise<Cliente> {
    const ep = this.getEndpoints();
    const response = await this.http.get(ep.byId(id));
    return response.data;
  }

  async findByDocumento(documento: string): Promise<Cliente> {
    const ep = this.getEndpoints();
    const response = await this.http.get(ep.byDocumento, {
      params: { documento }
    });
    return response.data;
  }

  async update(id: number, cliente: ActualizarClienteRequest): Promise<void> {
    const ep = this.getEndpoints();
    await this.http.put(ep.byId(id), cliente);
  }

  async updateDatosEmpresa(id: number, datos: ActualizarDatosEmpresaRequest): Promise<void> {
    const ep = this.getEndpoints();
    await this.http.put(ep.datosEmpresa(id), datos);
  }

  // Método para mantener compatibilidad con el código existente
  async updateDatosFacturacion(id: number, datos: ActualizarDatosFacturacionRequest): Promise<void> {
    const ep = this.getEndpoints();
    await this.http.put(ep.datosFacturacion(id), datos);
  }

  async delete(id: number): Promise<void> {
    const ep = this.getEndpoints();
    await this.http.delete(ep.byId(id));
  }

  async findAll(params?: BusquedaClienteParams): Promise<Cliente[]> {
    const ep = this.getEndpoints();
    const response = await this.http.get(ep.list, { params });
    return response.data;
  }
}