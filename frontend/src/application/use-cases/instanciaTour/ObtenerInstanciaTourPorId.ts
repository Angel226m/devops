import { InstanciaTour } from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class ObtenerInstanciaTourPorId {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(id: number): Promise<InstanciaTour> {
    return this.instanciaTourRepository.getById(id);
  }
}