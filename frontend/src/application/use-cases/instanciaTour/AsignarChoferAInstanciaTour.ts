import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class AsignarChoferAInstancia {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(id: number, idChofer: number): Promise<void> {
    return this.instanciaTourRepository.asignarChofer(id, idChofer);
  }
}