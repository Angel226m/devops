import { Sede } from '../../../domain/entities/Sede';
import { SedeRepository } from '../../ports/out/SedeRepository';

export class ListarSedes {
  constructor(private sedeRepository: SedeRepository) {}

  async execute(): Promise<Sede[]> {
    return this.sedeRepository.listar();
  }
}