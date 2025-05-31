 
 
import { ChoferHorarioRepository} from '../../ports/out/ChoferHorarioRepository';
import { ActualizarChoferHorarioRequest } from '../../../domain/entities/ChoferHorario';

export class ActualizarChoferHorario {
  private repository: ChoferHorarioRepository;

  constructor(repository: ChoferHorarioRepository) {
    this.repository = repository;
  }

  async execute(id: number, request: ActualizarChoferHorarioRequest): Promise<void> {
    return this.repository.update(id, request);
  }
}