import { TipoPasaje } from "../../dominio/entidades/TipoPasaje";
import { RepositorioTipoPasaje } from "../../aplicacion/puertos/salida/RepositorioTipoPasaje";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoTipoPasajeHttp implements RepositorioTipoPasaje {
  async listar(): Promise<TipoPasaje[]> {
    try {
      const response = await clienteAxios.get(endpoints.tipoPasaje.listar);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error al listar tipos de pasaje:", error);
      return [];
    }
  }

  async obtenerPorId(id: number): Promise<TipoPasaje | null> {
    try {
      const response = await clienteAxios.get(endpoints.tipoPasaje.obtenerPorId(id));
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          return null;
        }
      }
      console.error("Error al obtener tipo de pasaje por ID:", error);
      return null;
    }
  }

  async listarPorSede(idSede: number): Promise<TipoPasaje[]> {
    try {
      const response = await clienteAxios.get(endpoints.tipoPasaje.listarPorSede(idSede));
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error al listar tipos de pasaje para sede ${idSede}:`, error);
      return [];
    }
  }

  async listarPorTipoTour(idTipoTour: number): Promise<TipoPasaje[]> {
    try {
      const response = await clienteAxios.get(endpoints.tipoPasaje.listarPorTipoTour(idTipoTour));
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error al listar tipos de pasaje para tipo tour ${idTipoTour}:`, error);
      return [];
    }
  }
}


/*import { TipoPasaje } from "../../dominio/entidades/TipoPasaje";
import { RepositorioTipoPasaje } from "../../aplicacion/puertos/salida/RepositorioTipoPasaje";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoTipoPasajeHttp implements RepositorioTipoPasaje {
  async listar(): Promise<TipoPasaje[]> {
    const response = await clienteAxios.get(endpoints.tipoPasaje.listar);
    return response.data;
  }

  async obtenerPorId(id: number): Promise<TipoPasaje | null> {
    try {
      const response = await clienteAxios.get(endpoints.tipoPasaje.obtenerPorId(id));
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          return null;
        }
      }
      throw error;
    }
  }

  async listarPorSede(idSede: number): Promise<TipoPasaje[]> {
    const response = await clienteAxios.get(endpoints.tipoPasaje.listarPorSede(idSede));
    return response.data;
  }

  async listarPorTipoTour(idTipoTour: number): Promise<TipoPasaje[]> {
    const response = await clienteAxios.get(endpoints.tipoPasaje.listarPorTipoTour(idTipoTour));
    return response.data;
  }
}*/