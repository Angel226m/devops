export interface TipoTour {
  id_tipo_tour: number;
  id_sede: number;
  nombre: string;
  descripcion: string | null;
  duracion_minutos: number;
  url_imagen: string | null;
  eliminado: boolean;
  nombre_sede?: string;
}

export interface NuevoTipoTourRequest {
  id_sede: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  url_imagen?: string;
}

export interface ActualizarTipoTourRequest {
  id_sede: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  url_imagen?: string;
  eliminado?: boolean;
}