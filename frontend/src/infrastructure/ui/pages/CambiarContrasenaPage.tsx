import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { axiosClient } from '../../api/axiosClient';
import { endpoints } from '../../api/endpoints';

const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};

const CambiarContrasenaPage: React.FC = () => {
  const { t } = useTranslation();
  const query = useQuery();
  const navigate = useNavigate();
  const token = query.get('token');

  const [validando, setValidando] = useState(true);
  const [tokenValido, setTokenValido] = useState(false);
  const [tipoEntidad, setTipoEntidad] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Validar el token cuando el componente se monta
  useEffect(() => {
    const validarToken = async () => {
      if (!token) {
        setError('Token no proporcionado');
        setValidando(false);
        return;
      }

      try {
        const response = await axiosClient.get(`${endpoints.auth.validarToken}?token=${token}`);
        setTokenValido(true);
        setTipoEntidad(response.data.data.tipo_entidad);
      } catch (err: any) {
        console.error('Error al validar token:', err);
        setError(err.response?.data?.message || 'Token inválido o expirado');
      } finally {
        setValidando(false);
      }
    };

    validarToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (contrasena !== confirmarContrasena) {
      setPasswordError('Las contraseñas no coinciden');
      return;
    }
    
    // Validar longitud mínima
    if (contrasena.length < 6) {
      setPasswordError('La contraseña debe tener al menos 6 caracteres');
      return;
    }
    
    setPasswordError(null);
    setLoading(true);
    
    try {
      await axiosClient.post(endpoints.auth.cambiarContrasena, {
        token,
        contrasena_nueva: contrasena
      });
      
      setSuccess(true);
      
      // Redirigir al login después de unos segundos
      setTimeout(() => {
        const redirectUrl = tipoEntidad === 'USUARIO' 
          ? '/login'  // URL para usuarios administrativos
          : '/cliente/login';  // URL para clientes
        
        navigate(redirectUrl);
      }, 3000);
      
    } catch (err: any) {
      console.error('Error al cambiar contraseña:', err);
      setError(err.response?.data?.message || 'Error al actualizar contraseña');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 via-white to-cyan-50">
      <div className="max-w-md w-full space-y-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <Link to="/" className="inline-block">
            <h2 className="text-3xl font-bold">
              <span className="text-blue-600">Ocean</span><span className="text-gray-800">Tours</span>
            </h2>
          </Link>
          <h1 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t('recuperacion.cambiarContrasena', 'Cambiar contraseña')}
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            {t('recuperacion.subtituloCambio', 'Crea una nueva contraseña segura')}
          </p>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-blue-100"
        >
          {validando ? (
            <div className="flex justify-center py-6">
              <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span className="ml-3 text-lg text-gray-700">{t('recuperacion.validandoToken', 'Validando token...')}</span>
            </div>
          ) : tokenValido && !success ? (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  {t('recuperacion.nuevaContrasena', 'Nueva contraseña')}
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
                    autoComplete="new-password"
                    required
                    value={contrasena}
                    onChange={(e) => setContrasena(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  {t('recuperacion.requisitosContrasena', 'La contraseña debe tener al menos 6 caracteres')}
                </p>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                  {t('recuperacion.confirmarContrasena', 'Confirmar contraseña')}
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    id="confirm-password"
                    name="confirm-password"
                    type="password"
                    autoComplete="new-password"
                    required
                    value={confirmarContrasena}
                    onChange={(e) => setConfirmarContrasena(e.target.value)}
                    className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 py-3 sm:text-sm border-gray-300 rounded-md"
                  />
                </div>
              </div>

              {passwordError && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{passwordError}</p>
                    </div>
                  </div>
                </div>
              )}

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70"
                >
                  {loading ? (
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                      <svg className="h-5 w-5 text-blue-500 group-hover:text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                    </span>
                  )}
                  {t('recuperacion.guardarContrasena', 'Guardar contraseña')}
                </button>
              </div>
            </form>
          ) : success ? (
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                {t('recuperacion.contrasenaActualizada', 'Contraseña actualizada')}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {t('recuperacion.redirigiendo', 'Tu contraseña ha sido actualizada correctamente. Serás redirigido al inicio de sesión en unos segundos.')}
              </p>
              <div className="mt-6">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  {t('recuperacion.irAlLogin', 'Ir al inicio de sesión')}
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center py-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="mt-3 text-lg font-medium text-gray-900">
                {t('recuperacion.tokenInvalido', 'Enlace inválido o expirado')}
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                {error || t('recuperacion.solicitarNuevo', 'El enlace para restablecer tu contraseña es inválido o ha expirado.')}
              </p>
              <div className="mt-6">
                <Link
                  to="/recuperar-contrasena"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  {t('recuperacion.solicitarNuevoEnlace', 'Solicitar un nuevo enlace')}
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default CambiarContrasenaPage;