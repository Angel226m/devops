 
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class EliminarCliente {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(id: number): Promise<void> {
    await this.clienteRepository.delete(id);
  }
}