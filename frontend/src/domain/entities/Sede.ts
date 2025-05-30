export interface Sede {
  id_sede: number;
  nombre: string;
  direccion: string;
  telefono?: string;
  correo?: string;
  ciudad: string;
  provincia?: string;
  pais: string;
  eliminado?: boolean;
}

export type SedeCreacion = Omit<Sede, 'id_sede' | 'eliminado'>;
export type SedeActualizacion = Partial<Sede>;