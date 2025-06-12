export interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  numero_celular: string;
  eliminado?: boolean;
}

export interface NuevoClienteRequest {
  tipo_documento: string;
  numero_documento: string;
  nombres: string;
  apellidos: string;
  correo: string;
  numero_celular: string;
  contrasena: string;
}

export interface ActualizarClienteRequest {
  tipo_documento?: string;
  numero_documento?: string;
  nombres?: string;
  apellidos?: string;
  correo?: string;
  numero_celular?: string;
  contrasena?: string;
}

export interface LoginClienteRequest {
  correo: string;
  contrasena: string;
  recordarme?: boolean;
}

export interface CambiarContrasenaRequest {
  contrasena_actual: string;
  nueva_contrasena: string;
}

export interface ClienteAutenticado {
  id_cliente: number;
  nombres: string;
  apellidos: string;
  nombre_completo: string;
  tipo_documento: string;
  numero_documento: string;
  correo: string;
  numero_celular: string;
  rol: string;
}

export interface RespuestaAutenticacion {
  usuario: ClienteAutenticado;
  token?: string;
  refresh_token?: string;
}