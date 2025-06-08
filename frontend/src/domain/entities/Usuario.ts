 
export interface Usuario {
  id_usuario: number;
  id_sede: number | null;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CHOFER';
  nacionalidad?: string;
  tipo_documento: string;
  numero_documento: string;
  fecha_registro?: string;
  contrasena?: string;
  eliminado?: boolean;
  // NUEVO: Idiomas del usuario
  idiomas?: UsuarioIdioma[];
}

export interface UsuarioIdioma {
  id_usuario_idioma: number;
  id_usuario: number;
  id_idioma: number;
  nivel?: string;
  eliminado?: boolean;
  // Para mostrar el nombre del idioma
  nombre_idioma?: string;
}

export interface NuevoUsuarioRequest {
  id_sede: number | null;
  nombres: string;
  apellidos: string;
  correo: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento: string;
  rol: 'ADMIN' | 'VENDEDOR' | 'CHOFER';
  nacionalidad?: string;
  tipo_documento: string;
  numero_documento: string;
  contrasena: string;
  // NUEVO: Idiomas que maneja el usuario
  idiomas_ids?: number[];
}

export interface ActualizarUsuarioRequest {
  id_sede?: number | null;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  telefono?: string;
  direccion?: string;
  fecha_nacimiento?: string;
  rol?: 'ADMIN' | 'VENDEDOR' | 'CHOFER';
  nacionalidad?: string;
  tipo_documento?: string;
  numero_documento?: string;
  contrasena?: string;
  // NUEVO: Idiomas que maneja el usuario
  idiomas_ids?: number[];
}

// Nueva interfaz para asignar idioma con nivel
export interface AsignarIdiomaRequest {
  id_idioma: number;
  nivel?: string;
}