export interface TipoTour {
  id_tipo_tour: number;
  id_sede: number;
  nombre: string;
  descripcion: string | { String: string; Valid: boolean };
  duracion_minutos: number;
  url_imagen: string | { String: string; Valid: boolean };
  eliminado: boolean;
  nombre_sede?: string; // Campo adicional que viene en la respuesta
}

export interface FiltrosTipoTour {
  id_sede?: number;
  eliminado?: boolean;
}