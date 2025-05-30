import { Sede, SedeActualizacion } from '../../../domain/entities/Sede';
import { SedeRepository } from '../../ports/out/SedeRepository';

export class ActualizarSede {
  constructor(private sedeRepository: SedeRepository) {}

  async execute(id: number, sede: SedeActualizacion): Promise<Sede> {
    return this.sedeRepository.actualizar(id, sede);
  }
}