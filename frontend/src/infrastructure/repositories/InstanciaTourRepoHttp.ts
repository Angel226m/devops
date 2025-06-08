import { axiosClient } from '../api/axiosClient';
import { InstanciaTourRepository } from '../../application/ports/out/InstanciaTourRepository';
import { 
  InstanciaTour, 
  NuevaInstanciaTourRequest, 
  ActualizarInstanciaTourRequest, 
  FiltrosInstanciaTour 
} from '../../domain/entities/InstanciaTour';
import { endpoints } from '../api/endpoints';

export class InstanciaTourRepoHttp implements InstanciaTourRepository {
  async create(instanciaTour: NuevaInstanciaTourRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.instanciaTour.create, instanciaTour);
    return response.data.data.id;
  }

  async getById(id: number): Promise<InstanciaTour> {
    const response = await axiosClient.get(endpoints.instanciaTour.getById(id));
    return response.data.data;
  }

  async update(id: number, instanciaTour: ActualizarInstanciaTourRequest): Promise<void> {
    await axiosClient.put(endpoints.instanciaTour.update(id), instanciaTour);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.instanciaTour.delete(id));
  }

  async getAll(): Promise<InstanciaTour[]> {
    const response = await axiosClient.get(endpoints.instanciaTour.list);
    return response.data.data;
  }

  async getByTourProgramado(idTourProgramado: number): Promise<InstanciaTour[]> {
    const response = await axiosClient.get(endpoints.instanciaTour.listByTourProgramado(idTourProgramado));
    return response.data.data;
  }

  async getByFiltros(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]> {
    const response = await axiosClient.post(endpoints.instanciaTour.filtrar, filtros);
    return response.data.data;
  }

  async asignarChofer(id: number, idChofer: number): Promise<void> {
    await axiosClient.post(endpoints.instanciaTour.asignarChofer(id), { id_chofer: idChofer });
  }

  async generarInstancias(idTourProgramado: number): Promise<number> {
    const response = await axiosClient.post(endpoints.instanciaTour.generar(idTourProgramado));
    return response.data.data.cantidad;
  }
}