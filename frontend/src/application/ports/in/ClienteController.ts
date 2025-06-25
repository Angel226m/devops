 
import {
  Cliente,
  NuevoClienteRequest,
  ActualizarClienteRequest,
  ActualizarDatosFacturacionRequest,
  BusquedaClienteParams
} from '../../../domain/entities/Cliente';

export interface ClienteController {
  create(request: NuevoClienteRequest): Promise<number>;
  getById(id: number): Promise<Cliente>;
  getByDocumento(documento: string): Promise<Cliente>;
  update(id: number, request: ActualizarClienteRequest): Promise<void>;
  updateDatosFacturacion(id: number, request: ActualizarDatosFacturacionRequest): Promise<void>;
  delete(id: number): Promise<void>;
  list(params?: BusquedaClienteParams): Promise<Cliente[]>;
}