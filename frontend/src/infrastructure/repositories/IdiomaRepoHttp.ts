/*import { IdiomaRepository } from '../../application/ports/out/IdiomaRepository';
import { Idioma, NuevoIdiomaRequest, ActualizarIdiomaRequest } from '../../domain/entities/Idioma';
import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../api/endpoints';

export class IdiomaRepoHttp implements IdiomaRepository {
  async getAll(): Promise<Idioma[]> {
    const response = await axiosClient.get(endpoints.idioma.base);
    return response.data;
  }

  async getById(id: number): Promise<Idioma> {
    const response = await axiosClient.get(endpoints.idioma.byId(id));
    return response.data;
  }

  async create(idioma: NuevoIdiomaRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.idioma.base, idioma);
    return response.data.id || response.data.id_idioma;
  }

  async update(id: number, idioma: ActualizarIdiomaRequest): Promise<void> {
    await axiosClient.put(endpoints.idioma.byId(id), idioma);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.idioma.byId(id));
  }
}*/
import { axiosClient } from '../api/axiosClient';
import { IdiomaRepository } from '../../application/ports/out/IdiomaRepository';
import { Idioma, NuevoIdiomaRequest, ActualizarIdiomaRequest } from '../../domain/entities/Idioma';
import { endpoints } from '../api/endpoints';

export class IdiomaRepoHttp implements IdiomaRepository {
  async getAll(): Promise<Idioma[]> {
    const response = await axiosClient.get(endpoints.idioma.base);
    // La respuesta debería venir en response.data.data según tu API
    return response.data.data || response.data || [];
  }

  async getById(id: number): Promise<Idioma> {
    const response = await axiosClient.get(endpoints.idioma.byId(id));
    return response.data.data || response.data;
  }

  async create(idioma: NuevoIdiomaRequest): Promise<number> {
    const response = await axiosClient.post(endpoints.idioma.admin, idioma);
    return response.data.data?.id || response.data.id;
  }

  async update(id: number, idioma: ActualizarIdiomaRequest): Promise<void> {
    await axiosClient.put(endpoints.idioma.adminById(id), idioma);
  }

  async delete(id: number): Promise<void> {
    await axiosClient.delete(endpoints.idioma.adminById(id));
  }
}