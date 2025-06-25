 
import {
  Cliente,
  NuevoClienteRequest,
  ActualizarClienteRequest,
  ActualizarDatosEmpresaRequest,
  BusquedaClienteParams
} from '../../../domain/entities/Cliente';

export interface ClienteRepository {
  create(cliente: NuevoClienteRequest): Promise<number>;
  findById(id: number): Promise<Cliente>;
  findByDocumento(documento: string): Promise<Cliente>;
  update(id: number, cliente: ActualizarClienteRequest): Promise<void>;
  updateDatosEmpresa(id: number, datos: ActualizarDatosEmpresaRequest): Promise<void>;
  updateDatosFacturacion(id: number, datos: ActualizarDatosEmpresaRequest): Promise<void>; // Método de compatibilidad
  delete(id: number): Promise<void>;
  findAll(params?: BusquedaClienteParams): Promise<Cliente[]>;
}