 
 import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import TarjetaTour from './TarjetaTour';
import { RootState, AppDispatch } from '../../../store';
import { listarTiposTour } from '../../../store/slices/sliceTipoTour';
import { TipoTour } from '../../../../dominio/entidades/TipoTour';

interface ListaToursProps {
  cargando?: boolean;
  idSede?: number;
}

const ListaTours = ({ cargando: cargandoProp = false, idSede }: ListaToursProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  
  // Usar el estado de Redux
  const { tiposTour, cargando: cargandoRedux, error } = useSelector((state: RootState) => state.tipoTour);
  
  // Estado para el ordenamiento
  const [ordenamiento, setOrdenamiento] = useState('recomendados');
  
  // Estado para los tours filtrados y ordenados
  const [toursOrdenados, setToursOrdenados] = useState<TipoTour[]>([]);

  // Efecto para cargar los tours desde la API
  useEffect(() => {
    if (!cargandoProp) {
      if (idSede) {
        // Si se proporciona un idSede, cargar los tours por sede
        // En un caso real, aquí usarías listarTiposTourPorSede(idSede)
        dispatch(listarTiposTour());
      } else {
        // Cargar todos los tipos de tour
        dispatch(listarTiposTour());
      }
    }
  }, [dispatch, cargandoProp, idSede]);

  // Efecto para ordenar y filtrar los tours
  useEffect(() => {
    if (tiposTour.length > 0) {
      let toursFiltrados = [...tiposTour];
      
      // Filtrar por sede si es necesario
      if (idSede) {
        toursFiltrados = toursFiltrados.filter(tour => tour.id_sede === idSede);
      }
      
      // Filtrar tours no eliminados
      toursFiltrados = toursFiltrados.filter(tour => !tour.eliminado);
      
      // Ordenar según la selección
      switch (ordenamiento) {
        case 'precioAsc':
          // Asumiendo que hay un campo precio o similar
          // toursFiltrados.sort((a, b) => a.precio - b.precio);
          break;
        case 'precioDesc':
          // toursFiltrados.sort((a, b) => b.precio - a.precio);
          break;
        case 'duracion':
          toursFiltrados.sort((a, b) => a.duracion_minutos - b.duracion_minutos);
          break;
        case 'calificacion':
          // Si tuvieras un campo de calificación
          // toursFiltrados.sort((a, b) => b.calificacion - a.calificacion);
          break;
        default:
          // Por defecto ordenar por nombre
          toursFiltrados.sort((a, b) => a.nombre.localeCompare(b.nombre));
          break;
      }
      
      setToursOrdenados(toursFiltrados);
    }
  }, [tiposTour, ordenamiento, idSede]);

  // Manejador para cambiar el ordenamiento
  const handleOrdenamientoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOrdenamiento(e.target.value);
  };

  // Variantes para animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Si está cargando, mostrar esqueletos
  if (cargandoProp || cargandoRedux) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-60 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-5">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Si hay un error, mostrarlo
  if (error) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {t('comun.error')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {error}
        </p>
      </div>
    );
  }

  // Si no hay tours, mostrar mensaje
  if (toursOrdenados.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {t('tours.noEncontrados')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('tours.intentarOtrosFiltros')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t('tours.resultados', { cantidad: toursOrdenados.length })}
        </h2>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="ordenar" className="text-sm text-gray-600 dark:text-gray-400">
            {t('tours.ordenarPor')}:
          </label>
          <select 
            id="ordenar" 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            value={ordenamiento}
            onChange={handleOrdenamientoChange}
          >
            <option value="recomendados">{t('tours.ordenRecomendados')}</option>
            <option value="precioAsc">{t('tours.ordenPrecioAsc')}</option>
            <option value="precioDesc">{t('tours.ordenPrecioDesc')}</option>
            <option value="calificacion">{t('tours.ordenCalificacion')}</option>
            <option value="duracion">{t('tours.ordenDuracion')}</option>
          </select>
        </div>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {toursOrdenados.map((tour) => (
  <TarjetaTour 
    key={tour.id_tipo_tour} 
    tour={{
      id: tour.id_tipo_tour,
      nombre: tour.nombre,
      descripcion: typeof tour.descripcion === 'object' ? tour.descripcion.String : tour.descripcion,
      precio: 0, // Aquí puedes obtener el precio desde el tipo de pasaje más barato si lo tienes
      duracion: tour.duracion_minutos,
      calificacion: 4.5, // Puedes obtener este dato de otro lugar si lo tienes
      imagen: typeof tour.url_imagen === 'object' ? tour.url_imagen.String : tour.url_imagen || 'https://via.placeholder.com/300x200?text=Sin+Imagen',
      ubicacion: tour.nombre_sede || '' // Usar el nombre de la sede si está disponible
    }} 
  />
))}
      </motion.div>
    </>
  );
};

export default ListaTours;
 
 
 
 
 
 
 /*
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TarjetaTour from './TarjetaTour';

// Tipo para los tours
interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  calificacion: number;
  imagen: string;
  ubicacion: string;
}

interface ListaToursProps {
  cargando?: boolean;
}

const ListaTours = ({ cargando = false }: ListaToursProps) => {
  const { t } = useTranslation();
  const [tours, setTours] = useState<Tour[]>([]);
  
  // Simulación de carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la petición a la API
    if (!cargando) {
      const datos = [
        {
          id: 1,
          nombre: 'Tour Islas Ballestas',
          descripcion: 'Explora la biodiversidad marina de las Islas Ballestas en un recorrido fascinante. Verás lobos marinos, pingüinos y diversas especies de aves.',
          precio: 85,
          duracion: 120,
          calificacion: 4.8,
          imagen: 'https://images.unsplash.com/photo-1558551649-e6b9c8301187',
          ubicacion: 'Pisco, Perú'
        },
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural. Incluye equipo de snorkel y guía especializado.',
          precio: 120,
          duracion: 180,
          calificacion: 4.9,
          imagen: 'https://images.unsplash.com/photo-1564550974352-c7d93c939f53',
          ubicacion: 'Pisco, Perú'
        },
        {
          id: 3,
          nombre: 'Sunset Cruise',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular atardecer. Incluye cóctel de bienvenida y snacks.',
          precio: 95,
          duracion: 150,
          calificacion: 4.7,
          imagen: 'https://images.unsplash.com/photo-1506016476100-de644588c7d0',
          ubicacion: 'Paracas, Perú'
        },
        {
          id: 4,
          nombre: 'Tour de Pesca Deportiva',
          descripcion: 'Aventúrate en el mar con experimentados pescadores locales. Equipo incluido y posibilidad de cocinar tu pesca al final del tour.',
          precio: 150,
          duracion: 240,
          calificacion: 4.6,
          imagen: 'https://images.unsplash.com/photo-1564429097439-923c4855f07e',
          ubicacion: 'Pisco, Perú'
        },
        {
          id: 5,
          nombre: 'Kayak en Bahía Paracas',
          descripcion: 'Recorre la bahía en kayak y descubre hermosos paisajes costeros. Ideal para principiantes y familias.',
          precio: 70,
          duracion: 120,
          calificacion: 4.5,
          imagen: 'https://images.unsplash.com/photo-1545158779-0fbccae25484',
          ubicacion: 'Paracas, Perú'
        },
        {
          id: 6,
          nombre: 'Tour Reserva Nacional de Paracas',
          descripcion: 'Explora uno de los ecosistemas más importantes del Perú, hogar de diversas especies de flora y fauna.',
          precio: 110,
          duracion: 210,
          calificacion: 4.9,
          imagen: 'https://images.unsplash.com/photo-1562095241-8c6714fd4178',
          ubicacion: 'Paracas, Perú'
        }
      ];
      setTours(datos);
    }
  }, [cargando]);

  // Variantes para animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Si está cargando, mostrar esqueletos
  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg animate-pulse">
            <div className="h-60 bg-gray-200 dark:bg-gray-700"></div>
            <div className="p-5">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-4"></div>
              <div className="flex justify-between items-center mb-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
              </div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Si no hay tours, mostrar mensaje
  if (tours.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
          {t('tours.noEncontrados')}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('tours.intentarOtrosFiltros')}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
          {t('tours.resultados', { cantidad: tours.length })}
        </h2>
        
        <div className="flex items-center space-x-2">
          <label htmlFor="ordenar" className="text-sm text-gray-600 dark:text-gray-400">
            {t('tours.ordenarPor')}:
          </label>
          <select 
            id="ordenar" 
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-sm py-1 px-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="recomendados">{t('tours.ordenRecomendados')}</option>
            <option value="precioAsc">{t('tours.ordenPrecioAsc')}</option>
            <option value="precioDesc">{t('tours.ordenPrecioDesc')}</option>
            <option value="calificacion">{t('tours.ordenCalificacion')}</option>
            <option value="duracion">{t('tours.ordenDuracion')}</option>
          </select>
        </div>
      </div>
      
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        {tours.map((tour) => (
          <TarjetaTour key={tour.id} tour={tour} />
        ))}
      </motion.div>
    </>
  );
};

export default ListaTours;*/