export interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  id_chofer: number | null;
  id_embarcacion: number;
  cupo_disponible: number;
  estado: 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
  eliminado: boolean;
  
  // Campos adicionales para mostrar información relacionada
  nombre_tipo_tour?: string;
  nombre_embarcacion?: string;
  nombre_sede?: string;
  nombre_chofer?: string;
  hora_inicio_str?: string;
  hora_fin_str?: string;
  fecha_especifica_str?: string;
}

export interface NuevaInstanciaTourRequest {
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  id_chofer?: number | null;
  id_embarcacion: number;
  cupo_disponible: number;
}

export interface ActualizarInstanciaTourRequest {
  id_tour_programado?: number;
  fecha_especifica?: string;
  hora_inicio?: string;
  hora_fin?: string;
  id_chofer?: number | null;
  id_embarcacion?: number;
  cupo_disponible?: number;
  estado?: 'PROGRAMADO' | 'EN_CURSO' | 'COMPLETADO' | 'CANCELADO';
}

export interface AsignarChoferInstanciaRequest {
  id_chofer: number;
}

export interface FiltrosInstanciaTour {
  id_tour_programado?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
  id_chofer?: number;
  id_embarcacion?: number;
  id_sede?: number;
  id_tipo_tour?: number;
}