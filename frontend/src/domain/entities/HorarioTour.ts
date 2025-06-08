export interface HorarioTour {
  id_horario: number;
  id_tipo_tour: number;
  id_sede: number;
  hora_inicio: string;
  hora_fin: string;
  disponible_lunes: boolean;
  disponible_martes: boolean;
  disponible_miercoles: boolean;
  disponible_jueves: boolean;
  disponible_viernes: boolean;
  disponible_sabado: boolean;
  disponible_domingo: boolean;
  eliminado: boolean;
  // Campos adicionales para mostrar información relacionada
  nombre_tipo_tour?: string;
  nombre_sede?: string;
}

export interface NuevoHorarioTourRequest {
  id_tipo_tour: number;
  id_sede: number;
  hora_inicio: string;
  hora_fin: string;
  disponible_lunes: boolean;
  disponible_martes: boolean;
  disponible_miercoles: boolean;
  disponible_jueves: boolean;
  disponible_viernes: boolean;
  disponible_sabado: boolean;
  disponible_domingo: boolean;
}

export interface ActualizarHorarioTourRequest {
  id_tipo_tour: number;
  id_sede: number;
  hora_inicio: string;
  hora_fin: string;
  disponible_lunes: boolean;
  disponible_martes: boolean;
  disponible_miercoles: boolean;
  disponible_jueves: boolean;
  disponible_viernes: boolean;
  disponible_sabado: boolean;
  disponible_domingo: boolean;
  eliminado: boolean;
}