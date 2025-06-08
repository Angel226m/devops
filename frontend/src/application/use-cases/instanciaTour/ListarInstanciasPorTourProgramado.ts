import { InstanciaTour } from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class ListarInstanciasPorTourProgramado {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(idTourProgramado: number): Promise<InstanciaTour[]> {
    return this.instanciaTourRepository.getByTourProgramado(idTourProgramado);
  }
}