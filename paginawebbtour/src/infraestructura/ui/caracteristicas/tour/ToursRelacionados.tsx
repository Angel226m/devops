 
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

interface ToursRelacionadosProps {
  idTourActual: number;
}

const ToursRelacionados = ({ idTourActual }: ToursRelacionadosProps) => {
  const { t } = useTranslation();
  const [toursRelacionados, setToursRelacionados] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Simulación de carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la petición a la API
    setTimeout(() => {
      const tours = [
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural.',
          precio: 120,
          duracion: 180,
          calificacion: 4.9,
          imagen: 'https://images.unsplash.com/photo-1564550974352-c7d93c939f53',
          ubicacion: 'Pisco, Perú'
        },
        {
          id: 3,
          nombre: 'Sunset Cruise',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular atardecer.',
          precio: 95,
          duracion: 150,
          calificacion: 4.7,
          imagen: 'https://images.unsplash.com/photo-1506016476100-de644588c7d0',
          ubicacion: 'Paracas, Perú'
        },
        {
          id: 4,
          nombre: 'Tour de Pesca Deportiva',
          descripcion: 'Aventúrate en el mar con experimentados pescadores locales.',
          precio: 150,
          duracion: 240,
          calificacion: 4.6,
          imagen: 'https://images.unsplash.com/photo-1564429097439-923c4855f07e',
          ubicacion: 'Pisco, Perú'
        }
      ];
      
      // Filtrar el tour actual
      const toursFiltrados = tours.filter(tour => tour.id !== idTourActual);
      setToursRelacionados(toursFiltrados);
      setCargando(false);
    }, 1500);
  }, [idTourActual]);
  
  // Variantes para animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Si está cargando, mostrar esqueletos
  if (cargando) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[...Array(3)].map((_, index) => (
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
  
  // Si no hay tours relacionados
  if (toursRelacionados.length === 0) {
    return (
      <div className="text-center text-gray-600 dark:text-gray-400 py-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-lg">{t('tour.noToursRelacionados')}</p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-3 gap-8"
    >
      {toursRelacionados.map((tour) => (
        <TarjetaTour key={tour.id} tour={tour} />
      ))}
    </motion.div>
  );
};

export default ToursRelacionados;