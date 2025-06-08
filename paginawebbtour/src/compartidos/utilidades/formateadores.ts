 
/**
 * Formatea una fecha en formato ISO a DD/MM/YYYY
 * @param fecha Fecha en formato ISO o string
 * @returns Fecha formateada
 */
export const formateadorFecha = (fecha: string | Date): string => {
  if (!fecha) return '';
  
  const date = typeof fecha === 'string' ? new Date(fecha) : fecha;
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
};

/**
 * Formatea una hora en formato HH:MM de 24h a 12h con AM/PM
 * @param hora Hora en formato HH:MM
 * @returns Hora formateada con AM/PM
 */
export const formateadorHora = (hora: string): string => {
  if (!hora) return '';
  
  const [horas, minutos] = hora.split(':');
  const horasNum = parseInt(horas, 10);
  const periodo = horasNum >= 12 ? 'PM' : 'AM';
  const horas12 = horasNum % 12 || 12;
  
  return `${horas12}:${minutos} ${periodo}`;
};

/**
 * Formatea un valor monetario a formato de moneda
 * @param valor Valor numérico
 * @param moneda Símbolo de moneda (por defecto S/)
 * @returns Valor formateado como moneda
 */
export const formateadorMoneda = (valor: number, moneda: string = 'S/'): string => {
  return `${moneda} ${valor.toFixed(2)}`;
};