import { InstanciaTour, FiltrosInstanciaTour } from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepository } from '../../ports/out/InstanciaTourRepository';

export class FiltrarInstanciasTour {
  constructor(private instanciaTourRepository: InstanciaTourRepository) {}

  async execute(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]> {
    return this.instanciaTourRepository.getByFiltros(filtros);
  }
}