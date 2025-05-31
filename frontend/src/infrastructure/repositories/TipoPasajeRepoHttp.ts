import { TipoPasajeRepository } from '../../application/ports/out/TipoPasajeRepository';
import { TipoPasaje, NuevoTipoPasajeRequest, ActualizarTipoPasajeRequest } from '../../domain/entities/TipoPasaje';
import axiosClient from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import axios, { AxiosError } from 'axios';

export class TipoPasajeRepoHttp implements TipoPasajeRepository {
  async findAll(): Promise<TipoPasaje[]> {
    try {
      const response = await axiosClient.get(endpoints.tipoPasaje.list);
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error('Error en findAll de TipoPasajeRepoHttp:', error);
      return [];
    }
  }

  async findById(id: number): Promise<TipoPasaje> {
    try {
      const response = await axiosClient.get(endpoints.tipoPasaje.getById(id));
      return response.data.data;
    } catch (error) {
      console.error(`Error en findById(${id}) de TipoPasajeRepoHttp:`, error);
      throw error;
    }
  }

  async create(tipoPasaje: NuevoTipoPasajeRequest): Promise<number> {
    try {
      const response = await axiosClient.post(endpoints.tipoPasaje.create, tipoPasaje);
      return response.data.data.id;
    } catch (error) {
      console.error('Error en create de TipoPasajeRepoHttp:', error);
      throw error;
    }
  }

  async update(id: number, tipoPasaje: ActualizarTipoPasajeRequest): Promise<void> {
    try {
      await axiosClient.put(endpoints.tipoPasaje.update(id), tipoPasaje);
    } catch (error) {
      console.error(`Error en update(${id}) de TipoPasajeRepoHttp:`, error);
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(endpoints.tipoPasaje.delete(id));
    } catch (error) {
      console.error(`Error en delete(${id}) de TipoPasajeRepoHttp:`, error);
      throw error;
    }
  }

  async findBySede(idSede: number): Promise<TipoPasaje[]> {
    try {
      const response = await axiosClient.get(endpoints.tipoPasaje.listBySede(idSede));
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error(`Error en findBySede(${idSede}) de TipoPasajeRepoHttp:`, error);
      return [];
    }
  }

  async findByTipoTour(idTipoTour: number): Promise<TipoPasaje[]> {
    try {
      const response = await axiosClient.get(endpoints.tipoPasaje.listByTipoTour(idTipoTour));
      return Array.isArray(response.data.data) ? response.data.data : [];
    } catch (error) {
      console.error(`Error en findByTipoTour(${idTipoTour}) de TipoPasajeRepoHttp:`, error);
      return [];
    }
  }
}