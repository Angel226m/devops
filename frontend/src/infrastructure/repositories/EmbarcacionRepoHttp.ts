import { Embarcacion, EmbarcacionCreacion, EmbarcacionActualizacion } from '../../domain/entities/Embarcacion';
import { EmbarcacionRepository } from '../../application/ports/out/EmbarcacionRepository';
import axiosClient from '../api/axiosClient';
import { endpoints } from '../api/endpoints';
import axios, { AxiosError } from 'axios';

export class EmbarcacionRepoHttp implements EmbarcacionRepository {
  async listar(): Promise<Embarcacion[]> {
    try {
      console.log('Solicitando todas las embarcaciones');
      const response = await axiosClient.get(endpoints.embarcaciones.base);
      console.log('Respuesta completa listar:', response.data);
      
      // Acceder a data.data y asegurar que sea un array
      const embarcaciones = response.data.data || [];
      return Array.isArray(embarcaciones) ? embarcaciones : [];
    } catch (error) {
      console.error('Error al listar embarcaciones:', error);
      throw error;
    }
  }

  async listarPorSede(idSede: number): Promise<Embarcacion[]> {
    try {
      console.log(`Solicitando embarcaciones para sede ${idSede}`);
      const response = await axiosClient.get(endpoints.embarcaciones.porSede(idSede));
      console.log('Respuesta completa por sede:', response.data);
      
      // Acceder a data.data y asegurar que sea un array
      const embarcaciones = response.data.data || [];
      return Array.isArray(embarcaciones) ? embarcaciones : [];
    } catch (error) {
      console.error('Error al listar embarcaciones por sede:', error);
      throw error;
    }
  }

  async obtenerPorId(id: number): Promise<Embarcacion | null> {
    try {
      console.log(`Solicitando embarcación con ID ${id}`);
      const response = await axiosClient.get(endpoints.embarcaciones.porId(id));
      console.log('Respuesta completa por ID:', response.data);
      
      // Acceder a data.data
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response?.status === 404) {
          console.log(`Embarcación con ID ${id} no encontrada`);
          return null;
        }
      }
      console.error('Error al obtener embarcación por ID:', error);
      throw error;
    }
  }

  async crear(embarcacion: EmbarcacionCreacion): Promise<Embarcacion> {
    try {
      console.log('Creando nueva embarcación:', embarcacion);
      const response = await axiosClient.post(endpoints.embarcaciones.base, embarcacion);
      console.log('Respuesta crear embarcación:', response.data);
      
      // Acceder a data.data
      return response.data.data;
    } catch (error) {
      console.error('Error al crear embarcación:', error);
      throw error;
    }
  }

  async actualizar(id: number, embarcacion: EmbarcacionActualizacion): Promise<Embarcacion> {
    try {
      console.log(`Actualizando embarcación ID ${id}:`, embarcacion);
      const response = await axiosClient.put(endpoints.embarcaciones.porId(id), embarcacion);
      console.log('Respuesta actualizar embarcación:', response.data);
      
      // Acceder a data.data
      return response.data.data;
    } catch (error) {
      console.error('Error al actualizar embarcación:', error);
      throw error;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      console.log(`Eliminando embarcación ID ${id}`);
      await axiosClient.delete(endpoints.embarcaciones.porId(id));
      console.log(`Embarcación ID ${id} eliminada exitosamente`);
      return true;
    } catch (error) {
      console.error('Error al eliminar embarcación:', error);
      throw error;
    }
  }
}