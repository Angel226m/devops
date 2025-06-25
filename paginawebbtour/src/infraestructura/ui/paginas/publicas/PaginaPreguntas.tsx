/* 
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import { Link } from 'react-router-dom';

const PaginaPreguntas = () => {
  const { t } = useTranslation();
  const [categoriaActiva, setCategoriaActiva] = useState('general');
  
  // Categorías de preguntas
  const categorias = [
    { id: 'general', nombre: t('preguntas.categoriaGeneral') },
    { id: 'reservas', nombre: t('preguntas.categoriaReservas') },
    { id: 'tours', nombre: t('preguntas.categoriaTours') },
    { id: 'pagos', nombre: t('preguntas.categoriaPagos') },
    { id: 'seguridad', nombre: t('preguntas.categoriaSeguridad') }
  ];
  
  // Preguntas por categoría
  const preguntas = {
    general: [
      {
        pregunta: t('preguntas.general1Pregunta'),
        respuesta: t('preguntas.general1Respuesta')
      },
      {
        pregunta: t('preguntas.general2Pregunta'),
        respuesta: t('preguntas.general2Respuesta')
      },
      {
        pregunta: t('preguntas.general3Pregunta'),
        respuesta: t('preguntas.general3Respuesta')
      },
      {
        pregunta: t('preguntas.general4Pregunta'),
        respuesta: t('preguntas.general4Respuesta')
      }
    ],
    reservas: [
      {
        pregunta: t('preguntas.reservas1Pregunta'),
        respuesta: t('preguntas.reservas1Respuesta')
      },
      {
        pregunta: t('preguntas.reservas2Pregunta'),
        respuesta: t('preguntas.reservas2Respuesta')
      },
      {
        pregunta: t('preguntas.reservas3Pregunta'),
        respuesta: t('preguntas.reservas3Respuesta')
      },
      {
        pregunta: t('preguntas.reservas4Pregunta'),
        respuesta: t('preguntas.reservas4Respuesta')
      }
    ],
    tours: [
      {
        pregunta: t('preguntas.tours1Pregunta'),
        respuesta: t('preguntas.tours1Respuesta')
      },
      {
        pregunta: t('preguntas.tours2Pregunta'),
        respuesta: t('preguntas.tours2Respuesta')
      },
      {
        pregunta: t('preguntas.tours3Pregunta'),
        respuesta: t('preguntas.tours3Respuesta')
      },
      {
        pregunta: t('preguntas.tours4Pregunta'),
        respuesta: t('preguntas.tours4Respuesta')
      }
    ],
    pagos: [
      {
        pregunta: t('preguntas.pagos1Pregunta'),
        respuesta: t('preguntas.pagos1Respuesta')
      },
      {
        pregunta: t('preguntas.pagos2Pregunta'),
        respuesta: t('preguntas.pagos2Respuesta')
      },
      {
        pregunta: t('preguntas.pagos3Pregunta'),
        respuesta: t('preguntas.pagos3Respuesta')
      },
      {
        pregunta: t('preguntas.pagos4Pregunta'),
        respuesta: t('preguntas.pagos4Respuesta')
      }
    ],
    seguridad: [
      {
        pregunta: t('preguntas.seguridad1Pregunta'),
        respuesta: t('preguntas.seguridad1Respuesta')
      },
      {
        pregunta: t('preguntas.seguridad2Pregunta'),
        respuesta: t('preguntas.seguridad2Respuesta')
      },
      {
        pregunta: t('preguntas.seguridad3Pregunta'),
        respuesta: t('preguntas.seguridad3Respuesta')
      },
      {
        pregunta: t('preguntas.seguridad4Pregunta'),
        respuesta: t('preguntas.seguridad4Respuesta')
      }
    ]
  };
  
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

  return (
    <div>
      {/* Cabecera *//*}
      <div className="relative h-64 bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1519452575417-564c1401ecc0')",
            opacity: 0.4
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/80 to-gray-900/90" />
        
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('preguntas.titulo')}</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t('preguntas.subtitulo')}
            </p>
          </motion.div>
        </div>
      </div>
      
      <Seccion className="py-16">
        {/* Buscador *//*}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input 
              type="text"
              placeholder={t('preguntas.buscarPlaceholder')}
              className="w-full px-5 py-4 pr-12 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800 dark:text-white"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </motion.div>
        
        {/* Categorías *//*}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaActiva(categoria.id)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-colors duration-300 ${
                categoriaActiva === categoria.id
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </motion.div>
        
        {/* Preguntas *//*}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {preguntas[categoriaActiva as keyof typeof preguntas].map((pregunta, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
              >
                <details className="group">
                  <summary className="flex items-center justify-between px-6 py-4 cursor-pointer focus:outline-none">
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                      {pregunta.pregunta}
                    </h3>
                    <span className="ml-6 flex-shrink-0 text-gray-500 dark:text-gray-400 group-open:rotate-180 transition-transform duration-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </span>
                  </summary>
                  <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                    <p>{pregunta.respuesta}</p>
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </Seccion>
      
      {/* Contacto *//*}
      <Seccion className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {t('preguntas.noEncuentrasRespuesta')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            {t('preguntas.contactanos')}
          </p>
          <Link
            to="/contacto"
            className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors duration-300"
          >
            {t('preguntas.irContacto')}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </motion.div>
      </Seccion>
    </div>
  );
};

export default PaginaPreguntas;*/
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import { Link } from 'react-router-dom';

// Definimos la interfaz para nuestras FAQ
interface FAQ {
  id: number;
  category: string;
  question: string;
  answer: string;
}

const PaginaPreguntas = () => {
      window.scrollTo(0, 0);

  const { t } = useTranslation();
  const [categoriaActiva, setCategoriaActiva] = useState('todos');
  const [preguntasFiltradas, setPreguntasFiltradas] = useState<FAQ[]>([]);
  const [busqueda, setBusqueda] = useState('');
  const [preguntasAbiertas, setPreguntasAbiertas] = useState<Record<number, boolean>>({});

  // Preguntas frecuentes con sus categorías
  const faqs: FAQ[] = [
    {
      id: 1,
      category: 'reservas',
      question: '¿Cómo puedo realizar una reserva?',
      answer: 'Puedes realizar una reserva directamente a través de nuestro sitio web seleccionando el tour que te interesa y siguiendo el proceso de reserva. También puedes contactarnos por teléfono o correo electrónico si prefieres asistencia personalizada.',
    },
    {
      id: 2,
      category: 'reservas',
      question: '¿Cuál es la política de cancelación?',
      answer: 'Nuestra política de cancelación varía según el tour. Por lo general, ofrecemos reembolsos completos para cancelaciones realizadas con al menos 7 días de anticipación. Para cancelaciones entre 3-7 días antes, se aplica un cargo del 50%. No hay reembolsos para cancelaciones con menos de 3 días de anticipación. Te recomendamos revisar los términos específicos al momento de reservar.',
    },
    {
      id: 3,
      category: 'pagos',
      question: '¿Qué métodos de pago aceptan?',
      answer: 'Aceptamos tarjetas de crédito y débito (Visa, MasterCard, American Express), PayPal y transferencias bancarias. Para algunos tours, también ofrecemos la opción de pago en cuotas sin interés.',
    },
    {
      id: 4,
      category: 'pagos',
      question: '¿Es seguro realizar pagos en su sitio web?',
      answer: 'Sí, todos nuestros pagos en línea están protegidos con la tecnología de encriptación SSL más avanzada. No almacenamos datos completos de tarjetas de crédito en nuestros servidores.',
    },
    {
      id: 5,
      category: 'tours',
      question: '¿Qué debo llevar a un tour?',
      answer: 'Cada tour tiene requisitos específicos que se detallan en la descripción del mismo. En general, recomendamos llevar ropa y calzado cómodos, protección solar, repelente de insectos, una botella de agua reutilizable y una cámara para capturar tus experiencias.',
    },
    {
      id: 6,
      category: 'tours',
      question: '¿Los tours incluyen transporte?',
      answer: 'La mayoría de nuestros tours incluyen transporte desde puntos de encuentro específicos. Los detalles exactos se indican en la descripción de cada tour. Si tienes necesidades especiales de transporte, contáctanos para opciones personalizadas.',
    },
    {
      id: 7,
      category: 'tours',
      question: '¿Ofrecen tours privados?',
      answer: 'Sí, ofrecemos opciones de tours privados para grupos, familias o experiencias personalizadas. Estos tours se pueden adaptar a tus preferencias específicas. Contáctanos para más información y cotizaciones.',
    },
    {
      id: 8,
      category: 'otros',
      question: '¿Los guías hablan otros idiomas además de español?',
      answer: 'Sí, contamos con guías bilingües que hablan español e inglés en todos nuestros tours. Para algunos destinos populares, también tenemos disponibilidad de guías que hablan francés, alemán, italiano y otros idiomas. Si necesitas un idioma específico, indícalo al momento de hacer tu reserva.',
    },
    {
      id: 9,
      category: 'seguridad',
      question: '¿Qué medidas de seguridad tienen implementadas en los tours?',
      answer: 'La seguridad es nuestra prioridad. Todas nuestras embarcaciones cumplen con los estándares internacionales de seguridad marítima. Contamos con equipos de flotación adecuados para todos los pasajeros, sistemas de comunicación avanzados y nuestro personal está capacitado en primeros auxilios y protocolos de emergencia.',
    },
    {
      id: 10,
      category: 'seguridad',
      question: '¿Los tours son adecuados para personas con movilidad reducida?',
      answer: 'La accesibilidad varía según el tour. Algunas de nuestras embarcaciones están adaptadas para personas con movilidad reducida. Te recomendamos contactarnos con anticipación para informarte sobre las opciones más adecuadas para tus necesidades específicas.',
    },
    {
      id: 11,
      category: 'general',
      question: '¿Cuáles son los horarios de operación?',
      answer: 'Nuestros tours operan todos los días de 7:00 AM a 5:00 PM. Los horarios específicos de cada tour se indican en la descripción detallada. Nuestras oficinas de atención al cliente están disponibles de lunes a domingo de 8:00 AM a 8:00 PM.',
    },
    {
      id: 12,
      category: 'general',
      question: '¿Ofrecen descuentos para grupos grandes?',
      answer: 'Sí, ofrecemos tarifas especiales para grupos de más de 10 personas. También contamos con descuentos para estudiantes, personas mayores de 65 años y niños menores de 12 años. Contáctanos para más detalles sobre nuestras opciones de precios para grupos.',
    },
  ];

  // Categorías disponibles
  const categorias = [
    { id: 'todos', nombre: 'Todas las categorías' },
    { id: 'general', nombre: 'General' },
    { id: 'reservas', nombre: 'Reservas' },
    { id: 'tours', nombre: 'Tours' },
    { id: 'pagos', nombre: 'Pagos' },
    { id: 'seguridad', nombre: 'Seguridad' },
    { id: 'otros', nombre: 'Otros' }
  ];

  // Filtrar preguntas según la categoría activa y la búsqueda
  useEffect(() => {
    let resultado = [...faqs];
    
    // Filtrar por categoría
    if (categoriaActiva !== 'todos') {
      resultado = resultado.filter(faq => faq.category === categoriaActiva);
    }
    
    // Filtrar por búsqueda
    if (busqueda) {
      const terminoBusqueda = busqueda.toLowerCase();
      resultado = resultado.filter(
        faq => 
          faq.question.toLowerCase().includes(terminoBusqueda) || 
          faq.answer.toLowerCase().includes(terminoBusqueda)
      );
    }
    
    setPreguntasFiltradas(resultado);
    // Resetear preguntas abiertas cuando cambia el filtro
    setPreguntasAbiertas({});
  }, [categoriaActiva, busqueda]);

  // Inicializar con todas las preguntas
  useEffect(() => {
    setPreguntasFiltradas([...faqs]);
  }, []);

  // Manejar la apertura/cierre de preguntas - Corregido para garantizar la persistencia
  const togglePregunta = (id: number) => {
    setPreguntasAbiertas(prev => {
      const nuevoEstado = {...prev};
      nuevoEstado[id] = !prev[id];
      return nuevoEstado;
    });
  };

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

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Animaciones para el contenido de la respuesta
  const contentVariants = {
    collapsed: { 
      height: 0, 
      opacity: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 }
      } 
    },
    expanded: { 
      height: "auto", 
      opacity: 1,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.25, delay: 0.1 }
      } 
    }
  };

  return (
    <div>
      {/* Hero section con imagen de fondo */}
      <div className="relative h-80 bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-4.0.3')",
            opacity: 0.35
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/70 to-gray-900/90" />
        
        {/* Ola decorativa en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,69.3C672,64,768,96,864,96C960,96,1056,64,1152,48C1248,32,1344,32,1392,32L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
        
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white px-4"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h1>
            <p className="text-lg text-gray-200 max-w-2xl mx-auto">
              Encuentra respuestas a todas tus dudas sobre nuestros tours, reservas, pagos y más.
            </p>
          </motion.div>
        </div>
      </div>
      
      <Seccion className="py-16">
        {/* Buscador */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12"
        >
          <div className="relative">
            <input 
              type="text"
              placeholder="Buscar preguntas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full px-5 py-4 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 text-gray-800"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              {busqueda ? (
                <button 
                  onClick={() => setBusqueda('')}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
        </motion.div>
        
        {/* Categorías */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12"
        >
          {categorias.map((categoria) => (
            <button
              key={categoria.id}
              onClick={() => setCategoriaActiva(categoria.id)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                categoriaActiva === categoria.id
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm'
              }`}
            >
              {categoria.nombre}
            </button>
          ))}
        </motion.div>
        
        {/* Indicador de resultados */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto mb-8 text-center"
        >
          {busqueda && (
            <p className="text-gray-600">
              {preguntasFiltradas.length === 0 ? (
                <span>No se encontraron resultados para "<strong>{busqueda}</strong>"</span>
              ) : (
                <span>Se encontraron {preguntasFiltradas.length} resultados para "<strong>{busqueda}</strong>"</span>
              )}
            </p>
          )}
          
          {preguntasFiltradas.length === 0 && !busqueda && categoriaActiva !== 'todos' && (
            <p className="text-gray-600">No hay preguntas disponibles en esta categoría.</p>
          )}
        </motion.div>
        
        {/* Preguntas - FIX APLICADO: Estructura mejorada para evitar problemas de interacción */}
        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {preguntasFiltradas.map((faq, index) => (
              <motion.div
                key={faq.id}
                variants={fadeIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
              >
                <button 
                  className="flex items-center justify-between w-full px-6 py-4 text-left focus:outline-none"
                  onClick={() => togglePregunta(faq.id)}
                  aria-expanded={preguntasAbiertas[faq.id] || false}
                >
                  <h3 className="text-lg font-semibold text-gray-800 pr-6">{faq.question}</h3>
                  <span 
                    className={`flex-shrink-0 text-primary-500 transition-transform duration-300 ${preguntasAbiertas[faq.id] ? 'rotate-180' : ''}`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
                
                {/* Contenido de la pregunta con AnimatePresence */}
                <div className="overflow-hidden">
                  <AnimatePresence initial={false}>
                    {preguntasAbiertas[faq.id] && (
                      <motion.div
                        key={`content-${faq.id}`}
                        initial="collapsed"
                        animate="expanded"
                        exit="collapsed"
                        variants={contentVariants}
                        className="px-6 pb-5 text-gray-600 border-t border-gray-100"
                      >
                        <div className="pt-4">
                          <p>{faq.answer}</p>
                        </div>
                        
                        {/* Categoría y utilidad */}
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 pt-3 border-t border-gray-50 text-sm">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700 mb-2 sm:mb-0">
                            {faq.category === 'general' && 'General'}
                            {faq.category === 'reservas' && 'Reservas'}
                            {faq.category === 'tours' && 'Tours'}
                            {faq.category === 'pagos' && 'Pagos'}
                            {faq.category === 'seguridad' && 'Seguridad'}
                            {faq.category === 'otros' && 'Otros'}
                          </span>
                          
                          <div className="text-gray-500">
                            <span className="mr-3">¿Te fue útil esta respuesta?</span>
                            <button 
                              className="text-primary-500 hover:text-primary-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Lógica para marcar como útil
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M2 10.5a1.5 1.5 0 113 0v6a1.5 1.5 0 01-3 0v-6zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
                              </svg>
                              Sí
                            </button>
                            <button 
                              className="text-gray-500 hover:text-gray-600 ml-3"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Lógica para marcar como no útil
                              }}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M18 9.5a1.5 1.5 0 11-3 0v-6a1.5 1.5 0 013 0v6zM14 9.667v-5.43a2 2 0 00-1.105-1.79l-.05-.025A4 4 0 0011.055 2H5.64a2 2 0 00-1.962 1.608l-1.2 6A2 2 0 004.44 12H8v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
                              </svg>
                              No
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Sin resultados */}
        {preguntasFiltradas.length === 0 && (
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-2xl mx-auto py-12 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-500 mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No encontramos lo que buscas</h3>
            <p className="text-gray-600 mb-6">
              Intenta con otro término de búsqueda o contacta con nuestro equipo para resolver tus dudas.
            </p>
          </motion.div>
        )}
      </Seccion>
      
      {/* Contacto */}
      <div className="bg-gray-50">
        <Seccion className="py-16">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
              ¿No encuentras la respuesta que buscas?
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              Nuestro equipo de atención al cliente estará encantado de ayudarte a resolver todas tus dudas.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/contacto"
                className="inline-flex items-center px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-full shadow-md hover:shadow-lg transition-all duration-300"
              >
                Contáctanos
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H3a1 1 0 110-2h9.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </Link>
              <a
                href="tel:+51956789123"
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded-full shadow-sm hover:shadow transition-all duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary-500" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                Llamar ahora
              </a>
            </div>
          </motion.div>
        </Seccion>
      </div>
    </div>
  );
};

export default PaginaPreguntas;