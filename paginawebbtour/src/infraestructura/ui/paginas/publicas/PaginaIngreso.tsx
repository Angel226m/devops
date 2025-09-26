 /*

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FormularioIngreso from '../../caracteristicas/autenticacion/FormularioIngreso';
import OceanLogo from '../../componentes/layout/Logo';

const PaginaIngreso = () => {
      window.scrollTo(0, 0);

  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="flex justify-center mb-4">
            <OceanLogo />
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900">
            {t('ingreso.titulo', 'Iniciar Sesión')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('ingreso.subtitulo', '¿No tienes una cuenta?')}{' '}
            <Link to="/registrarse" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">
              {t('ingreso.registrarse', 'Regístrate aquí')}
            </Link>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-6 sm:px-10 shadow-lg sm:rounded-xl border border-blue-100"
        >
          <FormularioIngreso />
          
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  {t('ingreso.mantenerSesion', 'Mantener sesión activa por 7 días')}
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <Link to="/recuperar-contrasena" className="block w-full text-center text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">
              {t('ingreso.olvidasteContrasena', '¿Olvidaste tu contraseña?')}
            </Link>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} NAYARAK TOURS. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaginaIngreso;*/
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FormularioIngreso from '../../caracteristicas/autenticacion/FormularioIngreso';
import OceanLogo from '../../componentes/layout/Logo';

const PaginaIngreso = () => {
  window.scrollTo(0, 0);

  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-100 via-cyan-50 to-teal-100">
      <div className="max-w-md w-full space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          // PaginaIngreso.tsx (alternativa con estilos en el contenedor)
<div className="flex justify-center mb-4 transition-transform duration-300 hover:scale-105">
  <OceanLogo />
</div>
          <h1 className="mt-4 text-3xl font-extrabold text-gray-900 tracking-wide">
            {t('ingreso.titulo', 'Iniciar Sesión')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('ingreso.subtitulo', '¿No tienes una cuenta?')}{' '}
            <Link to="/registrarse" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-300">
              {t('ingreso.registrarse', 'Regístrate aquí')}
            </Link>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-6 px-6 sm:px-8 shadow-xl rounded-2xl border border-blue-100 transition-shadow duration-300 hover:shadow-2xl"
        >
          <FormularioIngreso />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p className="text-center text-xs text-gray-500 mt-4">
            © {new Date().getFullYear()} NAYARAK TOURS. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default PaginaIngreso;