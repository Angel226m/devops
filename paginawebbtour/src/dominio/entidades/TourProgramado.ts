 
export interface TourProgramado {
  id_tour_programado: number;
  id_tipo_tour: number;
  id_embarcacion: number;
  id_horario: number;
  id_sede: number;
  id_chofer: { Int64: number; Valid: boolean } | number;
  fecha: string;
  vigencia_desde: string;
  vigencia_hasta: string;
  cupo_maximo: number;
  cupo_disponible: number;
  estado: string;
  eliminado: boolean;
  es_excepcion?: boolean;
  notas_excepcion?: { String: string; Valid: boolean } | string;
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  nombre_chofer?: string;
  hora_inicio?: string;
  hora_fin?: string;
}

export interface FiltrosTourProgramado {
  id_tipo_tour?: number;
  id_sede?: number;
  estado?: string;
  eliminado?: boolean;
  vigente?: boolean;
  fecha_desde?: string;
  fecha_hasta?: string;
}