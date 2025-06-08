import { AxiosInstance } from "axios";
import { GaleriaTour, GaleriaTourRequest, GaleriaTourUpdateRequest } from "../../domain/entities/GaleriaTour";
import { GaleriaTourRepository } from "../../application/ports/out/GaleriaTourRepository";
import { endpoints } from "../api/endpoints";

export class GaleriaTourRepoHttp implements GaleriaTourRepository {
  constructor(private httpClient: AxiosInstance) {}

  async create(galeria: GaleriaTourRequest): Promise<number> {
    const response = await this.httpClient.post(endpoints.galeriaTour.create, galeria);
    return response.data.data.id;
  }

  async getById(id: number): Promise<GaleriaTour> {
    const response = await this.httpClient.get(endpoints.galeriaTour.getById(id));
    return response.data.data;
  }

  async listByTipoTour(idTipoTour: number): Promise<GaleriaTour[]> {
    const response = await this.httpClient.get(endpoints.galeriaTour.listByTipoTour(idTipoTour));
    return response.data.data;
  }

  async update(id: number, galeria: GaleriaTourUpdateRequest): Promise<void> {
    await this.httpClient.put(endpoints.galeriaTour.update(id), galeria);
  }

  async delete(id: number): Promise<void> {
    await this.httpClient.delete(endpoints.galeriaTour.delete(id));
  }
}