 
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

export default ToursDestacados; */
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

// Tipo para los tours
interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
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
      className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 hover:shadow-xl transition-all duration-300"
      aria-label={`Tour ${tour.nombre}`}
    >
      <div className="relative">
        <img
          src={tour.imagen}
          alt={tour.nombre}
          className="w-full h-52 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
          {tour.ubicacion}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-ocean-600 truncate">{tour.nombre}</h3>
        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tour.descripcion}</p>
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
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS15JOc50DomJmq0AntFvwpy1qvFh6kg8ymgg&s',
          ubicacion: 'Pisco, Perú',
        },
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural.',
          imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQogtw3YshZWPizQln-4TIYewkeNPRdQsLo7w&s',
          ubicacion: 'Pisco, Perú',
        },
        {
          id: 3,
          nombre: 'Avistamiento de Ballenas',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular avistamiento de ballenas.',
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
    <div className="py-8 px-4 sm:px-6 lg:px-8 bg-transparent">
      <div className="max-w-7xl mx-auto">
        {cargando ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="animate-pulse">
                <div className="h-52 bg-ocean-100 rounded-2xl"></div>
                <div className="mt-3 space-y-2">
                  <div className="h-4 bg-ocean-100 rounded w-3/4"></div>
                  <div className="h-4 bg-ocean-100 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
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