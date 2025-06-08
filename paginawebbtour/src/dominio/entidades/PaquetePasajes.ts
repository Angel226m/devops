 
export interface PaquetePasajes {
  id_paquete: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  descripcion: string | null;
  precio_total: number;
  cantidad_total: number;
  eliminado: boolean;
  nombre_sede?: string;
  nombre_tipo_tour?: string;
}

export interface FiltrosPaquetePasajes {
  id_sede?: number;
  id_tipo_tour?: number;
  eliminado?: boolean;
}