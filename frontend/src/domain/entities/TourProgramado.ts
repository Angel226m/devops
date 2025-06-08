export interface TourProgramado {
  id_tour_programado: number;
  id_tipo_tour: number;
  id_embarcacion: number;
  id_horario: number;
  id_sede: number;
  id_chofer: { Int64: number; Valid: boolean } | null;
  fecha: string;
  vigencia_desde: string;
  vigencia_hasta: string;
  cupo_maximo: number;
  cupo_disponible: number;
  estado: "PROGRAMADO" | "EN_CURSO" | "COMPLETADO" | "CANCELADO";
  eliminado: boolean;
  es_excepcion: boolean;
  notas_excepcion: { String: string; Valid: boolean } | null;
  // Campos con información relacionada
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  nombre_chofer?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

export interface NuevoTourProgramadoRequest {
  id_tipo_tour: number;
  id_embarcacion: number;
  id_horario: number;
  id_sede: number;
  id_chofer?: number;
  fecha: string;
  vigencia_desde: string;
  vigencia_hasta: string;
  cupo_maximo: number;
  es_excepcion: boolean;
  notas_excepcion?: string;
}

export interface ActualizarTourProgramadoRequest {
  id_tipo_tour?: number;
  id_embarcacion?: number;
  id_horario?: number;
  id_sede?: number;
  id_chofer?: number | null;
  fecha?: string;
  vigencia_desde?: string;
  vigencia_hasta?: string;
  cupo_maximo?: number;
  cupo_disponible?: number;
  estado?: string;
  es_excepcion?: boolean;
  notas_excepcion?: string | null;
}

export interface AsignarChoferRequest {
  id_chofer: number;
}

export interface FiltrosTourProgramado {
  id_sede?: number;
  id_tipo_tour?: number;
  id_chofer?: number;
  id_embarcacion?: number;
  estado?: string;
  fecha_inicio?: string;
  fecha_fin?: string;
  vigencia_desde_ini?: string;
  vigencia_desde_fin?: string;
  vigencia_hasta_ini?: string;
  vigencia_hasta_fin?: string;
}

// Value Object para representar la disponibilidad de un horario
export interface DisponibilidadHorario {
  disponible: boolean;
}