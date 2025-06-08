 
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import Boton from '../../componentes/comunes/Boton';
import Entrada from '../../componentes/comunes/Entrada';
import Alerta from '../../componentes/comunes/Alerta';

const PaginaRecuperacion = () => {
  const { t } = useTranslation();
  const [correo, setCorreo] = useState('');
  const [enviado, setEnviado] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!correo.trim()) {
      setError(t('recuperacion.correoRequerido'));
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(correo)) {
      setError(t('recuperacion.correoInvalido'));
      return;
    }
    
    setCargando(true);
    setError('');
    
    try {
      // En un caso real, aquí se haría la petición a la API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEnviado(true);
    } catch (err) {
      setError(t('recuperacion.errorEnvio'));
    } finally {
      setCargando(false);
    }
  };

  return (
    <Seccion className="py-16">
      <div className="max-w-md mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8"
        >
          {enviado ? (
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t('recuperacion.correoEnviado')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('recuperacion.instrucciones')}
              </p>
              <div className="flex flex-col space-y-4">
                <Boton 
                  texto={t('recuperacion.volverInicio')}
                  variante="primary"
                  tamano="lg"
                  ancho="full"
                  ruta="/inicio"
                />
                <button
                  type="button"
                  onClick={() => setEnviado(false)}
                  className="text-primary-600 hover:text-primary-500 text-sm font-medium"
                >
                  {t('recuperacion.intentarOtroCorreo')}
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {t('recuperacion.titulo')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('recuperacion.descripcion')}
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
                  label={t('recuperacion.correo')}
                  type="email"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  required
                />
                
                <Boton
                  type="submit"
                  texto={t('recuperacion.enviarInstrucciones')}
                  variante="primary"
                  tamano="lg"
                  ancho="full"
                  cargando={cargando}
                />
              </form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {t('recuperacion.recordaste')}{' '}
                  <Link to="/ingresar" className="font-medium text-primary-600 hover:text-primary-500">
                    {t('recuperacion.volverLogin')}
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

export default PaginaRecuperacion;