import React from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import Contenedor from '../../componentes/layout/Contenedor';

const ConservacionMarina: React.FC = () => {
  const { t } = useTranslation();
  
  // Animaciones para elementos
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6 }
    }
  };

  return (
    <Seccion className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900 dark:to-blue-800">
      <Contenedor>
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-ocean-600 dark:text-ocean-300 mb-4">
            {t('conservacion.titulo', 'Conservación y Responsabilidad Marina')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('conservacion.subtitulo', 'En Ocean Tours, implementamos medidas estrictas para proteger el ecosistema marino de Paracas y las Islas Ballestas, garantizando que el turismo sea sostenible y respetuoso con la naturaleza.')}
          </motion.p>
        </motion.div>

        {/* Sección de control de aforo y preservación */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-2xl overflow-hidden shadow-xl h-full">
              <img 
                src="https://images.unsplash.com/photo-1582967788606-a171c1080cb0?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Conservación marina" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{t('conservacion.proteccionTitulo', 'Control de Aforo y Visitas')}</h3>
                <p className="text-white/90">{t('conservacion.proteccionDescripcion', 'Limitamos el número de embarcaciones y visitantes diarios a las Islas Ballestas para minimizar el impacto en el ecosistema y la fauna marina.')}</p>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="bg-white dark:bg-blue-800 rounded-2xl shadow-xl p-8 h-full flex flex-col">
              <h3 className="text-2xl font-bold text-ocean-600 dark:text-ocean-300 mb-4">
                {t('conservacion.iniciativasTitulo', 'Nuestras Medidas de Conservación')}
              </h3>
              
              <div className="space-y-4 flex-grow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa1Titulo', 'Control Estricto de Embarcaciones')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa1Descripcion', 'Operamos con un número limitado de embarcaciones por día y con horarios escalonados para reducir la presencia humana simultánea en áreas sensibles del ecosistema marino.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa2Titulo', 'Navegación Responsable')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa2Descripcion', 'Nuestras embarcaciones utilizan motores de baja emisión y siguen rutas preestablecidas para minimizar la perturbación de hábitats marinos y el ruido que puede afectar a la fauna local.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa3Titulo', 'Cero Residuos')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa3Descripcion', 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones, con sistemas de gestión de residuos que garantizan que nada se arroje al mar durante los recorridos.')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <a href="#protocolos" className="inline-flex items-center text-ocean-600 dark:text-ocean-300 hover:text-ocean-700 dark:hover:text-ocean-200 font-medium">
                  {t('conservacion.saberMas', 'Conocer más sobre nuestros protocolos de conservación')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sección de especies protegidas - MEJORADA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-ocean-600 dark:bg-ocean-800 rounded-2xl overflow-hidden shadow-2xl mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                {t('conservacion.especiesTitulo', 'Protegiendo la Fauna Marina')}
              </h3>
              <div className="space-y-6 text-white">
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-200">{t('conservacion.pingüinos', 'Pingüinos de Humboldt')}</h4>
                    <p className="text-white/90">{t('conservacion.pingüinosDesc', 'Mantenemos una distancia mínima de 50 metros de las colonias de pingüinos para no alterar sus patrones de alimentación y reproducción. Nuestras embarcaciones reducen la velocidad al aproximarse a sus zonas de anidación.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-200">{t('conservacion.lobos', 'Lobos Marinos Sudamericanos')}</h4>
                    <p className="text-white/90">{t('conservacion.lobosDesc', 'Evitamos acercarnos a menos de 30 metros de las colonias de lobos marinos y regulamos el tiempo de observación a máximo 15 minutos por grupo para minimizar el estrés. Prohibimos cualquier intento de alimentación o interacción directa con estos animales.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-200">{t('conservacion.delfines', 'Delfines y Aves Marinas')}</h4>
                    <p className="text-white/90">{t('conservacion.delfinesDesc', 'Nunca perseguimos a los delfines cuando aparecen cerca de nuestras embarcaciones, permitiendo que sean ellos quienes decidan el nivel de interacción. Mantenemos motores en neutro cuando estamos en presencia de aves marinas que están pescando o descansando en el agua.')}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:h-auto">
              <img 
                src="https://images.unsplash.com/photo-1564452217659-5ea8fc34fe9b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Fauna marina protegida" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Protocolos de conservación */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          id="protocolos"
          className="mb-16"
        >
          <div className="text-center mb-10">
            <h3 className="text-2xl md:text-3xl font-bold text-ocean-600 dark:text-ocean-300 mb-4">
              {t('conservacion.protocolosTitulo', 'Protocolos Estrictos de Conservación')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('conservacion.protocolosDesc', 'Implementamos reglas claras y estrictas para todas nuestras operaciones con el fin de proteger el ecosistema marino.')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-white dark:bg-blue-800 rounded-xl shadow-lg p-6"
            >
              <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t('conservacion.protocolo1Titulo', 'Horarios Limitados')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo1Desc', 'Solo operamos tours en horarios específicos (7:00-10:00 AM y 2:00-4:00 PM) para minimizar la perturbación a los ciclos naturales de alimentación y descanso de la fauna marina.')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white dark:bg-blue-800 rounded-xl shadow-lg p-6"
            >
              <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t('conservacion.protocolo2Titulo', 'Límite de Visitantes')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo2Desc', 'Cada embarcación tiene un límite máximo de 25 pasajeros, y controlamos el número total de visitantes diarios a las islas para evitar la saturación del ecosistema.')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white dark:bg-blue-800 rounded-xl shadow-lg p-6"
            >
              <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t('conservacion.protocolo3Titulo', 'Zonas Restringidas')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo3Desc', 'Respetamos estrictamente las zonas de exclusión establecidas por las autoridades ambientales, especialmente durante las temporadas de reproducción de pingüinos y lobos marinos.')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white dark:bg-blue-800 rounded-xl shadow-lg p-6"
            >
              <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t('conservacion.protocolo4Titulo', 'Capacitación Obligatoria')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo4Desc', 'Todos nuestros capitanes y tripulación reciben capacitación obligatoria en protocolos de conservación marina y técnicas de navegación de bajo impacto antes de operar nuestras embarcaciones.')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white dark:bg-blue-800 rounded-xl shadow-lg p-6"
            >
              <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t('conservacion.protocolo5Titulo', 'Grupos Pequeños')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo5Desc', 'Organizamos grupos pequeños con un máximo de 12 visitantes por guía para garantizar un mejor control y minimizar el impacto acústico y visual sobre la fauna.')}
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-white dark:bg-blue-800 rounded-xl shadow-lg p-6"
            >
              <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {t('conservacion.protocolo6Titulo', 'Monitoreo Constante')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo6Desc', 'Registramos diariamente las condiciones del ecosistema y el comportamiento de la fauna para detectar cualquier cambio que pudiera indicar un impacto negativo del turismo y ajustar nuestras prácticas en consecuencia.')}
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Resultados tangibles */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-800 dark:to-cyan-800 rounded-xl overflow-hidden shadow-xl mb-16"
        >
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                {t('conservacion.resultadosTitulo', 'Impacto de Nuestras Medidas de Conservación')}
              </h3>
              <p className="text-blue-100 max-w-3xl mx-auto">
                {t('conservacion.resultadosSubtitulo', 'Nuestros esfuerzos por controlar el aforo y preservar el ecosistema marino han generado resultados medibles y positivos.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">+5.000</div>
                <p className="text-blue-100">
                  {t('conservacion.cifras1', 'Kg de residuos plásticos evitados en el ecosistema marino gracias a nuestros protocolos de gestión de residuos')}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">15%</div>
                <p className="text-blue-100">
                  {t('conservacion.cifras2', 'Reducción en el número de embarcaciones que acceden diariamente a zonas sensibles de las Islas Ballestas')}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">+20%</div>
                <p className="text-blue-100">
                  {t('conservacion.cifras3', 'Aumento en la población de pingüinos de Humboldt en la reserva desde que implementamos nuestros protocolos de conservación')}
                </p>
              </motion.div>
              
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
              >
                <div className="text-4xl font-bold text-white mb-2">0</div>
                <p className="text-blue-100">
                  {t('conservacion.cifras4', 'Incidentes de perturbación significativa a colonias de fauna marina en los últimos 3 años de operación')}
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Impacto en la comunidad local */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <div className="p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-ocean-600 dark:text-ocean-300 mb-6">
                {t('conservacion.comunidadTitulo', 'Beneficios para la Comunidad Local')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('conservacion.comunidadDesc', 'Nuestro modelo de turismo sostenible beneficia directamente a los habitantes de Paracas, creando un incentivo económico para la conservación del ecosistema marino.')}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('conservacion.comunidad1', 'El 85% de nuestro personal son residentes locales, incluidos capitanes, guías y personal administrativo.')}
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('conservacion.comunidad2', 'Compramos productos y servicios a proveedores locales, fortaleciendo la economía de Paracas.')}
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('conservacion.comunidad3', 'Nuestros visitantes gastan en hospedaje, alimentación y otros servicios locales, generando ingresos para toda la comunidad.')}
                  </p>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">
                    {t('conservacion.comunidad4', 'Capacitamos constantemente a nuestro personal local, mejorando sus habilidades y oportunidades laborales.')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="h-full">
              <img 
                src="https://images.unsplash.com/photo-1596662977545-627c4a975d3a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Comunidad local" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </motion.div>

        {/* Sección de certificaciones y alianzas */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="mt-16 text-center"
        >
          <motion.h3 variants={itemVariants} className="text-2xl font-bold text-ocean-600 dark:text-ocean-300 mb-8">
            {t('conservacion.certificacionesTitulo', 'Certificaciones y Reconocimientos')}
          </motion.h3>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-8">
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="https://via.placeholder.com/150x50?text=Certificación" alt="Certificación Turismo Sostenible" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="https://via.placeholder.com/150x50?text=Reserva" alt="Reserva Nacional de Paracas" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="https://via.placeholder.com/150x50?text=WWF" alt="WWF" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="https://via.placeholder.com/150x50?text=Ministerio" alt="Ministerio del Ambiente" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </motion.div>
        </motion.div>
      </Contenedor>
    </Seccion>
  );
};

export default ConservacionMarina;