export interface GaleriaTour {
  id_galeria: number;
  id_tipo_tour: number;
  url_imagen: string;
  descripcion: string;
  orden: number;
  fecha_creacion: string;
  eliminado: boolean;
}

export interface FiltrosGaleriaTour {
  id_tipo_tour?: number;
  eliminado?: boolean;
}