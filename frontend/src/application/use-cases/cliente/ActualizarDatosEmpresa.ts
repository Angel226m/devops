import { ActualizarDatosEmpresaRequest } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class ActualizarDatosEmpresa {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(id: number, request: ActualizarDatosEmpresaRequest): Promise<void> {
    await this.clienteRepository.updateDatosEmpresa(id, request);
  }
}