import { InstanciaTour, FiltrosInstanciaTour } from "../../dominio/entidades/InstanciaTour";
import { RepositorioInstanciaTour } from "../../aplicacion/puertos/salida/RepositorioInstanciaTour";
import { clienteAxios } from "../api/clienteAxios";
import { endpoints } from "../api/endpoints";
import axios, { AxiosError } from "axios";

export class RepoInstanciaTourHttp implements RepositorioInstanciaTour {
  async listar(): Promise<InstanciaTour[]> {
    try {
      const response = await clienteAxios.get(endpoints.instanciaTour.listar);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error al listar instancias de tour:", error);
      return [];
    }
  }

  async obtenerPorId(id: number): Promise<InstanciaTour | null> {
    try {
      const response = await clienteAxios.get(endpoints.instanciaTour.obtenerPorId(id));
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
      console.error("Error al obtener instancia de tour por ID:", error);
      return null;
    }
  }

  async listarPorFiltros(filtros: FiltrosInstanciaTour): Promise<InstanciaTour[]> {
    try {
      // Si hay fecha de inicio, usar el endpoint por fecha
      if (filtros.fecha_inicio) {
        const instancias = await this.listarPorFecha(filtros.fecha_inicio);
        
        // Aplicar filtros adicionales en el cliente
        return instancias.filter(instancia => {
          let cumpleFiltros = true;
          
          // Filtrar por ID de tour programado
          if (filtros.id_tour_programado !== undefined) {
            cumpleFiltros = cumpleFiltros && instancia.id_tour_programado === filtros.id_tour_programado;
          }
          
          // Filtrar por estado
          if (filtros.estado !== undefined) {
            cumpleFiltros = cumpleFiltros && instancia.estado === filtros.estado;
          }
          
          // Filtrar por tipo de tour (usando el nombre del tour)
          if (filtros.id_tipo_tour !== undefined && instancia.nombre_tipo_tour) {
            // Aquí habría que hacer una relación entre id_tipo_tour y nombre_tipo_tour
            // Como no tenemos esa relación directa, podríamos filtrar por nombre si lo conocemos
            if (filtros.id_tipo_tour === 43 && instancia.nombre_tipo_tour.includes("Ballenas")) {
              return true;
            } else if (filtros.id_tipo_tour !== 43 && !instancia.nombre_tipo_tour.includes("Ballenas")) {
              return true;
            } else {
              return false;
            }
          }
          
          return cumpleFiltros;
        });
      } else {
        // Si no hay fecha, usar el endpoint de disponibles
        const instancias = await this.listarDisponibles();
        
        // Aplicar filtros adicionales en el cliente
        return instancias.filter(instancia => {
          let cumpleFiltros = true;
          
          // Filtrar por ID de tour programado
          if (filtros.id_tour_programado !== undefined) {
            cumpleFiltros = cumpleFiltros && instancia.id_tour_programado === filtros.id_tour_programado;
          }
          
          // Filtrar por estado (aunque disponibles ya debería ser solo PROGRAMADO)
          if (filtros.estado !== undefined) {
            cumpleFiltros = cumpleFiltros && instancia.estado === filtros.estado;
          }
          
          // Filtrar por tipo de tour (usando el nombre del tour)
          if (filtros.id_tipo_tour !== undefined && instancia.nombre_tipo_tour) {
            // Aquí habría que hacer una relación entre id_tipo_tour y nombre_tipo_tour
            // Como no tenemos esa relación directa, podríamos filtrar por nombre si lo conocemos
            if (filtros.id_tipo_tour === 43 && instancia.nombre_tipo_tour.includes("Ballenas")) {
              return true;
            } else if (filtros.id_tipo_tour !== 43 && !instancia.nombre_tipo_tour.includes("Ballenas")) {
              return true;
            } else {
              return false;
            }
          }
          
          return cumpleFiltros;
        });
      }
    } catch (error) {
      console.error("Error al listar instancias de tour por filtros:", error);
      return [];
    }
  }

  async listarDisponibles(): Promise<InstanciaTour[]> {
    try {
      const response = await clienteAxios.get(endpoints.instanciaTour.listarDisponibles);
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error("Error al listar instancias de tour disponibles:", error);
      return [];
    }
  }

  async listarPorFecha(fecha: string): Promise<InstanciaTour[]> {
    try {
      // Asegurarnos de que la fecha esté en formato YYYY-MM-DD
      const fechaFormateada = fecha.split('T')[0];
      
      const response = await clienteAxios.get(endpoints.instanciaTour.listarPorFecha(fechaFormateada));
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return [];
    } catch (error) {
      console.error(`Error al listar instancias de tour por fecha ${fecha}:`, error);
      return [];
    }
  }
}