 


import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { RootState, AppDispatch } from '../../../store';
import { obtenerTipoTourPorId, limpiarTipoTourActual } from '../../../store/slices/sliceTipoTour';
import { listarToursDisponiblesSinDuplicados } from '../../../store/slices/sliceTourProgramado';
import Cargador from '../../componentes/comunes/Cargador';

// Función para formatear la hora
const formateadorHora = (horaString: string | undefined): string => {
  if (!horaString) return '';
  
  try {
    // La fecha viene en formato "0000-01-01T09:00:00Z"
    const fecha = new Date(horaString);
    const horas = fecha.getUTCHours();
    const minutos = fecha.getUTCMinutes();
    
    // Formato 12 horas
    const horasFormato12 = horas % 12 || 12;
    const periodo = horas >= 12 ? 'PM' : 'AM';
    
    // Formatea los minutos para que siempre tengan dos dígitos
    const minutosFormateados = minutos.toString().padStart(2, '0');
    
    return `${horasFormato12}:${minutosFormateados} ${periodo}`;
  } catch (error) {
    console.error("Error al formatear hora:", error);
    return '';
  }
};

// Función para formatear fecha
const formateadorFecha = (fechaString: string | undefined): string => {
  if (!fechaString) return '';
  
  try {
    const fecha = new Date(fechaString);
    return fecha.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return '';
  }
};

const DetalleTour = () => {
  const { t } = useTranslation();
  const [tabActiva, setTabActiva] = useState('descripcion');
  const { idTour } = useParams<{ idTour: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  // Obtener datos de Redux
  const { tipoTourActual, cargando: cargandoTipoTour, error: errorTipoTour } = useSelector(
    (state: RootState) => state.tipoTour
  );
  
  const { toursDisponibles, cargando: cargandoTours, error: errorTours } = useSelector(
    (state: RootState) => state.tourProgramado
  );
  
  // Datos predeterminados para la UI
  const incluye = [
    'Ticket para abordar la embarcación.',
    'Chaleco salvavidas.',
    'Guía turístico.'
  ];
  
  const noIncluye = [
    'Impuesto portuario y el impuesto SERNAMP (S/.16 soles por persona, se paga directamente en el muelle antes de embarcar).',
    t('tour.noIncluye.comidas'),
    t('tour.noIncluye.propinas')
  ];
  
  const recomendaciones = [
    t('tour.recomendaciones.ropa'),
    t('tour.recomendaciones.calzado'),
    t('tour.recomendaciones.proteccion'),
    t('tour.recomendaciones.agua'),
    t('tour.recomendaciones.documentos')
  ];
  
  // Cargar datos del tour y tours programados disponibles
  useEffect(() => {
    if (idTour) {
      const idTipoTour = parseInt(idTour);
      if (!isNaN(idTipoTour)) {
        console.log('Solicitando tour con ID:', idTipoTour);
        dispatch(obtenerTipoTourPorId(idTipoTour));
        // Cargar tours programados disponibles
        dispatch(listarToursDisponiblesSinDuplicados());
      }
    }
    
    // Limpiar al desmontar
    return () => {
      dispatch(limpiarTipoTourActual());
    };
  }, [dispatch, idTour]);
  
  // Filtrar tours disponibles para este tipo de tour
  const toursDisponiblesParaEsteTipo = tipoTourActual 
    ? toursDisponibles.filter(tour => tour.id_tipo_tour === tipoTourActual.id_tipo_tour)
    : [];
  
  // Obtener horarios únicos de los tours disponibles
  const horariosUnicos = toursDisponiblesParaEsteTipo.map(tour => {
    const horaInicio = formateadorHora(tour.hora_inicio);
    const horaFin = formateadorHora(tour.hora_fin);
    return `${horaInicio} - ${horaFin}`;
  }).filter((horario, index, self) => self.indexOf(horario) === index);
  
  // Renderizar estrellas según calificación
  const renderEstrellas = (calificacion: number = 4.5) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
          index < Math.floor(calificacion) 
            ? 'text-yellow-400' 
            : index < calificacion 
              ? 'text-yellow-300' 
              : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  // Mostrar cargador mientras se cargan los datos
  if (cargandoTipoTour) {
    return (
      <div className="flex justify-center items-center py-20">
        <Cargador />
      </div>
    );
  }
  
  // Mostrar error si no se pudieron cargar los datos
  if (errorTipoTour || !tipoTourActual) {
    return (
      <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-red-100">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          {errorTipoTour || 'No se pudo cargar la información del tour'}
        </h2>
        <p className="text-gray-600 mb-6">
          Por favor, intenta recargar la página o vuelve al listado de tours.
        </p>
        <button 
          onClick={() => navigate('/tours')}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Volver al listado de tours
        </button>
      </div>
    );
  }
  
  return (
    <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-sky-100">
      {/* Eliminada la sección de imagen principal */}
      
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl md:text-4xl font-bold text-black mb-4"
      >
        {tipoTourActual.nombre}
      </motion.h1>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex items-center flex-wrap gap-4 mb-6"
      >
        <div className="flex items-center bg-amber-50/70 px-3 py-1 rounded-lg">
          <div className="flex mr-1">
            {renderEstrellas(4.5)}
          </div>
          <span className="text-black font-medium ml-1">
            4.5
          </span>
        </div>
        
        <div className="flex items-center text-black bg-sky-50/70 px-3 py-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{tipoTourActual.duracion_minutos} {t('tour.minutos')}</span>
        </div>
        
        <div className="flex items-center text-black bg-teal-50/70 px-3 py-1 rounded-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{tipoTourActual.nombre_sede || t('tour.ubicacionGenerica')}</span>
        </div>
      </motion.div>
      
      {/* Pestañas de navegación */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-8 border-b border-sky-100"
      >
        <div className="flex flex-wrap -mb-px">
          <button
            className={`inline-block py-4 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              tabActiva === 'descripcion'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-blue-700 hover:text-blue-800'
            }`}
            onClick={() => setTabActiva('descripcion')}
          >
            {t('tour.descripcion')}
          </button>
          <button
            className={`inline-block py-4 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              tabActiva === 'detalles'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-blue-700 hover:text-blue-800'
            }`}
            onClick={() => setTabActiva('detalles')}
          >
            {t('tour.detalles')}
          </button>
          <button
            className={`inline-block py-4 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              tabActiva === 'horarios'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-blue-700 hover:text-blue-800'
            }`}
            onClick={() => setTabActiva('horarios')}
          >
            {t('tour.horarios')}
          </button>
          <button
            className={`inline-block py-4 px-4 text-sm font-medium border-b-2 transition-colors duration-200 ${
              tabActiva === 'recomendaciones'
                ? 'border-teal-500 text-teal-600'
                : 'border-transparent text-blue-700 hover:text-blue-800'
            }`}
            onClick={() => setTabActiva('recomendaciones')}
          >
            {t('tour.recomendaciones')}
          </button>
        </div>
      </motion.div>
      
      {/* Contenido de las pestañas */}
      <motion.div
        key={tabActiva}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-gradient-to-b from-white/30 to-white/70 p-4 rounded-lg"
      >
        {/* Descripción */}
        {tabActiva === 'descripcion' && (
          <div className="prose prose-lg max-w-none">
            <p className="text-black">
              El tour incluye:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>Ticket para abordar la embarcación.</li>
              <li>Chaleco salvavidas.</li>
              <li>Guía turístico.</li>
            </ul>
            <p className="text-black font-medium">
              Importante: La tarifa no incluye el impuesto portuario y el impuesto SERNAMP, por ellos pagará un total de S/.16 soles por persona, directamente en el muelle antes de embarcar.
            </p>

            {/* Mostrar la descripción original si existe */}
            {tipoTourActual.descripcion && typeof tipoTourActual.descripcion === 'string' && tipoTourActual.descripcion.trim() !== '' ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Descripción adicional:</h3>
                {tipoTourActual.descripcion.split('\n\n').map((parrafo: string, index: number) => (
                  <p key={index} className="text-black">
                    {parrafo}
                  </p>
                ))}
              </div>
            ) : typeof tipoTourActual.descripcion === 'object' && 
                tipoTourActual.descripcion && 
                tipoTourActual.descripcion.Valid && 
                tipoTourActual.descripcion.String && 
                tipoTourActual.descripcion.String.trim() !== '' ? (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-2">Descripción adicional:</h3>
                {tipoTourActual.descripcion.String.split('\n\n').map((parrafo: string, index: number) => (
                  <p key={index} className="text-black">
                    {parrafo}
                  </p>
                ))}
              </div>
            ) : null}
          </div>
        )}
        
        {/* Detalles */}
        {tabActiva === 'detalles' && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-blue-50/70 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">
                {t('tour.queIncluye')}
              </h3>
              <ul className="space-y-2">
                {incluye.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-red-50/70 p-4 rounded-lg">
              <h3 className="text-xl font-semibold text-black mb-4">
                {t('tour.queNoIncluye')}
              </h3>
              <ul className="space-y-2">
                {noIncluye.map((item: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-black">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        
        {/* Horarios */}
        {tabActiva === 'horarios' && (
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">
              {t('tour.horariosDisponibles')}
            </h3>
            
            {cargandoTours ? (
              <div className="flex justify-center items-center py-8">
                <Cargador />
              </div>
            ) : errorTours ? (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-lg">
                <p className="text-red-700">
                  {errorTours}
                </p>
              </div>
            ) : toursDisponiblesParaEsteTipo.length === 0 ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 rounded-r-lg">
                <p className="text-yellow-700">
                  {t('tour.sinHorariosDisponibles')}
                </p>
              </div>
            ) : (
              <div>
                {/* Mostrar los tours disponibles agrupados por horario */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                  {horariosUnicos.map((horario, index) => (
                    <div
                      key={index}
                      className="bg-sky-50/80 border border-sky-100 rounded-lg p-4 hover:shadow-md transition-shadow duration-200"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-teal-600 mr-2" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        <span className="text-black font-medium">{horario}</span>
                      </div>
                    </div>
                  ))}
                </div>
                
                {/* Detalles adicionales sobre los tours */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mt-6">
                  <h4 className="font-semibold text-blue-700 mb-2">Información de disponibilidad:</h4>
                  <ul className="space-y-2 text-blue-600">
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>
                        Los horarios mostrados corresponden a las próximas salidas disponibles.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>
                        Se recomienda llegar al punto de embarque 30 minutos antes de la hora de salida.
                      </span>
                    </li>
                    {toursDisponiblesParaEsteTipo.length > 0 && toursDisponiblesParaEsteTipo[0].vigencia_hasta && (
                      <li className="flex items-start">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span>
                          Vigente hasta: {formateadorFecha(toursDisponiblesParaEsteTipo[0].vigencia_hasta)}
                        </span>
                      </li>
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Recomendaciones */}
        {tabActiva === 'recomendaciones' && (
          <div>
            <h3 className="text-xl font-semibold text-black mb-4">
              {t('tour.recomendaciones')}
            </h3>
            <div className="bg-blue-50/80 border-l-4 border-blue-500 p-4 rounded-r-lg mb-6">
              <p className="text-blue-700">
                {t('tour.recomendacionesIntro')}
              </p>
            </div>
            <ul className="space-y-2 bg-cyan-50/70 p-4 rounded-lg">
              {recomendaciones.map((recomendacion: string, index: number) => (
                <li key={index} className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  <span className="text-black">{recomendacion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </motion.div>
      
      {/* Botón para volver al listado */}
      <div className="mt-8">
        <button
          onClick={() => navigate('/tours')}
          className="px-5 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          ← Volver a la lista de tours
        </button>
      </div>
    </div>
  );
};

export default DetalleTour;