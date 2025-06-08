import { ActualizarInstanciaTourRequest } from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class ActualizarInstanciaTour {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(id: number, instanciaTour: ActualizarInstanciaTourRequest): Promise<void> {
    return this.instanciaTourRepository.update(id, instanciaTour);
  }
}