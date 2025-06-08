 
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, isSameMonth, isSameDay, isToday, parse, isAfter, isBefore, addDays } from 'date-fns';
import { es, enUS } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

interface SelectorFechaProps {
  valor: Date | null;
  onChange: (fecha: Date) => void;
  label?: string;
  minFecha?: Date;
  maxFecha?: Date;
  error?: string;
  disabled?: boolean;
  placeholder?: string;
  formato?: string;
  className?: string;
}

const SelectorFecha = ({
  valor,
  onChange,
  label,
  minFecha,
  maxFecha,
  error,
  disabled = false,
  placeholder = 'Seleccionar fecha',
  formato = 'dd/MM/yyyy',
  className = ''
}: SelectorFechaProps) => {
  const { i18n } = useTranslation();
  const [fechaActual, setFechaActual] = useState(new Date());
  const [abierto, setAbierto] = useState(false);
  const [inputValue, setInputValue] = useState('');
  
  const selectorRef = useRef<HTMLDivElement>(null);
  const locale = i18n.language === 'es' ? es : enUS;

  // Actualizar valor de input cuando cambia la fecha seleccionada
  useEffect(() => {
    if (valor) {
      setInputValue(format(valor, formato, { locale }));
    } else {
      setInputValue('');
    }
  }, [valor, formato, locale]);

  // Cerrar al hacer clic fuera del selector
  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (selectorRef.current && !selectorRef.current.contains(event.target as Node)) {
        setAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFuera);
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, []);

  // Función para manejar selección de día
  const seleccionarDia = (dia: Date) => {
    if (
      (minFecha && isBefore(dia, minFecha)) ||
      (maxFecha && isAfter(dia, maxFecha))
    ) {
      return; // No seleccionar días fuera del rango permitido
    }
    
    onChange(dia);
    setAbierto(false);
  };

  // Función para manejar cambios en el input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Intentar parsear la fecha ingresada
    try {
      if (newValue) {
        const fecha = parse(newValue, formato, new Date(), { locale });
        if (isValid(fecha)) {
          onChange(fecha);
        }
      } else {
        onChange(null as unknown as Date); // Limpiar la fecha si el input está vacío
      }
    } catch (error) {
      // Error al parsear la fecha, no actualizar el valor
    }
  };

  // Validar si una fecha es válida
  const isValid = (fecha: Date) => {
    return fecha instanceof Date && !isNaN(fecha.getTime());
  };

  // Obtener días del calendario para el mes actual
  const getDiasCalendario = () => {
    const inicioMes = startOfMonth(fechaActual);
    const finMes = endOfMonth(fechaActual);
    const inicioSemana = startOfWeek(inicioMes, { locale });
    const finSemana = endOfWeek(finMes, { locale });

    return eachDayOfInterval({ start: inicioSemana, end: finSemana });
  };

  // Verificar si un día está deshabilitado
  const estaDiaDeshabilitado = (dia: Date) => {
    return (
      (minFecha && isBefore(dia, minFecha)) ||
      (maxFecha && isAfter(dia, maxFecha))
    );
  };

  // Cambiar de mes
  const cambiarMes = (incremento: number) => {
    if (incremento > 0) {
      setFechaActual(addMonths(fechaActual, 1));
    } else {
      setFechaActual(subMonths(fechaActual, 1));
    }
  };

  // Generar nombres de los días de la semana
  const diasSemana = Array.from({ length: 7 }).map((_, i) => {
    const date = addDays(startOfWeek(new Date(), { locale }), i);
    return format(date, 'EEEEEE', { locale });
  });

  return (
    <div className={`relative ${className}`} ref={selectorRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
        </label>
      )}
      
      <div className="relative">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => !disabled && setAbierto(true)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full px-4 py-2 border ${
            error
              ? 'border-red-500 dark:border-red-400'
              : 'border-gray-300 dark:border-gray-700'
          } rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white transition-colors ${
            disabled ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed' : ''
          }`}
        />
        
        <button
          type="button"
          onClick={() => !disabled && setAbierto(!abierto)}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500 focus:outline-none"
          disabled={disabled}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </button>
      </div>
      
      {error && (
        <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
      
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden"
          >
            <div className="p-3">
              {/* Controles de navegación */}
              <div className="flex items-center justify-between mb-4">
                <button
                  type="button"
                  onClick={() => cambiarMes(-1)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                
                <div className="text-gray-800 dark:text-white font-medium">
                  {format(fechaActual, 'MMMM yyyy', { locale })}
                </div>
                
                <button
                  type="button"
                  onClick={() => cambiarMes(1)}
                  className="p-1 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              
              {/* Días de la semana */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {diasSemana.map((dia, i) => (
                  <div key={i} className="text-center text-xs font-medium text-gray-500 dark:text-gray-400">
                    {dia}
                  </div>
                ))}
              </div>
              
              {/* Días del mes */}
              <div className="grid grid-cols-7 gap-1">
                {getDiasCalendario().map((dia, i) => {
                  const esHoy = isToday(dia);
                  const esMismoMes = isSameMonth(dia, fechaActual);
                  const esSeleccionado = valor && isSameDay(dia, valor);
                  const esDeshabilitado = estaDiaDeshabilitado(dia);
                  
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => !esDeshabilitado && seleccionarDia(dia)}
                      disabled={esDeshabilitado}
                      className={`w-8 h-8 text-sm rounded-full flex items-center justify-center ${
                        !esMismoMes
                          ? 'text-gray-400 dark:text-gray-600'
                          : esDeshabilitado
                          ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                          : esSeleccionado
                          ? 'bg-primary-500 text-white font-medium'
                          : esHoy
                          ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      {format(dia, 'd')}
                    </button>
                  );
                })}
              </div>
              
              {/* Acciones rápidas */}
              <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-3 flex justify-between">
                <button
                  type="button"
                  onClick={() => seleccionarDia(new Date())}
                  className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300 focus:outline-none"
                >
                  Hoy
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onChange(null as unknown as Date);
                    setAbierto(false);
                  }}
                  className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  Limpiar
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SelectorFecha;