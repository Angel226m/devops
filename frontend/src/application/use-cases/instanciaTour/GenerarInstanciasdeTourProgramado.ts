import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class GenerarInstanciasDeTourProgramado {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(idTourProgramado: number): Promise<number> {
    return this.instanciaTourRepository.generarInstancias(idTourProgramado);
  }
}