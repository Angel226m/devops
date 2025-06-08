import { NuevaInstanciaTourRequest } from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class CrearInstanciaTour {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(instanciaTour: NuevaInstanciaTourRequest): Promise<number> {
    return this.instanciaTourRepository.create(instanciaTour);
  }
}