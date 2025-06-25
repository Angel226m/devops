/* 
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import { Link } from 'react-router-dom';

const PaginaSobreNosotros = () => {
  const { t } = useTranslation();
  
  // Configuración de animaciones
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
  
  // Equipo de trabajo
  const equipo = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      cargo: t('sobreNosotros.cargoCEO'),
      imagen: "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 2,
      nombre: "María Rodríguez",
      cargo: t('sobreNosotros.cargoOperaciones'),
      imagen: "https://randomuser.me/api/portraits/women/44.jpg",
    },
    {
      id: 3,
      nombre: "Juan Pérez",
      cargo: t('sobreNosotros.cargoGuia'),
      imagen: "https://randomuser.me/api/portraits/men/22.jpg",
    },
    {
      id: 4,
      nombre: "Ana Sánchez",
      cargo: t('sobreNosotros.cargoMarine'),
      imagen: "https://randomuser.me/api/portraits/women/62.jpg",
    }
  ];
  
  // Valores de la empresa
  const valores = [
    {
      id: 1,
      titulo: t('sobreNosotros.valorSostenibilidad'),
      descripcion: t('sobreNosotros.valorSostenibilidadDesc'),
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 2,
      titulo: t('sobreNosotros.valorSeguridad'),
      descripcion: t('sobreNosotros.valorSeguridadDesc'),
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 3,
      titulo: t('sobreNosotros.valorExcelencia'),
      descripcion: t('sobreNosotros.valorExcelenciaDesc'),
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: 4,
      titulo: t('sobreNosotros.valorComunidad'),
      descripcion: t('sobreNosotros.valorComunidadDesc'),
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];

  return (
    <div>
      {/* Cabecera *//*}
      <div className="relative h-96 bg-gray-900 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1621868908413-6b226f78bbc3')",
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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{t('sobreNosotros.titulo')}</h1>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              {t('sobreNosotros.subtitulo')}
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* Historia *//*}
      <Seccion className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-6">
              {t('sobreNosotros.historiaTitulo')}
            </h2>
            
            <div className="space-y-4 text-gray-600 dark:text-gray-300">
              <p>{t('sobreNosotros.historiaP1')}</p>
              <p>{t('sobreNosotros.historiaP2')}</p>
              <p>{t('sobreNosotros.historiaP3')}</p>
            </div>
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative"
          >
            <div className="rounded-lg overflow-hidden shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1633776166220-8604a0405e8c" 
                alt={t('sobreNosotros.historiaImgAlt')} 
                className="w-full h-auto"
              />
            </div>
            
            <div className="absolute -bottom-6 -right-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
              <p className="text-2xl font-bold text-primary-500">15+</p>
              <p className="text-gray-600 dark:text-gray-300">{t('sobreNosotros.anosExperiencia')}</p>
            </div>
          </motion.div>
        </div>
      </Seccion>
      
      {/* Misión y Visión *//*}
      <Seccion className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {t('sobreNosotros.misionTitulo')}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300">
              {t('sobreNosotros.misionDescripcion')}
            </p>
          </motion.div>
          
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-lg"
          >
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 text-primary-500 dark:text-primary-400 rounded-full flex items-center justify-center mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
              {t('sobreNosotros.visionTitulo')}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300">
              {t('sobreNosotros.visionDescripcion')}
            </p>
          </motion.div>
        </div>
      </Seccion>
      
      {/* Valores *//*}
      <Seccion className="py-16">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {t('sobreNosotros.valoresTitulo')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('sobreNosotros.valoresDescripcion')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {valores.map((valor, index) => (
            <motion.div
              key={valor.id}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-12 h-12 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mb-4">
                {valor.icono}
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {valor.titulo}
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                {valor.descripcion}
              </p>
            </motion.div>
          ))}
        </div>
      </Seccion>
      
      {/* Equipo *//*}
      <Seccion className="py-16 bg-gray-50 dark:bg-gray-900">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {t('sobreNosotros.equipoTitulo')}
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('sobreNosotros.equipoDescripcion')}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {equipo.map((miembro, index) => (
            <motion.div
              key={miembro.id}
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md"
            >
              <div className="relative group">
                <img 
                  src={miembro.imagen} 
                  alt={miembro.nombre} 
                  className="w-full h-64 object-cover"
                />
                <div className="absolute inset-0 bg-primary-500 bg-opacity-70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
                  <div className="flex space-x-3">
                    <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-primary-500" viewBox="0 0 16 16">
                        <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-primary-500" viewBox="0 0 16 16">
                        <path d="M16 8.049c0-4.446-3.582-8.05-8-8.05C3.58 0-.002 3.603-.002 8.05c0 4.017 2.926 7.347 6.75 7.951v-5.625h-2.03V8.05H6.75V6.275c0-2.017 1.195-3.131 3.022-3.131.876 0 1.791.157 1.791.157v1.98h-1.009c-.993 0-1.303.621-1.303 1.258v1.51h2.218l-.354 2.326H9.25V16c3.824-.604 6.75-3.934 6.75-7.951z"/>
                      </svg>
                    </a>
                    <a href="#" className="bg-white p-2 rounded-full hover:bg-gray-100 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="text-primary-500" viewBox="0 0 16 16">
                        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-1">
                  {miembro.nombre}
                </h3>
                <p className="text-primary-500 dark:text-primary-400 mb-4">
                  {miembro.cargo}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </Seccion>
      
      {/* CTA *//*}
      <Seccion className="py-16">
        <div className="bg-primary-500 dark:bg-primary-600 rounded-2xl p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-20">
            <svg 
              width="300" 
              height="300" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path d="M50 0L56.75 43.25L100 50L56.75 56.75L50 100L43.25 56.75L0 50L43.25 43.25L50 0Z" fill="currentColor"/>
            </svg>
          </div>
          
          <div className="relative z-10 text-center max-w-2xl mx-auto">
            <motion.h2
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              {t('sobreNosotros.ctaTitulo')}
            </motion.h2>
            
            <motion.p
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-white text-opacity-90 mb-8"
            >
              {t('sobreNosotros.ctaDescripcion')}
            </motion.p>
            
            <motion.div
              variants={fadeIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/tours"
                className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors duration-300 shadow-md"
              >
                {t('sobreNosotros.ctaBotonTours')}
              </Link>
              <Link
                to="/contacto"
                className="px-6 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors duration-300"
              >
                {t('sobreNosotros.ctaBotonContacto')}
              </Link>
            </motion.div>
          </div>
        </div>
      </Seccion>
    </div>
  );
};

export default PaginaSobreNosotros;*/



import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Seccion from '../../componentes/layout/Seccion';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { useState, useEffect } from 'react';

const PaginaSobreNosotros = () => {
  const { t } = useTranslation();
  const [estadisticasAnimadas, setEstadisticasAnimadas] = useState({
    años: 0,
    tours: 0,
    clientes: 0,
    reconocimientos: 0
  });
  
  // Referencias para detectar cuándo los elementos están en el viewport
  const [refEstadisticas, inViewEstadisticas] = useInView({
    triggerOnce: true,
    threshold: 0.5,
  });
  
  // Animación para números crecientes
  useEffect(() => {
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
    if (inViewEstadisticas) {
      const duracion = 2000; // 2 segundos
      const intervalo = 20; // Actualizar cada 20ms
      const pasos = duracion / intervalo;
      
      const años = 20;
      const tours = 5000;
      const clientes = 50000;
      const reconocimientos = 12;
      
      let paso = 1;
      
      const timer = setInterval(() => {
        if (paso <= pasos) {
          const factor = easeOutQuad(paso / pasos);
          
          setEstadisticasAnimadas({
            años: Math.floor(años * factor),
            tours: Math.floor(tours * factor),
            clientes: Math.floor(clientes * factor),
            reconocimientos: Math.floor(reconocimientos * factor)
          });
          
          paso++;
        } else {
          clearInterval(timer);
        }
      }, intervalo);
      
      return () => clearInterval(timer);
    }
  }, [inViewEstadisticas]);
  
  // Función de easing para animación más natural
  const easeOutQuad = (x: number): number => {
    return 1 - (1 - x) * (1 - x);
  };
  
  // Configuración de animaciones
  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };
  
  const scaleIn = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };
  
  // Valores de la empresa
  const valores = [
    {
      id: 1,
      titulo: "Sostenibilidad",
      descripcion: "Protegemos y preservamos los ecosistemas marinos a través de prácticas sostenibles y respetuosas con el medio ambiente.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      )
    },
    {
      id: 2,
      titulo: "Seguridad",
      descripcion: "La seguridad de nuestros clientes es nuestra principal prioridad, con los más altos estándares en equipo y capacitación.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    },
    {
      id: 3,
      titulo: "Excelencia",
      descripcion: "Nos esforzamos por superar las expectativas de nuestros clientes en cada tour con un servicio excepcional y experiencias memorables.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      )
    },
    {
      id: 4,
      titulo: "Comunidad",
      descripcion: "Contribuimos activamente al desarrollo de la comunidad local, generando empleo y apoyando iniciativas de conservación en Pisco.",
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    }
  ];
  
  // Hitos importantes
  const hitos = [
    {
      año: "2003",
      titulo: "Fundación de Ocean Tours",
      descripcion: "Iniciamos operaciones con una pequeña embarcación y un sueño de mostrar las maravillas marítimas de Pisco."
    },
    {
      año: "2007",
      titulo: "Expansión de la flota",
      descripcion: "Adquirimos tres nuevas embarcaciones, ampliando nuestra capacidad para atender la creciente demanda turística."
    },
    {
      año: "2010",
      titulo: "Premio Nacional de Turismo",
      descripcion: "Recibimos el reconocimiento como 'Mejor Operador de Tours Marinos' por el Ministerio de Turismo del Perú."
    },
    {
      año: "2015",
      titulo: "Certificación Internacional",
      descripcion: "Obtuvimos certificaciones internacionales por nuestras prácticas sostenibles y excelencia en servicio."
    },
    {
      año: "2020",
      titulo: "Renovación tecnológica",
      descripcion: "Implementamos sistemas de reserva digital y mejoramos nuestras embarcaciones con tecnología de vanguardia."
    },
    {
      año: "2023",
      titulo: "Compromiso ambiental",
      descripcion: "Lanzamos nuestro programa de conservación marina y reducción de huella de carbono."
    }
  ];

  return (
    <div>
      {/* Hero parallax con efecto de profundidad */}
      <div className="relative h-[70vh] overflow-hidden bg-gray-900">
        <motion.div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1562059390-a761a084768e?ixlib=rb-4.0.3')" }}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 0.4, scale: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        <motion.div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/50 to-gray-900"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />
        
        {/* Elementos parallax */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-[10%] left-[5%] h-24 w-24 rounded-full bg-primary-500/20 blur-xl"
            animate={{ 
              y: [0, -15, 0],
              opacity: [0.4, 0.6, 0.4]
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute top-[30%] right-[10%] h-32 w-32 rounded-full bg-ocean-500/20 blur-xl"
            animate={{ 
              y: [0, 20, 0],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              repeatType: "reverse",
              delay: 1
            }}
          />
        </div>
        
        {/* Contenido del hero */}
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              ease: [0.22, 1, 0.36, 1]
            }}
            className="text-center text-white px-4 max-w-4xl"
          >
            <div className="mb-6 inline-block">
              <motion.span 
                className="inline-block font-medium bg-primary-500 text-white px-4 py-1 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Más de 20 años de experiencia
              </motion.span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight">
              <span className="block">Explorando las Maravillas</span>
              <motion.span 
                className="block text-primary-400 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
              >
                Marítimas de Pisco
              </motion.span>
            </h1>
            
            <motion.p 
              className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              Desde 2003, proporcionando experiencias acuáticas inolvidables con seguridad, pasión y respeto por nuestro ecosistema marino.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                to="/tours"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white font-medium rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              >
                Explorar Nuestros Tours
              </Link>
              <a
                href="#nuestra-historia"
                className="px-8 py-4 bg-transparent border border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Conoce Nuestra Historia
              </a>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Onda decorativa inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
            <path 
              fill="#ffffff" 
              fillOpacity="1" 
              d="M0,64L48,80C96,96,192,128,288,122.7C384,117,480,75,576,69.3C672,64,768,96,864,96C960,96,1056,64,1152,48C1248,32,1344,32,1392,32L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
            />
          </svg>
        </div>
      </div>
      
      {/* Estadísticas destacadas */}
      <Seccion className="py-16">
        <div 
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-10" 
          ref={refEstadisticas}
        >
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="bg-white rounded-xl shadow-lg p-6 text-center border-b-4 border-primary-500"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {estadisticasAnimadas.años}+
            </h3>
            <p className="text-gray-600">Años de experiencia</p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center border-b-4 border-ocean-500"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {estadisticasAnimadas.tours.toLocaleString()}+
            </h3>
            <p className="text-gray-600">Tours realizados</p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center border-b-4 border-primary-500"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {estadisticasAnimadas.clientes.toLocaleString()}+
            </h3>
            <p className="text-gray-600">Clientes satisfechos</p>
          </motion.div>
          
          <motion.div 
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 text-center border-b-4 border-ocean-500"
          >
            <h3 className="text-4xl md:text-5xl font-bold text-gray-800 mb-2">
              {estadisticasAnimadas.reconocimientos}
            </h3>
            <p className="text-gray-600">Premios y reconocimientos</p>
          </motion.div>
        </div>
      </Seccion>
      
      {/* Historia con timeline */}
      <div id="nuestra-historia" className="py-16 bg-gray-50">
        <Seccion>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Nuestra Trayectoria
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Más de dos décadas de excelencia
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Desde nuestros humildes inicios en 2003, Ocean Tours ha evolucionado para convertirse en la empresa líder en tours marítimos en Pisco, manteniendo siempre nuestra pasión por el océano y el compromiso con nuestras comunidades.
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Línea central */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200 z-0"></div>
            
            {/* Timeline eventos */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative z-10"
            >
              {hitos.map((hito, index) => (
                <motion.div 
                  key={hito.año}
                  variants={fadeIn}
                  className={`flex flex-col md:flex-row items-center mb-12 last:mb-0 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                >
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-10' : 'md:text-left md:pl-10'}`}>
                    <div className="bg-white rounded-xl shadow-md p-6 transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{hito.titulo}</h3>
                      <p className="text-gray-600">{hito.descripcion}</p>
                    </div>
                  </div>
                  
                  <div className="my-4 md:my-0">
                    <div className="w-14 h-14 rounded-full bg-primary-500 text-white font-bold text-lg flex items-center justify-center shadow-lg">
                      {hito.año}
                    </div>
                  </div>
                  
                  <div className="flex-1 md:hidden lg:block"></div>
                </motion.div>
              ))}
            </motion.div>
          </div>
          
          <div className="mt-16 text-center">
            <motion.a
              href="#"
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="inline-flex items-center text-primary-600 font-medium hover:text-primary-800 transition-colors"
            >
              <span>Ver galería histórica</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </motion.a>
          </div>
        </Seccion>
      </div>
      
      {/* Misión y Visión */}
      <Seccion className="py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <motion.div 
            className="order-2 md:order-1"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1516738901171-8eb4fc13bd20?ixlib=rb-4.0.3" 
                alt="Lancha navegando cerca de las Islas Ballestas" 
                className="rounded-xl shadow-2xl w-full h-auto"
              />
              
              <div className="absolute -bottom-8 -left-8 bg-white rounded-xl shadow-lg p-4 max-w-xs hidden md:block">
                <div className="flex items-center">
                  <span className="flex-shrink-0">
                    <svg className="h-12 w-12 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </span>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-800">Destinos exclusivos</h4>
                    <p className="text-sm text-gray-600">Acceso a lugares ocultos que solo los locales conocen</p>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-8 -right-8 bg-primary-500 text-white rounded-full w-24 h-24 flex items-center justify-center shadow-lg hidden md:flex">
                <div className="text-center">
                  <div className="text-2xl font-bold">100%</div>
                  <div className="text-xs">Seguridad</div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="order-1 md:order-2"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.span 
              variants={fadeIn}
              className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4"
            >
              Nuestra Filosofía
            </motion.span>
            
            <motion.h2 
              variants={fadeIn}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-6"
            >
              Comprometidos con la excelencia y la sostenibilidad
            </motion.h2>
            
            <motion.div variants={fadeIn} className="mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nuestra Misión</h3>
              <p className="text-gray-600">
                Proporcionar experiencias marítimas inolvidables y seguras que conecten a nuestros visitantes con la riqueza natural de las costas de Pisco, fomentando la conservación del ecosistema marino y contribuyendo al desarrollo sostenible de nuestra comunidad.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="mb-8">
              <h3 className="text-xl font-bold text-gray-800 mb-2">Nuestra Visión</h3>
              <p className="text-gray-600">
                Ser reconocidos internacionalmente como la empresa líder en turismo marino sostenible en América Latina, con un modelo de negocio que equilibre la excelencia en el servicio, la innovación constante y el compromiso con la preservación del océano para las futuras generaciones.
              </p>
            </motion.div>
            
            <motion.div 
              variants={fadeIn}
              className="flex items-center"
            >
              <div className="mr-4">
                <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                  <svg className="h-6 w-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-800">Respaldo y Experiencia</h4>
                <p className="text-sm text-gray-600">Certificados por organizaciones internacionales de turismo sostenible</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Seccion>
      
      {/* Valores con animación */}
      <div className="py-16 bg-gray-50">
        <Seccion>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="inline-block bg-primary-100 text-primary-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Nuestros Pilares
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Valores que nos han guiado durante 20 años
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Estos principios fundamentales han definido nuestra trayectoria y seguirán orientando nuestro compromiso con clientes, comunidad y medio ambiente.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {valores.map((valor, index) => (
              <motion.div
                key={valor.id}
                variants={scaleIn}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ translateY: -10 }}
                className="bg-white rounded-xl p-6 shadow-lg border-t-4 border-primary-500"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mb-6">
                  {valor.icono}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {valor.titulo}
                </h3>
                <p className="text-gray-600">
                  {valor.descripcion}
                </p>
              </motion.div>
            ))}
          </div>
        </Seccion>
      </div>
      
      {/* Galería con efecto parallax */}
      <Seccion className="py-16 overflow-hidden">
        <motion.div
          variants={fadeIn}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block bg-ocean-100 text-ocean-700 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Nuestras Experiencias
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
            Revive nuestros momentos más destacados
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            A través de dos décadas, hemos capturado innumerables momentos mágicos en el mar. Estas son solo algunas de las experiencias que ofrecemos.
          </p>
        </motion.div>
        
        <div className="relative">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="col-span-2 row-span-2 relative rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src="https://lanzaroteofficial.com/wp-content/uploads/2024/07/b4f5d130-b547-4dff-b974-10e8f822dd66.jpeg" 
                alt="Delfines nadando" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6">
                <div className="text-white">
                  <h3 className="text-xl font-bold">Avistamiento de delfines</h3>
                  <p>Una experiencia mágica con estos inteligentes mamíferos marinos</p>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src="https://www.carbonell-law.org/NuevoDiseno/ozonomio/revista143/Imagenes/misc%202.jpg" 
                alt="Islas Ballestas" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src="https://islasballestas.net/wp-content/uploads/2023/09/tour-islas-ballestas-paracas.jpg" 
                alt="Paseo en lancha" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src="https://images.trvl-media.com/lodging/19000000/18640000/18637500/18637491/c9464d89.jpg?impolicy=resizecrop&rw=575&rh=575&ra=fill" 
                alt="Aves marinas" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              className="rounded-xl overflow-hidden shadow-lg"
            >
              <img 
                src="https://usil-blog.s3.amazonaws.com/PROD/blog/image/shutterstock_168633974.jpg" 
                alt="Reserva Nacional de Paracas" 
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
          
          <motion.div 
            className="absolute -bottom-5 -right-5 transform rotate-6 bg-primary-500 text-white py-2 px-4 rounded-lg shadow-lg z-10"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0, rotate: 6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <p className="font-medium">¡Miles de recuerdos creados!</p>
          </motion.div>
        </div>
      </Seccion>
      
      {/* Reconocimientos */}
      <div className="py-16 bg-gray-900 text-white">
        <Seccion>
          <motion.div
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="inline-block bg-primary-500/20 text-primary-300 px-4 py-1 rounded-full text-sm font-medium mb-4">
              Legado y Reconocimiento
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Dos décadas de excelencia reconocida
            </h2>
            <p className="text-lg text-gray-300 max-w-3xl mx-auto">
              A lo largo de nuestra trayectoria, hemos recibido múltiples reconocimientos que avalan nuestro compromiso con la calidad, la seguridad y la sostenibilidad.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-1 bg-gradient-to-r from-primary-500 to-ocean-500"></div>
              <div className="p-6">
                <div className="h-16 mb-4 flex items-center">
                  <svg className="h-12 w-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Certificación Turismo Sostenible</h3>
                <p className="text-gray-400 mb-4">Reconocidos por nuestras prácticas sostenibles y contribución a la conservación del ecosistema marino.</p>
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <span>2019 - Presente</span>
                  <span className="mx-2">•</span>
                  <span>Rainforest Alliance</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-1 bg-gradient-to-r from-primary-500 to-ocean-500"></div>
              <div className="p-6">
                <div className="h-16 mb-4 flex items-center">
                  <svg className="h-12 w-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Premio Nacional de Turismo</h3>
                <p className="text-gray-400 mb-4">Galardonados como la mejor empresa de tours marítimos por la calidad de nuestros servicios.</p>
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <span>2010, 2015, 2020</span>
                  <span className="mx-2">•</span>
                  <span>Ministerio de Turismo</span>
                </div>
              </div>
            </motion.div>
            
            <motion.div
              variants={scaleIn}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-gray-800 rounded-xl overflow-hidden shadow-lg"
            >
              <div className="p-1 bg-gradient-to-r from-primary-500 to-ocean-500"></div>
              <div className="p-6">
                <div className="h-16 mb-4 flex items-center">
                  <svg className="h-12 w-12 text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Certificación de Seguridad Marítima</h3>
                <p className="text-gray-400 mb-4">Cumplimos con los más altos estándares internacionales de seguridad para nuestras embarcaciones.</p>
                <div className="flex items-center text-sm font-medium text-gray-300">
                  <span>2018 - Presente</span>
                  <span className="mx-2">•</span>
                  <span>Marine Safety Council</span>
                </div>
              </div>
            </motion.div>
          </div>
        </Seccion>
      </div>
      
      {/* CTA - Llamado final a la acción */}
      <Seccion className="py-20">
        <div className="relative bg-gradient-to-r from-primary-500 to-ocean-600 rounded-2xl overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 0.1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="absolute top-0 right-0 w-96 h-96"
          >
            <svg width="100%" height="100%" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <path fill="#FFFFFF" d="M40.4,-68.5C52.6,-61.6,62.8,-50.6,70.1,-37.5C77.5,-24.4,82.1,-9.2,79.6,4.5C77.1,18.2,67.4,30.4,57.2,41.8C47,53.3,36.2,63.9,23.3,68.9C10.3,73.9,-4.8,73.3,-20.2,69.7C-35.6,66.1,-51.3,59.6,-61.2,48.3C-71.1,37.1,-75.1,21,-76.8,4.8C-78.5,-11.5,-77.9,-27.9,-70.6,-41.5C-63.3,-55,-49.3,-65.7,-35,-71.2C-20.6,-76.7,-5.9,-77,8.7,-74.7C23.3,-72.3,28.2,-75.4,40.4,-68.5Z" transform="translate(100 100)" />
            </svg>
          </motion.div>
          
          <div className="relative p-10 md:p-16 text-center">
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="max-w-3xl mx-auto"
            >
              <motion.h2 
                variants={fadeIn}
                className="text-3xl md:text-4xl font-bold text-white mb-6"
              >
                Celebrando 20 años de aventuras marinas
              </motion.h2>
              
              <motion.p 
                variants={fadeIn}
                className="text-white text-opacity-90 text-lg mb-8"
              >
                Únete a nosotros y experimenta por qué miles de visitantes nos han elegido durante dos décadas para descubrir las maravillas de las costas de Pisco. Tu aventura inolvidable te espera.
              </motion.p>
              
              <motion.div 
                variants={fadeIn}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  to="/tours"
                  className="px-8 py-4 bg-white text-primary-600 font-medium rounded-lg hover:bg-gray-100 transition-all duration-300 shadow-lg transform hover:-translate-y-1"
                >
                  Explorar Nuestros Tours
                </Link>
                <Link
                  to="/contacto"
                  className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white/10 transition-all duration-300"
                >
                  Contáctanos
                </Link>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Seccion>
    </div>
  );
};

export default PaginaSobreNosotros;