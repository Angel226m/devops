import { SedeRepository } from '../../ports/out/SedeRepository';

export class EliminarSede {
  constructor(private sedeRepository: SedeRepository) {}

  async execute(id: number): Promise<boolean> {
    return this.sedeRepository.eliminar(id);
  }
}