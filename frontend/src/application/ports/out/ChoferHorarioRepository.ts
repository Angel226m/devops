import {
  ChoferHorario,
  NuevoChoferHorarioRequest,
  ActualizarChoferHorarioRequest
} from '../../../domain/entities/ChoferHorario';

export interface ChoferHorarioRepository {
  create(choferHorario: NuevoChoferHorarioRequest): Promise<number>;
  findById(id: number): Promise<ChoferHorario>;
  update(id: number, choferHorario: ActualizarChoferHorarioRequest): Promise<void>;
  delete(id: number): Promise<void>;
  findAll(): Promise<ChoferHorario[]>;
  findByChofer(idChofer: number): Promise<ChoferHorario[]>;
  findActiveByChofer(idChofer: number): Promise<ChoferHorario[]>;
  findByDia(dia: string): Promise<ChoferHorario[]>;
}