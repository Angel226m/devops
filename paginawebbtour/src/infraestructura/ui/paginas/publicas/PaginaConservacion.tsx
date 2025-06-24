 import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
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
  gradient: string;
  icono: JSX.Element;
}

interface ProtocoloData {
  titulo: string;
  descripcion: string;
  icono: JSX.Element;
  color: string;
}

interface TecnologiaData {
  titulo: string;
  descripcion: string;
  icono: JSX.Element;
  color: string;
}

interface ResultadoData {
  cifra: string;
  descripcion: string;
  icono: JSX.Element;
  color: string;
}

const PaginaConservacion = () => {
  const { t } = useTranslation();
  const [tabActivo, setTabActivo] = useState<EspecieKey>('pinguinos');
  const [scrollY, setScrollY] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  
  // Referencias para animaciones basadas en scroll
  const headerRef = useRef<HTMLDivElement>(null);
  const especiesRef = useRef<HTMLDivElement>(null);
  const protocolosRef = useRef<HTMLDivElement>(null);
  const resultadosRef = useRef<HTMLDivElement>(null);
  const tecnologiaRef = useRef<HTMLDivElement>(null);
  
  // Estado para animaciones en scroll
  const isEspeciesInView = useInView(especiesRef, { once: false, amount: 0.2 });
  const isProtocolosInView = useInView(protocolosRef, { once: false, amount: 0.2 });
  const isResultadosInView = useInView(resultadosRef, { once: false, amount: 0.2 });
  const isTecnologiaInView = useInView(tecnologiaRef, { once: false, amount: 0.2 });
  
  // Efecto para animación de paralaje en scroll
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para pre-cargar imágenes
  useEffect(() => {
    // Guardar imágenes en localStorage para evitar cargar de nuevo
    const checkCachedImages = () => {
      const cachedImages = localStorage.getItem('conservacionImagesCached');
      if (cachedImages) {
        setImagesLoaded(true);
        return true;
      }
      return false;
    };

    if (!checkCachedImages()) {
      const imageUrls = [
        'https://www.conaf.cl/wp-content/uploads/2024/04/RN-Pinguino-de-Humboldt-Pinguino-de-Humboldt-8.jpg',
        'https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
        'https://cdn.sanity.io/images/xhhnkk4g/production/c47f6d94ef07862864922d17dec79ddb119cf694-1080x720.webp?w=3840&q=65&fit=clip&auto=format',
        'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/63/19/7d/caption.jpg?w=500&h=400&s=1',
      ];

      let loadedCount = 0;
      imageUrls.forEach(src => {
        const img = new Image();
        img.src = src;
        img.onload = () => {
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            setImagesLoaded(true);
            localStorage.setItem('conservacionImagesCached', 'true');
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            setImagesLoaded(true);
          }
        };
      });
    }
  }, []);

  // Iconos para especies
  const iconos = {
    pinguino: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348c.21.21.329.497.329.795v1.089c0 .426.24.815.622 1.006l.153.076c.433.217.956.132 1.298-.21l.723-.723a8.7 8.7 0 002.288-4.042 1.087 1.087 0 00-.358-1.099l-1.33-1.108c-.251-.21-.582-.299-.905-.245l-1.17.195a1.125 1.125 0 01-.98-.314l-.295-.295a1.125 1.125 0 010-1.591l.13-.132a1.125 1.125 0 011.3-.21l.603.302a.809.809 0 001.086-1.086L14.25 7.5l1.256-.837a4.5 4.5 0 001.528-1.732l.146-.292" />
      </svg>
    ),
    lobo: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    ballena: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082" />
      </svg>
    ),
    ave: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
      </svg>
    )
  };

  // Datos de las especies para los tabs
  const especiesData: Record<EspecieKey, EspecieData> = {
    pinguinos: {
      titulo: 'Pingüinos de Humboldt',
      imagen: 'https://www.conaf.cl/wp-content/uploads/2024/04/RN-Pinguino-de-Humboldt-Pinguino-de-Humboldt-8.jpg',
      descripcion: 'El pingüino de Humboldt (Spheniscus humboldti) es una especie vulnerable que habita en las costas de Perú y Chile. En la Reserva Nacional de Paracas, alberga importantes colonias de anidación que protegemos rigurosamente siguiendo los lineamientos de SERNANP.',
      protocolos: [
        'Mantenemos distancias respetuosas de las colonias según estándares de SERNANP',
        'Reducimos la velocidad y el ruido de motores al acercarnos a sus zonas',
        'Evitamos visitas durante períodos críticos de reproducción',
        'Monitoreamos constantemente las poblaciones para detectar cambios'
      ],
      color: 'bg-blue-600',
      gradient: 'from-blue-600 via-blue-500 to-indigo-700',
      icono: iconos.pinguino
    },
    lobos: {
      titulo: 'Lobos Marinos Sudamericanos',
      imagen: 'https://images.unsplash.com/photo-1557127275-f8b5ba93e24e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80',
      descripcion: 'Los lobos marinos (Otaria flavescens) forman grandes colonias en las Islas Ballestas. Estas colonias son vitales para el ecosistema marino y constituyen uno de los principales atractivos de la reserva protegida por SERNANP.',
      protocolos: [
        'Mantenemos distancias adecuadas de las colonias según normativa vigente',
        'Controlamos el tiempo de observación según protocolos establecidos',
        'Prohibimos cualquier intento de alimentación o interacción directa',
        'Evitamos interrumpir sus comportamientos naturales de reproducción y descanso'
      ],
      color: 'bg-teal-600',
      gradient: 'from-teal-600 via-teal-500 to-cyan-700',
      icono: iconos.lobo
    },
    ballenas: {
      titulo: 'Ballenas y Cetáceos',
      imagen: 'https://cdn.sanity.io/images/xhhnkk4g/production/c47f6d94ef07862864922d17dec79ddb119cf694-1080x720.webp?w=3840&q=65&fit=clip&auto=format',
      descripcion: 'Varias especies de cetáceos, incluyendo la ballena jorobada (Megaptera novaeangliae) y el delfín nariz de botella (Tursiops truncatus), habitan temporalmente las aguas de la Reserva Nacional de Paracas durante sus migraciones anuales.',
      protocolos: [
        'Nunca perseguimos a los cetáceos, permitiendo que ellos decidan el nivel de interacción',
        'Mantenemos velocidad constante y predecible al avistarlos',
        'Controlamos el tiempo de observación según normativas de SERNANP',
        'Evitamos acercarnos a madres con crías y grupos en alimentación'
      ],
      color: 'bg-purple-600',
      gradient: 'from-purple-600 via-purple-500 to-indigo-700',
      icono: iconos.ballena
    },
    aves: {
      titulo: 'Aves Marinas',
      imagen: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/63/19/7d/caption.jpg?w=500&h=400&s=1',
      descripcion: 'Las Islas Ballestas albergan una increíble diversidad de aves marinas, incluyendo pelícanos peruanos, cormoranes, piqueros, gaviotas y el famoso guanay. Estas aves son fundamentales para el ecosistema y la producción de guano.',
      protocolos: [
        'Mantenemos motores en neutro cuando estamos cerca de aves que pescan o descansan',
        'Evitamos acercarnos a acantilados de anidación durante la temporada reproductiva',
        'Prohibimos cualquier ruido fuerte que pueda causar abandono de nidos',
        'Respetamos las zonas establecidas por SERNANP para proteger las colonias de aves'
      ],
      color: 'bg-amber-600',
      gradient: 'from-amber-600 via-orange-500 to-red-700',
      icono: iconos.ave
    }
  };

  // Protocolos generales de conservación con iconos más relacionados
  const protocolos: ProtocoloData[] = [
    {
      titulo: 'Horarios Regulados',
      descripcion: 'Respetamos estrictamente los horarios establecidos por SERNANP, diseñados para minimizar el impacto en los ciclos naturales de alimentación y descanso de la fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-700'
    },
    {
      titulo: 'Control de Aforo',
      descripcion: 'Cumplimos con los límites de capacidad de carga establecidos por SERNANP para la Reserva Nacional de Paracas, evitando la saturación del ecosistema.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: 'from-teal-500 to-teal-700'
    },
    {
      titulo: 'Zonas Restringidas',
      descripcion: 'Respetamos las zonas de exclusión y amortiguamiento establecidas por SERNANP, especialmente durante temporadas críticas de reproducción y anidación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: 'from-red-500 to-red-700'
    },
    {
      titulo: 'Navegación Responsable',
      descripcion: 'Nuestras embarcaciones siguen rutas predefinidas aprobadas por SERNANP, controlando la velocidad para reducir el impacto acústico y la contaminación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      titulo: 'Guías Certificados',
      descripcion: 'Nuestros guías están capacitados y certificados por SERNANP para garantizar prácticas responsables de observación de fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-green-500 to-green-700'
    },
    {
      titulo: 'Cero Residuos',
      descripcion: 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones, en cumplimiento con las normativas ambientales de SERNANP.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-700'
    }
  ];

  // Tecnologías para conservación con iconos más adecuados
  const tecnologias: TecnologiaData[] = [
    {
      titulo: 'GPS y Seguimiento de Rutas',
      descripcion: 'Todas nuestras embarcaciones están equipadas con GPS que monitorean la velocidad y aseguran que se respeten las rutas establecidas por SERNANP.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
      ),
      color: 'from-blue-600 to-indigo-800'
    },
    {
      titulo: 'Sensores Acústicos',
      descripcion: 'Monitoreamos los niveles de ruido de nuestras embarcaciones para garantizar que se mantengan por debajo de los umbrales que podrían afectar a la fauna.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0 0l-2.828 2.828a1 1 0 01-1.414 0 1 1 0 010-1.414L5.586 15.536z" />
        </svg>
      ),
      color: 'from-teal-600 to-green-800'
    },
    {
      titulo: 'Motores de Bajo Impacto',
      descripcion: 'Nuestras embarcaciones utilizan motores de última generación con tecnología de reducción de emisiones y baja huella acústica.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      color: 'from-amber-600 to-orange-800'
    },
    {
      titulo: 'Sistema de Registro Digital',
      descripcion: 'Documentamos cada avistamiento para contribuir a la base de datos científica de SERNANP sobre poblaciones y comportamiento de la fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'from-purple-600 to-pink-800'
    }
  ];

  // Resultados tangibles con iconos más apropiados
  const resultados: ResultadoData[] = [
    {
      cifra: '+5.000',
      descripcion: 'Kg de residuos plásticos evitados en el ecosistema marino',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      cifra: '15%',
      descripcion: 'Reducción en el número de embarcaciones en zonas sensibles',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
        </svg>
      ),
      color: 'from-sky-400 to-sky-600'
    },
    {
      cifra: '+20%',
      descripcion: 'Aumento en la población de pingüinos de Humboldt',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      cifra: '0',
      descripcion: 'Incidentes de perturbación significativa en los últimos 3 años',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      color: 'from-rose-400 to-rose-600'
    }
  ];

  // Animaciones optimizadas
  const tabVariants = {
    hidden: { opacity: 0, x: 10 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut"
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
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const fadeInUp = {
    hidden: { y: 60, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      }
    }
  };
  
  // Loader para mostrar mientras cargan las imágenes
  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <svg className="animate-spin -ml-1 mr-3 h-12 w-12 text-blue-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600 mt-4">Cargando recursos para una mejor experiencia...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden">
      {/* Cabecera con video de fondo */}
      <div 
        ref={headerRef}
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Fondo con efecto de profundidad */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
              transform: `translateY(${scrollY * 0.4}px)`,
              opacity: 0.7
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-teal-800/60 to-transparent backdrop-blur-[1px]" />
        </div>
        
        {/* Elementos flotantes decorativos animados */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Burbuja animada 1 */}
          <motion.div 
            animate={{ 
              y: [0, -150, 0],
              x: [0, 50, 0],
              scale: [1, 1.1, 1],
              rotate: [0, 10, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 25,
              ease: "linear" 
            }}
            className="absolute left-[15%] top-[60%] w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 to-cyan-300 opacity-20 blur-xl"
          />
          
          {/* Burbuja animada 2 */}
          <motion.div 
            animate={{ 
              y: [0, -100, 0],
              x: [0, -30, 0],
              scale: [1, 1.2, 1],
              rotate: [0, -5, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 20,
              ease: "linear",
              delay: 2
            }}
            className="absolute right-[20%] top-[70%] w-24 h-24 rounded-full bg-gradient-to-r from-teal-400 to-green-300 opacity-20 blur-xl"
          />
          
          {/* Burbuja animada 3 */}
          <motion.div 
            animate={{ 
              y: [0, -120, 0],
              x: [0, 20, 0],
              scale: [1, 1.15, 1],
              rotate: [0, 7, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 22,
              ease: "linear",
              delay: 5
            }}
            className="absolute left-[40%] top-[80%] w-28 h-28 rounded-full bg-gradient-to-r from-indigo-400 to-purple-300 opacity-20 blur-xl"
          />
        </div>
        
        {/* Contenido principal del header */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              ease: "easeOut"
            }}
            className="mb-8"
          >
            <span className="inline-block py-2 px-6 bg-white/10 backdrop-blur-md rounded-full text-xl font-semibold uppercase tracking-wider text-cyan-100 shadow-lg">
              Ocean Tours Paracas
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.2,
              ease: "easeOut"
            }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-xl"
          >
            <span className="inline-block bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
              {t('conservacion.titulo', 'Conservación Marina')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.4,
              ease: "easeOut"
            }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md"
          >
            {t('conservacion.subtitulo', 'Implementamos protocolos rigurosos según las normativas de SERNANP para preservar el ecosistema marino de Paracas y las Islas Ballestas.')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              duration: 1,
              delay: 0.6,
              ease: "easeOut"
            }}
            className="mt-10"
          >
            <a 
              href="#especies"
              className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden font-medium text-indigo-600 transition-all duration-300 ease-out border-2 border-blue-100/80 rounded-full shadow-md bg-white/10 backdrop-blur-md"
            >
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 translate-y-full bg-gradient-to-r from-blue-600 to-teal-600 group-hover:translate-y-0 ease"></span>
              <span className="absolute flex items-center justify-center w-full h-full text-blue-100 transition-all duration-300 transform group-hover:translate-y-full ease">Descubrir Nuestros Protocolos</span>
              <span className="relative invisible">Descubrir Nuestros Protocolos</span>
            </a>
          </motion.div>
        </div>
        
        {/* Efecto de ondas en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 overflow-hidden">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto translate-y-0.5">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L40,138.7C80,149,160,171,240,176C320,181,400,171,480,149.3C560,128,640,96,720,90.7C800,85,880,107,960,138.7C1040,171,1120,213,1200,213.3C1280,213,1360,171,1400,149.3L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Sección de introducción con efecto 3D */}
      <div className="py-20 px-4 bg-white relative">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-500 transform -skew-x-12 opacity-20 rounded-lg"></span>
                <span className="relative bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                  Nuestro Compromiso
                </span>
              </span>
            </motion.div>
            
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Protegiendo el{' '}
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 transform rotate-1 opacity-10 rounded-lg"></span>
                <span className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                  Ecosistema Marino
                </span>
              </span>{' '}
              de Paracas
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-700 leading-relaxed"
            >
              Como operador turístico autorizado por SERNANP, trabajamos en armonía con la naturaleza, siguiendo estrictos protocolos para garantizar que nuestras actividades respeten los ciclos naturales de la fauna marina y contribuyan a la conservación de este frágil ecosistema.
            </motion.p>
          </div>
        </div>
        
        {/* Elementos decorativos */}
        <div className="absolute -top-10 -right-20 w-64 h-64 bg-gradient-to-br from-blue-200 to-teal-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Sección de especies protegidas con tabs mejorados */}
      <div id="especies" ref={especiesRef} className="py-16 px-4 bg-gradient-to-b from-white to-blue-50 relative">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isEspeciesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 transform -skew-x-12 opacity-20 rounded-lg"></span>
                <span className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                  Fauna Marina Protegida
                </span>
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Protocolos Específicos por Especie
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              Aplicamos protocolos diseñados junto con SERNANP para cada especie, respetando sus comportamientos naturales y minimizando el impacto de nuestras visitas.
            </motion.p>
          </motion.div>

          {/* Tabs de selección de especies con efecto de hover mejorado */}
          <div className="mb-12 flex flex-wrap justify-center gap-6">
            {(Object.keys(especiesData) as EspecieKey[]).map((key) => (
              <motion.button
                key={key}
                onClick={() => setTabActivo(key)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden group"
              >
                <div className={`px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-lg flex items-center gap-3 ${
                  tabActivo === key 
                    ? `text-white ${especiesData[key].color} shadow-xl`
                    : 'bg-white text-gray-700 hover:text-blue-600 border border-gray-200 hover:border-blue-200 hover:shadow-blue-100'
                }`}
                >
                  <span className={`${tabActivo === key ? 'text-white' : 'text-blue-600'} transition-all duration-300`}>
                    {especiesData[key].icono}
                  </span>
                  <span className="font-medium text-lg">{especiesData[key].titulo}</span>
                  
                  {/* Efecto de brillo al pasar el cursor */}
                  <span className="absolute inset-0 w-full h-full bg-white/30 translate-x-full transform skew-x-12 group-hover:translate-x-[-180%] transition-all duration-700"></span>
                </div>
                
                {/* Efecto de selección */}
                {tabActivo === key && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-teal-400"
                  />
                )}
              </motion.button>
            ))}
          </div>

          {/* Contenido de cada tab con animación mejorada */}
          <AnimatePresence mode="wait">
            <motion.div
              key={tabActivo}
              variants={tabVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={`bg-gradient-to-br ${especiesData[tabActivo].gradient} rounded-3xl overflow-hidden shadow-2xl mb-16 transform`}
              style={{
                boxShadow: '0 20px 80px -20px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 md:p-12">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl text-white">
                      {especiesData[tabActivo].icono}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {especiesData[tabActivo].titulo}
                    </h3>
                  </div>
                  
                  <div className="text-white/90 space-y-6">
                    <p className="text-xl leading-relaxed">{especiesData[tabActivo].descripcion}</p>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-8 border border-white/20">
                      <h4 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {t('conservacion.protocolosTitulo', 'Protocolos de Protección')}
                      </h4>
                      <ul className="space-y-4">
                        {especiesData[tabActivo].protocolos.map((protocolo, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="flex items-start gap-4 group"
                          >
                            <div className="mt-1 bg-white/20 p-1 rounded-full group-hover:bg-white/40 transition-all duration-300">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white/95 text-lg group-hover:text-white transition-all duration-300">{protocolo}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="relative h-80 lg:h-auto overflow-hidden">
                  <motion.div
                    initial={{ scale: 1.2, y: 20 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className="h-full"
                  >
                    <img 
                      src={especiesData[tabActivo].imagen} 
                      alt={especiesData[tabActivo].titulo} 
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Overlay con efecto de viñeta para mejorar la visibilidad */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
                    
                    {/* Indicador de crédito de la imagen */}
                    <div className="absolute bottom-4 right-4 text-white/80 text-xs backdrop-blur-sm bg-black/30 px-2 py-1 rounded-md">
                      Foto: SERNANP
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Elemento decorativo */}
        <div className="absolute -bottom-40 right-0 w-80 h-80 bg-gradient-to-br from-blue-200 to-cyan-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Protocolos de conservación con tarjetas más atractivas */}
      <div 
        ref={protocolosRef}
        id="protocolos"
        className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white relative"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isProtocolosInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 transform -skew-x-12 opacity-20 rounded-lg"></span>
                <span className="relative bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                  Normativas SERNANP
                </span>
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Control de Visitas y Protección del Ecosistema
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              Implementamos medidas establecidas por SERNANP para regular el acceso a zonas sensibles y minimizar nuestro impacto en el ecosistema marino de Paracas.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {protocolos.map((protocolo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ 
                  duration: 0.7, 
                  delay: index * 0.1,
                  ease: "easeOut"
                }}
                whileHover={{ 
                  y: -10,
                  transition: { duration: 0.3 }
                }}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${protocolo.color} transform origin-left transition-all duration-500 group-hover:h-3`}></div>
                <div className="p-8">
                  <div className="rounded-xl p-4 bg-gradient-to-r from-gray-50 to-blue-50 mb-6 w-16 h-16 flex items-center justify-center text-blue-600 group-hover:scale-110 group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-cyan-50 transition-all duration-500">
                    {protocolo.icono}
                  </div>
                  
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {protocolo.titulo}
                  </h4>
                  
                  <p className="text-gray-600 text-lg group-hover:text-gray-700 transition-colors duration-300">
                    {protocolo.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Elemento decorativo */}
        <div className="absolute -top-40 -left-20 w-72 h-72 bg-gradient-to-br from-teal-200 to-green-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Resultados tangibles con contador animado */}
      <div 
        ref={resultadosRef}
        className="py-20 px-4 bg-gradient-to-b from-white to-blue-50 relative"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isResultadosInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 transform -skew-x-12 opacity-20 rounded-lg"></span>
                <span className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                  Impacto Medible
                </span>
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Resultados de Nuestras Medidas de Protección
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              El cumplimiento de los lineamientos de SERNANP y nuestros protocolos adicionales han generado resultados medibles en la conservación del ecosistema marino.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {resultados.map((resultado, index) => (
              <motion.div 
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.8,
                      delay: index * 0.2,
                      ease: "easeOut"
                    }
                  }
                }}
                className="group bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl hover:border-blue-100 transition-all duration-500"
              >
                <div className={`h-2 bg-gradient-to-r ${resultado.color} transform origin-left transition-all duration-500 group-hover:h-3`}></div>
                
                <div className="p-8 relative z-10 flex flex-col items-center">
                  <div className={`bg-gradient-to-br ${resultado.color} text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {resultado.icono}
                  </div>
                  
                  <motion.div 
                    initial={{ scale: 0.5, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ 
                      delay: 0.3 + index * 0.2,
                      duration: 0.8,
                      type: "spring",
                      stiffness: 100
                    }}
                    className="relative flex justify-center mb-4"
                  >
                    <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text group-hover:from-blue-700 group-hover:to-teal-700 transition-all duration-300">
                      {resultado.cifra}
                    </h3>
                  </motion.div>
                  
                  <p className="text-gray-700 text-lg text-center group-hover:text-gray-900 transition-colors duration-300">
                    {resultado.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Elemento decorativo */}
        <div className="absolute -bottom-40 -left-20 w-80 h-80 bg-gradient-to-br from-purple-200 to-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      </div>
      
      {/* Tecnología para conservación con efecto de profundidad */}
      <div 
              ref={tecnologiaRef}
        className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white relative"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isTecnologiaInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="relative inline-block">
                <span className="absolute inset-0 bg-gradient-to-r from-teal-400 to-blue-400 transform -skew-x-12 opacity-20 rounded-lg"></span>
                <span className="relative bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                  Innovación
                </span>
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Tecnología al Servicio de la Conservación
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              Utilizamos tecnología avanzada para monitorear el ecosistema y garantizar el cumplimiento de los protocolos establecidos por SERNANP.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl transform hover:scale-[1.02] transition-transform duration-500 relative">
                <img 
                  src="https://images.unsplash.com/photo-1587930508275-3a869c8f0ac3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Tecnología de conservación" 
                  className="w-full h-full object-cover"
                />
                
                {/* Overlay para mejorar la visibilidad */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-blue-900/30"></div>
                
                {/* Decoración tipo HUD en la imagen */}
                <div className="absolute top-4 left-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm">
                  Sistema GPS Activo
                </div>
                
                <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm">
                  Monitoreo SERNANP
                </div>
                
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 border-2 border-white/30 rounded-full flex items-center justify-center">
                  <div className="w-20 h-20 border-2 border-white/20 rounded-full flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-full"></div>
                  </div>
                </div>
              </div>
              
              {/* Elementos decorativos de profundidad */}
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gradient-to-br from-blue-500 to-teal-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-20 blur-3xl"></div>
            </motion.div>
            
            <div className="space-y-8">
              {tecnologias.map((tecnologia, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.8,
                    delay: index * 0.15,
                    ease: "easeOut"
                  }}
                  className="group bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100 hover:border-blue-100"
                >
                  <div className="flex gap-5">
                    <div className={`flex-shrink-0 p-4 bg-gradient-to-br ${tecnologia.color} text-white rounded-xl transform group-hover:scale-110 transition-transform duration-300`}>
                      {tecnologia.icono}
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                        {tecnologia.titulo}
                      </h4>
                      <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
                        {tecnologia.descripcion}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Sección de certificaciones con efecto de glassmorphism */}
      <div className="py-20 px-4 bg-blue-50 relative overflow-hidden">
        {/* Elementos decorativos de fondo */}
        <div className="absolute -top-60 -right-40 w-96 h-96 bg-gradient-to-br from-blue-300 to-teal-300 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-indigo-300 to-purple-300 rounded-full opacity-20 blur-3xl"></div>
        
        <div className="container mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="relative inline-block">
              <span className="absolute inset-0 bg-gradient-to-r from-blue-400 to-teal-400 transform -skew-x-12 opacity-20 rounded-lg"></span>
              <span className="relative bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider mb-4 inline-block">
                Reconocimiento
              </span>
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Certificaciones y Reconocimientos
            </h2>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-wrap justify-center items-center gap-10"
          >
            {['SERNANP', 'Reserva', 'WWF', 'Ministerio'].map((logo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ 
                  delay: index * 0.1 + 0.3,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 100
                }}
                whileHover={{ 
                  scale: 1.1,
                  rotate: [0, -2, 0, 2, 0]
                }}
                className="group bg-white/70 backdrop-blur-lg p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/80"
              >
                <img 
                  src={`https://via.placeholder.com/150x50?text=${logo}`} 
                  alt={`${logo} de Turismo Sostenible`} 
                  className="h-16 grayscale group-hover:grayscale-0 transition-all duration-500" 
                />
                
                {/* Elemento de brillo */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-white/0 via-white/40 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Llamado a la acción con efecto de paralaje */}
      <div className="relative py-20 px-4 overflow-hidden">
        {/* Fondo con paralaje */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1540968221243-29f5d70540bf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
              transform: `translateY(${scrollY * 0.2}px)`,
              opacity: 0.5
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-700/90 to-teal-700/90"></div>
        </div>
        
        <div className="container mx-auto relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-md"
            >
              Explora la Reserva de manera responsable
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 mb-10 drop-shadow-sm"
            >
              Descubre la belleza natural de las Islas Ballestas con un operador comprometido con la conservación y autorizado por SERNANP
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <a 
                href="/tours" 
                className="group relative inline-flex items-center justify-center px-10 py-5 overflow-hidden font-medium text-blue-600 transition-all duration-300 ease-out rounded-full shadow-2xl bg-white"
              >
                <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-gradient-to-r from-blue-600 to-teal-600 group-hover:translate-x-0 ease"></span>
                <span className="absolute flex items-center justify-center w-full h-full text-blue-600 transition-all duration-300 transform group-hover:translate-x-full ease">Reservar un Tour Sostenible</span>
                <span className="relative invisible">Reservar un Tour Sostenible</span>
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaConservacion;