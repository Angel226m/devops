import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import { ChoferHorarioRepository } from '../../application/ports/out/ChoferHorarioRepository';
import { 
  ChoferHorario, 
  NuevoChoferHorarioRequest, 
  ActualizarChoferHorarioRequest 
} from '../../domain/entities/ChoferHorario';

export class ChoferHorarioRepoHttp implements ChoferHorarioRepository {
  async create(choferHorario: NuevoChoferHorarioRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.horariosChofer.create, choferHorario);
    return response.data.data.id;
  }

  async findById(id: number): Promise<ChoferHorario> {
    const response = await axiosClient.get(endpoints.horariosChofer.getById(id));
    return response.data.data;
  }

  async update(id: number, choferHorario: ActualizarChoferHorarioRequest): Promise<void> {
    await axiosClient.put(endpoints.horariosChofer.update(id), choferHorario);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.horariosChofer.delete(id));
  }

  async findAll(): Promise<ChoferHorario[]> {
    const response = await axiosClient.get(endpoints.horariosChofer.list);
    return response.data.data;
  }

  async findByChofer(idChofer: number): Promise<ChoferHorario[]> {
    const response = await axiosClient.get(endpoints.horariosChofer.listByChofer(idChofer));
    return response.data.data;
  }

  async findActiveByChofer(idChofer: number): Promise<ChoferHorario[]> {
    const response = await axiosClient.get(endpoints.horariosChofer.listActiveByChofer(idChofer));
    return response.data.data;
  }

  async findByDia(dia: string): Promise<ChoferHorario[]> {
    const response = await axiosClient.get(endpoints.horariosChofer.listByDia(dia));
    return response.data.data;
  }
}