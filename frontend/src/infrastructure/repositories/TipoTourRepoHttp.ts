import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import { TipoTourRepository } from '../../application/ports/out/TipoTourRepository';
import { 
  TipoTour, 
  NuevoTipoTourRequest, 
  ActualizarTipoTourRequest
} from '../../domain/entities/TipoTour';

// TipoTour Repository Implementation
export class TipoTourRepoHttp implements TipoTourRepository {
  async create(tipoTour: NuevoTipoTourRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.tiposTour.create, tipoTour);
    return response.data.data.id;
  }

  async findById(id: number): Promise<TipoTour> {
    const response = await axiosClient.get(endpoints.tiposTour.getById(id));
    return response.data.data;
  }

  async update(id: number, tipoTour: ActualizarTipoTourRequest): Promise<void> {
    await axiosClient.put(endpoints.tiposTour.update(id), tipoTour);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.tiposTour.delete(id));
  }

  async findAll(): Promise<TipoTour[]> {
    const response = await axiosClient.get(endpoints.tiposTour.list);
    return response.data.data;
  }

  async findBySede(idSede: number): Promise<TipoTour[]> {
    const response = await axiosClient.get(endpoints.tiposTour.listBySede(idSede));
    return response.data.data;
  }
}