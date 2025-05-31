 
 
import { ChoferHorarioRepository } from '../../ports/out/ChoferHorarioRepository';
import { NuevoChoferHorarioRequest  } from '../../../domain/entities/ChoferHorario';

export class CrearChoferHorario {
  private repository: ChoferHorarioRepository;

  constructor(repository: ChoferHorarioRepository) {
    this.repository = repository;
  }

  async execute(request: NuevoChoferHorarioRequest): Promise<number> {
    return this.repository.create(request);
  }
}