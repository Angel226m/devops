import { Cliente } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class ObtenerClientePorDocumento {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(documento: string): Promise<Cliente> {
    return await this.clienteRepository.findByDocumento(documento);
  }
}