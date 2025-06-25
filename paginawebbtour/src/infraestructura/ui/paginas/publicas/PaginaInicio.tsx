 
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import Hero from '../../caracteristicas/inicio/Hero';
import ToursDestacados from '../../caracteristicas/inicio/ToursDestacados';
import Testimonios from '../../caracteristicas/inicio/Testimonios';
import Socios from '../../caracteristicas/inicio/Socios';
import SuscripcionBoletin from '../../caracteristicas/inicio/SuscripcionBoletin';

const PaginaInicio = () => {
      window.scrollTo(0, 0);

  const { t } = useTranslation();
  
  // Configuración de animaciones
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  // Modificar esta parte en PaginaInicio.tsx
const item = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0, 
    transition: {
      duration: 0.7,
      ease: [0.6, 0.05, 0.01, 0.9] // Corregir valor
    }
  }
};
  return (
    <div>
      {/* Hero Section */}
      <Hero />
      
     {/* Tours Destacados */}
<Seccion className="py-16">
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    variants={container}
    className="text-center mb-12"
  >
    <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-black dark:text-black mb-4">
      {t('inicio.toursDestacados')}
    </motion.h2>
    <motion.p variants={item} className="max-w-2xl mx-auto text-black dark:text-black">
      {t('inicio.toursDestacadosDescripcion')}
    </motion.p>
  </motion.div>
  
  <ToursDestacados />
  
  <motion.div 
    variants={item}
    initial="hidden"
    whileInView="show"
    viewport={{ once: true }}
    className="text-center mt-10"
  >
    <Link 
      to="/tours" 
      className="inline-block px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full transition-colors duration-300 shadow-md hover:shadow-lg"
    >
      {t('inicio.verTodosTours')}
    </Link>
  </motion.div>
</Seccion>

      
      {/* Sección Por qué elegirnos */}
      <Seccion className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="text-center mb-12"
        >
          <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('inicio.porQueElegirnos')}
          </motion.h2>
          <motion.p variants={item} className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            {t('inicio.porQueElegirnosDescripcion')}
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-500 dark:text-ocean-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('inicio.seguridad')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('inicio.seguridadDescripcion')}</p>
          </motion.div>
          
          <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-500 dark:text-ocean-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('inicio.calidad')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('inicio.calidadDescripcion')}</p>
          </motion.div>
          
          <motion.div variants={item} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="w-12 h-12 bg-ocean-100 dark:bg-ocean-900/30 text-ocean-500 dark:text-ocean-400 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{t('inicio.experiencia')}</h3>
            <p className="text-gray-600 dark:text-gray-400">{t('inicio.experienciaDescripcion')}</p>
          </motion.div>
        </motion.div>
      </Seccion>
      
{/* Testimonios */}
<Seccion className="py-16">
  <motion.div
    initial="hidden"
    whileInView="show"
    viewport={{ once: true, amount: 0.3 }}
    variants={container}
    className="text-center mb-12"
  >
    <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-black dark:text-black mb-4">
      {t('inicio.testimonios')}
    </motion.h2>
    <motion.p variants={item} className="max-w-2xl mx-auto text-black dark:text-black">
      {t('inicio.testimoniosDescripcion')}
    </motion.p>
  </motion.div>
  
  <Testimonios />
</Seccion>

      
      {/* Socios */}
      <Seccion className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          variants={container}
          className="text-center mb-12"
        >
          <motion.h2 variants={item} className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
            {t('inicio.socios')}
          </motion.h2>
          <motion.p variants={item} className="max-w-2xl mx-auto text-gray-600 dark:text-gray-400">
            {t('inicio.sociosDescripcion')}
          </motion.p>
        </motion.div>
        
        <Socios />
      </Seccion>
      
      {/* Suscripción Boletín */}
      <SuscripcionBoletin />
    </div>
  );
};

export default PaginaInicio;