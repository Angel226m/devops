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
            {t('conservacion.titulo', 'Conservación y Responsabilidad Social')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('conservacion.subtitulo', 'En Ocean Tours, creemos que el turismo responsable debe contribuir a la preservación de los ecosistemas marinos y el bienestar de las comunidades locales.')}
          </motion.p>
        </motion.div>

        {/* Sección de iniciativas de conservación */}
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
                <h3 className="text-2xl font-bold mb-2">{t('conservacion.proteccionTitulo', 'Protección de Especies Marinas')}</h3>
                <p className="text-white/90">{t('conservacion.proteccionDescripcion', 'Nuestros tours están diseñados para observar la vida marina sin perturbar su hábitat natural')}</p>
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
                {t('conservacion.iniciativasTitulo', 'Nuestras Iniciativas de Conservación')}
              </h3>
              
              <div className="space-y-4 flex-grow">
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa1Titulo', 'Programa de Limpieza de Playas')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa1Descripcion', 'Organizamos limpiezas mensuales de playas con la participación de voluntarios y nuestro personal, recolectando residuos plásticos y otros desechos.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa2Titulo', 'Educación Ambiental')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa2Descripcion', 'Durante nuestros tours, educamos a los visitantes sobre la importancia de la conservación marina y cómo pueden contribuir a proteger estos ecosistemas frágiles.')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="flex-shrink-0 bg-ocean-100 dark:bg-ocean-700 rounded-full p-2 mr-4 mt-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4 2a2 2 0 00-2 2v11a3 3 0 106 0V4a2 2 0 00-2-2H4zm1 14a1 1 0 100-2 1 1 0 000 2zm5-1.757l4.9-4.9a2 2 0 000-2.828L13.485 5.1a2 2 0 00-2.828 0L10 5.757v8.486zM16 18H9.071l6-6H16a2 2 0 012 2v2a2 2 0 01-2 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa3Titulo', 'Apoyo a Investigaciones')}</h4>
                    <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa3Descripcion', 'Colaboramos con instituciones locales en estudios de monitoreo de poblaciones de aves marinas y mamíferos marinos como lobos marinos y delfines.')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <a href="#unete" className="inline-flex items-center text-ocean-600 dark:text-ocean-300 hover:text-ocean-700 dark:hover:text-ocean-200 font-medium">
                  {t('conservacion.saberMas', 'Saber más sobre nuestras iniciativas')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Sección de impacto social */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={containerVariants}
          className="text-center mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-ocean-600 dark:text-ocean-300 mb-4">
            {t('conservacion.impactoTitulo', 'Impacto Social')}
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            {t('conservacion.impactoSubtitulo', 'Trabajamos estrechamente con las comunidades locales para asegurar que el turismo beneficie directamente a los habitantes de Paracas.')}
          </motion.p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Empleo local" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('conservacion.empleoTitulo', 'Empleo Local')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('conservacion.empleoDescripcion', 'El 90% de nuestro personal son residentes locales. Brindamos capacitación constante y oportunidades de desarrollo profesional.')}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-white dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Educación comunitaria" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('conservacion.educacionTitulo', 'Educación Comunitaria')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('conservacion.educacionDescripcion', 'Ofrecemos programas educativos gratuitos para niños locales sobre conservación marina y turismo sostenible.')}</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-white dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden"
          >
            <div className="h-48 overflow-hidden">
              <img 
                src="https://images.unsplash.com/photo-1593113598332-cd288d649433?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&q=80" 
                alt="Apoyo a artesanos" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">{t('conservacion.artesanosTitulo', 'Apoyo a Artesanos')}</h3>
              <p className="text-gray-600 dark:text-gray-300">{t('conservacion.artesanosDescripcion', 'Promovemos el trabajo de artesanos locales, vendiendo sus productos en nuestras tiendas y brindando espacios para mostrar su arte.')}</p>
            </div>
          </motion.div>
        </div>

        {/* Sección de especies protegidas */}
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
                {t('conservacion.especiesTitulo', 'Especies que Protegemos')}
              </h3>
              <div className="space-y-4 text-white">
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-200">{t('conservacion.pingüinos', 'Pingüinos de Humboldt')}</h4>
                    <p className="text-white/80">{t('conservacion.pingüinosDesc', 'Especie vulnerable que habita en la Reserva Nacional de Paracas')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-200">{t('conservacion.lobos', 'Lobos Marinos')}</h4>
                    <p className="text-white/80">{t('conservacion.lobosDesc', 'Colonias importantes en las Islas Ballestas que monitoreamos constantemente')}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-cyan-300" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-cyan-200">{t('conservacion.delfines', 'Delfines y Ballenas')}</h4>
                    <p className="text-white/80">{t('conservacion.delfinesDesc', 'Respetamos estrictas normas de observación para no perturbar su comportamiento natural')}</p>
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

        {/* Sección de unirse al esfuerzo de conservación */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          id="unete"
          className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 rounded-2xl p-8 md:p-12"
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl md:text-3xl font-bold text-ocean-600 dark:text-ocean-300 mb-4">
              {t('conservacion.uneteTitulo', 'Únete a Nuestros Esfuerzos de Conservación')}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              {t('conservacion.uneteDescripcion', 'Al elegir Ocean Tours, estás contribuyendo directamente a nuestras iniciativas de conservación. También puedes participar activamente en nuestros programas de voluntariado.')}
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <a 
                href="#contacto" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white bg-ocean-600 hover:bg-ocean-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 transition-colors"
              >
                {t('conservacion.contactar', 'Contactar para Voluntariado')}
              </a>
              <a 
                href="/tours" 
                className="inline-flex items-center justify-center px-6 py-3 border border-ocean-600 dark:border-ocean-400 text-base font-medium rounded-full shadow-sm text-ocean-600 dark:text-ocean-300 bg-white dark:bg-transparent hover:bg-ocean-50 dark:hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 transition-colors"
              >
                {t('conservacion.explorarTours', 'Explorar Tours Sostenibles')}
              </a>
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
            {t('conservacion.certificacionesTitulo', 'Nuestras Certificaciones y Alianzas')}
          </motion.h3>
          
          <motion.div variants={itemVariants} className="flex flex-wrap justify-center items-center gap-8">
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="/logos/certificacion-1.png" alt="Certificación Turismo Sostenible" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="/logos/certificacion-2.png" alt="Reserva Nacional de Paracas" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="/logos/certificacion-3.png" alt="WWF" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
            <div className="bg-white dark:bg-blue-800 p-4 rounded-lg shadow-md">
              <img src="/logos/certificacion-4.png" alt="Ministerio del Ambiente" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
            </div>
          </motion.div>
        </motion.div>
      </Contenedor>
    </Seccion>
  );
};

export default ConservacionMarina;