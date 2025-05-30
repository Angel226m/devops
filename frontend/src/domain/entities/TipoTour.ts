export interface TipoTour {
  id_tipo_tour: number;
  id_sede: number;
  id_idioma: number; // Campo para el idioma principal
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  cantidad_pasajeros: number;
  url_imagen?: string;
  eliminado?: boolean;
}

// Nueva interfaz para la relación muchos a muchos entre TipoTour e Idioma
export interface TipoTourIdioma {
  id_tipo_tour_idioma?: number; // ID de la relación (si existe)
  id_tipo_tour: number;         // ID del tipo de tour
  id_idioma: number;            // ID del idioma
  nombre?: string;              // Nombre traducido en este idioma (opcional)
  descripcion?: string;         // Descripción traducida en este idioma (opcional)
}

export interface TipoTourCreacion {
  id_sede: number;
  id_idioma: number;
  nombre: string;
  descripcion?: string;
  duracion_minutos: number;
  cantidad_pasajeros: number;
  url_imagen?: string;
}

export interface TipoTourActualizacion {
  id_sede?: number;
  id_idioma?: number;
  nombre?: string;
  descripcion?: string;
  duracion_minutos?: number;
  cantidad_pasajeros?: number;
  url_imagen?: string;
}