 import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  fetchTourProgramadoById,
  deleteTourProgramado,
  cambiarEstado
} from '../../../../infrastructure/store/slices/tourProgramadoSlice';
import { RootState, AppDispatch } from '../../../../infrastructure/store/index';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUserFriends, // Usar este en lugar de FaUsers
  FaEdit, 
  FaTrash,
  FaArrowLeft,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationTriangle,
  FaShip
} from 'react-icons/fa';

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

const formatHora = (horaStr: string | null | undefined) => {
  if (!horaStr) return 'No disponible';
  return asegurarTexto(horaStr);
};

const getEstadoBadgeClass = (estado: string) => {
  switch(estado.toUpperCase()) {
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

const TourProgramadoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { currentTour, loading, error } = useSelector((state: RootState) => state.tourProgramado);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchTourProgramadoById(parseInt(id)));
    }
  }, [dispatch, id]);
  
  const handleEditar = () => {
    if (id) {
      navigate(`/admin/tours/editar/${id}`);
    }
  };
  
  const handleEliminar = () => {
    if (id && window.confirm('¿Está seguro que desea eliminar este tour programado?')) {
      dispatch(deleteTourProgramado(parseInt(id)))
        .unwrap()
        .then(() => {
          navigate('/admin/tours');
        })
        .catch(error => {
          console.error("Error al eliminar el tour:", error);
          alert("Error al eliminar el tour. Intente nuevamente.");
        });
    }
  };
  
  const handleCambiarEstado = (nuevoEstado: string) => {
    if (id) {
      dispatch(cambiarEstado({ id: parseInt(id), estado: nuevoEstado }))
        .unwrap()
        .then(() => {
          // Recargar los datos
          dispatch(fetchTourProgramadoById(parseInt(id)));
        })
        .catch(error => {
          console.error("Error al cambiar el estado:", error);
          alert("Error al cambiar el estado. Intente nuevamente.");
        });
    }
  };
  
  const handleVolver = () => {
    navigate(-1);
  };
  
  if (loading || !currentTour) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando detalles del tour...</p>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-6">
          <button 
            onClick={handleVolver}
            className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            <FaArrowLeft className="mr-1" /> Volver
          </button>
        </div>
        
        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <FaExclamationTriangle className="h-5 w-5 mr-2 text-red-500" />
              <p className="font-medium">{asegurarTexto(error)}</p>
            </div>
          </motion.div>
        )}
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-md overflow-hidden"
        >
          <div className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {asegurarTexto(currentTour.nombre_tipo_tour) || 'Tour Programado'}
                </h1>
                <p className="text-gray-600 mt-1">
                  {asegurarTexto(currentTour.nombre_sede) || 'Sede no especificada'}
                </p>
              </div>
              
              <div className="mt-3 md:mt-0">
                <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${getEstadoBadgeClass(asegurarTexto(currentTour.estado))}`}>
                  {asegurarTexto(currentTour.estado)}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Información General</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <FaCalendarAlt className="text-blue-500 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Fecha</p>
                      <p className="text-gray-800 font-medium">{formatFecha(currentTour.fecha)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaClock className="text-blue-500 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Horario</p>
                      <p className="text-gray-800 font-medium">
                        {formatHora(currentTour.hora_inicio)} - {formatHora(currentTour.hora_fin)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaShip className="text-blue-500 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Embarcación</p>
                      <p className="text-gray-800 font-medium">
                        {asegurarTexto(currentTour.nombre_embarcacion) || 'No asignada'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <FaUserFriends className="text-blue-500 mr-3 h-5 w-5" />
                    <div>
                      <p className="text-sm text-gray-500">Chofer</p>
                      <p className="text-gray-800 font-medium">
                        {asegurarTexto(currentTour.nombre_chofer) || 'No asignado'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-3">Capacidad y Cupos</h2>
                
                <div className="space-y-2">
                  <div className="flex items-center">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
  <FaUserFriends className="h-4 w-4 text-gray-400" />
</div>
                    <div>
                      <p className="text-sm text-gray-500">Cupo Máximo</p>
                      <p className="text-gray-800 font-medium">{currentTour.cupo_maximo} personas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-green-100 p-2 rounded-md mr-3">
                      <FaCheckCircle className="text-green-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Cupo Disponible</p>
                      <p className="text-gray-800 font-medium">{currentTour.cupo_disponible} personas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="bg-amber-100 p-2 rounded-md mr-3">
                      <FaMapMarkerAlt className="text-amber-600 h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Ocupación</p>
                      <p className="text-gray-800 font-medium">
                        {currentTour.cupo_maximo - currentTour.cupo_disponible} / {currentTour.cupo_maximo} ({Math.round(((currentTour.cupo_maximo - currentTour.cupo_disponible) / currentTour.cupo_maximo) * 100)}%)
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {currentTour.es_excepcion && (
              <div className="mb-6 bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="flex items-start">
                  <FaExclamationTriangle className="h-5 w-5 text-amber-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-amber-800">Excepción</h3>
                    <p className="text-amber-700 mt-1">{asegurarTexto(currentTour.notas_excepcion) || 'Este tour está marcado como excepción (fuera de la programación regular).'}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-8 border-t pt-6">
              <div className="flex flex-wrap justify-between items-center">
                <div className="space-x-2 mb-4 md:mb-0">
                  <button
                    onClick={handleEditar}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
                  >
                    <FaEdit className="mr-2 -ml-1 h-4 w-4" /> Editar Tour
                  </button>
                  
                  <button
                    onClick={handleEliminar}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                  >
                    <FaTrash className="mr-2 -ml-1 h-4 w-4" /> Eliminar
                  </button>
                </div>
                
                <div className="space-x-2">
                  {asegurarTexto(currentTour.estado).toUpperCase() !== 'EN_CURSO' && (
                    <button
                      onClick={() => handleCambiarEstado('EN_CURSO')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600 focus:outline-none"
                    >
                      <FaCheckCircle className="mr-2 -ml-1 h-4 w-4" /> Iniciar Tour
                    </button>
                  )}
                  
                  {asegurarTexto(currentTour.estado).toUpperCase() === 'EN_CURSO' && (
                    <button
                      onClick={() => handleCambiarEstado('COMPLETADO')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none"
                    >
                      <FaCheckCircle className="mr-2 -ml-1 h-4 w-4" /> Completar
                    </button>
                  )}
                  
                  {asegurarTexto(currentTour.estado).toUpperCase() !== 'CANCELADO' && (
                    <button
                      onClick={() => handleCambiarEstado('CANCELADO')}
                      className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none"
                    >
                      <FaTimesCircle className="mr-2 -ml-1 h-4 w-4" /> Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default TourProgramadoDetail;