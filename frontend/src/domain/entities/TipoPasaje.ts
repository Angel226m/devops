 
export interface TipoPasaje {
  id_tipo_pasaje: number;
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  costo: number;
  edad: string;
  eliminado: boolean;
}

export interface NuevoTipoPasajeRequest {
  id_sede: number;
  id_tipo_tour: number;
  nombre: string;
  costo: number;
  edad: string;
}

export interface ActualizarTipoPasajeRequest {
  id_tipo_tour: number;
  nombre: string;
  costo: number;
  edad: string;
}