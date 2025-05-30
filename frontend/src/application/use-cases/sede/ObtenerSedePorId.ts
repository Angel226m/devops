import { Sede } from '../../../domain/entities/Sede';
import { SedeRepository } from '../../ports/out/SedeRepository';

export class ObtenerSedePorId {
  constructor(private sedeRepository: SedeRepository) {}

  async execute(id: number): Promise<Sede | null> {
    return this.sedeRepository.obtenerPorId(id);
  }
}