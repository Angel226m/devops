 

import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { iniciarSesion } from '../../../store/slices/sliceAutenticacion';
import { LoginClienteRequest } from '../../../../dominio/entidades/Cliente';
import { AppDispatch } from '../../../store';
import { motion } from 'framer-motion';

const FormularioIngreso = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const [formData, setFormData] = useState({
    correo: '',
    contrasena: '',
    recordarme: false
  });
  const [mostrarContrasena, setMostrarContrasena] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Limpiar el error cuando el usuario comienza a escribir
    if (error) {
      setError(null);
    }
  };
  
  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    
    try {
      // Preparar datos para la autenticación
      const credenciales: LoginClienteRequest = {
        correo: formData.correo,
        contrasena: formData.contrasena,
        recordarme: formData.recordarme // Si está marcado, mantener sesión por 7 días
      };
      
      // Llamar a la acción de iniciar sesión
      await dispatch(iniciarSesion(credenciales)).unwrap();
      
      // Redirigir al usuario a la página principal
      navigate('/');
    } catch (error: any) {
      // Mostrar mensaje de error apropiado
      console.error('Error al iniciar sesión:', error);
      
      // Determinar el tipo de error
      if (error.message && error.message.toLowerCase().includes('correo')) {
        setError('El correo electrónico no está registrado');
      } else if (error.message && error.message.toLowerCase().includes('contraseña')) {
        setError('La contraseña es incorrecta');
      } else {
        setError(error.message || 'Error al iniciar sesión. Por favor, intente nuevamente.');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-auto"
    >
      <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
        Iniciar Sesión
      </h2>

      {error && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md text-sm mb-6"
        >
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p>{error}</p>
            </div>
          </div>
        </motion.div>
      )}
      
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="correo" className="block text-sm font-medium text-gray-700">
            Correo Electrónico
          </label>
          <div className="mt-1">
            <input
              id="correo"
              name="correo"
              type="email"
              autoComplete="email"
              required
              value={formData.correo}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="correo@ejemplo.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">
              Contraseña
            </label>
            <div className="text-sm">
              <Link to="/recuperar-contrasena" className="font-medium text-blue-600 hover:text-blue-500">
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          </div>
          <div className="mt-1 relative">
            <input
              id="contrasena"
              name="contrasena"
              type={mostrarContrasena ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={formData.contrasena}
              onChange={handleChange}
              className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm pr-10"
              placeholder="••••••"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              onClick={() => setMostrarContrasena(!mostrarContrasena)}
            >
              {mostrarContrasena ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="recordarme"
            name="recordarme"
            type="checkbox"
            checked={formData.recordarme}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="recordarme" className="ml-2 block text-sm text-gray-700">
            Mantener sesión activa por 7 días
          </label>
        </div>
        <p className="text-xs text-gray-500 -mt-4 ml-6">
          {formData.recordarme 
            ? 'Su sesión se mantendrá activa durante 7 días.' 
            : 'Su sesión expirará después de 1 hora de inactividad.'}
        </p>

        <div>
          <button
            type="submit"
            disabled={cargando}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-300 ${
              cargando ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {cargando ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Iniciando sesión...
              </div>
            ) : 'Iniciar Sesión'}
          </button>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 text-center">
          ¿No tienes una cuenta?{' '}
          <Link to="/registrarse" className="font-medium text-blue-600 hover:text-blue-500">
            Regístrate aquí
          </Link>
        </p>
        
        {/* Mensaje informativo para la demo - quítalo en producción */}
        <div className="mt-4 rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1 md:flex md:justify-between">
              <p className="text-sm text-blue-700">
                Para propósitos de demo, use: <strong>cliente@gmail.com</strong> / <strong>cliente</strong>
              </p>
            </div>
          </div>
        </div>
      </form>
    </motion.div>
  );
};

export default FormularioIngreso;