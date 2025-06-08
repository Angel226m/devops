import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class EliminarInstanciaTour {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(id: number): Promise<void> {
    return this.instanciaTourRepository.delete(id);
  }
}