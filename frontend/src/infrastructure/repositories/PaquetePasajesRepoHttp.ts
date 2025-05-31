import { PaquetePasajesRepository } from '../../application/ports/out/PaquetePasajesRepository';
import { PaquetePasajes, NuevoPaquetePasajesRequest, ActualizarPaquetePasajesRequest } from '../../domain/entities/PaquetePasajes';
import axiosClient from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import axios, { AxiosError } from 'axios';

export class PaquetePasajesRepoHttp implements PaquetePasajesRepository {
  async findAll(): Promise<PaquetePasajes[]> {
    try {
      const response = await axiosClient.get(endpoints.paquetePasajes.list);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error en findAll de PaquetePasajesRepoHttp:', error);
      return [];
    }
  }

  async findById(id: number): Promise<PaquetePasajes> {
    try {
      const response = await axiosClient.get(endpoints.paquetePasajes.getById(id));
      return response.data.data;
    } catch (error) {
      console.error(`Error en findById(${id}) de PaquetePasajesRepoHttp:`, error);
      throw error;
    }
  }

  async create(paquetePasajes: NuevoPaquetePasajesRequest): Promise<number> {
    try {
      const response = await axiosClient.post(endpoints.paquetePasajes.create, paquetePasajes);
      return response.data.data.id;
    } catch (error) {
      console.error('Error en create de PaquetePasajesRepoHttp:', error);
      throw error;
    }
  }

  async update(id: number, paquetePasajes: ActualizarPaquetePasajesRequest): Promise<void> {
    try {
      await axiosClient.put(endpoints.paquetePasajes.update(id), paquetePasajes);
    } catch (error) {
      console.error(`Error en update(${id}) de PaquetePasajesRepoHttp:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(endpoints.paquetePasajes.delete(id));
    } catch (error) {
      console.error(`Error en delete(${id}) de PaquetePasajesRepoHttp:`, error);
      throw error;
    }
  }

  async findBySede(idSede: number): Promise<PaquetePasajes[]> {
    try {
      const response = await axiosClient.get(endpoints.paquetePasajes.listBySede(idSede));
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error(`Error en findBySede(${idSede}) de PaquetePasajesRepoHttp:`, error);
      return [];
    }
  }

  async findByTipoTour(idTipoTour: number): Promise<PaquetePasajes[]> {
    try {
      const response = await axiosClient.get(endpoints.paquetePasajes.listByTipoTour(idTipoTour));
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error(`Error en findByTipoTour(${idTipoTour}) de PaquetePasajesRepoHttp:`, error);
      return [];
    }
  }
}