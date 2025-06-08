import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  fetchToursProgramados, 
  fetchTourProgramadoById,
  deleteTourProgramado,
  forcedDeleteTourProgramado,
  cambiarEstado,
  fetchToursVigentes,
  TourProgramadoState 
} from '../../../../infrastructure/store/slices/tourProgramadoSlice';

// Importar slice y acciones de instanciaTour
import {
  fetchInstanciasPorTourProgramado,
  generarInstancias,
  InstanciaTourState
} from '../../../../infrastructure/store/slices/instanciaTourSlice';

import { fetchTipoTourPorId } from '../../../../infrastructure/store/slices/tipoTourSlice';
import { RootState, AppDispatch } from '../../../../infrastructure/store/index';
import { format, parseISO, isAfter, isBefore, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUserFriends, 
  FaEye, 
  FaEdit, 
  FaTrash,
  FaFilter,
  FaChevronLeft,
  FaCheck,
  FaTimes,
  FaSearch,
  FaShip,
  FaPlus,
  FaInfoCircle,
  FaCalendarCheck,
  FaUserTie,
  FaExclamationTriangle,
  FaListAlt,
  FaCalendarPlus,
  FaCalendarWeek
} from 'react-icons/fa';
import { ROUTES } from '../../../../shared/constants/appRoutes';

// Estado del tour programado (para mostrar badges con colores)
const getEstadoBadgeClass = (estado: string) => {
  const upperEstado = (estado || '').toUpperCase();
  switch(upperEstado) {
    case 'PROGRAMADO':
      return 'bg-blue-100 text-blue-800';
    case 'CONFIRMADO':
      return 'bg-green-100 text-green-800';
    case 'CANCELADO':
      return 'bg-red-100 text-red-800';
    case 'EN_CURSO':
      return 'bg-yellow-100 text-yellow-800';
    case 'COMPLETADO':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Badge para estado de vigencia
const getVigenciaBadge = (vigenciaDesde: string, vigenciaHasta: string) => {
  try {
    const fechaDesde = parseISO(vigenciaDesde);
    const fechaHasta = parseISO(vigenciaHasta);
    const today = new Date();
    
    // Si la fecha de vigencia ya expiró
    if (isBefore(fechaHasta, today)) {
      return <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">Vigencia expirada</span>;
    }
    
    // Si aún no ha iniciado la vigencia
    if (isAfter(fechaDesde, today)) {
      return <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">Vigencia futura</span>;
    }
    
    // Si está dentro del período de vigencia
    if (isWithinInterval(today, { start: fechaDesde, end: fechaHasta })) {
      return <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">Vigente</span>;
    }
    
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Estado desconocido</span>;
  } catch (e) {
    console.error("Error al evaluar vigencia:", e);
    return <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-medium">Vigencia desconocida</span>;
  }
};

// Función para asegurar que los valores sean texto
const asegurarTexto = (valor: any): string => {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number') return valor.toString();
  if (typeof valor === 'object') {
    try {
      if (valor.String !== undefined) return valor.String || '';
      if (valor.Valid !== undefined) return valor.Valid ? valor.String || '' : '';
      if (typeof valor.toString === 'function' && valor.toString !== Object.prototype.toString) {
        return valor.toString();
      }
      return JSON.stringify(valor);
    } catch (e) {
      console.error('Error al convertir objeto a texto:', e);
      return '';
    }
  }
  return String(valor);
};

// Función para asegurar que un valor sea número
const asegurarNumero = (valor: any): number => {
  if (valor === null || valor === undefined) return 0;
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') {
    const parsed = parseInt(valor, 10);
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
};

const formatFecha = (fechaStr: string | null | undefined) => {
  if (!fechaStr) return 'Fecha no disponible';
  try {
    const fechaTextual = asegurarTexto(fechaStr);
    return format(parseISO(fechaTextual), "EEEE d 'de' MMMM 'de' yyyy", { locale: es });
  } catch (e) {
    console.error("Error al formatear fecha:", e, fechaStr);
    return asegurarTexto(fechaStr);
  }
};

const formatFechaCorta = (fechaStr: string | null | undefined) => {
  if (!fechaStr) return 'N/D';
  try {
    const fechaTextual = asegurarTexto(fechaStr);
    return format(parseISO(fechaTextual), "dd/MM/yyyy", { locale: es });
  } catch (e) {
    return asegurarTexto(fechaStr);
  }
};
/*
const formatHora = (horaStr: string | null | undefined) => {
  if (!horaStr) return 'No disponible';
  try {
    // Si es una fecha completa, extraer solo la parte de la hora
    const fechaHora = parseISO(asegurarTexto(horaStr));
    return format(fechaHora, 'HH:mm', { locale: es });
  } catch (e) {
    return asegurarTexto(horaStr);
  }
};
*/

// Reemplazar la función formatHora actual
const formatHora = (horaStr: string | null | undefined) => {
  if (!horaStr) return 'No disponible';
  try {
    // Si es un string simple de hora (HH:MM:SS)
    if (typeof horaStr === 'string' && horaStr.includes(':') && !horaStr.includes('T') && !horaStr.includes('-')) {
      // Solo extraer las horas y minutos (ignorar segundos)
      const partes = horaStr.split(':');
      return `${partes[0]}:${partes[1]}`;
    }
    
    // Si es una fecha completa, extraer solo la parte de la hora
    try {
      const fechaHora = parseISO(asegurarTexto(horaStr));
      return format(fechaHora, 'HH:mm', { locale: es });
    } catch (e) {
      // Si falla el parseo como fecha, devolver el string original formateado
      return horaStr.toString().substring(0, 5); // Tomar solo HH:MM
    }
  } catch (e) {
    console.error("Error al formatear hora:", e, horaStr);
    return asegurarTexto(horaStr);
  }
};
// Función para obtener días de la semana abreviados
const obtenerDiasOperativos = (tour: any): string => {
  const dias: string[] = [];
  
  if (tour.disponible_lunes) dias.push('L');
  if (tour.disponible_martes) dias.push('M');
  if (tour.disponible_miercoles) dias.push('X');
  if (tour.disponible_jueves) dias.push('J');
  if (tour.disponible_viernes) dias.push('V');
  if (tour.disponible_sabado) dias.push('S');
  if (tour.disponible_domingo) dias.push('D');
  
  return dias.length > 0 ? dias.join(' | ') : 'Sin días configurados';
};

// Componente Toast para notificaciones
const Toast: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ 
  message, 
  type, 
  onClose 
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg z-50 flex items-center max-w-md`}
    >
      {type === 'success' ? (
        <FaCheck className="mr-2" />
      ) : (
        <FaInfoCircle className="mr-2" />
      )}
      <span className="text-sm">{message}</span>
      <button 
        onClick={onClose} 
        className="ml-4 text-white hover:text-gray-200"
      >
        &times;
      </button>
    </motion.div>
  );
};

// Componente para mostrar instancias de un tour específico
// 
// 
/*
const InstanciasTour: React.FC<{ tourId: number }> = ({ tourId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { instancias, loading, cantidadGenerada } = useSelector<RootState, InstanciaTourState>(
    (state) => state.instanciaTour
  );
  const [showInstancias, setShowInstancias] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Mostrar notificación
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  // Ocultar notificación
  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  // Cargar las instancias cuando se muestre el componente
  useEffect(() => {
    if (showInstancias) {
      dispatch(fetchInstanciasPorTourProgramado(tourId))
        .unwrap()
        .catch(error => {
          console.error("Error al cargar instancias:", error);
          showToast('Error al cargar las instancias del tour', 'error');
        });
    }
  }, [dispatch, tourId, showInstancias]);

  // Generar instancias para este tour
  const handleGenerarInstancias = () => {
    setIsGenerating(true);
    dispatch(generarInstancias(tourId))
      .unwrap()
      .then((cantidad) => {
        showToast(`Se generaron ${cantidad} instancias de tour correctamente`, 'success');
        // Recargar las instancias
        dispatch(fetchInstanciasPorTourProgramado(tourId));
      })
      .catch(error => {
        console.error("Error al generar instancias:", error);
        showToast('Error al generar instancias de tour', 'error');
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  if (!showInstancias) {
    return (
      <div className="mt-2">
        <button
          onClick={() => setShowInstancias(true)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <FaListAlt className="mr-1" /> Ver instancias del tour
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
      {/* Toast de notificación *//*}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaCalendarWeek className="mr-2 text-blue-600" /> 
          Instancias del Tour
        </h3>
        <button
          onClick={() => setShowInstancias(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="text-sm">Cerrar</span>
        </button>
      </div>

      <div className="mb-3">
        <button
          onClick={handleGenerarInstancias}
          disabled={isGenerating}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <FaCalendarPlus className="mr-2" /> 
          {isGenerating ? 'Generando...' : 'Generar Instancias'}
        </button>
        
        {cantidadGenerada !== null && (
          <div className="mt-2 text-green-600 bg-green-50 p-2 rounded-md inline-block">
            <FaCheck className="inline-block mr-1" /> Se generaron {cantidadGenerada} instancias de tour
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-blue-800">Cargando instancias...</p>
        </div>
      ) : instancias.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chofer
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Embarcación
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cupo
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {instancias.map((instancia) => (
                <tr key={instancia.id_instancia} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {formatFechaCorta(instancia.fecha_especifica)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {formatHora(instancia.hora_inicio)} - {formatHora(instancia.hora_fin)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {instancia.nombre_chofer || 'No asignado'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {instancia.nombre_embarcacion}
                  </td>
                 <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
  {instancia.cupo_disponible}
</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getEstadoBadgeClass(asegurarTexto(instancia.estado))}`}>
                      {asegurarTexto(instancia.estado)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-100 rounded-lg">
          <FaInfoCircle className="mx-auto text-blue-500 text-xl mb-2" />
          <p className="text-gray-700">No hay instancias generadas para este tour</p>
          <p className="text-gray-500 text-sm mt-1">
            Haz clic en "Generar Instancias" para crear las fechas específicas de este tour
          </p>
        </div>
      )}
      
      {instancias.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Las instancias son las fechas específicas en que operará este tour según los días configurados
        </div>
      )}
    </div>
  );
};
*/


// Componente para mostrar instancias de un tour específico
const InstanciasTour: React.FC<{ tourId: number }> = ({ tourId }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { instancias, loading, cantidadGenerada } = useSelector<RootState, InstanciaTourState>(
    (state) => state.instanciaTour
  );
  const [showInstancias, setShowInstancias] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });

  // Mostrar notificación
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  // Ocultar notificación
  const hideToast = () => {
    setToast({ ...toast, show: false });
  };

  // Cargar las instancias cuando se muestre el componente
  useEffect(() => {
    if (showInstancias) {
      dispatch(fetchInstanciasPorTourProgramado(tourId))
        .unwrap()
        .catch(error => {
          console.error("Error al cargar instancias:", error);
          showToast('Error al cargar las instancias del tour', 'error');
        });
    }
  }, [dispatch, tourId, showInstancias]);

  // Generar instancias para este tour
  const handleGenerarInstancias = () => {
    // Verificar si ya existen instancias para evitar duplicados
    if (instancias.length > 0) {
      if (!window.confirm('Ya existen instancias para este tour. Generar nuevas instancias podría crear duplicados. ¿Desea continuar?')) {
        return;
      }
    }
    
    setIsGenerating(true);
    dispatch(generarInstancias(tourId))
      .unwrap()
      .then((cantidad) => {
        showToast(`Se generaron ${cantidad} instancias de tour correctamente`, 'success');
        // Recargar las instancias
        dispatch(fetchInstanciasPorTourProgramado(tourId));
      })
      .catch(error => {
        console.error("Error al generar instancias:", error);
        showToast('Error al generar instancias de tour', 'error');
      })
      .finally(() => {
        setIsGenerating(false);
      });
  };

  if (!showInstancias) {
    return (
      <div className="mt-2">
        <button
          onClick={() => setShowInstancias(true)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <FaListAlt className="mr-1" /> Ver instancias del tour
        </button>
      </div>
    );
  }

  return (
    <div className="mt-3 bg-gray-50 p-4 rounded-lg border border-gray-200">
      {/* Toast de notificación */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center">
          <FaCalendarWeek className="mr-2 text-blue-600" /> 
          Instancias del Tour
        </h3>
        <button
          onClick={() => setShowInstancias(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          <span className="text-sm">Cerrar</span>
        </button>
      </div>

      <div className="mb-3">
        <button
          onClick={handleGenerarInstancias}
          disabled={isGenerating}
          className={`inline-flex items-center px-3 py-2 border border-transparent text-sm rounded-md font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200 ${isGenerating ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          <FaCalendarPlus className="mr-2" /> 
          {isGenerating ? 'Generando...' : 'Generar Instancias'}
        </button>
        
        {cantidadGenerada !== null && (
          <div className="mt-2 text-green-600 bg-green-50 p-2 rounded-md inline-block">
            <FaCheck className="inline-block mr-1" /> Se generaron {cantidadGenerada} instancias de tour
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="w-10 h-10 mx-auto border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="mt-2 text-blue-800">Cargando instancias...</p>
        </div>
      ) : instancias.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fecha
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Chofer
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Embarcación
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Cupo
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {instancias.map((instancia) => (
                <tr key={instancia.id_instancia} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {instancia.fecha_especifica_str || formatFechaCorta(instancia.fecha_especifica)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {/* Usar los campos _str directamente */}
                    {instancia.hora_inicio_str || formatHora(instancia.hora_inicio)} - {instancia.hora_fin_str || formatHora(instancia.hora_fin)}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {instancia.nombre_chofer || 'No asignado'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {instancia.nombre_embarcacion}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-700">
                    {instancia.cupo_disponible}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getEstadoBadgeClass(asegurarTexto(instancia.estado))}`}>
                      {asegurarTexto(instancia.estado)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-4 bg-gray-100 rounded-lg">
          <FaInfoCircle className="mx-auto text-blue-500 text-xl mb-2" />
          <p className="text-gray-700">No hay instancias generadas para este tour</p>
          <p className="text-gray-500 text-sm mt-1">
            Haz clic en "Generar Instancias" para crear las fechas específicas de este tour
          </p>
        </div>
      )}
      
      {instancias.length > 0 && (
        <div className="mt-2 text-xs text-gray-500 italic">
          Las instancias son las fechas específicas en que operará este tour según los días configurados
        </div>
      )}
    </div>
  );
};
const TourProgramadoList: React.FC = () => {
  const { tipoId } = useParams<{ tipoId: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { tours, loading, error } = useSelector<RootState, TourProgramadoState>(
    (state) => state.tourProgramado
  );
  const tipoTourActual = useSelector((state: RootState) => state.tipoTour.tipoTourActual);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState<string>('');
  const [fechaDesde, setFechaDesde] = useState<string>('');
  const [fechaHasta, setFechaHasta] = useState<string>('');
  const [vigenciaActiva, setVigenciaActiva] = useState<boolean>(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({
    show: false,
    message: '',
    type: 'success'
  });
  
  // Para expandir/colapsar instancias de tour
  const [expandedTourId, setExpandedTourId] = useState<number | null>(null);

  // Fecha actual para límite en datepicker
  const today = new Date().toISOString().split('T')[0];
  
  // Mostrar notificación
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
  };

  // Ocultar notificación
  const hideToast = () => {
    setToast({ ...toast, show: false });
  };
  
  // Cargar el tipo de tour actual y los tours filtrados
  useEffect(() => {
    console.log('🔄 CARGANDO TOURS PARA TIPO:', tipoId);
    console.log('📍 SEDE SELECCIONADA:', selectedSede?.id_sede);
    
    if (tipoId) {
      // Cargar información del tipo de tour
      dispatch(fetchTipoTourPorId(parseInt(tipoId)))
        .then(() => console.log('✅ Tipo de tour cargado correctamente'))
        .catch(err => console.error('❌ Error al cargar tipo de tour:', err));
      
      // Preparar filtros para la búsqueda
      const filtros = {
        id_tipo_tour: parseInt(tipoId),
        id_sede: selectedSede?.id_sede,
        estado: selectedEstado ? selectedEstado as any : undefined,
        fecha_inicio: fechaDesde || undefined,
        fecha_fin: fechaHasta || undefined
      };
      
      console.log('🔍 FILTROS APLICADOS:', filtros);
      
      // Si está activado el filtro de vigencia, cargar solo tours vigentes
      if (vigenciaActiva) {
        console.log('📅 Cargando solo tours vigentes');
        dispatch(fetchToursVigentes())
          .then(() => console.log('✅ Tours vigentes cargados'))
          .catch(err => console.error('❌ Error al cargar tours vigentes:', err));
      } else {
        console.log('📋 Cargando todos los tours con filtros');
        dispatch(fetchToursProgramados(filtros))
          .then(() => console.log('✅ Tours programados cargados'))
          .catch(err => console.error('❌ Error al cargar tours programados:', err));
      }
    }
  }, [dispatch, tipoId, selectedSede, selectedEstado, fechaDesde, fechaHasta, vigenciaActiva]);
  
  // Filtrar tours según el término de búsqueda
  const filteredTours = tours.filter(tour => {
    if (!tour) return false;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      (tour.nombre_tipo_tour && asegurarTexto(tour.nombre_tipo_tour).toLowerCase().includes(searchLower)) ||
      (tour.nombre_embarcacion && asegurarTexto(tour.nombre_embarcacion).toLowerCase().includes(searchLower)) ||
      (tour.nombre_sede && asegurarTexto(tour.nombre_sede).toLowerCase().includes(searchLower)) ||
      (tour.nombre_chofer && asegurarTexto(tour.nombre_chofer).toLowerCase().includes(searchLower))
    );
  });
  
  console.log('📊 TOURS FILTRADOS:', filteredTours.length, 'de', tours.length, 'total');
  
  // Rutas actualizadas
  const handleVerDetalle = (id: number) => {
    navigate(ROUTES.ADMIN.TOURS_PROGRAMADOS.DETAIL(id));
  };

  const handleEditar = (id: number) => {
    navigate(ROUTES.ADMIN.TOURS_PROGRAMADOS.EDIT(id));
  };

  const handleEliminar = (id: number) => {
    const tourToDelete = tours.find(tour => tour.id_tour_programado === id);
    
    if (!tourToDelete) {
      showToast('No se encontró el tour seleccionado', 'error');
      return;
    }
    
    const estadoTour = asegurarTexto(tourToDelete.estado).toUpperCase();
    
    // Verificar si el tour está en un estado que permite eliminación
    if (estadoTour === 'EN_CURSO') {
      showToast('No se puede eliminar un tour que está en curso. Cancele el tour primero.', 'error');
      return;
    }
    
    if (estadoTour === 'COMPLETADO') {
      showToast('No se puede eliminar un tour que ya ha sido completado.', 'error');
      return;
    }
    
    // Verificar si el tour tiene reservas
    const cupoMaximo = asegurarNumero(tourToDelete.cupo_maximo);
    const cupoDisponible = asegurarNumero(tourToDelete.cupo_disponible);
    const tieneReservas = cupoMaximo > cupoDisponible;
    
    let confirmMessage = '¿Está seguro que desea eliminar este tour programado? Esta acción no se puede deshacer.';
    
    if (tieneReservas) {
      confirmMessage = `¡ADVERTENCIA! Este tour tiene ${cupoMaximo - cupoDisponible} reservas asociadas. Al eliminar el tour se eliminarán también todas las reservas. ¿Está seguro de continuar?`;
    }
    
    if (window.confirm(confirmMessage)) {
      // Si tiene reservas, ofrecer eliminación forzada
      const actionToDispatch = tieneReservas ? forcedDeleteTourProgramado(id) : deleteTourProgramado(id);
      
      dispatch(actionToDispatch)
        .unwrap()
        .then(() => {
          showToast('Tour eliminado correctamente', 'success');
          
          // Recargar la lista después de eliminar
          if (tipoId) {
            const filtros = {
              id_tipo_tour: parseInt(tipoId),
              id_sede: selectedSede?.id_sede,
              estado: selectedEstado ? selectedEstado as any : undefined,
              fecha_inicio: fechaDesde || undefined,
              fecha_fin: fechaHasta || undefined
            };
            dispatch(fetchToursProgramados(filtros));
          }
        })
        .catch((error: any) => {
          console.error("Error al eliminar el tour:", error);
          
          let errorMessage = 'Error al eliminar el tour. ';
          if (typeof error === 'string') {
            errorMessage += error;
          } else if (error && typeof error === 'object') {
            if ('message' in error) errorMessage += error.message;
            else if ('data' in error && error.data?.message) errorMessage += error.data.message;
          }
          
          showToast(errorMessage, 'error');
          
          // Si el error es porque tiene reservas, ofrecer eliminación forzada
          if (errorMessage.includes('reservas') || errorMessage.includes('asociadas')) {
            if (window.confirm('Este tour tiene reservas asociadas. ¿Desea forzar la eliminación?')) {
              dispatch(forcedDeleteTourProgramado(id))
                .unwrap()
                .then(() => {
                  showToast('Tour eliminado correctamente (forzado)', 'success');
                  
                  if (tipoId) {
                    dispatch(fetchToursProgramados({
                      id_tipo_tour: parseInt(tipoId),
                      id_sede: selectedSede?.id_sede,
                    }));
                  }
                })
                .catch((forceError) => {
                  console.error("Error al forzar eliminación:", forceError);
                  showToast('Error al forzar la eliminación del tour.', 'error');
                });
            }
          }
        });
    }
  };

  const handleCambiarEstado = (id: number, nuevoEstado: string) => {
    dispatch(cambiarEstado({ id, estado: nuevoEstado }))
      .unwrap()
      .then(() => {
        showToast(`Estado del tour actualizado a ${nuevoEstado}`, 'success');
      })
      .catch(error => {
        console.error("Error al cambiar el estado:", error);
        showToast('Error al cambiar el estado del tour', 'error');
      });
  };
  
  const handleVolver = () => {
    navigate(ROUTES.ADMIN.TOURS_PROGRAMADOS.LIST);
  };
  
  const handleNuevoTour = () => {
    navigate(`${ROUTES.ADMIN.TOURS_PROGRAMADOS.NEW}?tipo=${tipoId}`);
  };
  
  const handleLimpiarFiltros = () => {
    setSelectedEstado('');
    setFechaDesde('');
    setFechaHasta('');
    setSearchTerm('');
    setVigenciaActiva(false);
  };
  
  const toggleFilters = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Expandir/Colapsar instancias de tour
  const toggleInstancias = (id: number) => {
    setExpandedTourId(expandedTourId === id ? null : id);
  };
  
  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };
  
  if (loading && tours.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando tours programados...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Toast de notificación */}
      {toast.show && (
        <Toast 
          message={toast.message} 
          type={toast.type} 
          onClose={hideToast} 
        />
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Encabezado y botón para volver */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <button 
              onClick={handleVolver}
              className="mb-4 md:mb-0 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              <FaChevronLeft className="mr-1" /> Volver a tipos de tour
            </button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
              {tipoTourActual?.nombre ? `Tours de ${asegurarTexto(tipoTourActual.nombre)}` : 'Tours Programados'}
            </h1>
            <p className="text-gray-600 mt-1">
              {tipoTourActual?.descripcion ? asegurarTexto(tipoTourActual.descripcion) : 'Lista de tours programados disponibles'}
            </p>
            {tipoTourActual?.duracion_minutos && (
              <p className="text-gray-500 text-sm mt-1">
                Duración: {asegurarNumero(tipoTourActual.duracion_minutos)} minutos
              </p>
            )}
          </div>
          
          <div className="mt-4 md:mt-0 flex space-x-2">
            <button
              onClick={toggleFilters}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center transition-colors duration-200"
            >
              <FaFilter className="mr-2" /> Filtros
            </button>
            
            <button
              onClick={handleNuevoTour}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 flex items-center transition-colors duration-200"
            >
              <FaPlus className="mr-2" /> Nuevo Tour
            </button>
          </div>
        </div>
        
        {/* Panel de filtros */}
        {isFilterOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-white p-4 rounded-lg shadow-md mb-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                <select
                  value={selectedEstado}
                  onChange={(e) => setSelectedEstado(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Todos los estados</option>
                  <option value="PROGRAMADO">Programado</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="EN_CURSO">En curso</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Desde</label>
                <input
                  type="date"
                  value={fechaDesde}
                  onChange={(e) => {
                    setFechaDesde(e.target.value);
                    // Si la fecha hasta es menor que la fecha desde, actualizar
                    if (fechaHasta && e.target.value > fechaHasta) {
                      setFechaHasta(e.target.value);
                    }
                  }}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hasta</label>
                <input
                  type="date"
                  value={fechaHasta}
                  min={fechaDesde || today}
                  onChange={(e) => setFechaHasta(e.target.value)}
                  className="w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  <input
                    id="solo-vigentes"
                    type="checkbox"
                    checked={vigenciaActiva}
                    onChange={() => setVigenciaActiva(!vigenciaActiva)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="solo-vigentes" className="ml-2 block text-sm text-gray-700">
                    Solo tours vigentes
                  </label>
                </div>
                
                <button
                  onClick={handleLimpiarFiltros}
                  className="py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none transition-colors duration-200"
                >
                  Limpiar filtros
                </button>
              </div>
            </div>
          </motion.div>
        )}
        
        {/* Barra de búsqueda */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
              placeholder="Buscar por embarcación, chofer o sede..."
            />
          </div>
        </div>

        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="w-5 h-5 mr-2 text-red-500" />
              <p className="font-medium">{asegurarTexto(error)}</p>
            </div>
          </motion.div>
        )}
        
        {/* Lista de tours programados */}
        {filteredTours.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredTours.map((tour) => (
              <motion.div 
                key={tour.id_tour_programado}
                variants={childVariants}
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <div className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">{asegurarTexto(tour.nombre_tipo_tour) || 'Tour sin nombre'}</h2>
                      <p className="text-gray-500">{asegurarTexto(tour.nombre_sede) || 'Sede no especificada'}</p>
                    </div>
                    
                    <div className="mt-2 md:mt-0 flex flex-wrap gap-2 items-start md:items-center">
                      {/* Badge de Vigencia */}
                      <div>
                        {getVigenciaBadge(tour.vigencia_desde, tour.vigencia_hasta)}
                      </div>
                      
                      {/* Badge de Estado */}
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getEstadoBadgeClass(asegurarTexto(tour.estado))}`}>
                        {asegurarTexto(tour.estado)}
                      </span>
                      
                      {/* Badge si es excepción */}
                      {tour.es_excepcion && (
                        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-medium">
                          Excepción
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {/* Información principal del tour */}
                 { /*<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-500 mr-2" />
                      <span className="text-gray-700">{formatFecha(tour.fecha)}</span>
                    </div>
                    
                    <div className="flex items-center">
                      <FaClock className="text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        {formatHora(tour.hora_inicio)} - {formatHora(tour.hora_fin)}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <FaShip className="text-blue-500 mr-2" />
                      <span className="text-gray-700">{asegurarTexto(tour.nombre_embarcacion) || 'Embarcación no asignada'}</span>
                    </div>
                  </div>*/}
                  {/* Información principal del tour */}
{/* Información principal del tour */}
<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
  <div className="flex items-center">
    <FaCalendarAlt className="text-blue-500 mr-2" />
    <span className="text-gray-700">
      {formatFecha(tour.fecha)}
      <span className="ml-2 text-xs text-gray-500">(Creado)</span>
    </span>
  </div>
  
  <div className="flex items-center">
    <FaClock className="text-blue-500 mr-2" />
    <span className="text-gray-700">
      {/* Simplemente usar formatHora */}
      {formatHora(tour.hora_inicio)} - {formatHora(tour.hora_fin)}
    </span>
  </div>
  
  <div className="flex items-center">
    <FaShip className="text-blue-500 mr-2" />
    <span className="text-gray-700">{asegurarTexto(tour.nombre_embarcacion) || 'Embarcación no asignada'}</span>
  </div>
</div>
                  
                  {/* Información del chofer y cupo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center">
                      <FaUserTie className="text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        Chofer: {asegurarTexto(tour.nombre_chofer) || 'No asignado'}
                      </span>
                    </div>
                    
                    <div className="flex items-center">
                      <FaUserFriends className="text-blue-500 mr-2" />
                      <span className="text-gray-700">
                        Cupo: {asegurarNumero(tour.cupo_disponible)}/{asegurarNumero(tour.cupo_maximo)} disponibles
                      </span>
                    </div>
                  </div>
                  
                  {/* Días operativos del tour */}
                  <div className="mb-4 bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <FaClock className="text-blue-500 mr-2 mt-1" />
                      <div>
                        <p className="text-gray-700 font-medium">Días operativos:</p>
                        <p className="text-gray-600 text-sm">
                          {obtenerDiasOperativos(tour)}
                        </p>
                        <p className="text-gray-500 text-xs italic mt-1">
                          El tour opera en estos días de la semana durante el período de vigencia
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Período de vigencia */}
                  <div className="mb-4 bg-green-50 p-3 rounded-lg">
                    <div className="flex items-start">
                      <FaCalendarCheck className="text-green-500 mr-2 mt-1" />
                      <div>
                        <p className="text-gray-700 font-medium">Período de vigencia:</p>
                        <p className="text-gray-600 text-sm">
                          Desde {formatFecha(tour.vigencia_desde)} hasta {formatFecha(tour.vigencia_hasta)}
                        </p>
                        <p className="text-gray-500 text-xs italic mt-1">
                          Este tour está disponible para reservas durante este período
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notas de excepción si aplica */}
                  {tour.es_excepcion && tour.notas_excepcion && (
                    <div className="mb-4 bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <div className="flex items-start">
                        <FaExclamationTriangle className="text-amber-500 mr-2 mt-1" />
                        <div>
                          <p className="text-amber-800 font-medium">Notas de excepción:</p>
                          <p className="text-amber-700 text-sm">{asegurarTexto(tour.notas_excepcion)}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Componente de instancias de tour */}
                  {expandedTourId === tour.id_tour_programado ? (
                    <InstanciasTour tourId={tour.id_tour_programado} />
                  ) : (
                    <button
                      onClick={() => toggleInstancias(tour.id_tour_programado)}
                      className="mt-2 flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
                    >
                      <FaListAlt className="mr-1" /> Ver instancias del tour
                    </button>
                  )}
                  
                  {/* Acciones */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      onClick={() => handleVerDetalle(tour.id_tour_programado)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none transition-colors duration-200"
                    >
                      <FaEye className="mr-2" /> Ver detalles
                    </button>
                    
                    <button
                      onClick={() => handleEditar(tour.id_tour_programado)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none transition-colors duration-200"
                    >
                      <FaEdit className="mr-2" /> Editar
                    </button>
                    
                    <button
                      onClick={() => handleEliminar(tour.id_tour_programado)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none transition-colors duration-200"
                    >
                      <FaTrash className="mr-2" /> Eliminar
                    </button>
                    
                    {/* Botones de cambio de estado según el estado actual */}
                    {asegurarTexto(tour.estado).toUpperCase() === 'PROGRAMADO' && (
                      <button
                        onClick={() => handleCambiarEstado(tour.id_tour_programado, 'EN_CURSO')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none transition-colors duration-200"
                      >
                        <FaCheck className="mr-2" /> Iniciar Tour
                      </button>
                    )}
                    
                    {asegurarTexto(tour.estado).toUpperCase() === 'EN_CURSO' && (
                      <button
                        onClick={() => handleCambiarEstado(tour.id_tour_programado, 'COMPLETADO')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-500 hover:bg-green-600 focus:outline-none transition-colors duration-200"
                      >
                        <FaCheck className="mr-2" /> Completar
                      </button>
                    )}
                    
                    {!['CANCELADO', 'COMPLETADO'].includes(asegurarTexto(tour.estado).toUpperCase()) && (
                      <button
                        onClick={() => handleCambiarEstado(tour.id_tour_programado, 'CANCELADO')}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none transition-colors duration-200"
                      >
                        <FaTimes className="mr-2" /> Cancelar
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white p-8 rounded-xl shadow-md text-center"
          >
            <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="mt-4 text-lg font-medium text-gray-900">No se encontraron tours programados</h3>
            <p className="mt-2 text-gray-500">
              No hay tours programados para el tipo seleccionado
              {fechaDesde ? ` desde ${fechaDesde}` : ''}
              {fechaHasta ? ` hasta ${fechaHasta}` : ''}
              {selectedEstado ? ` con estado "${selectedEstado}"` : ''}
              {vigenciaActiva ? ` que estén vigentes actualmente` : ''}.
            </p>
            <div className="mt-6">
              <button
                onClick={handleNuevoTour}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm text-sm font-medium hover:bg-blue-700 flex items-center mx-auto transition-colors duration-200"
              >
                <FaPlus className="mr-2" /> Crear nuevo tour
              </button>
            </div>
          </motion.div>
        )}
        
        {/* Resumen de resultados */}
        {filteredTours.length > 0 && (
          <div className="mt-6 text-center text-gray-600">
            Mostrando {filteredTours.length} {filteredTours.length === 1 ? 'tour programado' : 'tours programados'}
            {searchTerm ? ` para la búsqueda "${searchTerm}"` : ''}
            {selectedEstado ? ` con estado "${selectedEstado}"` : ''}
            {vigenciaActiva ? ' vigentes actualmente' : ''}
          </div>
        )}
      </div>
    </div>
  );
};

export default TourProgramadoList;