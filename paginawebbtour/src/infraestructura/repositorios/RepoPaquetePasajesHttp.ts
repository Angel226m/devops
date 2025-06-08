import { PaquetePasajes } from "../../dominio/entidades/PaquetePasajes";
import { RepositorioPaquetePasajes } from "../../aplicacion/puertos/salida/RepositorioPaquetePasajes";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoPaquetePasajesHttp implements RepositorioPaquetePasajes {
  async listar(): Promise<PaquetePasajes[]> {
    try {
      const response = await clienteAxios.get(endpoints.paquetePasajes.listar);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error al listar paquetes de pasajes:", error);
      return [];
    }
  }

  async obtenerPorId(id: number): Promise<PaquetePasajes | null> {
    try {
      const response = await clienteAxios.get(endpoints.paquetePasajes.obtenerPorId(id));
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
      console.error("Error al obtener paquete de pasajes por ID:", error);
      return null;
    }
  }

  async listarPorSede(idSede: number): Promise<PaquetePasajes[]> {
    try {
      const response = await clienteAxios.get(endpoints.paquetePasajes.listarPorSede(idSede));
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error al listar paquetes de pasajes para sede ${idSede}:`, error);
      return [];
    }
  }

  async listarPorTipoTour(idTipoTour: number): Promise<PaquetePasajes[]> {
    try {
      const response = await clienteAxios.get(endpoints.paquetePasajes.listarPorTipoTour(idTipoTour));
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error al listar paquetes de pasajes para tipo tour ${idTipoTour}:`, error);
      return [];
    }
  }
}
/*import { PaquetePasajes } from "../../dominio/entidades/PaquetePasajes";
import { RepositorioPaquetePasajes } from "../../aplicacion/puertos/salida/RepositorioPaquetePasajes";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoPaquetePasajesHttp implements RepositorioPaquetePasajes {
  async listar(): Promise<PaquetePasajes[]> {
    const response = await clienteAxios.get(endpoints.paquetePasajes.listar);
    return response.data;
  }

  async obtenerPorId(id: number): Promise<PaquetePasajes | null> {
    try {
      const response = await clienteAxios.get(endpoints.paquetePasajes.obtenerPorId(id));
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

  async listarPorSede(idSede: number): Promise<PaquetePasajes[]> {
    const response = await clienteAxios.get(endpoints.paquetePasajes.listarPorSede(idSede));
    return response.data;
  }

  async listarPorTipoTour(idTipoTour: number): Promise<PaquetePasajes[]> {
    const response = await clienteAxios.get(endpoints.paquetePasajes.listarPorTipoTour(idTipoTour));
    return response.data;
  }
}*/