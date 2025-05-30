import { TipoTour, TipoTourCreacion, TipoTourActualizacion, TipoTourIdioma } from '../../domain/entities/TipoTour';
import { TipoTourRepository } from '../../application/ports/out/TipoTourRepository';
import { axiosClient } from '../api/axiosClient';
import { endpoints } from '../api/endpoints';

export class TipoTourRepoHttp implements TipoTourRepository {
  async listar(): Promise<TipoTour[]> {
    try {
      const response = await axiosClient.get(endpoints.tiposTour.list);
      return response.data.data || []; 
    } catch (error) {
      console.error('Error al listar tipos de tour:', error);
      throw error;
    }
  }

  async listarPorSede(idSede: number): Promise<TipoTour[]> {
    try {
      // Usamos un query parameter
      const response = await axiosClient.get(`${endpoints.tiposTour.listBySede}?id_sede=${idSede}`);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error al listar tipos de tour por sede ${idSede}:`, error);
      throw error;
    }
  }

  async listarPorIdioma(idIdioma: number): Promise<TipoTour[]> {
    try {
      // AQUÍ: Invocar la función para obtener la URL correcta
      const url = endpoints.tiposTour.listByIdioma(idIdioma);
      const response = await axiosClient.get(url);
      return response.data.data || []; 
    } catch (error) {
      console.error(`Error al listar tipos de tour por idioma ${idIdioma}:`, error);
      throw error;
    }
  }

  async obtenerPorId(id: number): Promise<TipoTour | null> {
    try {
      // AQUÍ: Invocar la función para obtener la URL correcta
      const url = endpoints.tiposTour.getById(id);
      console.log(`Obteniendo tipo de tour con ID ${id} desde URL: ${url}`);
      const response = await axiosClient.get(url);
      return response.data.data || null;
    } catch (error) {
      console.error(`Error al obtener tipo de tour ${id}:`, error);
      throw error;
    }
  }

  async obtenerIdiomasDeTour(idTipoTour: number): Promise<TipoTourIdioma[]> {
    try {
      // Suponiendo que tienes un endpoint para esto, sino, puedes crear uno
      const url = endpoints.tiposTour.getById(idTipoTour) + '/idiomas';
      const response = await axiosClient.get(url);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error al obtener idiomas del tipo de tour ${idTipoTour}:`, error);
      throw error;
    }
  }

  async crear(tipoTour: TipoTourCreacion): Promise<TipoTour> {
    try {
      const response = await axiosClient.post(endpoints.tiposTour.create, tipoTour);
      return response.data.data || response.data;
    } catch (error) {
      console.error('Error al crear tipo de tour:', error);
      throw error;
    }
  }

  async actualizar(id: number, tipoTour: TipoTourActualizacion): Promise<TipoTour> {
    try {
      // AQUÍ: Invocar la función para obtener la URL correcta
      const url = endpoints.tiposTour.update(id);
      const response = await axiosClient.put(url, tipoTour);
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error al actualizar tipo de tour ${id}:`, error);
      throw error;
    }
  }

  async eliminar(id: number): Promise<boolean> {
    try {
      // AQUÍ: Invocar la función para obtener la URL correcta
      const url = endpoints.tiposTour.delete(id);
      await axiosClient.delete(url);
      return true;
    } catch (error) {
      console.error(`Error al eliminar tipo de tour ${id}:`, error);
      throw error;
    }
  }

  // Nuevos métodos para gestionar la relación muchos a muchos
  async agregarIdioma(idTipoTour: number, idIdioma: number): Promise<TipoTourIdioma> {
    try {
      // Asumiendo que usas una estructura similar a usuarios/idiomas
      const url = endpoints.tiposTour.getById(idTipoTour) + '/idiomas';
      const response = await axiosClient.post(url, { id_idioma: idIdioma });
      return response.data.data || response.data;
    } catch (error) {
      console.error(`Error al agregar idioma ${idIdioma} al tipo de tour ${idTipoTour}:`, error);
      throw error;
    }
  }

  async eliminarIdioma(idTipoTour: number, idIdioma: number): Promise<boolean> {
    try {
      // Asumiendo que usas una estructura similar a usuarios/idiomas
      const url = endpoints.tiposTour.getById(idTipoTour) + `/idiomas/${idIdioma}`;
      await axiosClient.delete(url);
      return true;
    } catch (error) {
      console.error(`Error al eliminar idioma ${idIdioma} del tipo de tour ${idTipoTour}:`, error);
      throw error;
    }
  }
}