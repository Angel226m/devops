import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import BarraNavegacion from './BarraNavegacion';
import PiePagina from '../componentes/layout/PiePagina';
import { useEffect } from 'react';

const LayoutPrincipal = () => {
  // Efecto para desplazarse al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
      <BarraNavegacion />
      
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <PiePagina />
    </div>
  );
};

export default LayoutPrincipal;


/*import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import BarraNavegacion from './BarraNavegacion';
import PiePagina from '../componentes/layout/PiePagina';
import { useEffect } from 'react';

const LayoutPrincipal = () => {
  // Efecto para desplazarse al inicio al cambiar de página
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
//cambiar si sin dark <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-blue-50 to-teal-50 dark:from-gray-900 dark:to-gray-800">
      <BarraNavegacion />
      
      <motion.main 
        className="flex-grow"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <Outlet />
      </motion.main>
      
      <PiePagina />
    </div>
  );
};

export default LayoutPrincipal;*/
