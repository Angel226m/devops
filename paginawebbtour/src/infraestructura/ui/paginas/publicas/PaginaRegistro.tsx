import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Seccion from '../../componentes/layout/Seccion';
import FormularioRegistro from '../../caracteristicas/autenticacion/FormularioRegistro';

const PaginaRegistro = () => {
  const { t } = useTranslation();

  return (
    <Seccion className="py-16 bg-gradient-to-b from-primary-50 via-primary-100/30 to-secondary-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex-1 bg-white/70 backdrop-blur-sm p-8 rounded-2xl shadow-md border border-primary-100"
          >
            <div className="max-w-md">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {t('registro.titulo')}
              </h1>
              <p className="text-lg text-gray-700 mb-8">
                {t('registro.descripcion')}
              </p>
              
              <div className="space-y-6">
                <div className="flex items-center space-x-4 bg-primary-50 p-4 rounded-xl border border-primary-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('registro.beneficio1Titulo')}
                    </h3>
                    <p className="text-gray-700">
                      {t('registro.beneficio1Descripcion')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-secondary-50 p-4 rounded-xl border border-secondary-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary-100 flex items-center justify-center text-secondary-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('registro.beneficio2Titulo')}
                    </h3>
                    <p className="text-gray-700">
                      {t('registro.beneficio2Descripcion')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 bg-accent-50 p-4 rounded-xl border border-accent-100">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-accent-100 flex items-center justify-center text-accent-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {t('registro.beneficio3Titulo')}
                    </h3>
                    <p className="text-gray-700">
                      {t('registro.beneficio3Descripcion')}
                    </p>
                    <p className="mt-2 text-sm font-medium text-accent-600">
                      {t('registro.sesionDuracion')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex-1 flex justify-center items-start"
          >
            <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-8 border border-primary-200">
              <div className="bg-gradient-to-r from-primary-50 to-secondary-50 p-6 rounded-lg mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">
                  {t('registro.formularioTitulo')}
                </h2>
                <p className="text-center text-sm text-gray-600">
                  {t('registro.requeridoParaReservas')}
                </p>
              </div>
              <FormularioRegistro />
            </div>
          </motion.div>
        </div>
      </div>
    </Seccion>
  );
};

export default PaginaRegistro;