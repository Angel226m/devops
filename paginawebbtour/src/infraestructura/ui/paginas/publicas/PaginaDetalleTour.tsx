/*import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { obtenerTipoTourPorId } from '../../../store/slices/sliceTipoTour';
import { listarToursDisponiblesSinDuplicados } from '../../../store/slices/sliceTourProgramado';
import { listarGaleriasTourPorTipoTour } from '../../../store/slices/sliceGaleriaTour';

import Seccion from '../../componentes/layout/Seccion';
import GaleriaTour from '../../caracteristicas/tour/GaleriaTour';
import FormularioReservacion from '../../caracteristicas/tour/FormularioReservacion';
import ResenasTour from '../../caracteristicas/tour/ResenasTour';
import ToursRelacionados from '../../caracteristicas/tour/ToursRelacionados';
import Cargador from '../../componentes/comunes/Cargador';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';

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

const PaginaDetalleTour = () => {
  const { t } = useTranslation();
  const { idTour } = useParams<{ idTour: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('descripcion');
  
  // Obtener datos de Redux
  const { tipoTourActual, cargando: cargandoTipoTour, error: errorTipoTour } = useSelector(
    (state: RootState) => state.tipoTour
  );
  
  const { toursDisponibles, cargando: cargandoTours, error: errorTours } = useSelector(
    (state: RootState) => state.tourProgramado
  );
  
  const { galeriasTour, cargando: cargandoGaleria } = useSelector(
    (state: RootState) => state.galeriaTour
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
  // En el componente PaginaDetalleTour, ajusta el useEffect para evitar llamadas duplicadas
useEffect(() => {
  if (idTour) {
    const idTipoTour = parseInt(idTour);
    if (!isNaN(idTipoTour)) {
      console.log('Solicitando tour con ID:', idTipoTour);
      
      // Verificar si ya tenemos el tipo de tour cargado
      if (!tipoTourActual || tipoTourActual.id_tipo_tour !== idTipoTour) {
        dispatch(obtenerTipoTourPorId(idTipoTour));
      }
      
      // Verificar si ya tenemos tours disponibles cargados
      if (toursDisponibles.length === 0) {
        dispatch(listarToursDisponiblesSinDuplicados());
      }
      
      // Verificar si ya tenemos galerías cargadas
      if (galeriasTour.length === 0) {
        dispatch(listarGaleriasTourPorTipoTour(idTipoTour));
      }
    }
  }
}, [dispatch, idTour, tipoTourActual, toursDisponibles.length, galeriasTour.length]);
  
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
  
  // Comprobar si estamos cargando datos
  const cargando = cargandoTipoTour || cargandoTours || cargandoGaleria;
  
  // Mostrar cargador mientras se cargan los datos
  if (cargando) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        <Cargador tamano="lg" />
      </div>
    );
  }
  
  // Mostrar error si no se pudieron cargar los datos
  if (errorTipoTour || !tipoTourActual) {
    return (
      <Seccion className="py-16 bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg max-w-2xl mx-auto border border-sky-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            {errorTipoTour || t('tour.noEncontrado')}
          </h2>
          <p className="text-blue-700 mb-6">
            {t('tour.intentarDespues')}
          </p>
          <button 
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 shadow-md"
          >
            {t('general.volver')}
          </button>
        </div>
      </Seccion>
    );
  }
  
  // Obtener la URL de la imagen del tipo de tour
  const imagenTour = typeof tipoTourActual.url_imagen === 'object' 
    ? (tipoTourActual.url_imagen.Valid ? tipoTourActual.url_imagen.String : '') 
    : tipoTourActual.url_imagen || '';
  
  // Preparar los datos del tour para los componentes
  const tourData = {
    id: tipoTourActual.id_tipo_tour,
    nombre: tipoTourActual.nombre,
    descripcion: typeof tipoTourActual.descripcion === 'string' 
      ? tipoTourActual.descripcion 
      : (tipoTourActual.descripcion && tipoTourActual.descripcion.Valid ? tipoTourActual.descripcion.String : ''),
    duracion: tipoTourActual.duracion_minutos,
    precio: 0, // Aquí puedes obtener el precio desde el tipo de pasaje más barato si lo tienes
    calificacion: 4.5, // Podría ser dinámico basado en reseñas
    numResenas: 20, // Podría ser dinámico basado en reseñas
    imagenPrincipal: imagenTour,
    ubicacion: tipoTourActual.nombre_sede || t('tour.ubicacionGenerica'),
    incluye: incluye,
    noIncluye: noIncluye,
    horarios: horariosUnicos,
    recomendaciones: recomendaciones,
    galeria: galeriasTour.map(item => item.url_imagen)
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
      {/* Galería de imágenes *//*}
      <GaleriaTour 
        idTipoTour={tipoTourActual.id_tipo_tour} 
        nombreTour={tipoTourActual.nombre}
        imagenPrincipal={imagenTour}
      />
      
      <Seccion className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal del tour *//*}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-sky-100">
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
              
              {/* Pestañas de navegación *//*}
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
              
              {/* Contenido de las pestañas *//*}
              <motion.div
                key={tabActiva}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-gradient-to-b from-white/30 to-white/70 p-4 rounded-lg"
              >
                {/* Descripción *//*}
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

                    {/* Mostrar la descripción original si existe *//*}
                    {tourData.descripcion && tourData.descripcion.trim() !== '' ? (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">Descripción adicional:</h3>
                        {tourData.descripcion.split('\n\n').map((parrafo: string, index: number) => (
                          <p key={index} className="text-black">
                            {parrafo}
                          </p>
                        ))}
                      </div>
                    ) : null}
                  </div>
                )}
                
                {/* Detalles *//*}
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
                
                {/* Horarios *//*}
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
                        {/* Mostrar los tours disponibles agrupados por horario *//*}
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
                        
                        {/* Detalles adicionales sobre los tours *//*}
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
                
                {/* Recomendaciones *//*}
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
            </div>
            
            {/* Reseñas del tour *//*}
            <div className="mt-12 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-sky-100">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-blue-800 mb-6"
              >
                {t('tour.resenasClientes')} (20)
              </motion.h2>
              
              <ResenasTour idTour={tipoTourActual.id_tipo_tour} />
            </div>
          </div>
          
          {/* Formulario de reservación *//*}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FormularioReservacion tour={tourData} />
            </div>
          </div>
        </div>
      </Seccion>
      
      {/* Tours relacionados *//*}
      <Seccion className="py-12 bg-gradient-to-b from-sky-100 to-cyan-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            {t('tour.toursRelacionados')}
          </h2>
          <p className="text-blue-700 max-w-2xl mx-auto">
            {t('tour.toursRelacionadosDescripcion')}
          </p>
        </motion.div>
        
        <ToursRelacionados idTourActual={tipoTourActual.id_tipo_tour} />
      </Seccion>
    </div>
  );
};

export default PaginaDetalleTour;*/

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { obtenerTipoTourPorId } from '../../../store/slices/sliceTipoTour';
import { listarToursDisponiblesSinDuplicados } from '../../../store/slices/sliceTourProgramado';
import { listarGaleriasTourPorTipoTour } from '../../../store/slices/sliceGaleriaTour';
import { listarTiposPasajePorTipoTour } from '../../../store/slices/sliceTipoPasaje';
import { listarPaquetesPasajesPorTipoTour } from '../../../store/slices/slicePaquetePasajes';

import Seccion from '../../componentes/layout/Seccion';
import GaleriaTour from '../../caracteristicas/tour/GaleriaTour';
import FormularioReservacion from '../../caracteristicas/tour/FormularioReservacion';
import ResenasTour from '../../caracteristicas/tour/ResenasTour';
import ToursRelacionados from '../../caracteristicas/tour/ToursRelacionados';
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

interface RecursosCargados {
  tipoTour: boolean;
  tours: boolean;
  galeria: boolean;
  tiposPasaje: boolean;
  paquetesPasajes: boolean;
}

const PaginaDetalleTour = () => {
  const { t } = useTranslation();
  const { idTour } = useParams<{ idTour: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState('descripcion');
  
  // Usar una referencia para rastrear qué recursos ya se han cargado
  const recursosCargados = useRef<RecursosCargados>({
    tipoTour: false,
    tours: false,
    galeria: false,
    tiposPasaje: false,
    paquetesPasajes: false
  });
  
  // Usar una referencia para rastrear si ya hemos iniciado la carga
  const cargaIniciada = useRef(false);
  
  // Obtener datos de Redux
  const { tipoTourActual, cargando: cargandoTipoTour, error: errorTipoTour } = useSelector(
    (state: RootState) => state.tipoTour
  );
  
  const { toursDisponibles, cargando: cargandoTours, error: errorTours } = useSelector(
    (state: RootState) => state.tourProgramado
  );
  
  const { galeriasTour, cargando: cargandoGaleria } = useSelector(
    (state: RootState) => state.galeriaTour
  );
  
  const { tiposPasaje, cargando: cargandoTiposPasaje } = useSelector(
    (state: RootState) => state.tipoPasaje
  );
  
  const { paquetesPasajes, cargando: cargandoPaquetes } = useSelector(
    (state: RootState) => state.paquetePasajes
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
  
  // Cargar datos del tour y recursos relacionados
  useEffect(() => {
    if (!idTour || cargaIniciada.current) return;
    
    const idTipoTour = parseInt(idTour);
    if (isNaN(idTipoTour)) return;
    
    // Marcar la carga como iniciada para evitar múltiples cargas
    cargaIniciada.current = true;
    
    console.log('Iniciando carga de recursos para tour con ID:', idTipoTour);
    
    // Cargar tipo de tour (si no está cargado o es un tour diferente)
    if (!recursosCargados.current.tipoTour && (!tipoTourActual || tipoTourActual.id_tipo_tour !== idTipoTour)) {
      console.log('Cargando datos del tipo de tour');
      dispatch(obtenerTipoTourPorId(idTipoTour))
        .then(() => {
          recursosCargados.current.tipoTour = true;
        })
        .catch(() => {
          console.error('Error al cargar tipo de tour');
        });
    } else {
      recursosCargados.current.tipoTour = true;
    }
    
    // Cargar tours disponibles (si no están cargados)
    if (!recursosCargados.current.tours && toursDisponibles.length === 0) {
      console.log('Cargando tours disponibles');
      dispatch(listarToursDisponiblesSinDuplicados())
        .then(() => {
          recursosCargados.current.tours = true;
        })
        .catch(() => {
          console.error('Error al cargar tours disponibles');
        });
    } else {
      recursosCargados.current.tours = true;
    }
    
    // Cargar galería (si no está cargada)
    if (!recursosCargados.current.galeria) {
      console.log('Cargando galería de imágenes');
      dispatch(listarGaleriasTourPorTipoTour(idTipoTour))
        .then(() => {
          recursosCargados.current.galeria = true;
        })
        .catch(() => {
          console.error('Error al cargar galería');
        });
    }
    
    // Cargar tipos de pasaje (si no están cargados)
    if (!recursosCargados.current.tiposPasaje) {
      console.log('Cargando tipos de pasaje');
      dispatch(listarTiposPasajePorTipoTour(idTipoTour))
        .then(() => {
          recursosCargados.current.tiposPasaje = true;
        })
        .catch(() => {
          console.error('Error al cargar tipos de pasaje');
        });
    }
    
    // Cargar paquetes de pasajes (si no están cargados)
    if (!recursosCargados.current.paquetesPasajes) {
      console.log('Cargando paquetes de pasajes');
      dispatch(listarPaquetesPasajesPorTipoTour(idTipoTour))
        .then(() => {
          recursosCargados.current.paquetesPasajes = true;
        })
        .catch(() => {
          console.error('Error al cargar paquetes de pasajes');
        });
    }
  }, [dispatch, idTour, tipoTourActual, toursDisponibles.length]);
  
  // Reiniciar las referencias si el ID del tour cambia
  useEffect(() => {
    if (idTour && tipoTourActual && parseInt(idTour) !== tipoTourActual.id_tipo_tour) {
      console.log('ID del tour ha cambiado, reiniciando referencias');
      recursosCargados.current = {
        tipoTour: false,
        tours: false,
        galeria: false,
        tiposPasaje: false,
        paquetesPasajes: false
      };
      cargaIniciada.current = false;
    }
  }, [idTour, tipoTourActual]);
  
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
  
  // Comprobar si estamos cargando datos
  const cargando = cargandoTipoTour || cargandoTours || cargandoGaleria || cargandoTiposPasaje || cargandoPaquetes;
  
  // Mostrar cargador mientras se cargan los datos iniciales
  if (cargando && !tipoTourActual) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        <Cargador tamano="lg" />
      </div>
    );
  }
  
  // Mostrar error si no se pudieron cargar los datos
  if (errorTipoTour || !tipoTourActual) {
    return (
      <Seccion className="py-16 bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        <div className="bg-white rounded-xl p-8 text-center shadow-lg max-w-2xl mx-auto border border-sky-100">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-blue-800 mb-4">
            {errorTipoTour || t('tour.noEncontrado')}
          </h2>
          <p className="text-blue-700 mb-6">
            {t('tour.intentarDespues')}
          </p>
          <button 
            onClick={() => navigate('/tours')}
            className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 shadow-md"
          >
            {t('general.volver')}
          </button>
        </div>
      </Seccion>
    );
  }
  
  // Obtener la URL de la imagen del tipo de tour
  const imagenTour = typeof tipoTourActual.url_imagen === 'object' 
    ? (tipoTourActual.url_imagen.Valid ? tipoTourActual.url_imagen.String : '') 
    : tipoTourActual.url_imagen || '';
  
  // Calcular precio básico (si hay tipos de pasaje disponibles)
  const precioBasico = Array.isArray(tiposPasaje) && tiposPasaje.length > 0
    ? tiposPasaje[0].costo
    : 0;
  
  // Preparar los datos del tour para los componentes
  const tourData = {
    id: tipoTourActual.id_tipo_tour,
    nombre: tipoTourActual.nombre,
    descripcion: typeof tipoTourActual.descripcion === 'string' 
      ? tipoTourActual.descripcion 
      : (tipoTourActual.descripcion && tipoTourActual.descripcion.Valid ? tipoTourActual.descripcion.String : ''),
    duracion: tipoTourActual.duracion_minutos,
    precio: precioBasico, // Usamos el precio del primer tipo de pasaje
    calificacion: 4.5, // Podría ser dinámico basado en reseñas
    numResenas: 20, // Podría ser dinámico basado en reseñas
    imagenPrincipal: imagenTour,
    ubicacion: tipoTourActual.nombre_sede || t('tour.ubicacionGenerica'),
    incluye: incluye,
    noIncluye: noIncluye,
    horarios: horariosUnicos,
    recomendaciones: recomendaciones,
    galeria: galeriasTour.map(item => item.url_imagen)
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
      {/* Galería de imágenes */}
      <GaleriaTour 
        idTipoTour={tipoTourActual.id_tipo_tour} 
        nombreTour={tipoTourActual.nombre}
        imagenPrincipal={imagenTour}
      />
      
      <Seccion className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contenido principal del tour */}
          <div className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-sky-100">
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
                    {tourData.descripcion && tourData.descripcion.trim() !== '' ? (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-semibold mb-2">Descripción adicional:</h3>
                        {tourData.descripcion.split('\n\n').map((parrafo: string, index: number) => (
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
            </div>
            
            {/* Reseñas del tour */}
            <div className="mt-12 bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-sm border border-sky-100">
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-2xl font-bold text-blue-800 mb-6"
              >
                {t('tour.resenasClientes')} (20)
              </motion.h2>
              
              <ResenasTour idTour={tipoTourActual.id_tipo_tour} />
            </div>
          </div>
          
          {/* Formulario de reservación */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <FormularioReservacion tour={tourData} />
            </div>
          </div>
        </div>
      </Seccion>
      
      {/* Tours relacionados */}
      <Seccion className="py-12 bg-gradient-to-b from-sky-100 to-cyan-100">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-blue-800 mb-4">
            {t('tour.toursRelacionados')}
          </h2>
          <p className="text-blue-700 max-w-2xl mx-auto">
            {t('tour.toursRelacionadosDescripcion')}
          </p>
        </motion.div>
        
        <ToursRelacionados idTourActual={tipoTourActual.id_tipo_tour} />
      </Seccion>
    </div>
  );
};

export default PaginaDetalleTour;