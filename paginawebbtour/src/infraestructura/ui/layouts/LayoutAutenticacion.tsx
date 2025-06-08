 
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import Logo from '../componentes/layout/Logo';
import CambiadorIdioma from '../componentes/navegacion/CambiadorIdioma';
import { useTranslation } from 'react-i18next';

const LayoutAutenticacion = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-ocean-50 to-ocean-100 flex flex-col">
      <div className="fixed top-4 right-4 z-10">
        <CambiadorIdioma />
      </div>
      
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden w-full max-w-md">
          <div className="p-4 bg-primary-500 text-white flex justify-center">
            <Logo tamano="md" />
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="p-6"
          >
            <Outlet />
          </motion.div>
          
          <div className="p-4 text-center text-sm text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-700">
            {t('auth.footer', 'Nautical Tours © 2025. Todos los derechos reservados.')}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayoutAutenticacion;