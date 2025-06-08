export interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  id_chofer: { Int64: number; Valid: boolean } | number; // Puede ser un objeto o un número
  id_embarcacion: number;
  cupo_disponible: number;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  eliminado: boolean;
  nombre_tour?: string;
  nombre_chofer?: string;
  nombre_embarcacion?: string;
  nombre_tipo_tour?: string; // Añadido según la respuesta de la API
  nombre_sede?: string;
  hora_inicio_str?: string; // Añadido según la respuesta de la API
  hora_fin_str?: string; // Añadido según la respuesta de la API
  fecha_especifica_str?: string; // Añadido según la respuesta de la API
}

export interface FiltrosInstanciaTour {
  id_tour_programado?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
  eliminado?: boolean;
  id_tipo_tour?: number; // Añadido para filtrar por tipo de tour
}