import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import Boton from '../../componentes/comunes/Boton';
import Entrada from '../../componentes/comunes/Entrada';
import Alerta from '../../componentes/comunes/Alerta';
// Importar directamente desde axios si clientePublico no está disponible
import axios from 'axios';

// Función para obtener la URL base
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://reservas.angelproyect.com/api/v1';
  }
  return '/api/v1';
};

const PaginaCambioContrasena = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [tokenValido, setTokenValido] = useState<boolean | null>(null);
  const [tipoEntidad, setTipoEntidad] = useState<string | null>(null);
  const [completado, setCompletado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [validandoToken, setValidandoToken] = useState(true);

  useEffect(() => {
    // Validar el token al cargar la página
    const validarToken = async () => {
      if (!token) {
        setTokenValido(false);
        setValidandoToken(false);
        return;
      }

      try {
        const response = await axios.get(`${getBaseURL()}/auth/validar-token?token=${token}`);
        setTokenValido(true);
        // Guardar el tipo de entidad para redireccionar correctamente después
        if (response.data && response.data.data) {
          setTipoEntidad(response.data.data.tipo_entidad);
        }
      } catch (err) {
        setTokenValido(false);
        setError(t('cambioContrasena.tokenInvalido'));
      } finally {
        setValidandoToken(false);
      }
    };

    validarToken();
  }, [token, t]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (nuevaContrasena.length < 6) {
      setError(t('cambioContrasena.contrasenaCorta'));
      return;
    }
    
    if (nuevaContrasena !== confirmarContrasena) {
      setError(t('cambioContrasena.contrasenaNoCoincide'));
      return;
    }
    
    setCargando(true);
    setError('');
    
    try {
      await axios.post(`${getBaseURL()}/auth/cambiar-contrasena`, {
        token,
        nueva_contrasena: nuevaContrasena,
        confirmar_contrasena: confirmarContrasena
      });
      
      setCompletado(true);
    } catch (err: any) {
      console.error('Error al cambiar contraseña:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError(t('cambioContrasena.errorCambio'));
      }
    } finally {
      setCargando(false);
    }
  };

  const handleVolver = () => {
    if (tipoEntidad === 'USUARIO') {
      navigate('/admin/ingresar');
    } else {
      navigate('/ingresar');
    }
  };

  if (validandoToken) {
    return (
      <Seccion className="py-16 bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 min-h-screen">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center">
            <div className="animate-pulse flex justify-center py-8">
              <div className="h-12 w-12 rounded-full bg-blue-200"></div>
            </div>
            <p className="text-gray-600">{t('cambioContrasena.validandoToken')}</p>
          </div>
        </div>
      </Seccion>
    );
  }

  if (tokenValido === false) {
    return (
      <Seccion className="py-16 bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 min-h-screen">
        <div className="max-w-md mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-8 border border-blue-100 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t('cambioContrasena.tokenInvalido')}
            </h2>
            <p className="text-gray-600 mb-6">
              {t('cambioContrasena.tokenExpirado')}
            </p>
            <Boton 
              texto={t('cambioContrasena.solicitarNuevoEnlace')}
              variante="primary"
              tamano="lg"
              ancho="full"
              ruta="/recuperar-contrasena"
              className="bg-blue-600 hover:bg-blue-700"
            />
          </motion.div>
        </div>
      </Seccion>
    );
  }

  return (
    <Seccion className="py-16 bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 min-h-screen">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-blue-100"
        >
          {completado ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-cyan-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('cambioContrasena.exitoso')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('cambioContrasena.puedeIniciarSesion')}
              </p>
              <Boton 
                texto={t('cambioContrasena.iniciarSesion')}
                variante="primary"
                tamano="lg"
                ancho="full"
                onClick={handleVolver}
                className="bg-blue-600 hover:bg-blue-700"
              />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {t('cambioContrasena.titulo')}
              </h2>
              <p className="text-gray-600 mb-6">
                {t('cambioContrasena.descripcion')}
              </p>
              
              {error && (
                <Alerta 
                  tipo="error" 
                  mensaje={error} 
                  className="mb-4"
                  onCerrar={() => setError('')}
                />
              )}
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <Entrada
                  label={t('cambioContrasena.nuevaContrasena')}
                  type="password"
                  value={nuevaContrasena}
                  onChange={(e) => setNuevaContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                
                <Entrada
                  label={t('cambioContrasena.confirmarContrasena')}
                  type="password"
                  value={confirmarContrasena}
                  onChange={(e) => setConfirmarContrasena(e.target.value)}
                  placeholder="••••••••"
                  required
                />
                
                <Boton
                  type="submit"
                  texto={t('cambioContrasena.cambiarContrasena')}
                  variante="primary"
                  tamano="lg"
                  ancho="full"
                  cargando={cargando}
                  className="bg-blue-600 hover:bg-blue-700"
                />
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  {t('cambioContrasena.recordaste')}{' '}
                  <Link to="/ingresar" className="font-medium text-blue-600 hover:text-blue-500">
                    {t('cambioContrasena.volverLogin')}
                  </Link>
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>
    </Seccion>
  );
};

export default PaginaCambioContrasena;