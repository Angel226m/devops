 import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import { useTranslation } from 'react-i18next';

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

interface BeneficioData {
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
  const beneficiosRef = useRef<HTMLDivElement>(null);
  
  // Estado para animaciones en scroll
  const isEspeciesInView = useInView(especiesRef, { once: false, amount: 0.2 });
  const isProtocolosInView = useInView(protocolosRef, { once: false, amount: 0.2 });
  const isResultadosInView = useInView(resultadosRef, { once: false, amount: 0.2 });
  const isBeneficiosInView = useInView(beneficiosRef, { once: false, amount: 0.2 });
  
  // Efecto para animación de paralaje en scroll
  useEffect(() => {
    // Desplazar al inicio de la página
    window.scrollTo(0, 0);
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Efecto para pre-cargar imágenes
  useEffect(() => {
    try {
      // Comprobar si las imágenes están en caché
      const cachedImages = localStorage.getItem('conservacionImagesCached');
      if (cachedImages) {
        setImagesLoaded(true);
        return;
      }
      
      // Precarga de imágenes
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
            try {
              localStorage.setItem('conservacionImagesCached', 'true');
            } catch (error) {
              console.log('Error al guardar en localStorage');
            }
          }
        };
        img.onerror = () => {
          loadedCount++;
          if (loadedCount === imageUrls.length) {
            setImagesLoaded(true);
          }
        };
      });
    } catch (error) {
      // En caso de error, permitir que se cargue la página
      setImagesLoaded(true);
    }
  }, []);

  // Iconos de animales mejorados para cada categoría
  const iconos = {
    pinguino: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2c1.1 0 2 .9 2 2s-.9 2-2 2-2-.9-2-2 .9-2 2-2zm-1 6c0-1.1.9-2 2-2s2 .9 2 2v1h1c1.1 0 2 .9 2 2s-.9 2-2 2h-1v1.93c-.61-.35-1.16-.78-1.65-1.27l-1.66-1.66H9.83c-.55 0-1 .45-1 1s.45 1 1 1h.91c-.38.73-.84 1.4-1.37 2H5C3.9 16 3 15.1 3 14c0-1.1.9-2 2-2h1.67C7.57 10.14 8 8.42 8 7.39V7c0-.55.45-1 1-1h2v2z"/>
      </svg>
    ),
    lobo: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16.84 14.52c-.21-.33-.5-.62-.83-.83.34-.23.59-.54.75-.89h.01c.72-.09 1.32-.58 1.53-1.27.36-1.18-.15-2.42-1.12-3.07.67-.93.98-2.14.64-3.33-.34-1.18-1.3-2.07-2.47-2.34-1.12-1.24-3.3-1.24-4.63.06-1.21.21-2.24 1.11-2.61 2.3-.36 1.19-.05 2.43.66 3.4-.94.66-1.42 1.86-1.1 3.03.24.74.84 1.28 1.56 1.44.18.33.44.61.77.82-.34.21-.64.5-.85.84l-2.34-.73C4.2 13.46 2 13.95 2 15.82v4.28c0 .55.45 1 1 1h1v-4.66l1.25.34c-.01.07-.02.13-.02.2 0 1.24.89 2.33 2.12 2.89.87.35 1.82.35 2.69 0 1.24-.55 2.12-1.65 2.12-2.89 0-.07-.01-.13-.02-.2l2.39-.65-3.34-1.03.01-.03c.12-.42.32-.79.59-1.09.32-.36.75-.63 1.22-.75.47-.12.96-.05 1.39.19.75.43 1.21 1.24 1.21 2.08 0 .07-.01.13-.02.2l-1.21.33v4.66h2v-4.69l1.21-.33c0-.07-.02-.14-.02-.2 0-1.24.88-2.33 2.12-2.89.87-.35 1.82-.35 2.69 0 1.24.55 2.12 1.65 2.12 2.89 0 .07-.01.13-.02.2l1.25-.34v4.66h1c.55 0 1-.45 1-1v-4.28c0-1.87-2.2-2.36-3.8-1.88l-2.28.74z"/>
      </svg>
    ),
    ballena: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 14c-1.66 0-3-1.34-3-3 0-1.31.84-2.41 2-2.83V12c0 1.1.9 2 2 2h5.17c-.83.59-1.83.95-2.92.96-.65-.96-1.79-1.63-3.09-1.63-2.03 0-3.77 1.71-3.97 3.95C1.74 17.57 1 16.85 1 16V5c0-.55.45-1 1-1s1 .45 1 1v1.37C4.5 4.02 7.04 3 9.83 3c3.11 0 5.97 1.42 7.86 3.75.32.41.71.75 1.17 1.05.12.08.25.14.39.2.65.3 1.28.67 1.87 1.11.22.17.37.38.48.61.17.37.26.76.26 1.16V18c0 1.1-.9 2-2 2-.97 0-1.77-.7-1.94-1.62C18 14.13 14.5 11 10.5 11c-.5 0-1-.08-1.47-.2-.28.06-.56.14-.82.26-.29.13-.54.29-.75.45H7z"/>
      </svg>
    ),
    ave: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 10c.32-3.28-4.28-6-9.99-6S1.7 6.72 2.02 10H22zM5.35 13.5c.55 0 .99.44.99.99 0 .55-.44.99-.99.99s-.99-.44-.99-.99c.01-.55.45-.99.99-.99zM2 17.08V20h20v-2.92c-2.63-.82-5.28-1.25-8-1.27v1.81L11.98 16l-2.03 1.62v-1.81c-2.72.03-5.37.46-7.95 1.27z"/>
      </svg>
    )
  };

  // Iconos para protocolos con animales/vida marina
  const protocolIconos = {
    horarios: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 18H5V9h14v12zm-7-8c0 .55-.45 1-1 1s-1-.45-1-1V9.25c0-.41.34-.75.75-.75s.75.34.75.75V13zm4 2c0 .55-.45 1-1 1s-1-.45-1-1v-1.25c0-.41.34-.75.75-.75s.75.34.75.75V15zm-8-2c0 .55-.45 1-1 1s-1-.45-1-1V9.25c0-.41.34-.75.75-.75s.75.34.75.75V13z"/>
      </svg>
    ),
    aforo: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5s-3 1.34-3 3 1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
      </svg>
    ),
    zonas: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4.41 21L6 19.41l-2.12-2.12a3 3 0 0 1 0-4.24l2.83-2.83a3.031 3.031 0 0 1 4.24 0L18.36 17H20v2h-6v-2h1.9l-4.2-4.21-5.76 5.79L4.41 21zM17 5.54l1.78 1.77c.59.59 1.58.59 2.17 0 .58-.59.58-1.53 0-2.12L19.17 3.4c-.58-.59-1.58-.59-2.17 0-.58.59-.58 1.54 0 2.13V5.54zM9.07 9.07a3.12 3.12 0 0 0 0 4.24l.97.97 3.23-3.24-.97-.97c-1.17-1.17-3.07-1.17-4.24 0z"/>
      </svg>
    ),
    navegacion: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M21 14h-1V8c0-1.1-.9-2-2-2H9v2h9v6h-2V6c0-1.1-.9-2-2-2H3c-1.1 0-2 .9-2 2v9c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-5h10v5c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-2h2c1.1 0 2-.9 2-2v-1c0-.55-.45-1-1-1z"/>
      </svg>
    ),
    guias: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z"/>
      </svg>
    ),
    residuos: (
      <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 16h4v2h-4zm0-8h7v2h-7zm0 4h6v2h-6zM3 18c0 1.1.9 2 2 2h6c1.1 0 2-.9 2-2V8H3v10zM10 4H6L5 5H2v2h12V5h-3z"/>
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

  // Protocolos generales de conservación
  const protocolos: ProtocoloData[] = [
    {
      titulo: 'Horarios Regulados',
      descripcion: 'Respetamos estrictamente los horarios establecidos por SERNANP, diseñados para minimizar el impacto en los ciclos naturales de alimentación y descanso de la fauna marina.',
      icono: protocolIconos.horarios,
      color: 'from-blue-500 to-blue-700'
    },
    {
      titulo: 'Control de Aforo',
      descripcion: 'Cumplimos con los límites de capacidad de carga establecidos por SERNANP para la Reserva Nacional de Paracas, evitando la saturación del ecosistema.',
      icono: protocolIconos.aforo,
      color: 'from-teal-500 to-teal-700'
    },
    {
      titulo: 'Zonas Restringidas',
      descripcion: 'Respetamos las zonas de exclusión y amortiguamiento establecidas por SERNANP, especialmente durante temporadas críticas de reproducción y anidación.',
      icono: protocolIconos.zonas,
      color: 'from-red-500 to-red-700'
    },
    {
      titulo: 'Navegación Responsable',
      descripcion: 'Nuestras embarcaciones siguen rutas predefinidas aprobadas por SERNANP, controlando la velocidad para reducir el impacto acústico y la contaminación.',
      icono: protocolIconos.navegacion,
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      titulo: 'Guías Certificados',
      descripcion: 'Nuestros guías están capacitados y certificados por SERNANP para garantizar prácticas responsables de observación de fauna marina.',
      icono: protocolIconos.guias,
      color: 'from-green-500 to-green-700'
    },
    {
      titulo: 'Cero Residuos',
      descripcion: 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones, en cumplimiento con las normativas ambientales de SERNANP.',
      icono: protocolIconos.residuos,
      color: 'from-purple-500 to-purple-700'
    }
  ];

  // Beneficios para la comunidad
  const beneficios: BeneficioData[] = [
    {
      titulo: 'Creación de Empleo Local',
      descripcion: 'Generamos más de 50 puestos de trabajo directos para la comunidad de Paracas, priorizando la contratación de guías, tripulantes y personal administrativo de la zona.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/>
        </svg>
      ),
      color: 'from-blue-600 to-indigo-800'
    },
    {
      titulo: 'Alianzas con Comercios Locales',
      descripcion: 'Colaboramos con restaurantes, hospedajes y artesanos de Paracas para ofrecer a nuestros visitantes una experiencia turística completa que beneficia directamente a la economía local.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M21.9 8.89l-1.05-4.37c-.22-.9-1-1.52-1.91-1.52H5.05c-.9 0-1.69.63-1.9 1.52L2.1 8.89c-.24 1.02-.02 2.06.62 2.88.08.11.19.19.28.29V19c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-6.94c.09-.09.2-.18.28-.28.64-.82.87-1.87.62-2.89zm-2.99-3.9l1.05 4.37c.1.42.01.84-.25 1.17-.14.18-.44.47-.94.47-.61 0-1.14-.49-1.21-1.14L16.98 5l1.93-.01zM13 5h1.96l.54 4.52c.05.39-.07.78-.33 1.07-.22.26-.54.41-.95.41-.67 0-1.22-.59-1.22-1.31V5zM8.49 9.52L9.04 5H11v4.69c0 .72-.55 1.31-1.29 1.31-.34 0-.65-.15-.89-.41-.25-.29-.37-.68-.33-1.07zm-4.45-.16L5.05 5h1.97l-.58 4.86c-.08.65-.6 1.14-1.21 1.14-.49 0-.8-.29-.93-.47-.27-.32-.36-.75-.26-1.17zM5 19v-6.03c.08.01.15.03.23.03.87 0 1.66-.36 2.24-.95.6.6 1.4.95 2.31.95.87 0 1.65-.36 2.23-.93.59.57 1.39.93 2.29.93.84 0 1.64-.35 2.24-.95.58.59 1.37.95 2.24.95.08 0 .15-.02.23-.03V19H5z"/>
        </svg>
      ),
      color: 'from-teal-600 to-green-800'
    },
    {
      titulo: 'Capacitación y Educación',
      descripcion: 'Implementamos programas de capacitación para jóvenes locales en guiado turístico y conservación ambiental, contribuyendo al desarrollo profesional de la comunidad y fomentando un mayor compromiso con la protección de la naturaleza.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82zM12 3L1 9l11 6 9-4.91V17h2V9L12 3z"/>
        </svg>
      ),
      color: 'from-amber-600 to-orange-800'
    },
    {
      titulo: 'Apoyo a Comerciantes Locales',
      descripcion: 'Promovemos la venta de artesanías y productos locales como parte de la experiencia turística, generando ingresos directos para artesanos y pequeños comerciantes de la región, preservando las tradiciones culturales y la identidad local.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M19 6h-2c0-2.76-2.24-5-5-5S7 3.24 7 6H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-7-3c1.66 0 3 1.34 3 3H9c0-1.66 1.34-3 3-3zm0 10c-2.76 0-5-2.24-5-5h2c0 1.66 1.34 3 3 3s3-1.34 3-3h2c0 2.76-2.24 5-5 5z"/>
        </svg>
      ),
      color: 'from-purple-600 to-pink-800'
    }
  ];

  // Resultados tangibles
  const resultados: ResultadoData[] = [
    {
      cifra: '+5.000',
      descripcion: 'Kg de residuos plásticos evitados en el ecosistema marino anualmente',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
        </svg>
      ),
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      cifra: '15%',
      descripcion: 'Reducción en el número de embarcaciones en zonas sensibles',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M20 6h-3V4c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM9 4h6v2H9V4zm11 15H4v-2h16v2zm0-5H4V8h3v2h2V8h6v2h2V8h3v6z"/>
        </svg>
      ),
      color: 'from-sky-400 to-sky-600'
    },
    {
      cifra: '+20%',
      descripcion: 'Aumento en la población de pingüinos de Humboldt en los últimos 5 años',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M16 6l2.29 2.29-4.88 4.88-4-4L2 16.59 3.41 18l6-6 4 4 6.3-6.29L22 12V6z"/>
        </svg>
      ),
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      cifra: '+50',
      descripcion: 'Empleos locales generados gracias al turismo sostenible',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" className="w-8 h-8" viewBox="0 0 24 24">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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
      transition: { duration: 0.5, ease: "easeOut" }
    },
    exit: { 
      opacity: 0,
      x: -10,
      transition: { duration: 0.3 }
    }
  };
  
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };
  
  const fadeInUp = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  // Loader para mostrar mientras cargan las imágenes
  if (!imagesLoaded) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-600 inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-lg text-gray-600 mt-4">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      {/* Cabecera */}
      <div 
        ref={headerRef}
        className="relative h-[85vh] overflow-hidden flex items-center justify-center"
      >
        {/* Fondo */}
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: "url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
              transform: `translateY(${scrollY * 0.4}px)`,
              opacity: 0.7
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-blue-900/70 via-teal-800/60 to-transparent"></div>
        </div>
        
        {/* Elementos marinos animados */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              y: [0, -50, 0],
              x: [0, 30, 0],
              rotate: [0, 10, 0]
            }}
            transition={{ repeat: Infinity, duration: 20, ease: "easeInOut" }}
            className="absolute w-12 h-12 top-1/4 left-1/4 text-blue-200 opacity-60"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M21.949 11.179c-.129-.387-.387-.774-.774-.903-2.064-.516-4.516.129-6.194 1.549-.387-.516-.774-1.032-1.29-1.548-1.807-1.807-3.742-2.451-5.42-2.322-1.807.13-3.355 1.162-4.387 2.709-.516.904-.516 2.064 0 2.967.903 1.549 2.58 2.58 4.516 2.839 1.548.129 3.226-.258 4.774-1.29.387.516.903 1.033 1.42 1.548 1.419 1.42 3.096 2.193 4.645 2.322h.645c.516 0 1.161-.258 1.678-.774 1.29-1.29 1.678-3.872.387-7.097zm-12.517 3.742c-1.161.774-2.58 1.032-3.871.903-1.29-.129-2.451-.774-3.096-1.936 0-.258-.129-.387-.129-.645 0-.258 0-.387.129-.645.645-1.162 1.678-1.807 2.838-1.936 1.161-.129 2.58.258 4 1.678 1.161 1.161 2.064 2.451 2.709 3.87-1.032-.258-1.806-.774-2.58-1.289zm9.678 1.161c-.258.258-.516.387-.774.387-.129 0-.258 0-.387-.129-1.29-.258-2.58-.903-3.742-2.064-.129-.129-.258-.258-.387-.387.645-1.936.387-4-.645-5.549 1.161-1.032 2.967-1.548 4.387-1.161.129 0 .258.129.387.258.645 1.807.903 3.355.903 4.645-.129 1.548-.258 2.709-.742 4z"/>
            </svg>
          </motion.div>
          
          <motion.div 
            animate={{ 
              y: [0, -30, 0],
              x: [0, -40, 0],
              rotate: [0, -5, 0]
            }}
            transition={{ repeat: Infinity, duration: 15, ease: "easeInOut", delay: 2 }}
            className="absolute w-16 h-16 top-1/3 right-1/4 text-cyan-200 opacity-50"
          >
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 7.17c-.9-.53-1.94-.9-3.04-1.1.05-.21.08-.43.08-.67 0-.66-.16-1.27-.43-1.81-.3-.6-.73-1.11-1.25-1.5-.36-.27-.76-.49-1.2-.64C15.73 1.19 15.23 1 14.7 1c-1.06 0-2.03.46-2.7 1.2-.67-.74-1.64-1.2-2.7-1.2-.54 0-1.04.19-1.47.44-.44.16-.84.38-1.2.64-.52.39-.94.9-1.25 1.5-.27.54-.43 1.15-.43 1.81 0 .24.03.46.08.67-1.1.2-2.14.57-3.04 1.1-.13.08-.16.27-.06.39.08.1.22.14.34.08.98-.58 2.13-.96 3.36-1.06-.03.13-.05.27-.05.4 0 .23.01.45.04.67.03.22.08.44.15.65.14.44.35.85.63 1.21.16.21.34.41.55.59.21.18.43.35.69.49.24.13.49.24.76.33.25.08.52.15.79.19.34.05.69.08 1.05.08.33 0 .65-.03.96-.07l.08-.01c.1.49.33.93.67 1.28.42.42.98.7 1.6.73.03 0 .06.01.09.01.05 0 .1 0 .14-.01.63-.04 1.19-.32 1.6-.74.34-.34.57-.79.67-1.28l.08.01c.31.04.63.07.96.07.36 0 .71-.03 1.05-.08.27-.04.54-.1.79-.19.26-.09.52-.2.76-.33.25-.14.48-.31.69-.49.2-.18.38-.38.55-.59.28-.36.49-.77.63-1.21.07-.21.12-.42.15-.65.03-.22.04-.44.04-.67 0-.14-.02-.27-.05-.4 1.23.1 2.38.48 3.36 1.06.12.06.26.02.34-.08.1-.13.08-.32-.06-.39zM12 2.92c.86 0 1.62.44 2.06 1.11.17.02.32.07.49.1-.37.26-.78.41-1.22.41-.45 0-.86-.15-1.23-.41.17-.03.33-.08.5-.1.42-.67 1.19-1.11 2.05-1.11zM5.57 6.09c0-.05.01-.11.01-.16 0-.81.32-1.55.84-2.1.26-.27.57-.5.91-.66.31-.14.66-.23 1.02-.23.85 0 1.62.44 2.06 1.11.04.01.08.02.13.02.04 0 .08-.01.13-.02.44-.67 1.21-1.11 2.06-1.11.36 0 .7.09 1.02.23.34.16.65.39.91.66.52.55.84 1.28.84 2.1 0 .05.01.11.01.16-.07.03-.14.06-.21.1l-.4.02c-.03-.11-.07-.22-.13-.32-.13-.24-.3-.45-.51-.63-.16-.13-.32-.25-.5-.35-.17-.09-.34-.17-.53-.23-.18-.06-.36-.1-.55-.13-.2-.03-.41-.05-.62-.05-.5 0-.97.09-1.41.26-.44-.17-.91-.26-1.41-.26-.21 0-.42.02-.62.05-.19.03-.37.07-.55.13-.19.06-.36.14-.53.23-.18.1-.34.21-.5.35-.21.18-.38.39-.51.63-.05.1-.1.21-.13.32-.01-.01-.03-.01-.04-.02-.07-.04-.14-.07-.21-.1zm9.92 3.16c-.06.19-.15.36-.26.52-.12.16-.27.3-.44.43-.14.1-.3.19-.47.26-.16.07-.33.13-.5.17-.18.04-.37.07-.56.09-.2.02-.4.03-.61.03-.37 0-.72-.04-1.05-.11-.05-.01-.1-.02-.16-.03-.04-.01-.08-.02-.12-.03.41-.55.67-1.22.67-1.92 0-.16-.02-.31-.05-.46.51.32 1.12.51 1.78.51.66 0 1.27-.19 1.78-.51-.02.15-.04.3-.04.46 0 .18.01.36.03.53v.06zm-8.98-1.43c.66 0 1.27-.19 1.78-.51-.02.15-.04.3-.04.46 0 .71.26 1.38.67 1.92-.04.01-.08.02-.12.03-.05.01-.1.02-.16.03-.33.07-.68.11-1.05.11-.21 0-.41-.01-.61-.03-.19-.02-.38-.05-.56-.09-.17-.04-.34-.1-.5-.17-.17-.07-.33-.16-.47-.26-.17-.12-.32-.27-.44-.43-.11-.16-.2-.33-.26-.52-.02-.18-.03-.35-.03-.53 0-.16.02-.31.05-.46.5.32 1.11.51 1.77.51zm2.14 2.32c.11.11.24.2.38.27.03.45.29.87.69 1.09-.04.01-.09.02-.13.03-.21.05-.42.09-.64.12-.24.03-.49.05-.75.05-.25 0-.5-.02-.74-.05-.22-.03-.43-.07-.64-.12-.05-.01-.09-.02-.14-.03.4-.22.66-.64.69-1.09.15-.07.28-.16.39-.27.11-.11.21-.23.29-.37.07.14.17.26.28.37zm2.7.27c.14-.07.27-.16.38-.27.11-.11.21-.23.28-.37.08.14.18.26.29.37.11.11.24.2.39.27.03.45.29.87.69 1.09-.04.01-.09.02-.14.03-.21.05-.42.09-.64.12-.24.03-.49.05-.74.05-.26 0-.51-.02-.75-.05-.22-.03-.43-.07-.64-.12-.05-.01-.09-.02-.13-.03.4-.22.66-.64.69-1.09zm.65-3.33c-.2 0-.38-.03-.56-.08-.17-.05-.33-.12-.48-.21-.15-.09-.28-.2-.39-.33-.07-.08-.12-.17-.18-.26.05-.04.1-.09.14-.14.51-.51.84-1.2.84-1.96 0-.16-.02-.32-.04-.47.07.01.14.03.21.05.15.04.29.09.43.15.13.06.26.13.38.2.13.08.24.17.35.26.21.18.39.39.52.62.07.12.13.25.17.38.04.13.06.27.06.41 0 .34-.12.65-.32.91-.07.09-.16.18-.25.25-.09.08-.19.14-.3.19-.1.06-.21.1-.33.13-.1.03-.22.05-.33.06-.11.01-.22.02-.33.02-.03.02-.06.02-.09.02zm-6.9-.88c-.11-.13-.24-.24-.39-.33-.15-.09-.31-.16-.48-.21-.18-.05-.36-.08-.56-.08-.03 0-.06 0-.09-.01-.11 0-.22-.01-.33-.02-.11-.01-.23-.03-.33-.06-.12-.03-.23-.07-.33-.13-.11-.05-.21-.11-.3-.19-.09-.08-.18-.16-.25-.25-.2-.26-.32-.57-.32-.91 0-.14.02-.28.06-.41.04-.13.1-.26.17-.38.13-.23.31-.44.52-.62.11-.09.22-.18.35-.26.12-.07.25-.14.38-.2.14-.06.28-.11.43-.15.07-.02.14-.04.21-.05-.03.15-.04.31-.04.47 0 .76.33 1.45.84 1.96.04.05.09.1.14.14-.06.09-.11.18-.18.26z"/>
            </svg>
          </motion.div>
        </div>
        
        {/* Contenido del header */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="text-5xl md:text-7xl font-bold mb-6 text-white drop-shadow-xl"
          >
            <span className="text-white">
              {t('conservacion.titulo', 'Conservación Marina')}
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto leading-relaxed font-light drop-shadow-md"
          >
            {t('conservacion.subtitulo', 'Implementamos protocolos rigurosos según las normativas de SERNANP para preservar el ecosistema marino de Paracas y las Islas Ballestas.')}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-6"
          >
            <motion.a 
              href="#especies"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative overflow-hidden inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-full shadow-lg group"
            >
              {/* Efecto de luz */}
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-out"></span>
              
              {/* Texto con efecto de brillo */}
              <span className="relative flex items-center justify-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 animate-bounce" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Descubrir Nuestros Protocolos
              </span>
            </motion.a>
          </motion.div>
        </div>
        
        {/* Onda decorativa en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,128L40,138.7C80,149,160,171,240,176C320,181,400,171,480,149.3C560,128,640,96,720,90.7C800,85,880,107,960,138.7C1040,171,1120,213,1200,213.3C1280,213,1360,171,1400,149.3L1440,128L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Sección de introducción */}
      <div className="py-4 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight"
            >
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-600">
                Conservación y Responsabilidad Social
              </span>
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-gray-700 leading-relaxed"
            >
              En NAYARAK TOURS, creemos que el turismo responsable debe contribuir a la preservación de los ecosistemas marinos y el bienestar de las comunidades locales.
            </motion.p>
          </div>
        </div>
      </div>
      
      {/* Sección de especies protegidas */}
      <div id="especies" ref={especiesRef} className="py-4 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isEspeciesInView ? "visible" : "hidden"}
            className="text-center mb-4"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Protocolos Específicos por Especie
            </motion.h2>
          </motion.div>

          {/* Tabs de selección de especies */}
          <div className="mb-4 flex flex-wrap justify-center gap-3">
            {(Object.keys(especiesData) as EspecieKey[]).map((key) => (
              <motion.button
                key={key}
                onClick={() => setTabActivo(key)}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden"
              >
                <div className={`px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md flex items-center gap-3 ${
                  tabActivo === key 
                    ? `text-white ${especiesData[key].color}`
                    : 'bg-white text-gray-700 hover:text-blue-600 border border-gray-200'
                }`}
                >
                  <span className={`${tabActivo === key ? 'text-white' : 'text-blue-600'}`}>
                    {especiesData[key].icono}
                  </span>
                  <span className="font-medium">{especiesData[key].titulo}</span>
                </div>
                
                {/* Indicador de tab activo */}
                {tabActivo === key && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-teal-400"
                  />
                )}
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
              className={`bg-gradient-to-br ${especiesData[tabActivo].gradient} rounded-2xl overflow-hidden shadow-xl mb-6`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-5">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 flex items-center gap-3">
                    <span className="bg-white/20 p-2 rounded-lg">
                      {especiesData[tabActivo].icono}
                    </span>
                    {especiesData[tabActivo].titulo}
                  </h3>
                  
                  <div className="text-white space-y-3">
                    <p className="text-lg leading-relaxed">{especiesData[tabActivo].descripcion}</p>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mt-3">
                      <h4 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        Protocolos de Protección
                      </h4>
                      <ul className="space-y-2">
                        {especiesData[tabActivo].protocolos.map((protocolo, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="flex items-start gap-2"
                          >
                            <div className="mt-1 bg-white/20 p-1 rounded-full">
                                                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white">{protocolo}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="h-64 lg:h-auto overflow-hidden">
                  <motion.img 
                    src={especiesData[tabActivo].imagen} 
                    alt={especiesData[tabActivo].titulo} 
                    className="w-full h-full object-cover"
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 1.5 }}
                  />
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      
      {/* Protocolos de conservación */}
      <div 
        ref={protocolosRef}
        id="protocolos"
        className="py-4 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isProtocolosInView ? "visible" : "hidden"}
            className="text-center mb-4"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Control de Visitas y Protección del Ecosistema
            </motion.h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {protocolos.map((protocolo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5, 
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 transition-all duration-300 transform"
              >
                <div className={`h-1 bg-gradient-to-r ${protocolo.color}`}></div>
                <div className="p-4">
                  <motion.div 
                    className="rounded-xl p-3 bg-gradient-to-r from-gray-50 to-blue-50 mb-3 w-14 h-14 flex items-center justify-center text-blue-600"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {protocolo.icono}
                  </motion.div>
                  
                  <h4 className="text-lg font-bold text-gray-800 mb-2">
                    {protocolo.titulo}
                  </h4>
                  
                  <p className="text-gray-600 text-sm">
                    {protocolo.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Resultados tangibles */}
      <div 
        ref={resultadosRef}
        className="py-4 px-4 bg-blue-50"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isResultadosInView ? "visible" : "hidden"}
            className="text-center mb-4"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Impacto de Nuestra Conservación
            </motion.h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {resultados.map((resultado, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  scale: 1.03,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`h-1 bg-gradient-to-r ${resultado.color}`}></div>
                
                <div className="p-4 flex flex-col items-center text-center">
                  <motion.div 
                    className={`bg-gradient-to-br ${resultado.color} text-white w-14 h-14 rounded-xl flex items-center justify-center mb-3 shadow-md`}
                    animate={{ 
                      scale: [1, 1.1, 1],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 2,
                      delay: index * 0.5
                    }}
                  >
                    {resultado.icono}
                  </motion.div>
                  
                  <motion.h3 
                    className="text-3xl font-bold text-gray-800 mb-2"
                    animate={{ 
                      color: ['#1E40AF', '#0369A1', '#1E40AF'],
                    }}
                    transition={{ 
                      repeat: Infinity, 
                      repeatType: "reverse", 
                      duration: 3,
                      delay: index * 0.3
                    }}
                  >
                    {resultado.cifra}
                  </motion.h3>
                  
                  <p className="text-gray-700 text-sm">
                    {resultado.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Beneficios para la comunidad */}
      <div 
        ref={beneficiosRef}
        className="py-4 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isBeneficiosInView ? "visible" : "hidden"}
            className="text-center mb-4"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
              Beneficios para la Comunidad Local
            </motion.h2>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {beneficios.map((beneficio, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ 
                  y: -5,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.3), 0 8px 10px -6px rgba(59, 130, 246, 0.1)"
                }}
                className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 relative overflow-hidden group"
              >
                {/* Efecto de gradiente animado */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-blue-50 to-teal-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
                
                <div className="flex gap-3 relative z-10">
                  <motion.div 
                    className={`flex-shrink-0 p-3 bg-gradient-to-br ${beneficio.color} text-white rounded-xl`}
                    whileHover={{ rotate: 10, scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    {beneficio.icono}
                  </motion.div>
                  
                  <div>
                    <h4 className="text-lg font-bold text-gray-800 mb-1">
                      {beneficio.titulo}
                    </h4>
                    <p className="text-gray-600 text-sm">
                      {beneficio.descripcion}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Llamado a la acción */}
      <div className="py-10 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white mt-4 relative overflow-hidden">
        {/* Elementos flotantes de fondo */}
        <motion.div 
          className="absolute w-40 h-40 rounded-full bg-white/10 top-10 left-10"
          animate={{ 
            y: [0, -30, 0],
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 8 }}
        />
        
        <motion.div 
          className="absolute w-20 h-20 rounded-full bg-white/10 bottom-10 right-10"
          animate={{ 
            y: [0, 20, 0],
            x: [0, -20, 0],
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ repeat: Infinity, duration: 7, delay: 1 }}
        />
        
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              Explora la Reserva de manera responsable
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 mb-6"
            >
              Descubre la belleza natural de las Islas Ballestas con un operador comprometido con la conservación y autorizado por SERNANP
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.a 
                href="/tours" 
                className="relative inline-flex group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="absolute inset-0 rounded-full bg-white/20 blur-md transform scale-105 group-hover:scale-110 transition-all duration-500"></span>
                <span className="relative inline-flex overflow-hidden rounded-full p-[3px] bg-gradient-to-r from-white/80 via-white to-white/80">
                  <span className="px-8 py-4 rounded-full bg-white text-blue-600 font-medium text-lg relative flex items-center justify-center transition-all duration-300 group-hover:bg-opacity-90">
                    <span className="mr-2">Reservar un Tour Sostenible</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform group-hover:translate-x-1 transition-transform duration-300" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </span>
                </span>
              </motion.a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaConservacion;