 /*

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { listarGaleriasTourPorTipoTour } from '../../../store/slices/sliceGaleriaTour';
import { obtenerTipoTourPorId } from '../../../store/slices/sliceTipoTour';
import Cargador from '../../componentes/comunes/Cargador';

interface GaleriaTourProps {
  idTipoTour: number;
  nombreTour: string;
  imagenPrincipal?: string;
}

const GaleriaTour = ({ idTipoTour, nombreTour, imagenPrincipal }: GaleriaTourProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modoGaleria, setModoGaleria] = useState(false);
  
  // Obtener datos de Redux
  const { galeriasTour, cargando: cargandoGaleria, error: errorGaleria } = useSelector(
    (state: RootState) => state.galeriaTour
  );
  
  const { tipoTourActual, cargando: cargandoTipoTour, error: errorTipoTour } = useSelector(
    (state: RootState) => state.tipoTour
  );
  
  // Efecto para cargar datos al montar el componente o cuando cambia el ID del tour
  // En el componente GaleriaTour
useEffect(() => {
  console.log(`Cargando datos para tipo tour ID: ${idTipoTour}`);
  
  if (idTipoTour && typeof idTipoTour === 'number' && idTipoTour > 0) {
    // Verificar si ya tenemos el tipo de tour cargado
    if (!tipoTourActual || tipoTourActual.id_tipo_tour !== idTipoTour) {
      // Cargar datos del tipo de tour
      dispatch(obtenerTipoTourPorId(idTipoTour))
        .then((action) => {
          if (action.payload) {
            console.log(`Tipo tour cargado:`, action.payload);
          } else {
            console.log("No se pudo cargar el tipo de tour");
          }
        })
        .catch((error) => {
          console.error(`Error al cargar tipo tour:`, error);
        });
    }
    
    // Verificar si ya tenemos galerías cargadas
    if (galeriasTour.length === 0) {
      // Cargar galería de imágenes
      dispatch(listarGaleriasTourPorTipoTour(idTipoTour))
        .then((action) => {
          if (action.payload && Array.isArray(action.payload)) {
            console.log(`Galería cargada, imágenes:`, action.payload.length);
          } else {
            console.log("No se pudo cargar la galería o está vacía");
          }
        })
        .catch((error) => {
          console.error(`Error al cargar galería:`, error);
        });
    }
  } else {
    console.error("ID de tipo tour no válido:", idTipoTour);
  }
}, [dispatch, idTipoTour, tipoTourActual, galeriasTour.length]);
  
  // Determinar la imagen principal
  const obtenerImagenPrincipal = (): string => {
    console.log("Obteniendo imagen principal");
    console.log("Imagen proporcionada:", imagenPrincipal);
    console.log("Tipo tour:", tipoTourActual);
    console.log("Galería:", galeriasTour);
    
    // Prioridad 1: Usar la imagen proporcionada explícitamente
    if (imagenPrincipal && imagenPrincipal.trim() !== '') {
      console.log("Usando imagen proporcionada:", imagenPrincipal);
      return imagenPrincipal;
    }
    
    // Prioridad 2: Usar la imagen del tipo de tour
    if (tipoTourActual) {
      const urlImagen = typeof tipoTourActual.url_imagen === 'object' 
        ? tipoTourActual.url_imagen.Valid ? tipoTourActual.url_imagen.String : ''
        : tipoTourActual.url_imagen || '';
        
      if (urlImagen.trim() !== '') {
        console.log("Usando imagen del tipo tour:", urlImagen);
        return urlImagen;
      }
    }
    
    // Prioridad 3: Usar la primera imagen de la galería
    if (galeriasTour && Array.isArray(galeriasTour) && galeriasTour.length > 0 && galeriasTour[0].url_imagen) {
      console.log("Usando primera imagen de galería:", galeriasTour[0].url_imagen);
      return galeriasTour[0].url_imagen;
    }
    
    // Imagen por defecto
    console.log("Usando imagen por defecto");
    return 'https://via.placeholder.com/800x600?text=Sin+Imagen+Disponible';
  };
  
  // Preparar las URLs de las imágenes
  const prepararImagenes = (): string[] => {
    const imagenPrincipal = obtenerImagenPrincipal();
    const imagenesGaleria = Array.isArray(galeriasTour) 
      ? galeriasTour.map(item => item?.url_imagen || '').filter(url => url !== '')
      : [];
    
    console.log("Imágenes de galería:", imagenesGaleria);
    
    // Evitar duplicar la imagen principal si ya está en la galería
    if (imagenesGaleria.includes(imagenPrincipal)) {
      console.log("Imagen principal ya está en la galería, no se duplica");
      return imagenesGaleria;
    }
    
    // Combinar imagen principal con el resto de la galería
    console.log("Combinando imagen principal con la galería");
    return [imagenPrincipal, ...imagenesGaleria];
  };
  
  const imagenes = prepararImagenes();
  console.log("Total de imágenes preparadas:", imagenes.length);
  
  // Calcular índice anterior y siguiente
  const indiceAnterior = (imagenActiva - 1 + imagenes.length) % imagenes.length;
  const indiceSiguiente = (imagenActiva + 1) % imagenes.length;
  
  // Cambiar a la imagen anterior
  const anteriorImagen = () => {
    setImagenActiva(indiceAnterior);
  };
  
  // Cambiar a la imagen siguiente
  const siguienteImagen = () => {
    setImagenActiva(indiceSiguiente);
  };
  
  // Abrir galería en pantalla completa
  const abrirGaleria = (indice: number) => {
    setImagenActiva(indice);
    setModoGaleria(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Cerrar galería en pantalla completa
  const cerrarGaleria = () => {
    setModoGaleria(false);
    document.body.style.overflow = 'auto';
  };
  
  // Si está cargando, mostrar el indicador de carga
  const cargando = cargandoGaleria || cargandoTipoTour;
  if (cargando) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <Cargador />
      </div>
    );
  }
  
  // Si hay un error, mostrar mensaje de error
  const error = errorGaleria || errorTipoTour;
  if (error) {
    console.error("Error en el componente GaleriaTour:", error);
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600">{error}</p>
          <p className="text-gray-600 mt-2">{t('tour.errorCargaGaleria')}</p>
        </div>
      </div>
    );
  }

  // Si no hay imágenes después de cargar, mostrar un mensaje
  if (imagenes.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">{t('tour.sinImagenesDisponibles')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Resto del componente igual que antes *//*}
      {/* Galería normal *//*}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-96 md:h-[500px]">
          {/* Imagen principal *//*}
          <div 
            className="md:col-span-8 relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => abrirGaleria(0)}
          >
            <img 
              src={imagenes[0]} 
              alt={`${nombreTour} - Imagen principal`} 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="bg-black bg-opacity-50 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Imágenes secundarias *//*}
          <div className="md:col-span-4 grid grid-cols-2 gap-2">
            {imagenes.slice(1, 5).map((imagen, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => abrirGaleria(index + 1)}
              >
                <img 
                  src={imagen} 
                  alt={`${nombreTour} - Imagen ${index + 2}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="bg-black bg-opacity-50 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                
                {/* Mostrar botón de "Ver más" en la última imagen si hay más de 5 imágenes *//*}
                {index === 3 && imagenes.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirGaleria(4);
                    }}
                  >
                    <div className="text-white text-center">
                      <p className="text-xl font-bold">+{imagenes.length - 5}</p>
                      <p className="text-sm">{t('tour.verMasImagenes')}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Galería en pantalla completa *//*}
      <AnimatePresence>
        {modoGaleria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col"
          >
            {/* Barra superior *//*}
            <div className="flex justify-between items-center py-4 px-6 text-white">
              <h2 className="text-xl font-semibold">
                {nombreTour} - {t('tour.imagen')} {imagenActiva + 1} / {imagenes.length}
              </h2>
              <button
                onClick={cerrarGaleria}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                aria-label={t('general.cerrar')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Contenedor de imagen *//*}
            <div className="flex-grow flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imagenActiva}
                  src={imagenes[imagenActiva]}
                  alt={`${nombreTour} - Imagen ${imagenActiva + 1}`}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Botones de navegación *//*}
              <button
                onClick={anteriorImagen}
                className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all duration-200 transform hover:scale-110"
                aria-label={t('general.anterior')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={siguienteImagen}
                className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all duration-200 transform hover:scale-110"
                aria-label={t('general.siguiente')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Miniaturas *//*}
            <div className="p-4 bg-black bg-opacity-50">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenActiva(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === imagenActiva ? 'border-blue-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={imagen} 
                      alt={`Miniatura ${index + 1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GaleriaTour;*/



import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../../store';
import { listarGaleriasTourPorTipoTour } from '../../../store/slices/sliceGaleriaTour';
import { obtenerTipoTourPorId } from '../../../store/slices/sliceTipoTour';
import Cargador from '../../componentes/comunes/Cargador';

interface GaleriaTourProps {
  idTipoTour: number;
  nombreTour: string;
  imagenPrincipal?: string;
}

const GaleriaTour = ({ idTipoTour, nombreTour, imagenPrincipal }: GaleriaTourProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [imagenActiva, setImagenActiva] = useState(0);
  const [modoGaleria, setModoGaleria] = useState(false);
  
  // Referencias para evitar múltiples llamadas
  const tipoTourCargado = useRef(false);
  const galeriaCargada = useRef(false);
  const cargarDatosIniciado = useRef(false);
  
  // Obtener datos de Redux
  const { galeriasTour, cargando: cargandoGaleria, error: errorGaleria } = useSelector(
    (state: RootState) => state.galeriaTour
  );
  
  const { tipoTourActual, cargando: cargandoTipoTour, error: errorTipoTour } = useSelector(
    (state: RootState) => state.tipoTour
  );
  
  // Efecto para cargar datos al montar el componente o cuando cambia el ID del tour
  useEffect(() => {
    // Evitar múltiples cargas durante re-renderizados
    if (cargarDatosIniciado.current) return;
    
    console.log(`Cargando datos para tipo tour ID: ${idTipoTour}`);
    cargarDatosIniciado.current = true;
    
    if (idTipoTour && typeof idTipoTour === 'number' && idTipoTour > 0) {
      // Verificar si ya tenemos el tipo de tour cargado
      if ((!tipoTourActual || tipoTourActual.id_tipo_tour !== idTipoTour) && !tipoTourCargado.current) {
        // Cargar datos del tipo de tour
        tipoTourCargado.current = true; // Marcar como en proceso de carga
        dispatch(obtenerTipoTourPorId(idTipoTour))
          .then((action) => {
            if (action.payload) {
              console.log(`Tipo tour cargado:`, action.payload);
            } else {
              console.log("No se pudo cargar el tipo de tour");
              tipoTourCargado.current = false; // Resetear para permitir un reintento
            }
          })
          .catch((error) => {
            console.error(`Error al cargar tipo tour:`, error);
            tipoTourCargado.current = false; // Resetear para permitir un reintento
          });
      } else {
        tipoTourCargado.current = true;
      }
      
      // Verificar si ya tenemos galerías cargadas
      if (galeriasTour.length === 0 && !galeriaCargada.current) {
        // Cargar galería de imágenes
        galeriaCargada.current = true; // Marcar como en proceso de carga
        dispatch(listarGaleriasTourPorTipoTour(idTipoTour))
          .then((action) => {
            if (action.payload && Array.isArray(action.payload)) {
              console.log(`Galería cargada, imágenes:`, action.payload.length);
            } else {
              console.log("No se pudo cargar la galería o está vacía");
              galeriaCargada.current = false; // Resetear para permitir un reintento
            }
          })
          .catch((error) => {
            console.error(`Error al cargar galería:`, error);
            galeriaCargada.current = false; // Resetear para permitir un reintento
          });
      } else {
        galeriaCargada.current = true;
      }
    } else {
      console.error("ID de tipo tour no válido:", idTipoTour);
      cargarDatosIniciado.current = false; // Resetear para permitir un reintento si el ID cambia
    }
  }, [dispatch, idTipoTour, tipoTourActual, galeriasTour]);
  
  // Efecto para actualizar el estado cuando cambia el ID del tour
  useEffect(() => {
    // Resetear los flags cuando cambia el ID del tour
    if (idTipoTour !== tipoTourActual?.id_tipo_tour) {
      tipoTourCargado.current = false;
      galeriaCargada.current = false;
      cargarDatosIniciado.current = false;
    }
  }, [idTipoTour, tipoTourActual]);
  
  // Determinar la imagen principal
  const obtenerImagenPrincipal = (): string => {
    // Evitar logs excesivos
    const debug = false;
    
    if (debug) {
      console.log("Obteniendo imagen principal");
      console.log("Imagen proporcionada:", imagenPrincipal);
      console.log("Tipo tour:", tipoTourActual);
      console.log("Galería:", galeriasTour);
    }
    
    // Prioridad 1: Usar la imagen proporcionada explícitamente
    if (imagenPrincipal && imagenPrincipal.trim() !== '') {
      if (debug) console.log("Usando imagen proporcionada:", imagenPrincipal);
      return imagenPrincipal;
    }
    
    // Prioridad 2: Usar la imagen del tipo de tour
    if (tipoTourActual) {
      const urlImagen = typeof tipoTourActual.url_imagen === 'object' 
        ? tipoTourActual.url_imagen.Valid ? tipoTourActual.url_imagen.String : ''
        : tipoTourActual.url_imagen || '';
        
      if (urlImagen.trim() !== '') {
        if (debug) console.log("Usando imagen del tipo tour:", urlImagen);
        return urlImagen;
      }
    }
    
    // Prioridad 3: Usar la primera imagen de la galería
    if (galeriasTour && Array.isArray(galeriasTour) && galeriasTour.length > 0 && galeriasTour[0].url_imagen) {
      if (debug) console.log("Usando primera imagen de galería:", galeriasTour[0].url_imagen);
      return galeriasTour[0].url_imagen;
    }
    
    // Imagen por defecto
    if (debug) console.log("Usando imagen por defecto");
    return 'https://via.placeholder.com/800x600?text=Sin+Imagen+Disponible';
  };
  
  // Preparar las URLs de las imágenes
  const prepararImagenes = (): string[] => {
    const imagenPrincipal = obtenerImagenPrincipal();
    const imagenesGaleria = Array.isArray(galeriasTour) 
      ? galeriasTour.map(item => item?.url_imagen || '').filter(url => url !== '')
      : [];
    
    // Evitar logs excesivos
    const debug = false;
    if (debug) console.log("Imágenes de galería:", imagenesGaleria);
    
    // Evitar duplicar la imagen principal si ya está en la galería
    if (imagenesGaleria.includes(imagenPrincipal)) {
      if (debug) console.log("Imagen principal ya está en la galería, no se duplica");
      return imagenesGaleria;
    }
    
    // Combinar imagen principal con el resto de la galería
    if (debug) console.log("Combinando imagen principal con la galería");
    return [imagenPrincipal, ...imagenesGaleria];
  };
  
  // Memoizar la preparación de imágenes para evitar cálculos innecesarios
  const imagenes = prepararImagenes();
  
  // Evitar logs excesivos
  const debug = false;
  if (debug) console.log("Total de imágenes preparadas:", imagenes.length);
  
  // Calcular índice anterior y siguiente
  const indiceAnterior = (imagenActiva - 1 + imagenes.length) % imagenes.length;
  const indiceSiguiente = (imagenActiva + 1) % imagenes.length;
  
  // Cambiar a la imagen anterior
  const anteriorImagen = () => {
    setImagenActiva(indiceAnterior);
  };
  
  // Cambiar a la imagen siguiente
  const siguienteImagen = () => {
    setImagenActiva(indiceSiguiente);
  };
  
  // Abrir galería en pantalla completa
  const abrirGaleria = (indice: number) => {
    setImagenActiva(indice);
    setModoGaleria(true);
    document.body.style.overflow = 'hidden';
  };
  
  // Cerrar galería en pantalla completa
  const cerrarGaleria = () => {
    setModoGaleria(false);
    document.body.style.overflow = 'auto';
  };
  
  // Si está cargando y no hay imágenes, mostrar el indicador de carga
  const cargando = (cargandoGaleria || cargandoTipoTour) && imagenes.length <= 1;
  if (cargando) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <Cargador />
      </div>
    );
  }
  
  // Si hay un error y no hay imágenes, mostrar mensaje de error
  const error = (errorGaleria || errorTipoTour) && imagenes.length <= 1;
  if (error) {
    console.error("Error en el componente GaleriaTour:", errorGaleria || errorTipoTour);
    return (
      <div className="h-96 flex items-center justify-center bg-red-50 rounded-lg border border-red-200 p-4">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-red-600">{errorGaleria || errorTipoTour}</p>
          <p className="text-gray-600 mt-2">{t('tour.errorCargaGaleria')}</p>
        </div>
      </div>
    );
  }

  // Si no hay imágenes después de cargar, mostrar un mensaje
  if (imagenes.length === 0) {
    return (
      <div className="h-96 flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="text-gray-600">{t('tour.sinImagenesDisponibles')}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Galería normal */}
      <div className="relative">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 h-96 md:h-[500px]">
          {/* Imagen principal */}
          <div 
            className="md:col-span-8 relative rounded-lg overflow-hidden cursor-pointer"
            onClick={() => abrirGaleria(0)}
          >
            <img 
              src={imagenes[0]} 
              alt={`${nombreTour} - Imagen principal`} 
              className="w-full h-full object-cover"
              loading="eager" // Cargar prioritariamente
            />
            <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
              <div className="bg-black bg-opacity-50 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
              </div>
            </div>
          </div>
          
          {/* Imágenes secundarias */}
          <div className="md:col-span-4 grid grid-cols-2 gap-2">
            {imagenes.slice(1, 5).map((imagen, index) => (
              <div 
                key={index}
                className="relative rounded-lg overflow-hidden cursor-pointer"
                onClick={() => abrirGaleria(index + 1)}
              >
                <img 
                  src={imagen} 
                  alt={`${nombreTour} - Imagen ${index + 2}`} 
                  className="w-full h-full object-cover"
                  loading="lazy" // Cargar cuando sea necesario
                />
                <div className="absolute inset-0 bg-black bg-opacity-20 hover:bg-opacity-30 transition-opacity duration-300 flex items-center justify-center opacity-0 hover:opacity-100">
                  <div className="bg-black bg-opacity-50 p-1 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                    </svg>
                  </div>
                </div>
                
                {/* Mostrar botón de "Ver más" en la última imagen si hay más de 5 imágenes */}
                {index === 3 && imagenes.length > 5 && (
                  <div 
                    className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      abrirGaleria(4);
                    }}
                  >
                    <div className="text-white text-center">
                      <p className="text-xl font-bold">+{imagenes.length - 5}</p>
                      <p className="text-sm">{t('tour.verMasImagenes')}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Galería en pantalla completa */}
      <AnimatePresence>
        {modoGaleria && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col"
          >
            {/* Barra superior */}
            <div className="flex justify-between items-center py-4 px-6 text-white">
              <h2 className="text-xl font-semibold">
                {nombreTour} - {t('tour.imagen')} {imagenActiva + 1} / {imagenes.length}
              </h2>
              <button
                onClick={cerrarGaleria}
                className="p-2 rounded-full hover:bg-gray-800 transition-colors duration-200"
                aria-label={t('general.cerrar')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Contenedor de imagen */}
            <div className="flex-grow flex items-center justify-center relative">
              <AnimatePresence mode="wait">
                <motion.img
                  key={imagenActiva}
                  src={imagenes[imagenActiva]}
                  alt={`${nombreTour} - Imagen ${imagenActiva + 1}`}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              {/* Botones de navegación */}
              <button
                onClick={anteriorImagen}
                className="absolute left-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all duration-200 transform hover:scale-110"
                aria-label={t('general.anterior')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button
                onClick={siguienteImagen}
                className="absolute right-4 p-2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white transition-all duration-200 transform hover:scale-110"
                aria-label={t('general.siguiente')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            
            {/* Miniaturas */}
            <div className="p-4 bg-black bg-opacity-50">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {imagenes.map((imagen, index) => (
                  <button
                    key={index}
                    onClick={() => setImagenActiva(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === imagenActiva ? 'border-blue-500 scale-110' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img 
                      src={imagen} 
                      alt={`Miniatura ${index + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GaleriaTour;