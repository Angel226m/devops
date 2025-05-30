export interface Idioma {
  id_idioma: number;
  nombre: string;
}

export interface NuevoIdiomaRequest {
  nombre: string;
}

export interface ActualizarIdiomaRequest {
  nombre: string;
}