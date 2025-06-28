 
// domain/entities/Reserva.ts
export interface Reserva {
  id_reserva?: number;
  id_vendedor?: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  fecha_reserva?: string;
  total_pagar: number;
  notas?: string;
  estado: string;
  fecha_expiracion?: string;
  eliminado?: boolean;
  
  // Campos calculados o relacionados
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_vendedor?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  cantidad_pasajes?: PasajeCantidad[];
  paquetes?: PaquetePasajeDetalle[];
  metodo_pago?: string;
  total_pasajeros?: number;
}

export interface PasajeCantidad {
  id_pasajes_cantidad?: number;
  id_reserva?: number;
  id_tipo_pasaje: number;
  cantidad: number;
  eliminado?: boolean;
  
  // Campos calculados
  nombre_tipo?: string;
  precio_unitario?: number;
  subtotal?: number;
}

export interface PaquetePasajeDetalle {
  id_paquete_detalle?: number;
  id_paquete: number;
  id_reserva?: number;
  cantidad: number;
  eliminado?: boolean;
  
  // Campos calculados
  nombre_paquete?: string;
  precio_unitario?: number;
  subtotal?: number;
  cantidad_total?: number;
}

export interface NuevaReservaRequest {
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  id_vendedor?: number;
  total_pagar: number;
  notas?: string;
  cantidad_pasajes?: PasajeCantidadRequest[];
  paquetes?: PaqueteRequest[];
}

export interface PasajeCantidadRequest {
  id_tipo_pasaje: number;
  cantidad: number;
}

export interface PaqueteRequest {
  id_paquete: number;
  cantidad: number;
}

export interface ActualizarReservaRequest {
  id_cliente?: number;
  id_instancia?: number;
  id_paquete?: number;
  id_vendedor?: number;
  total_pagar?: number;
  notas?: string;
  estado?: string;
  cantidad_pasajes?: PasajeCantidadRequest[];
  paquetes?: PaqueteRequest[];
}

export interface CambiarEstadoReservaRequest {
  estado: string;
}

export interface ConfirmarPagoRequest {
  id_reserva: number;
  id_transaccion: string;
  monto: number;
}

export interface FiltrosReserva {
  id_cliente?: number;
  id_instancia?: number;
  id_vendedor?: number;
  fecha_inicio?: string;
  fecha_fin?: string;
  estado?: string;
}

export const estadosReserva = [
  'RESERVADO',
  'CONFIRMADO',
  'COMPLETADO',
  'CANCELADO'
];