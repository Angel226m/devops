export interface ChoferHorario {
  id_horario_chofer: number;
  id_usuario: number;
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
  fecha_inicio: string;
  fecha_fin: string | null;
  eliminado: boolean;
  // Campos adicionales para mostrar información relacionada
  nombre_chofer?: string;
  nombre_sede?: string;
}

export interface NuevoChoferHorarioRequest {
  id_usuario: number;
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
  fecha_inicio: string;
  fecha_fin?: string;
}

export interface ActualizarChoferHorarioRequest {
  id_usuario: number;
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
  fecha_inicio: string;
  fecha_fin?: string;
  eliminado: boolean;
}