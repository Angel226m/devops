export interface TipoPasaje {
  id_tipo_pasaje: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  costo: number;
  edad: string | null;
  eliminado: boolean;
  nombre_sede?: string;
  nombre_tipo_tour?: string;
}

export interface FiltrosTipoPasaje {
  id_sede?: number;
  id_tipo_tour?: number;
  eliminado?: boolean;
}