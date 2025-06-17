 
export interface CantidadPasaje {
  id_tipo_pasaje: number;
  cantidad: number;
  precio_unitario: number;
}

export interface PaqueteReserva {
  id_paquete: number;
  cantidad: number;
  precio_unitario: number;
}

export interface ReservaBase {
  id_cliente: number;
  id_instancia: number;
  id_canal?: number;
  id_sede: number;
  id_vendedor?: number | null;
  total_pagar: number;
  cantidad_pasajes: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  notas?: string;
}

export interface NuevaReservaRequest extends ReservaBase {}

export interface ActualizarReservaRequest extends ReservaBase {}

export interface CambiarEstadoReservaRequest {
  estado: EstadoReserva;
}

export type EstadoReserva = 'RESERVADO' | 'CONFIRMADA' | 'CANCELADA' | 'PENDIENTE' | 'PROCESADO' | 'ANULADO';

export interface Reserva extends ReservaBase {
  id_reserva: number;
  fecha_creacion: string;
  fecha_actualizacion: string;
  estado: EstadoReserva;
  fecha_cancelacion?: string;
  // Relaciones
  cliente?: {
    id_cliente: number;
    nombres: string;
    apellidos: string;
    correo: string;
    numero_celular?: string;
  };
  instancia?: {
    id_instancia: number;
    id_tour_programado: number;
    nombre_tour?: string;
    fecha_especifica: string;
    hora_inicio: string;
    cupo_disponible: number;
    estado: string;
  };
  canal_venta?: {
    id_canal: number;
    nombre: string;
  };
  sede?: {
    id_sede: number;
    nombre: string;
  };
  vendedor?: {
    id_usuario: number;
    nombres: string;
    apellidos: string;
  };
}

export interface ReservaMercadoPagoRequest {
  id_cliente: number;
  id_instancia: number;
  id_canal?: number;
  id_sede?: number;
  total_pagar: number;
  cantidad_pasajes: CantidadPasaje[];
  paquetes?: PaqueteReserva[];
  telefono?: string;
  documento?: string;
  notas?: string;
}

export interface ReservaMercadoPagoResponse {
  id_reserva: number;
  nombre_tour: string;
  preferenceID: string;
  initPoint: string;
  sandboxInitPoint: string;
}

export interface ConfirmarPagoRequest {
  id_reserva: number;
  id_transaccion: string;
  monto: number;
}