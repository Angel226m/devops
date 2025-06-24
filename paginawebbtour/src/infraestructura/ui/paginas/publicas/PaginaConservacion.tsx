import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';

const PaginaConservacion = () => {
  const { t } = useTranslation();
  
  // Animaciones
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  // Estado para el formulario de voluntariado
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    interes: 'limpieza',
    mensaje: ''
  });
  
  const [enviando, setEnviando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Manejar cambios en el formulario
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);
    
    // Simulación de envío
    setTimeout(() => {
      setEnviando(false);
      setEnviado(true);
      
      // Resetear formulario
      setFormData({
        nombre: '',
        email: '',
        telefono: '',
        interes: 'limpieza',
        mensaje: ''
      });
      
      // Resetear mensaje después de 5 segundos
      setTimeout(() => {
        setEnviado(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div>
      {/* Cabecera */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
            opacity: 0.3
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/30 to-teal-800/30 backdrop-blur-sm" />
        
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-shadow-lg">
              {t('conservacion.titulo', 'Conservación Marina y Compromiso Social')}
            </h1>
            <p className="text-lg text-white max-w-2xl mx-auto text-shadow">
              {t('conservacion.subtitulo', 'Descubre cómo Ocean Tours contribuye a la preservación del ecosistema marino y al bienestar de la comunidad local')}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Sección principal */}
      <Seccion className="py-16 bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('conservacion.iniciativasTitulo', 'Nuestras Iniciativas de Conservación')}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t('conservacion.iniciativasSubtitulo', 'En Ocean Tours, creemos que el turismo responsable debe contribuir a la preservación de los ecosistemas marinos y el bienestar de las comunidades locales.')}
            </p>
          </motion.div>

          {/* Iniciativas de conservación */}
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
              <div className="bg-white/90 dark:bg-blue-800 rounded-2xl shadow-xl p-8 h-full flex flex-col">
                <h3 className="text-2xl font-bold text-teal-600 dark:text-teal-300 mb-4">
                  {t('conservacion.iniciativasTitulo', 'Nuestras Iniciativas de Conservación')}
                </h3>
                
                <div className="space-y-4 flex-grow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-700 rounded-full p-2 mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa1Titulo', 'Programa de Limpieza de Playas')}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa1Descripcion', 'Organizamos limpiezas mensuales de playas con la participación de voluntarios y nuestro personal, recolectando residuos plásticos y otros desechos.')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-700 rounded-full p-2 mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 dark:text-white">{t('conservacion.iniciativa2Titulo', 'Educación Ambiental')}</h4>
                      <p className="text-gray-600 dark:text-gray-300">{t('conservacion.iniciativa2Descripcion', 'Durante nuestros tours, educamos a los visitantes sobre la importancia de la conservación marina y cómo pueden contribuir a proteger estos ecosistemas frágiles.')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 bg-teal-100 dark:bg-teal-700 rounded-full p-2 mr-4 mt-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-teal-600 dark:text-teal-300" viewBox="0 0 20 20" fill="currentColor">
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
                  <a href="#unete" className="inline-flex items-center text-teal-600 dark:text-teal-300 hover:text-teal-700 dark:hover:text-teal-200 font-medium">
                    {t('conservacion.saberMas', 'Saber más sobre nuestras iniciativas')}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Impacto social */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('conservacion.impactoTitulo', 'Impacto Social')}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t('conservacion.impactoSubtitulo', 'Trabajamos estrechamente con las comunidades locales para asegurar que el turismo beneficie directamente a los habitantes de Paracas.')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <motion.div 
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/90 dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden"
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
              className="bg-white/90 dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden"
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
              className="bg-white/90 dark:bg-blue-800 rounded-xl shadow-lg overflow-hidden"
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

          {/* Especies protegidas */}
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-teal-600 dark:bg-teal-800 rounded-2xl overflow-hidden shadow-2xl mb-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {t('conservacion.especiesTitulo', 'Especies que Protegemos')}
                </h3>
                <div className="space-y-4 text-white">
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5.5 16a3.5 3.5 0 01-.369-6.98 4 4 0 117.753-1.977A4.5 4.5 0 1113.5 16h-8z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-teal-200">{t('conservacion.pingüinos', 'Pingüinos de Humboldt')}</h4>
                      <p className="text-white/80">{t('conservacion.pingüinosDesc', 'Especie vulnerable que habita en la Reserva Nacional de Paracas')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-teal-200">{t('conservacion.lobos', 'Lobos Marinos')}</h4>
                      <p className="text-white/80">{t('conservacion.lobosDesc', 'Colonias importantes en las Islas Ballestas que monitoreamos constantemente')}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-300" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-semibold text-teal-200">{t('conservacion.delfines', 'Delfines y Ballenas')}</h4>
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

          {/* Nuestro impacto en cifras */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              {t('conservacion.cifrasTitulo', 'Nuestro Impacto en Cifras')}
            </h2>
            <p className="text-lg text-gray-700 max-w-3xl mx-auto">
              {t('conservacion.cifrasSubtitulo', 'Resultados tangibles de nuestro compromiso con la conservación')}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-teal-50 to-blue-50 p-6 rounded-xl shadow-sm border border-teal-100 text-center"
            >
              <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">+5.000</div>
              <p className="text-sm text-gray-600">
                {t('conservacion.cifras1', 'Kg de residuos recolectados en playas')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-xl shadow-sm border border-blue-100 text-center"
            >
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">+1.200</div>
              <p className="text-sm text-gray-600">
                {t('conservacion.cifras2', 'Niños educados en conservación marina')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-gradient-to-br from-cyan-50 to-teal-50 p-6 rounded-xl shadow-sm border border-cyan-100 text-center"
            >
              <div className="w-16 h-16 bg-cyan-100 text-cyan-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">+50</div>
              <p className="text-sm text-gray-600">
                {t('conservacion.cifras3', 'Familias locales beneficiadas')}
              </p>
            </motion.div>

            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gradient-to-br from-teal-50 to-emerald-50 p-6 rounded-xl shadow-sm border border-teal-100 text-center"
            >
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="text-3xl font-bold text-gray-800 mb-1">15%</div>
              <p className="text-sm text-gray-600">
                {t('conservacion.cifras4', 'De nuestros ingresos destinados a conservación')}
              </p>
            </motion.div>
          </div>

          {/* Unirse a nuestros esfuerzos de conservación */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            id="unete"
            className="bg-gradient-to-r from-cyan-50 to-blue-50 dark:from-cyan-900 dark:to-blue-900 rounded-2xl p-8 md:p-12 mb-16"
          >
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">
                  {t('conservacion.uneteTitulo', 'Únete a Nuestros Esfuerzos de Conservación')}
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {t('conservacion.uneteDescripcion', 'Al elegir Ocean Tours, estás contribuyendo directamente a nuestras iniciativas de conservación. También puedes participar activamente en nuestros programas de voluntariado.')}
                </p>
              </div>
              
              {/* Formulario de voluntariado */}
              <div className="bg-white/90 rounded-xl shadow-md p-6 border border-blue-100">
                <h4 className="text-xl font-semibold text-gray-800 mb-4">
                  {t('conservacion.formTitulo', 'Formulario de Voluntariado')}
                </h4>
                
                {/* Mensajes de éxito/error */}
                {enviado && (
                  <div className="bg-green-100 text-green-700 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{t('conservacion.mensajeExito', '¡Gracias por tu interés! Te contactaremos pronto.')}</span>
                    </div>
                  </div>
                )}
                
                {error && (
                  <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
                    <div className="flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span>{error}</span>
                    </div>
                  </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('conservacion.nombre', 'Nombre completo')} *
                      </label>
                      <input
                        type="text"
                        id="nombre"
                        name="nombre"
                        value={formData.nombre}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('conservacion.email', 'Correo electrónico')} *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('conservacion.telefono', 'Teléfono')}
                      </label>
                      <input
                        type="tel"
                        id="telefono"
                        name="telefono"
                        value={formData.telefono}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="interes" className="block text-sm font-medium text-gray-700 mb-1">
                        {t('conservacion.interes', 'Área de interés')} *
                      </label>
                      <select
                        id="interes"
                        name="interes"
                        value={formData.interes}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      >
                        <option value="limpieza">{t('conservacion.areaLimpieza', 'Limpieza de playas')}</option>
                        <option value="educacion">{t('conservacion.areaEducacion', 'Educación ambiental')}</option>
                        <option value="investigacion">{t('conservacion.areaInvestigacion', 'Apoyo a investigaciones')}</option>
                        <option value="comunidad">{t('conservacion.areaComunidad', 'Proyectos comunitarios')}</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700 mb-1">
                      {t('conservacion.mensaje', 'Mensaje')} *
                    </label>
                    <textarea
                      id="mensaje"
                      name="mensaje"
                      value={formData.mensaje}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
                      placeholder={t('conservacion.mensajePlaceholder', 'Cuéntanos por qué te interesa ser voluntario...')}
                    ></textarea>
                  </div>
                  
                  <button
                    type="submit"
                    disabled={enviando}
                    className={`inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors ${
                      enviando ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {enviando ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('conservacion.enviando', 'Enviando...')}
                      </>
                    ) : (
                      t('conservacion.enviar', 'Enviar solicitud')
                    )}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

          {/* Certificaciones */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              {t('conservacion.certificacionesTitulo', 'Nuestras Certificaciones y Alianzas')}
            </h2>
            
            <div className="flex flex-wrap justify-center items-center gap-8">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150x50?text=Certificación" alt="Certificación Turismo Sostenible" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150x50?text=Reserva" alt="Reserva Nacional de Paracas" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150x50?text=WWF" alt="WWF" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <img src="https://via.placeholder.com/150x50?text=Ministerio" alt="Ministerio del Ambiente" className="h-16 grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </motion.div>
        </div>
      </Seccion>
    </div>
  );
};

export default PaginaConservacion;