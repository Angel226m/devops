import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';

// Definición de tipos para evitar errores de TypeScript
type EspecieKey = 'pinguinos' | 'lobos' | 'ballenas' | 'aves';

interface EspecieData {
  titulo: string;
  imagen: string;
  descripcion: string;
  protocolos: string[];
  color: string;
}

interface ProtocoloData {
  titulo: string;
  descripcion: string;
  icono: JSX.Element;
}

interface TecnologiaData {
  titulo: string;
  descripcion: string;
}

interface ResultadoData {
  cifra: string;
  descripcion: string;
}

const PaginaConservacion = () => {
  const { t } = useTranslation();
  
  // Estado para el tab activo
  const [tabActivo, setTabActivo] = useState<EspecieKey>('pinguinos');
  
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
  
  const tabVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5
      }
    },
    exit: { 
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.3
      }
    }
  };

  // Datos de las especies para los tabs
  const especiesData: Record<EspecieKey, EspecieData> = {
    pinguinos: {
      titulo: 'Pingüinos de Humboldt',
      imagen: 'https://image.salmonexpert.cl/1190519.webp?imageId=1190519&width=960&height=622&format=jpg',
      descripcion: 'El pingüino de Humboldt (Spheniscus humboldti) es una especie vulnerable que habita en las costas de Perú y Chile. En la Reserva Nacional de Paracas, alberga importantes colonias de anidación que protegemos rigurosamente siguiendo los lineamientos de SERNANP.',
      protocolos: [
        'Mantenemos distancias respetuosas de las colonias según estándares de SERNANP',
        'Reducimos la velocidad y el ruido de motores al acercarnos a sus zonas',
        'Evitamos visitas durante períodos críticos de reproducción',
        'Monitoreamos constantemente las poblaciones para detectar cambios'
      ],
      color: 'from-blue-600 to-ocean-600'
    },
    lobos: {
      titulo: 'Lobos Marinos Sudamericanos',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTwoS23r4tbuQz-72p9xHjvUjr2cuJnPxywvQ&s',
      descripcion: 'Los lobos marinos (Otaria flavescens) forman grandes colonias en las Islas Ballestas. Estas colonias son vitales para el ecosistema marino y constituyen uno de los principales atractivos de la reserva protegida por SERNANP.',
      protocolos: [
        'Mantenemos distancias adecuadas de las colonias según normativa vigente',
        'Controlamos el tiempo de observación según protocolos establecidos',
        'Prohibimos cualquier intento de alimentación o interacción directa',
        'Evitamos interrumpir sus comportamientos naturales de reproducción y descanso'
      ],
      color: 'from-ocean-600 to-cyan-600'
    },
    ballenas: {
      titulo: 'Ballenas y Cetáceos',
      imagen: 'https://www.tvperu.gob.pe/sites/default/files/styles/note/public/notas_-_tvperu_-_2024-07-02t150728.634.jpg?itok=MBEpqoZi',
      descripcion: 'Varias especies de cetáceos, incluyendo la ballena jorobada (Megaptera novaeangliae) y el delfín nariz de botella (Tursiops truncatus), habitan temporalmente las aguas de la Reserva Nacional de Paracas durante sus migraciones anuales.',
      protocolos: [
        'Nunca perseguimos a los cetáceos, permitiendo que ellos decidan el nivel de interacción',
        'Mantenemos velocidad constante y predecible al avistarlos',
        'Controlamos el tiempo de observación según normativas de SERNANP',
        'Evitamos acercarnos a madres con crías y grupos en alimentación'
      ],
      color: 'from-cyan-600 to-teal-600'
    },
    aves: {
      titulo: 'Aves Marinas',
      imagen: 'https://images.unsplash.com/photo-1621856342476-d7ac978acb63?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      descripcion: 'Las Islas Ballestas albergan una increíble diversidad de aves marinas, incluyendo pelícanos peruanos, cormoranes, piqueros, gaviotas y el famoso guanay. Estas aves son fundamentales para el ecosistema y la producción de guano.',
      protocolos: [
        'Mantenemos motores en neutro cuando estamos cerca de aves que pescan o descansan',
        'Evitamos acercarnos a acantilados de anidación durante la temporada reproductiva',
        'Prohibimos cualquier ruido fuerte que pueda causar abandono de nidos',
        'Respetamos las zonas establecidas por SERNANP para proteger las colonias de aves'
      ],
      color: 'from-teal-600 to-green-600'
    }
  };

  // Protocolos generales de conservación
  const protocolos: ProtocoloData[] = [
    {
      titulo: 'Horarios Regulados',
      descripcion: 'Respetamos estrictamente los horarios establecidos por SERNANP, diseñados para minimizar el impacto en los ciclos naturales de alimentación y descanso de la fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      titulo: 'Control de Aforo',
      descripcion: 'Cumplimos con los límites de capacidad de carga establecidos por SERNANP para la Reserva Nacional de Paracas, evitando la saturación del ecosistema.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 1.944A11.954 11.954 0 012.166 5C2.056 5.649 2 6.319 2 7c0 5.225 3.34 9.67 8 11.317C14.66 16.67 18 12.225 18 7c0-.682-.057-1.35-.166-2.001A11.954 11.954 0 0110 1.944zM11 14a1 1 0 11-2 0 1 1 0 012 0zm0-7a1 1 0 10-2 0v3a1 1 0 102 0V7z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      titulo: 'Zonas Restringidas',
      descripcion: 'Respetamos las zonas de exclusión y amortiguamiento establecidas por SERNANP, especialmente durante temporadas críticas de reproducción y anidación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
          <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
        </svg>
      )
    },
    {
      titulo: 'Navegación Responsable',
      descripcion: 'Nuestras embarcaciones siguen rutas predefinidas aprobadas por SERNANP, controlando la velocidad para reducir el impacto acústico y la contaminación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      titulo: 'Guías Certificados',
      descripcion: 'Nuestros guías están capacitados y certificados por SERNANP para garantizar prácticas responsables de observación de fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      )
    },
    {
      titulo: 'Cero Residuos',
      descripcion: 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones, en cumplimiento con las normativas ambientales de SERNANP.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-ocean-600 dark:text-ocean-300" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  // Tecnologías para conservación
  const tecnologias: TecnologiaData[] = [
    {
      titulo: 'GPS y Seguimiento de Rutas',
      descripcion: 'Todas nuestras embarcaciones están equipadas con GPS que monitorean la velocidad y aseguran que se respeten las rutas establecidas por SERNANP.'
    },
    {
      titulo: 'Sensores Acústicos',
      descripcion: 'Monitoreamos los niveles de ruido de nuestras embarcaciones para garantizar que se mantengan por debajo de los umbrales que podrían afectar a la fauna.'
    },
    {
      titulo: 'Motores de Bajo Impacto',
      descripcion: 'Nuestras embarcaciones utilizan motores de última generación con tecnología de reducción de emisiones y baja huella acústica.'
    },
    {
      titulo: 'Sistema de Registro Digital',
      descripcion: 'Documentamos cada avistamiento para contribuir a la base de datos científica de SERNANP sobre poblaciones y comportamiento de la fauna marina.'
    }
  ];

  // Resultados tangibles
  const resultados: ResultadoData[] = [
    {
      cifra: '+5.000',
      descripcion: 'Kg de residuos plásticos evitados en el ecosistema marino'
    },
    {
      cifra: '15%',
      descripcion: 'Reducción en el número de embarcaciones en zonas sensibles'
    },
    {
      cifra: '+20%',
      descripcion: 'Aumento en la población de pingüinos de Humboldt'
    },
    {
      cifra: '0',
      descripcion: 'Incidentes de perturbación significativa en los últimos 3 años'
    }
  ];

  return (
    <div className="bg-white">
      {/* Cabecera */}
      <div className="relative h-80 md:h-[500px] overflow-hidden bg-gradient-to-r from-blue-600 to-teal-500">
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
            className="text-center text-white px-4 max-w-5xl mx-auto"
          >
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg"
            >
              {t('conservacion.titulo', 'Conservación Marina y Protección del Ecosistema')}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-white max-w-3xl mx-auto text-shadow leading-relaxed"
            >
              {t('conservacion.subtitulo', 'Implementamos protocolos rigurosos según las normativas de SERNANP para preservar el ecosistema marino de Paracas y las Islas Ballestas.')}
            </motion.p>
          </motion.div>
        </div>
        
        {/* Onda decorativa en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L48,144C96,160,192,192,288,197.3C384,203,480,181,576,165.3C672,149,768,139,864,154.7C960,171,1056,213,1152,218.7C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Sección principal */}
      <Seccion className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              {t('conservacion.proteccionTitulo', 'Protección de la Fauna Marina')}
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              {t('conservacion.proteccionDesc', 'Aplicamos protocolos específicos establecidos por SERNANP para cada especie, respetando sus comportamientos naturales y minimizando el impacto de las visitas turísticas.')}
            </p>
          </motion.div>

          {/* Tabs de selección de especies */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {(Object.keys(especiesData) as EspecieKey[]).map((key) => (
              <motion.button
                key={key}
                onClick={() => setTabActivo(key)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md ${
                  tabActivo === key 
                    ? 'bg-ocean-600 text-white' 
                    : 'bg-white border border-ocean-200 text-ocean-600 hover:bg-ocean-50'
                }`}
              >
                {especiesData[key].titulo}
              </motion.button>
            ))}
          </div>

          {/* Contenido de cada tab */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tabActivo}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`bg-gradient-to-br ${especiesData[tabActivo].color} dark:from-blue-800 dark:to-ocean-800 rounded-2xl overflow-hidden shadow-2xl mb-16`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-8 md:p-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                    {especiesData[tabActivo].titulo}
                  </h3>
                  <div className="text-white/90 space-y-4">
                    <p className="text-lg leading-relaxed">{especiesData[tabActivo].descripcion}</p>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mt-6">
                      <h4 className="text-xl font-semibold text-cyan-200 mb-4">{t('conservacion.protocolosTitulo', 'Protocolos de Protección:')}</h4>
                      <ul className="list-disc pl-5 space-y-3">
                        {especiesData[tabActivo].protocolos.map((protocolo, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="text-white/95"
                          >
                            {protocolo}
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="h-80 lg:h-auto overflow-hidden">
                  <motion.img 
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1 }}
                    src={especiesData[tabActivo].imagen} 
                    alt={especiesData[tabActivo].titulo} 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

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
              <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('conservacion.protocolosTitulo', 'Control de Visitas y Protección del Ecosistema')}
              </h3>
              <p className="text-xl text-gray-700 max-w-3xl mx-auto">
                {t('conservacion.protocolosDesc', 'Implementamos estrictas medidas establecidas por SERNANP para regular el acceso a zonas sensibles y minimizar nuestro impacto en el ecosistema marino de Paracas.')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {protocolos.map((protocolo, index) => (
                <motion.div 
                  key={index}
                  initial={{ y: 50, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                  className="bg-white rounded-xl shadow-lg p-6 border border-blue-50 hover:shadow-xl transition-all duration-300"
                >
                  <div className="bg-ocean-100 dark:bg-ocean-700 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                    {protocolo.icono}
                  </div>
                  <h4 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {protocolo.titulo}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-300">
                    {protocolo.descripcion}
                  </p>
                </motion.div>
              ))}
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
                <h3 className="text-2xl md:text-4xl font-bold text-white mb-4">
                  {t('conservacion.resultadosTitulo', 'Resultados de Nuestras Medidas de Protección')}
                </h3>
                <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                  {t('conservacion.resultadosSubtitulo', 'El cumplimiento de los lineamientos de SERNANP y nuestros protocolos adicionales han generado resultados medibles en la conservación del ecosistema marino.')}
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resultados.map((resultado, index) => (
                  <motion.div 
                    key={index}
                    initial={{ scale: 0.9, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ 
                      scale: 1.05,
                      transition: { duration: 0.2 }
                    }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center"
                  >
                    <motion.div 
                      initial={{ scale: 0.8 }}
                      whileInView={{ scale: 1 }}
                      transition={{ 
                        type: "spring",
                        stiffness: 100,
                        delay: index * 0.1 + 0.3
                      }}
                      className="text-4xl md:text-5xl font-bold text-white mb-2"
                    >
                      {resultado.cifra}
                    </motion.div>
                    <p className="text-blue-100">
                      {resultado.descripcion}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Tecnología para conservación */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden mb-16 border border-blue-50"
          >
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
              <div className="lg:col-span-3 p-8 md:p-12">
                <h3 className="text-3xl font-bold text-ocean-600 dark:text-ocean-300 mb-6">
                  {t('conservacion.tecnologiaTitulo', 'Tecnología al Servicio de la Conservación')}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
                  {t('conservacion.tecnologiaDesc', 'Utilizamos tecnología avanzada para monitorear el ecosistema y garantizar el cumplimiento de los protocolos establecidos por SERNANP:')}
                </p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {tecnologias.map((tecnologia, index) => (
                    <motion.div 
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 + 0.3 }}
                      whileHover={{ y: -5, transition: { duration: 0.2 } }}
                      className="bg-ocean-50 dark:bg-blue-700 rounded-xl p-5 hover:shadow-md transition-all duration-300"
                    >
                      <h4 className="font-bold text-ocean-600 dark:text-ocean-300 mb-2">
                        {tecnologia.titulo}
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">
                        {tecnologia.descripcion}
                      </p>
                    </motion.div>
                  ))}
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
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8 }}
            className="mt-16 text-center"
          >
            <motion.h3 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-2xl md:text-3xl font-bold text-gray-900 mb-8"
            >
              {t('conservacion.certificacionesTitulo', 'Certificaciones y Reconocimientos')}
            </motion.h3>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap justify-center items-center gap-8"
            >
              {['SERNANP', 'Reserva', 'WWF', 'Ministerio'].map((logo, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ 
                    scale: 1.05,
                    filter: "grayscale(0)",
                    transition: { duration: 0.2 }
                  }}
                  className="bg-white p-4 rounded-lg shadow-md"
                >
                  <img 
                    src={`https://via.placeholder.com/150x50?text=${logo}`} 
                    alt={`${logo} de Turismo Sostenible`} 
                    className="h-16 grayscale hover:grayscale-0 transition-all duration-300" 
                  />
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </Seccion>
    </div>
  );
};

export default PaginaConservacion;