import { GaleriaTour } from "../../dominio/entidades/GaleriaTour";
import { RepositorioGaleriaTour } from "../../aplicacion/puertos/salida/RepositorioGaleriaTour";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoGaleriaTourHttp implements RepositorioGaleriaTour {
  async listar(): Promise<GaleriaTour[]> {
    try {
      const response = await clienteAxios.get(endpoints.galeriaTour.listar);
      console.log("Respuesta de listar galerías:", response.data);
      return response.data.data || [];
    } catch (error) {
      console.error("Error al listar galerías de tour:", error);
      return [];
    }
  }

  async obtenerPorId(id: number): Promise<GaleriaTour | null> {
    try {
      const response = await clienteAxios.get(endpoints.galeriaTour.obtenerPorId(id));
      console.log(`Respuesta de obtener galería ${id}:`, response.data);
      return response.data.data || null;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
          return null;
        }
      }
      console.error("Error al obtener galería de tour por ID:", error);
      return null;
    }
  }

  async listarPorTipoTour(idTipoTour: number): Promise<GaleriaTour[]> {
    try {
      console.log(`Llamando a endpoint para listar galerías del tipo tour ${idTipoTour}:`, endpoints.galeriaTour.listarPorTipoTour(idTipoTour));
      const response = await clienteAxios.get(endpoints.galeriaTour.listarPorTipoTour(idTipoTour));
      console.log(`Respuesta de listar galerías por tipo tour ${idTipoTour}:`, response.data);
      return response.data.data || [];
    } catch (error) {
      console.error(`Error al listar galerías para tipo tour ${idTipoTour}:`, error);
      return [];
    }
  }
}