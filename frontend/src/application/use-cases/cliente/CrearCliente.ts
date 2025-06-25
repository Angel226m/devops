import { NuevoClienteRequest } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class CrearCliente {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(request: NuevoClienteRequest): Promise<number> {
    return await this.clienteRepository.create(request);
  }
}