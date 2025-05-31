 
 
import { ChoferHorarioRepository } from '../../ports/out/ChoferHorarioRepository';

export class EliminarChoferHorario {
  private repository: ChoferHorarioRepository;

  constructor(repository: ChoferHorarioRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<void> {
    return this.repository.delete(id);
  }
}