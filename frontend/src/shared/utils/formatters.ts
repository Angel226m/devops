 
// Utilidades para formatear datos

/**
 * Formatea un número como moneda en soles peruanos
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea un número con separadores de miles
 */
export const formatNumber = (number: number): string => {
  return new Intl.NumberFormat('es-PE').format(number);
};

/**
 * Formatea una fecha en formato legible
 */
export const formatDate = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj);
};

/**
 * Formatea una fecha con hora
 */
export const formatDateTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateObj);
};

/**
 * Formatea una fecha en formato corto (DD/MM/YYYY)
 */
export const formatDateShort = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-PE', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(dateObj);
};

/**
 * Formatea solo la hora (HH:MM)
 */
export const formatTime = (date: Date | string): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('es-PE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(dateObj);
};

/**
 * Formatea un porcentaje
 */
export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Formatea el estado de una reserva para mostrar
 */
export const formatEstadoReserva = (estado: string): string => {
  const estados: { [key: string]: string } = {
    'PENDIENTE': 'Pendiente',
    'CONFIRMADO': 'Confirmado',
    'PAGADO': 'Pagado',
    'COMPLETADO': 'Completado',
    'CANCELADO': 'Cancelado',
    'EXPIRADO': 'Expirado',
  };
  
  return estados[estado] || estado;
};

/**
 * Formatea el rol del usuario
 */
export const formatRol = (rol: string): string => {
  const roles: { [key: string]: string } = {
    'ADMIN': 'Administrador',
    'VENDEDOR': 'Vendedor',
    'CHOFER': 'Chofer',
  };
  
  return roles[rol] || rol;
};

/**
 * Obtiene el color para un estado de reserva
 */
export const getEstadoColor = (estado: string): string => {
  const colores: { [key: string]: string } = {
    'PENDIENTE': 'text-yellow-600 bg-yellow-100',
    'CONFIRMADO': 'text-blue-600 bg-blue-100',
    'PAGADO': 'text-green-600 bg-green-100',
    'COMPLETADO': 'text-green-800 bg-green-200',
    'CANCELADO': 'text-red-600 bg-red-100',
    'EXPIRADO': 'text-gray-600 bg-gray-100',
  };
  
  return colores[estado] || 'text-gray-600 bg-gray-100';
};

/**
 * Formatea una duración en minutos a formato legible
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) {
    return `${mins} min`;
  } else if (mins === 0) {
    return `${hours}h`;
  } else {
    return `${hours}h ${mins}min`;
  }
};

/**
 * Capitaliza la primera letra de una string
 */
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Trunca un texto a una longitud específica
 */
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};