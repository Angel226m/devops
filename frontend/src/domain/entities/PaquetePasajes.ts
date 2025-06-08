export interface PaquetePasajes {
  id_paquete: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  descripcion: string;
  precio_total: number;
  cantidad_total: number;
  eliminado: boolean;
}

export interface NuevoPaquetePasajesRequest {
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  descripcion: string;
  precio_total: number;
  cantidad_total: number;
}

export interface ActualizarPaquetePasajesRequest {
  id_tipo_tour: number;
  nombre: string;
  descripcion: string;
  precio_total: number;
  cantidad_total: number;
}