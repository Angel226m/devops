 
 
import { ChoferHorario } from '../../../domain/entities/ChoferHorario';
 import { ChoferHorarioRepository } from '../../ports/out/ChoferHorarioRepository';
export class ObtenerChoferHorarioPorId {
  private repository: ChoferHorarioRepository;

  constructor(repository: ChoferHorarioRepository) {
    this.repository = repository;
  }

  async execute(id: number): Promise<ChoferHorario> {
    return this.repository.findById(id);
  }
}