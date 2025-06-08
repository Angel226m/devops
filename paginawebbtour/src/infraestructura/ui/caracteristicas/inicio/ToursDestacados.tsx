 /*
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TarjetaTour from '../tour/TarjetaTour';

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

const ToursDestacados = () => {
  const { t } = useTranslation();
  const [toursDestacados, setToursDestacados] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);

  // Simulación de carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la petición a la API
    setTimeout(() => {
      const tours = [
        {
          id: 1,
          nombre: 'Tour Islas Ballestas',
          descripcion: 'Explora la biodiversidad marina de las Islas Ballestas en un recorrido fascinante.',
          precio: 85,
          duracion: 120,
          calificacion: 4.8,
          imagen: 'https://images.unsplash.com/photo-1558551649-e6b9c8301187',
          ubicacion: 'Pisco, Perú'
        },
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
        }
      ];
      setToursDestacados(tours);
      setCargando(false);
    }, 1000);
  }, []);

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

  return (
    <div>
      {cargando ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {toursDestacados.map((tour) => (
            <TarjetaTour key={tour.id} tour={tour} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ToursDestacados;*/

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import TarjetaTour from '../tour/TarjetaTour';

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

const ToursDestacados = () => {
  const { t } = useTranslation();
  const [toursDestacados, setToursDestacados] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);

  // Simulación de carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la petición a la API
    setTimeout(() => {
      const tours = [
        {
          id: 1,
          nombre: 'Tour Islas Ballestas',
          descripcion: 'Explora la biodiversidad marina de las Islas Ballestas en un recorrido fascinante.',
          precio: 85,
          duracion: 120,
          calificacion: 4.8,
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS15JOc50DomJmq0AntFvwpy1qvFh6kg8ymgg&s',
          ubicacion: 'Pisco, Perú'
        },
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural.',
          precio: 120,
          duracion: 180,
          calificacion: 4.9,
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQogtw3YshZWPizQln-4TIYewkeNPRdQsLo7w&s',
          ubicacion: 'Pisco, Perú'
        },
        {
          id: 3,
          nombre: 'Avistamiento de Ballenas',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular avistamiento de ballenas.',
           precio: 95,
          duracion: 150,
          calificacion: 4.7,
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYWyX23c4h3Q1Q29hkZ-_cFA6vqIRbcI096w&s',
          ubicacion: 'Paracas, Perú'
        }
      ];
      setToursDestacados(tours);
      setCargando(false);
    }, 1000);
  }, []);

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

  return (
    <div className="bg-blue-50">
      {cargando ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse flex space-x-4">
            <div className="flex-1 space-y-4 py-1">
              <div className="h-60 bg-blue-200 dark:bg-blue-700 rounded"></div>
              <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded"></div>
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-60 bg-blue-200 dark:bg-blue-700 rounded"></div>
              <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded"></div>
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
              </div>
            </div>
            <div className="flex-1 space-y-4 py-1">
              <div className="h-60 bg-blue-200 dark:bg-blue-700 rounded"></div>
              <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-3/4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded"></div>
                <div className="h-4 bg-blue-200 dark:bg-blue-700 rounded w-5/6"></div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-3 gap-8 p-4 text-blue-900"
        >
          {toursDestacados.map((tour) => (
            <TarjetaTour key={tour.id} tour={tour} />
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default ToursDestacados;