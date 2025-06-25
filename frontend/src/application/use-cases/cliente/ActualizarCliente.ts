import { ActualizarClienteRequest } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class ActualizarCliente {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(id: number, request: ActualizarClienteRequest): Promise<void> {
    await this.clienteRepository.update(id, request);
  }
}