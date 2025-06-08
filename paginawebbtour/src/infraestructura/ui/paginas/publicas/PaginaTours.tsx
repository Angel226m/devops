 
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import ListaTours from '../../caracteristicas/tour/ListaTours';
import FiltrosTour from '../../caracteristicas/tour/FiltrosTour';

const PaginaTours = () => {
  const { t } = useTranslation();
  const [cargando, setCargando] = useState(true);
  
  // Simulación de carga
  useEffect(() => {
    const timer = setTimeout(() => {
      setCargando(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div>
      {/* Cabecera */}
      <div className="relative h-64 md:h-80 bg-ocean-600 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1582902281015-d64db4d2f356?q=80')",
            opacity: 0.3
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-ocean-900/70 to-ocean-700/90" />
        
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('tours.titulo')}</h1>
            <p className="text-lg text-ocean-100 max-w-2xl mx-auto">
              {t('tours.descripcion')}
            </p>
          </motion.div>
        </div>
        
        {/* Ola decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" className="w-full">
            <path 
              fill="#fff" 
              fillOpacity="1" 
              d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,48C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
            />
          </svg>
        </div>
      </div>
      
      {/* Contenido principal */}
      <Seccion className="py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filtros laterales */}
          <div className="lg:col-span-1">
            <FiltrosTour />
          </div>
          
          {/* Lista de tours */}
          <div className="lg:col-span-3">
            <ListaTours cargando={cargando} />
          </div>
        </div>
      </Seccion>
    </div>
  );
};

export default PaginaTours;