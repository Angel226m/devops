 
import { TourProgramado, FiltrosTourProgramado } from "../../dominio/entidades/TourProgramado";
import { RepositorioTourProgramado } from "../../aplicacion/puertos/salida/RepositorioTourProgramado";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoTourProgramadoHttp implements RepositorioTourProgramado {
  async listar(): Promise<TourProgramado[]> {
    try {
      const response = await clienteAxios.get(endpoints.tourProgramado.listar);
      return response.data.data || [];
    } catch (error) {
      console.error("Error al listar tours programados:", error);
      return [];
    }
  }

  async obtenerPorId(id: number): Promise<TourProgramado | null> {
    try {
      const response = await clienteAxios.get(endpoints.tourProgramado.obtenerPorId(id));
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          return null;
        }
      }
      console.error("Error al obtener tour programado por ID:", error);
      return null;
    }
  }

  async listarDisponiblesSinDuplicados(): Promise<TourProgramado[]> {
    try {
      const response = await clienteAxios.get(endpoints.tourProgramado.listarDisponiblesSinDuplicados);
      return response.data.data || [];
    } catch (error) {
      console.error("Error al listar tours disponibles sin duplicados:", error);
      return [];
    }
  }

  async listarPorFiltros(filtros: FiltrosTourProgramado): Promise<TourProgramado[]> {
    try {
      const response = await clienteAxios.get(endpoints.tourProgramado.listarPorFiltros, {
        params: filtros
      });
      return response.data.data || [];
    } catch (error) {
      console.error("Error al listar tours programados por filtros:", error);
      return [];
    }
  }
}