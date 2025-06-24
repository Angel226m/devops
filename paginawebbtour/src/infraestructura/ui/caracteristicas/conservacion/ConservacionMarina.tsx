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
            {t('conservacion.titulo', 'Conservación y Protección Marina')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('conservacion.subtitulo', 'En Ocean Tours, implementamos protocolos rigurosos para preservar el ecosistema marino de Paracas y las Islas Ballestas, controlando el impacto de nuestras visitas y protegiendo la fauna local.')}
          </motion.p>
        </motion.div>

        {/* Sección de especies protegidas - DESTACADA */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="bg-gradient-to-br from-blue-600 to-ocean-600 dark:from-blue-800 dark:to-ocean-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {t('conservacion.pingüinosTitulo', 'Pingüinos de Humboldt')}
                </h3>
                <div className="text-white/90 space-y-4">
                  <p>{t('conservacion.pingüinosDesc1', 'El pingüino de Humboldt (Spheniscus humboldti) es una especie vulnerable que habita en las costas de Perú y Chile. En la Reserva Nacional de Paracas, alberga importantes colonias de anidación que protegemos rigurosamente.')}</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('conservacion.pingüinosProtocoloTitulo', 'Protocolos de Protección:')}</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>{t('conservacion.pingüinosProtocolo1', 'Mantenemos una distancia mínima de 50 metros de las colonias')}</li>
                      <li>{t('conservacion.pingüinosProtocolo2', 'Reducimos la velocidad y el ruido de motores al acercarnos a sus zonas')}</li>
                      <li>{t('conservacion.pingüinosProtocolo3', 'Evitamos visitas durante períodos críticos de reproducción')}</li>
                      <li>{t('conservacion.pingüinosProtocolo4', 'Monitoreamos constantemente las poblaciones para detectar cambios')}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80">
                <img 
                  src="https://images.unsplash.com/photo-1563515020427-bd3037558d99?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Pingüinos de Humboldt" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="bg-gradient-to-br from-ocean-600 to-cyan-600 dark:from-ocean-800 dark:to-cyan-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {t('conservacion.lobosTitulo', 'Lobos Marinos Sudamericanos')}
                </h3>
                <div className="text-white/90 space-y-4">
                  <p>{t('conservacion.lobosDesc1', 'Los lobos marinos (Otaria flavescens) forman grandes colonias en las Islas Ballestas. Estas colonias son vitales para el ecosistema marino y constituyen uno de los principales atractivos de la reserva.')}</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('conservacion.lobosProtocoloTitulo', 'Protocolos de Protección:')}</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>{t('conservacion.lobosProtocolo1', 'Mantenemos una distancia mínima de 30 metros de las colonias')}</li>
                      <li>{t('conservacion.lobosProtocolo2', 'Limitamos el tiempo de observación a un máximo de 15 minutos por grupo')}</li>
                      <li>{t('conservacion.lobosProtocolo3', 'Prohibimos cualquier intento de alimentación o interacción directa')}</li>
                      <li>{t('conservacion.lobosProtocolo4', 'Evitamos interrumpir sus comportamientos naturales de reproducción y descanso')}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80">
                <img 
                  src="https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Lobos Marinos Sudamericanos" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
            <motion.div 
              initial={{ x: -50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="bg-gradient-to-br from-cyan-600 to-teal-600 dark:from-cyan-800 dark:to-teal-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {t('conservacion.delfinesTitulo', 'Delfines y Cetáceos')}
                </h3>
                <div className="text-white/90 space-y-4">
                  <p>{t('conservacion.delfinesDesc1', 'Varias especies de delfines, incluyendo el delfín nariz de botella (Tursiops truncatus) y el delfín oscuro (Lagenorhynchus obscurus), habitan las aguas de la Reserva Nacional de Paracas, así como ballenas en temporadas migratorias.')}</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('conservacion.delfinesProtocoloTitulo', 'Protocolos de Protección:')}</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>{t('conservacion.delfinesProtocolo1', 'Nunca perseguimos a los delfines, permitiendo que ellos decidan el nivel de interacción')}</li>
                      <li>{t('conservacion.delfinesProtocolo2', 'Mantenemos velocidad constante y predecible al avistarlos')}</li>
                      <li>{t('conservacion.delfinesProtocolo3', 'Limitamos el tiempo de observación a 20 minutos por grupo')}</li>
                      <li>{t('conservacion.delfinesProtocolo4', 'Evitamos acercarnos a madres con crías y grupos en alimentación')}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80">
                <img 
                  src="https://images.unsplash.com/photo-1607153333879-c174d265f1d2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Delfines" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="bg-gradient-to-br from-teal-600 to-green-600 dark:from-teal-800 dark:to-green-800 rounded-2xl overflow-hidden shadow-2xl"
            >
              <div className="p-8 md:p-10">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {t('conservacion.avesTitulo', 'Aves Marinas')}
                </h3>
                <div className="text-white/90 space-y-4">
                  <p>{t('conservacion.avesDesc1', 'Las Islas Ballestas albergan una increíble diversidad de aves marinas, incluyendo pelícanos peruanos, cormoranes, piqueros, gaviotas y el famoso guanay. Estas aves son fundamentales para el ecosistema y la producción de guano.')}</p>
                  
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                    <h4 className="text-xl font-semibold text-cyan-200 mb-2">{t('conservacion.avesProtocoloTitulo', 'Protocolos de Protección:')}</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>{t('conservacion.avesProtocolo1', 'Mantenemos motores en neutro cuando estamos cerca de aves que pescan o descansan')}</li>
                      <li>{t('conservacion.avesProtocolo2', 'Evitamos acercarnos a acantilados de anidación durante la temporada reproductiva')}</li>
                      <li>{t('conservacion.avesProtocolo3', 'Prohibimos cualquier ruido fuerte que pueda causar abandono de nidos')}</li>
                      <li>{t('conservacion.avesProtocolo4', 'Nunca circunnavegamos completamente las islas para evitar ahuyentar a las aves')}</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="h-64 md:h-80">
                <img 
                  src="https://images.unsplash.com/photo-1621856342476-d7ac978acb63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Aves Marinas" 
                  className="w-full h-full object-cover"
                />
              </div>
            </motion.div>
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
              {t('conservacion.protocolosTitulo', 'Control de Visitas y Protección del Ecosistema')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              {t('conservacion.protocolosDesc', 'Implementamos estrictas medidas para regular el acceso a zonas sensibles y minimizar nuestro impacto en el ecosistema marino de Paracas.')}
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
                {t('conservacion.protocolo1Titulo', 'Horarios Controlados')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo1Desc', 'Operamos exclusivamente en horarios específicos (7:00-10:00 AM y 2:00-4:00 PM) respetando los ciclos naturales de alimentación y descanso de la fauna. Esto reduce la presión sobre el ecosistema al limitar la presencia humana a periodos determinados.')}
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
                {t('conservacion.protocolo2Titulo', 'Control de Aforo')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo2Desc', 'Limitamos cada embarcación a un máximo de 25 visitantes y controlamos el número total de embarcaciones diarias para evitar la saturación. Este sistema de cuotas permite que el ecosistema se recupere entre visitas y reduce el estrés sobre la fauna.')}
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
                {t('conservacion.protocolo3Desc', 'Respetamos las zonas de exclusión establecidas por las autoridades ambientales y creamos perímetros adicionales durante temporadas críticas. Las zonas sensibles como áreas de reproducción y anidación están completamente vetadas para las embarcaciones turísticas.')}
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
                {t('conservacion.protocolo4Titulo', 'Navegación Controlada')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo4Desc', 'Nuestras embarcaciones siguen rutas predefinidas con velocidad controlada y limitada. Utilizamos motores de baja emisión sonora y mantenemos una velocidad máxima de 8 nudos en la reserva para minimizar el impacto acústico y la contaminación.')}
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
                {t('conservacion.protocolo5Titulo', 'Visitantes por Guía')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo5Desc', 'Mantenemos un máximo de 12 visitantes por guía para garantizar mejor control y monitoreo. Esta proporción permite asegurar que todos los visitantes respeten las normas de observación y distancias mínimas, reduciendo el riesgo de comportamientos inapropiados.')}
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
                {t('conservacion.protocolo6Titulo', 'Cero Residuos')}
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                {t('conservacion.protocolo6Desc', 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones. Está absolutamente prohibido arrojar cualquier tipo de residuo al mar, y disponemos de sistemas de contención y recolección para todos los desechos generados durante el recorrido.')}
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
                {t('conservacion.resultadosTitulo', 'Resultados de Nuestras Medidas de Protección')}
              </h3>
              <p className="text-blue-100 max-w-3xl mx-auto">
                {t('conservacion.resultadosSubtitulo', 'El control de aforo y nuestros protocolos de navegación han generado resultados medibles en la conservación del ecosistema marino.')}
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

        {/* Tecnología para conservación */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-white dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden mb-16"
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            <div className="lg:col-span-3 p-8 md:p-12">
              <h3 className="text-2xl md:text-3xl font-bold text-ocean-600 dark:text-ocean-300 mb-6">
                {t('conservacion.tecnologiaTitulo', 'Tecnología al Servicio de la Conservación')}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t('conservacion.tecnologiaDesc', 'Utilizamos tecnología avanzada para monitorear el ecosistema y garantizar el cumplimiento de nuestros protocolos de protección:')}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-ocean-50 dark:bg-blue-700 rounded-xl p-5">
                  <h4 className="font-bold text-ocean-600 dark:text-ocean-300 mb-2">
                    {t('conservacion.tecnologia1Titulo', 'GPS y Seguimiento de Rutas')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t('conservacion.tecnologia1Desc', 'Todas nuestras embarcaciones están equipadas con GPS que monitorean la velocidad y aseguran que se respeten las rutas establecidas y las zonas de exclusión.')}
                  </p>
                </div>
                
                <div className="bg-ocean-50 dark:bg-blue-700 rounded-xl p-5">
                  <h4 className="font-bold text-ocean-600 dark:text-ocean-300 mb-2">
                    {t('conservacion.tecnologia2Titulo', 'Sensores Acústicos')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t('conservacion.tecnologia2Desc', 'Monitoreamos los niveles de ruido de nuestras embarcaciones para garantizar que se mantengan por debajo de los umbrales que podrían afectar a la fauna marina.')}
                  </p>
                </div>
                
                <div className="bg-ocean-50 dark:bg-blue-700 rounded-xl p-5">
                  <h4 className="font-bold text-ocean-600 dark:text-ocean-300 mb-2">
                    {t('conservacion.tecnologia3Titulo', 'Motores de Bajo Impacto')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t('conservacion.tecnologia3Desc', 'Nuestras embarcaciones utilizan motores de última generación con tecnología de reducción de emisiones y baja huella acústica.')}
                  </p>
                </div>
                
                <div className="bg-ocean-50 dark:bg-blue-700 rounded-xl p-5">
                  <h4 className="font-bold text-ocean-600 dark:text-ocean-300 mb-2">
                    {t('conservacion.tecnologia4Titulo', 'Sistema de Registro Digital')}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300 text-sm">
                    {t('conservacion.tecnologia4Desc', 'Documentamos cada avistamiento de especies importantes para contribuir a la base de datos científica sobre poblaciones y comportamiento de la fauna marina.')}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 h-full">
              <img 
                src="https://images.unsplash.com/photo-1587930508275-3a869c8f0ac3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                alt="Tecnología de conservación" 
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