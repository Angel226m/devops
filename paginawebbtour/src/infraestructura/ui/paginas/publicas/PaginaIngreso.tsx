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


// PaginaIngreso.tsx (modificado sin className en OceanLogo)
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FormularioIngreso from '../../caracteristicas/autenticacion/FormularioIngreso';
import OceanLogo from '../../componentes/layout/Logo';

const PaginaIngreso = () => {
  window.scrollTo(0, 0);

  const { t } = useTranslation();
  
  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{ 
        backgroundImage: `url('https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/20/6f/e1/ocean-view.jpg?w=1200&h=700&s=1')`,
        backgroundBlendMode: 'overlay',
      }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 to-teal-500/30" />
      
      <div className="relative z-10 max-w-4xl w-full mx-4 grid grid-cols-1 md:grid-cols-2 gap-0 bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Lado Izquierdo: Imagen y Eslogan */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden md:flex flex-col justify-center p-8 bg-gradient-to-b from-teal-600 to-blue-800 text-white"
        >
          <h2 className="text-4xl font-extrabold mb-4">Descubre Pisco con NAYARAK Tours</h2>
          <p className="text-lg opacity-90">"El viaje es la única compra que te hace más rico."</p>
        </motion.div>
        
        {/* Lado Derecho: Formulario */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="p-8 bg-white/20 backdrop-blur-md rounded-3xl md:rounded-l-none"
        >
          <div className="text-center mb-6">
            <div className="flex justify-center mb-4 transition-transform duration-500 hover:rotate-6">
              <OceanLogo /> {/* Ajustado sin className si hay error */}
            </div>
            <h1 className="text-3xl font-extrabold text-white drop-shadow-md">
              {t('ingreso.titulo', 'Iniciar Sesión')}
            </h1>
            <p className="mt-2 text-sm text-white/80">
              {t('ingreso.subtitulo', '¿No tienes una cuenta?')}{' '}
              <Link to="/registrarse" className="font-medium text-teal-300 hover:text-teal-100 transition-colors duration-300">
                {t('ingreso.registrarse', 'Regístrate aquí')}
              </Link>
            </p>
          </div>
          
          <FormularioIngreso />
        </motion.div>
      </div>
      
      <p className="absolute bottom-4 text-center text-xs text-white/70 w-full">
        © {new Date().getFullYear()} NAYARAK TOURS. Todos los derechos reservados.
      </p>
    </div>
  );
};

export default PaginaIngreso;