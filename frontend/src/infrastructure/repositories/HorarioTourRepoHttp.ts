 
import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import { HorarioTourRepository } from '../../application/ports/out/HorarioTourRepository';
import { 
  HorarioTour, 
  NuevoHorarioTourRequest, 
  ActualizarHorarioTourRequest
} from '../../domain/entities/HorarioTour';

export class HorarioTourRepoHttp implements HorarioTourRepository {
  async create(horarioTour: NuevoHorarioTourRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.horariosTour.create, horarioTour);
    return response.data.data.id;
  }

  async findById(id: number): Promise<HorarioTour> {
    const response = await axiosClient.get(endpoints.horariosTour.getById(id));
    return response.data.data;
  }

  async update(id: number, horarioTour: ActualizarHorarioTourRequest): Promise<void> {
    await axiosClient.put(endpoints.horariosTour.update(id), horarioTour);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.horariosTour.delete(id));
  }

  async findAll(): Promise<HorarioTour[]> {
    const response = await axiosClient.get(endpoints.horariosTour.list);
    return response.data.data;
  }

  async findByTipoTour(idTipoTour: number): Promise<HorarioTour[]> {
    const response = await axiosClient.get(endpoints.horariosTour.listByTipoTour(idTipoTour));
    return response.data.data;
  }

  async findByDia(dia: string): Promise<HorarioTour[]> {
    const response = await axiosClient.get(endpoints.horariosTour.listByDia(dia));
    return response.data.data;
  }
}