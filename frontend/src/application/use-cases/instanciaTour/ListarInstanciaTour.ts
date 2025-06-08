import { InstanciaTour } from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class ListarInstanciasTour {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(): Promise<InstanciaTour[]> {
    return this.instanciaTourRepository.getAll();
  }
}