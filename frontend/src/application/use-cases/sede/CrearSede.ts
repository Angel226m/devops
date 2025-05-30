import { Sede, SedeCreacion } from '../../../domain/entities/Sede';
import { SedeRepository } from '../../ports/out/SedeRepository';

export class CrearSede {
  constructor(private sedeRepository: SedeRepository) {}

  async execute(sede: SedeCreacion): Promise<Sede> {
    return this.sedeRepository.crear(sede);
  }
}