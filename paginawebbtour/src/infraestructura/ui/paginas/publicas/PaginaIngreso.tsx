import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FormularioIngreso from '../../caracteristicas/autenticacion/FormularioIngreso';
import OceanLogo from '../../componentes/layout/Logo';

const PaginaIngreso = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-cyan-50 via-blue-50 to-white">
      <div className="max-w-md w-full">
        {/* Logo y encabezado */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-6">
            <OceanLogo />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900">
            {t('ingreso.titulo', 'Iniciar Sesión')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('ingreso.subtitulo', '¿No tienes una cuenta?')}{' '}
            <Link to="/registrarse" className="font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-300">
              {t('ingreso.registrarse', 'Regístrate aquí')}
            </Link>
          </p>
        </motion.div>
        
        {/* Formulario */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-cyan-100"
        >
          {/* Componente de formulario */}
          <FormularioIngresoEstilizado />
          
          {/* Opciones adicionales */}
          <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-cyan-600 focus:ring-cyan-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                {t('ingreso.mantenerSesion', 'Mantener sesión activa por 7 días')}
              </label>
            </div>
            
            <div>
              <Link 
                to="/recuperar-contrasena" 
                className="text-sm font-medium text-cyan-600 hover:text-cyan-500 transition-colors duration-300"
              >
                {t('ingreso.olvidasteContrasena', '¿Olvidaste tu contraseña?')}
              </Link>
            </div>
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Ocean Tours. Todos los derechos reservados.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

// Componente de formulario estilizado
const FormularioIngresoEstilizado = () => {
  const { t } = useTranslation();
  
  return (
    <form className="space-y-6" action="#" method="POST">
      {/* Campo de correo electrónico */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          {t('formulario.correoElectronico', 'Correo Electrónico')}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
          </div>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
            placeholder={t('formulario.correoPlaceholder', 'correo@ejemplo.com')}
          />
        </div>
      </div>

      {/* Campo de contraseña */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          {t('formulario.contrasena', 'Contraseña')}
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
            placeholder="••••••"
          />
        </div>
      </div>

      {/* Botón de ingreso */}
      <div>
        <button
          type="submit"
          className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-cyan-600 to-blue-500 hover:from-cyan-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-300 shadow-md hover:shadow-lg"
        >
          <span className="absolute left-0 inset-y-0 flex items-center pl-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-cyan-100 group-hover:text-white transition-colors duration-300" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          </span>
          {t('ingreso.botonIngresar', 'Iniciar Sesión')}
        </button>
      </div>
    </form>
  );
};

export default PaginaIngreso;
/*import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import FormularioIngreso from '../../caracteristicas/autenticacion/FormularioIngreso';

const PaginaIngreso = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 via-white to-secondary-50">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-bold">
              <span className="text-primary-600">Ocean</span><span className="text-gray-800">Tours</span>
            </h2>
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('ingreso.titulo')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('ingreso.subtitulo')}{' '}
            <Link to="/registrarse" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300">
              {t('ingreso.registrarse')}
            </Link>
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-4 shadow-md sm:rounded-lg sm:px-10 border border-primary-100"
        >
          <FormularioIngreso />
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  {t('ingreso.proximamente')}
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div>
                <button
                  disabled
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-400 cursor-not-allowed opacity-70"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              <div>
                <button
                  disabled
                  className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-400 cursor-not-allowed opacity-70"
                >
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.09.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.605-3.369-1.343-3.369-1.343-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.268 2.75 1.026A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.026 2.747-1.026.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.841-2.337 4.687-4.565 4.934.359.31.678.92.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.577.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  {t('ingreso.mantenerSesion')}
                </label>
              </div>
              
              <div className="text-sm">
                <Link to="/recuperar-contrasena" className="font-medium text-primary-600 hover:text-primary-500 transition-colors duration-300">
                  {t('ingreso.olvidasteContrasena')}
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center text-xs text-gray-500">
            <p>{t('ingreso.infoSesion')}</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PaginaIngreso;*/