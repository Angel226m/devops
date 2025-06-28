 
// domain/entities/Pago.ts
export interface Pago {
  id_pago?: number;
  id_reserva: number;
  metodo_pago: string;
  canal_pago: string;
  id_sede?: number | null;
  monto: number;
  fecha_pago?: string;
  estado: string;
  comprobante?: string;
  numero_comprobante?: string;
  url_comprobante?: string;
  eliminado?: boolean;
  
  // Campos calculados o relacionados
  nombre_cliente?: string;
  apellidos_cliente?: string;
  documento_cliente?: string;
  nombre_sede?: string;
  tour_nombre?: string;
  tour_fecha?: string;
}

export interface NuevoPagoRequest {
  id_reserva: number;
  metodo_pago: string;
  canal_pago: string;
  id_sede?: number | null;
  monto: number;
  comprobante?: string;
  numero_comprobante?: string;
  url_comprobante?: string;
}

export interface ActualizarPagoRequest {
  metodo_pago: string;
  canal_pago: string;
  id_sede?: number | null;
  monto: number;
  comprobante?: string;
  numero_comprobante?: string;
  url_comprobante?: string;
  estado: string;
}

export interface CambiarEstadoPagoRequest {
  estado: string;
}

// Constantes para opciones disponibles
export const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'YAPE', 'PLIN', 'MERCADOPAGO', 'DEPOSITO'];
export const CANALES_PAGO = ['LOCAL', 'WEB', 'APP', 'TELEFONO'];
export const ESTADOS_PAGO = ['PROCESADO', 'PENDIENTE', 'ANULADO'];