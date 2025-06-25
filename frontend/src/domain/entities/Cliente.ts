export interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  // Campos para persona natural
  nombres?: string;
  apellidos?: string;
  // Campos para empresas
  razon_social?: string;
  direccion_fiscal?: string;
  // Campos de contacto
  correo: string;
  numero_celular: string;
  // Datos de sistema
  nombre_completo?: string; // Campo calculado
  eliminado: boolean;
}

export interface NuevoClienteRequest {
  tipo_documento: string;
  numero_documento: string;
  // Campos para persona natural
  nombres?: string;
  apellidos?: string;
  // Campos para empresas
  razon_social?: string;
  direccion_fiscal?: string;
  // Campos de contacto
  correo: string;
  numero_celular: string;
  // Datos de sistema
  contrasena?: string;
}

export interface ActualizarClienteRequest {
  tipo_documento: string;
  numero_documento: string;
  // Campos para persona natural
  nombres?: string;
  apellidos?: string;
  // Campos para empresas
  razon_social?: string;
  direccion_fiscal?: string;
  // Campos de contacto
  correo: string;
  numero_celular: string;
}

// Mantener ambos nombres para compatibilidad
export interface ActualizarDatosEmpresaRequest {
  razon_social: string;
  direccion_fiscal: string;
}

// Alias para mantener compatibilidad con el código existente
export type ActualizarDatosFacturacionRequest = ActualizarDatosEmpresaRequest;

export interface BusquedaClienteParams {
  search?: string;
  type?: 'doc' | 'ruc' | 'nombre';
}

export const tiposDocumento = [
  { value: 'DNI', label: 'DNI' },
  { value: 'CE', label: 'Carné de Extranjería' },
  { value: 'Pasaporte', label: 'Pasaporte' },
  { value: 'RUC', label: 'RUC' }
];