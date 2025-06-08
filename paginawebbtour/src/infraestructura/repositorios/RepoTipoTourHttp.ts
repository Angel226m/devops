import { RepositorioTipoTour } from "../../aplicacion/puertos/salida/RepositorioTipoTour";
import { TipoTour } from "../../dominio/entidades/TipoTour";
import { clientePublico } from "../api/clientePublico";
import { endpoints } from "../api/endpoints";

// Interfaz para la respuesta de la API
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export class RepoTipoTourHttp implements RepositorioTipoTour {
  async listar(): Promise<TipoTour[]> {
    try {
      // Usamos la interfaz genérica para especificar el tipo de datos esperado
      const response = await clientePublico.get<ApiResponse<TipoTour[]>>(endpoints.tipoTour.listar);
      
      // La respuesta real está en el campo "data" de la respuesta
      const tiposTour = response.data.data;
      
      // Procesar los datos para manejar los campos que vienen como objetos con "String" y "Valid"
      return tiposTour.map(tour => ({
        ...tour,
        descripcion: typeof tour.descripcion === 'object' && tour.descripcion?.String ? 
          tour.descripcion.String : tour.descripcion,
        url_imagen: typeof tour.url_imagen === 'object' && tour.url_imagen?.String ? 
          tour.url_imagen.String : tour.url_imagen
      }));
    } catch (error) {
      console.error("Error al listar los tipos de tour:", error);
      return [];
    }
  }

  async obtenerPorId(id: number): Promise<TipoTour | null> {
    try {
      const response = await clientePublico.get<ApiResponse<TipoTour>>(endpoints.tipoTour.obtenerPorId(id));
      
      const tipoTour = response.data.data;
      
      // Procesar los datos para manejar los campos que vienen como objetos
      return {
        ...tipoTour,
        descripcion: typeof tipoTour.descripcion === 'object' && tipoTour.descripcion?.String ? 
          tipoTour.descripcion.String : tipoTour.descripcion,
        url_imagen: typeof tipoTour.url_imagen === 'object' && tipoTour.url_imagen?.String ? 
          tipoTour.url_imagen.String : tipoTour.url_imagen
      };
    } catch (error) {
      console.error(`Error al obtener el tipo de tour con ID ${id}:`, error);
      return null;
    }
  }

  async listarPorSede(idSede: number): Promise<TipoTour[]> {
    try {
      const response = await clientePublico.get<ApiResponse<TipoTour[]>>(endpoints.tipoTour.listarPorSede(idSede));
      
      const tiposTour = response.data.data;
      
      // Procesar los datos para manejar los campos que vienen como objetos
      return tiposTour.map(tour => ({
        ...tour,
        descripcion: typeof tour.descripcion === 'object' && tour.descripcion?.String ? 
          tour.descripcion.String : tour.descripcion,
        url_imagen: typeof tour.url_imagen === 'object' && tour.url_imagen?.String ? 
          tour.url_imagen.String : tour.url_imagen
      }));
    } catch (error) {
      console.error(`Error al listar los tipos de tour por sede ${idSede}:`, error);
      return [];
    }
  }
}