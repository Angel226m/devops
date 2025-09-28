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

export default ToursDestacados;*/
 
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Tipo para los tours (sin calificación)
interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  imagen: string;
  ubicacion: string;
}

const TarjetaTour = ({ tour }: { tour: Tour }) => {
  const { t } = useTranslation();

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        show: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
      }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
      aria-label={`Tour ${tour.nombre}`}
    >
      <div className="relative">
        <img
          src={tour.imagen}
          alt={tour.nombre}
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-0 left-0 bg-indigo-600 text-white text-xs font-semibold px-3 py-1 rounded-br-lg">
          {tour.ubicacion}
        </div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-bold text-gray-800 truncate">{tour.nombre}</h3>
        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{tour.descripcion}</p>
        <div className="mt-3 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-700">
              Duración: {tour.duracion} min
            </p>
            <p className="text-lg font-bold text-indigo-600">
              S/ {tour.precio.toFixed(2)}
            </p>
          </div>
          <Link
            to={`/tours/${tour.id}`}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-all duration-300"
            aria-label={`Explorar ${tour.nombre}`}
          >
            Explorar
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

const ToursDestacados = () => {
  const { t } = useTranslation();
  const [toursDestacados, setToursDestacados] = useState<Tour[]>([]);
  const [cargando, setCargando] = useState(true);

  // Simulación de carga de datos
  useEffect(() => {
    setTimeout(() => {
      const tours = [
        {
          id: 1,
          nombre: 'Tour Islas Ballestas',
          descripcion: 'Explora la biodiversidad marina de las Islas Ballestas en un recorrido fascinante.',
          precio: 85,
          duracion: 120,
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS15JOc50DomJmq0AntFvwpy1qvFh6kg8ymgg&s',
          ubicacion: 'Pisco, Perú',
        },
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural.',
          precio: 120,
          duracion: 180,
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQogtw3YshZWPizQln-4TIYewkeNPRdQsLo7w&s',
          ubicacion: 'Pisco, Perú',
        },
        {
          id: 3,
          nombre: 'Avistamiento de Ballenas',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular avistamiento de ballenas.',
          precio: 95,
          duracion: 150,
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYWyX23c4h3Q1Q29hkZ-_cFA6vqIRbcI096w&s',
          ubicacion: 'Paracas, Perú',
        },
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
        staggerChildren: 0.2,
      },
    },
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl font-bold text-gray-800">
            {t('tours.destacados', 'Tours Destacados')}
          </h2>
          <p className="text-gray-600 mt-2">
            {t('tours.descripcion', 'Descubre las mejores experiencias para tu próxima aventura')}
          </p>
        </motion.div>

        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-48 bg-blue-200 rounded-2xl"></div>
                <div className="mt-4 space-y-3">
                  <div className="h-4 bg-blue-200 rounded w-3/4"></div>
                  <div className="h-4 bg-blue-200 rounded w-5/6"></div>
                  <div className="h-4 bg-blue-200 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {toursDestacados.map((tour) => (
              <TarjetaTour key={tour.id} tour={tour} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ToursDestacados;
 