import { Sede, SedeCreacion, SedeActualizacion } from '../../domain/entities/Sede';
import { SedeRepository } from '../../application/ports/out/SedeRepository';
import axiosClient from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import axios, { AxiosError } from 'axios';

export class SedeRepoHttp implements SedeRepository {
  async listar(): Promise<Sede[]> {
    const response = await axiosClient.get(endpoints.sede.base);
    return response.data;
  }

  async obtenerPorId(id: number): Promise<Sede | null> {
    try {
      const response = await axiosClient.get(endpoints.sede.byId(id));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  async obtenerPorCiudad(ciudad: string): Promise<Sede[]> {
    const response = await axiosClient.get(endpoints.sede.byCiudad(ciudad));
    return response.data;
  }

  async obtenerPorPais(pais: string): Promise<Sede[]> {
    const response = await axiosClient.get(endpoints.sede.byPais(pais));
    return response.data;
  }

  async crear(sede: SedeCreacion): Promise<Sede> {
    const response = await axiosClient.post(endpoints.sede.base, sede);
    return response.data;
  }

  async actualizar(id: number, sede: SedeActualizacion): Promise<Sede> {
    const response = await axiosClient.put(endpoints.sede.byId(id), sede);
    return response.data;
  }

  async eliminar(id: number): Promise<boolean> {
    await axiosClient.delete(endpoints.sede.byId(id));
    return true;
  }
}