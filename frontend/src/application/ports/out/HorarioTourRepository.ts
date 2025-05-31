import {
  HorarioTour,
  NuevoHorarioTourRequest,
  ActualizarHorarioTourRequest
} from '../../../domain/entities/HorarioTour';

export interface HorarioTourRepository {
  create(horarioTour: NuevoHorarioTourRequest): Promise<number>;
  findById(id: number): Promise<HorarioTour>;
  update(id: number, horarioTour: ActualizarHorarioTourRequest): Promise<void>;
  delete(id: number): Promise<void>;
  findAll(): Promise<HorarioTour[]>;
  findByTipoTour(idTipoTour: number): Promise<HorarioTour[]>;
  findByDia(dia: string): Promise<HorarioTour[]>;
}