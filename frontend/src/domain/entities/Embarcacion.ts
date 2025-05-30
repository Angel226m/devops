// Definición del enum para el estado de embarcaciones
export enum EstadoEmbarcacion {
  DISPONIBLE = 'DISPONIBLE',
  OCUPADA = 'OCUPADA',
  MANTENIMIENTO = 'MANTENIMIENTO',
  FUERA_DE_SERVICIO = 'FUERA_DE_SERVICIO'
}

// Interfaz principal de Embarcacion (ajustada a la tabla BD)
export interface Embarcacion {
  id_embarcacion: number;
  id_sede: number;
  nombre: string;
  capacidad: number;
  descripcion?: string;
  eliminado?: boolean;
  estado: EstadoEmbarcacion;
}

// Tipo para crear una nueva embarcación (sin ID y eliminado)
export type EmbarcacionCreacion = Omit<Embarcacion, 'id_embarcacion' | 'eliminado'>;

// Tipo para actualizar embarcación (campos opcionales)
export type EmbarcacionActualizacion = Partial<Omit<Embarcacion, 'id_embarcacion' | 'eliminado'>>;