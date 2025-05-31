import { ChoferHorario } from '../../../domain/entities/ChoferHorario';
import { ChoferHorarioRepository } from '../../ports/out/ChoferHorarioRepository';

export class ListarChoferesHorarioPorDia {
  private repository: ChoferHorarioRepository;

  constructor(repository: ChoferHorarioRepository) {
    this.repository = repository;
  }

  async execute(dia: string): Promise<ChoferHorario[]> {
    return this.repository.findByDia(dia);
  }
}