/*import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

// Interfaces
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

interface TarjetaTourProps {
  tour: Tour;
}

const TarjetaTour = ({ tour }: TarjetaTourProps) => {
  const { t } = useTranslation();
  
  // Variantes para animaciones
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Formateador de precio
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Formateador de duración
  const formatearDuracion = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
    }
    return `${minutosRestantes}min`;
  };

  return (
    <motion.div 
      variants={item}
      className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/tours/${tour.id}`} className="block overflow-hidden h-60 relative">
        <img 
          src={tour.imagen} 
          alt={tour.nombre} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          onError={(e) => {
            // Si la imagen falla, usar una imagen de respaldo
            const target = e.target as HTMLImageElement;
            target.src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
          }}
        />
        {tour.ubicacion && (
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm border border-sky-100 rounded-full px-3 py-1 text-xs text-sky-700 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tour.ubicacion}
          </div>
        )}
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <Link to={`/tours/${tour.id}`} className="group">
          <h3 className="text-lg font-semibold text-sky-800 mb-2 group-hover:text-cyan-600 transition-colors">
            {tour.nombre}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {tour.descripcion}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium text-sky-700">
              {tour.calificacion.toFixed(1)}
            </span>
          </div>
          
          <div className="text-sm text-sky-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatearDuracion(tour.duracion)}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          {tour.precio > 0 ? (
            <div>
              <span className="text-xs text-sky-600">{t('tours.desde')}</span>
              <p className="text-lg font-bold text-cyan-600">
                {formatearPrecio(tour.precio)}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-xs text-sky-600">{t('tours.consultar')}</span>
            </div>
          )}
          
          <Link 
            to={`/tours/${tour.id}`} 
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            {t('tours.verDetalles')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TarjetaTour;
 */


import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useState } from 'react';

// Interfaces
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

interface TarjetaTourProps {
  tour: Tour;
}

const TarjetaTour = ({ tour }: TarjetaTourProps) => {
  const { t } = useTranslation();
  const [imagenError, setImagenError] = useState(false);
  
  // Variantes para animaciones
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  // Formateador de precio
  const formatearPrecio = (precio: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0
    }).format(precio);
  };

  // Formateador de duración
  const formatearDuracion = (minutos: number) => {
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h${minutosRestantes > 0 ? ` ${minutosRestantes}min` : ''}`;
    }
    return `${minutosRestantes}min`;
  };

  return (
    <motion.div 
      variants={item}
      className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col"
    >
      <Link to={`/tours/${tour.id}`} className="block overflow-hidden h-60 relative">
        {imagenError ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-200 via-sky-200 to-cyan-200 flex items-center justify-center">
            <div className="text-sky-700 opacity-50 font-medium">
              {tour.nombre}
            </div>
          </div>
        ) : (
          <img 
            src={tour.imagen} 
            alt={tour.nombre} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={() => setImagenError(true)}
          />
        )}
        
        {tour.ubicacion && (
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm border border-sky-100 rounded-full px-3 py-1 text-xs text-sky-700 flex items-center shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {tour.ubicacion}
          </div>
        )}
      </Link>

      <div className="p-5 flex-grow flex flex-col">
        <Link to={`/tours/${tour.id}`} className="group">
          <h3 className="text-lg font-semibold text-sky-800 mb-2 group-hover:text-cyan-600 transition-colors">
            {tour.nombre}
          </h3>
        </Link>
        
        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
          {tour.descripcion}
        </p>
        
        <div className="flex justify-between items-center mt-auto">
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-amber-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <span className="ml-1 text-sm font-medium text-sky-700">
              {tour.calificacion.toFixed(1)}
            </span>
          </div>
          
          <div className="text-sm text-sky-700 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {formatearDuracion(tour.duracion)}
          </div>
        </div>
        
        <div className="mt-4 flex items-center justify-between">
          {tour.precio > 0 ? (
            <div>
              <span className="text-xs text-sky-600">{t('tours.desde')}</span>
              <p className="text-lg font-bold text-cyan-600">
                {formatearPrecio(tour.precio)}
              </p>
            </div>
          ) : (
            <div>
              <span className="text-xs text-sky-600">{t('tours.consultar')}</span>
            </div>
          )}
          
          <Link 
            to={`/tours/${tour.id}`} 
            className="px-4 py-2 bg-gradient-to-r from-sky-500 to-cyan-500 hover:from-sky-600 hover:to-cyan-600 text-white text-sm font-medium rounded-lg transition-colors shadow-sm hover:shadow-md"
          >
            {t('tours.verDetalles')}
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default TarjetaTour;