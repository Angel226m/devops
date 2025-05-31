 
import { ChoferHorario } from '../../../domain/entities/ChoferHorario';
import { ChoferHorarioRepository } from '../../ports/out/ChoferHorarioRepository';

export class ListarChoferesHorario {
  private repository: ChoferHorarioRepository;

  constructor(repository: ChoferHorarioRepository) {
    this.repository = repository;
  }

  async execute(id_chofer: number): Promise<ChoferHorario[]> {
    return this.repository.findByChofer(id_chofer);
  }
}