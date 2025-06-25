import { Cliente, BusquedaClienteParams } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class ListarClientes {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(params?: BusquedaClienteParams): Promise<Cliente[]> {
    return await this.clienteRepository.findAll(params);
  }
}