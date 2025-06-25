import { ActualizarDatosFacturacionRequest } from '../../../domain/entities/Cliente';
import { ClienteRepository } from '../../ports/out/ClienteRepository';

export class ActualizarDatosFacturacion {
  constructor(private clienteRepository: ClienteRepository) {}

  async execute(id: number, request: ActualizarDatosFacturacionRequest): Promise<void> {
    await this.clienteRepository.updateDatosFacturacion(id, request);
  }
}