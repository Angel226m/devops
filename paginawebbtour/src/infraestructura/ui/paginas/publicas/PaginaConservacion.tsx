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

  // Iconos para especies
  const iconos = {
    pinguino: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
      </svg>
    ),
    lobo: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M8.25 10.875a2.625 2.625 0 115.25 0 2.625 2.625 0 01-5.25 0z" />
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.125 4.5a4.125 4.125 0 102.338 7.524l2.007 2.006a.75.75 0 101.06-1.06l-2.006-2.007a4.125 4.125 0 00-3.399-6.463z" clipRule="evenodd" />
      </svg>
    ),
    ballena: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M7.493 18.75c-.425 0-.82-.236-.975-.632A7.48 7.48 0 016 15.375c0-1.75.599-3.358 1.602-4.634.151-.192.373-.309.6-.397.473-.183.89-.514 1.212-.924a9.042 9.042 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75 2.25 2.25 0 012.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H14.23c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23h-.777zM2.331 10.977a11.969 11.969 0 00-.831 4.398 12 12 0 00.52 3.507c.26.85 1.084 1.368 1.973 1.368H4.9c.445 0 .72-.498.523-.898a8.963 8.963 0 01-.924-3.977c0-1.708.476-3.305 1.302-4.666.245-.403-.028-.959-.5-.959H4.25c-.832 0-1.612.453-1.918 1.227z" />
      </svg>
    ),
    ave: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M11.25 5.337c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.036 1.007-1.875 2.25-1.875S15 2.34 15 3.375c0 .369-.128.713-.349 1.003-.215.283-.401.604-.401.959 0 .332.278.598.61.578 1.91-.114 3.79-.342 5.632-.676a.75.75 0 01.878.645 49.17 49.17 0 01.376 5.452.657.657 0 01-.66.664c-.354 0-.675-.186-.958-.401a1.647 1.647 0 00-1.003-.349c-1.035 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401.31 0 .557.262.534.571a48.774 48.774 0 01-.595 4.845.75.75 0 01-.61.61c-1.82.317-3.673.533-5.555.642a.58.58 0 01-.611-.581c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.035-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959a.641.641 0 01-.658.643 49.118 49.118 0 01-4.708-.36.75.75 0 01-.645-.878c.293-1.614.504-3.257.629-4.924A.53.53 0 005.337 15c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.036 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.369 0 .713.128 1.003.349.283.215.604.401.959.401a.656.656 0 00.659-.663 47.703 47.703 0 00-.31-4.82.75.75 0 01.83-.832c1.343.155 2.703.254 4.077.294a.64.64 0 00.657-.642z" />
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
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-700'
    },
    {
      titulo: 'Control de Aforo',
      descripcion: 'Cumplimos con los límites de capacidad de carga establecidos por SERNANP para la Reserva Nacional de Paracas, evitando la saturación del ecosistema.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        </svg>
      ),
      color: 'from-teal-500 to-teal-700'
    },
    {
      titulo: 'Zonas Restringidas',
      descripcion: 'Respetamos las zonas de exclusión y amortiguamiento establecidas por SERNANP, especialmente durante temporadas críticas de reproducción y anidación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 0 0 5.636 5.636m12.728 12.728A9 9 0 0 1 5.636 5.636m12.728 12.728L5.636 5.636" />
        </svg>
      ),
      color: 'from-red-500 to-red-700'
    },
    {
      titulo: 'Navegación Responsable',
      descripcion: 'Nuestras embarcaciones siguen rutas predefinidas aprobadas por SERNANP, controlando la velocidad para reducir el impacto acústico y la contaminación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      titulo: 'Guías Certificados',
      descripcion: 'Nuestros guías están capacitados y certificados por SERNANP para garantizar prácticas responsables de observación de fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.489-2.489m0 0a3.375 3.375 0 10-4.773-4.773 3.375 3.375 0 004.774 4.774zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'from-green-500 to-green-700'
    },
    {
      titulo: 'Cero Residuos',
      descripcion: 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones, en cumplimiento con las normativas ambientales de SERNANP.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-700'
    }
  ];

  // Beneficios para la comunidad
  const beneficios: BeneficioData[] = [
    {
      titulo: 'Creación de Empleo Local',
      descripcion: 'Generamos más de 50 puestos de trabajo directos para la comunidad de Paracas, priorizando la contratación de guías, tripulantes y personal administrativo de la zona.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 0 0 .75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 0 0-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0 1 12 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 0 1-.673-.38m0 0A2.18 2.18 0 0 1 3 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 0 1 3.413-.387m7.5 0V5.25A2.25 2.25 0 0 0 13.5 3h-3a2.25 2.25 0 0 0-2.25 2.25v.894m7.5 0a48.667 48.667 0 0 0-7.5 0M12 12.75h.008v.008H12v-.008Z" />
        </svg>
      ),
      color: 'from-blue-600 to-indigo-800'
    },
    {
      titulo: 'Alianzas con Comercios Locales',
      descripcion: 'Colaboramos con restaurantes, hospedajes y artesanos de Paracas para ofrecer a nuestros visitantes una experiencia turística completa que beneficia directamente a la economía local.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        </svg>
      ),
      color: 'from-teal-600 to-green-800'
    },
    {
      titulo: 'Capacitación y Educación',
      descripcion: 'Implementamos programas de capacitación para jóvenes locales en guiado turístico y conservación ambiental, contribuyendo al desarrollo profesional de la comunidad.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
        </svg>
      ),
      color: 'from-amber-600 to-orange-800'
    },
    {
      titulo: 'Apoyo a Comerciantes Locales',
      descripcion: 'Promovemos la venta de artesanías y productos locales como parte de la experiencia turística, generando ingresos directos para artesanos y pequeños comerciantes de la región.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0 0 12 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.988 5.988 0 0 1-2.031.352 5.988 5.988 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.971Zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0 2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 0 1-2.031.352 5.989 5.989 0 0 1-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.971Z" />
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
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
        </svg>
      ),
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      cifra: '15%',
      descripcion: 'Reducción en el número de embarcaciones en zonas sensibles',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M12 18.75H4.5a2.25 2.25 0 01-2.25-2.25V9m12.841 9.091L16.5 19.5m-1.409-1.409c.407-.407.659-.97.659-1.591v-9a2.25 2.25 0 00-2.25-2.25h-9c-.621 0-1.184.252-1.591.659m12.182 12.182L2.909 5.909M1.5 4.5l1.409 1.409" />
        </svg>
      ),
      color: 'from-sky-400 to-sky-600'
    },
    {
      cifra: '+20%',
      descripcion: 'Aumento en la población de pingüinos de Humboldt en los últimos 5 años',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
        </svg>
      ),
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      cifra: '+50',
      descripcion: 'Empleos locales generados gracias al turismo sostenible',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
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
    hidden: { y: 30, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
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
            className="mt-10"
          >
            <a 
              href="#especies"
              className="inline-block px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px]"
            >
              <span>Descubrir Nuestros Protocolos</span>
            </a>
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
      <div className="py-8 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight"
            >
              Protegiendo el Ecosistema Marino de Paracas
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
      </div>
      
      {/* Sección de especies protegidas */}
      <div id="especies" ref={especiesRef} className="py-8 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isEspeciesInView ? "visible" : "hidden"}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Protocolos Específicos por Especie
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              Aplicamos protocolos diseñados junto con SERNANP para cada especie, respetando sus comportamientos naturales y minimizando el impacto de nuestras visitas.
            </motion.p>
          </motion.div>

          {/* Tabs de selección de especies */}
          <div className="mb-8 flex flex-wrap justify-center gap-4">
            {(Object.keys(especiesData) as EspecieKey[]).map((key) => (
              <motion.button
                key={key}
                onClick={() => setTabActivo(key)}
                whileHover={{ scale: 1.05 }}
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
              className={`bg-gradient-to-br ${especiesData[tabActivo].gradient} rounded-3xl overflow-hidden shadow-xl mb-8`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-6 md:p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl text-white">
                      {especiesData[tabActivo].icono}
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white">
                      {especiesData[tabActivo].titulo}
                    </h3>
                  </div>
                  
                  <div className="text-white space-y-4">
                    <p className="text-xl leading-relaxed">{especiesData[tabActivo].descripcion}</p>
                    
                    <div className="bg-white/10 rounded-2xl p-6 mt-4 border border-white/20">
                      <h4 className="text-xl font-semibold text-white mb-4 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                        {t('conservacion.protocolosTitulo', 'Protocolos de Protección')}
                      </h4>
                      <ul className="space-y-3">
                        {especiesData[tabActivo].protocolos.map((protocolo, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 + 0.2 }}
                            className="flex items-start gap-3"
                          >
                            <div className="mt-1 bg-white/20 p-1 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white text-lg">{protocolo}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="h-72 lg:h-auto overflow-hidden">
                  <img 
                    src={especiesData[tabActivo].imagen} 
                    alt={especiesData[tabActivo].titulo} 
                    className="w-full h-full object-cover"
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
        className="py-8 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isProtocolosInView ? "visible" : "hidden"}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Control de Visitas y Protección del Ecosistema
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              Implementamos medidas establecidas por SERNANP para regular el acceso a zonas sensibles y minimizar nuestro impacto en el ecosistema marino de Paracas.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {protocolos.map((protocolo, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300"
              >
                <div className={`h-2 bg-gradient-to-r ${protocolo.color}`}></div>
                <div className="p-6">
                  <div className="rounded-xl p-4 bg-gradient-to-r from-gray-50 to-blue-50 mb-4 w-16 h-16 flex items-center justify-center text-blue-600">
                    {protocolo.icono}
                  </div>
                  
                  <h4 className="text-xl font-bold text-gray-800 mb-3">
                    {protocolo.titulo}
                  </h4>
                  
                  <p className="text-gray-600">
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
        className="py-8 px-4 bg-blue-50"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isResultadosInView ? "visible" : "hidden"}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Resultados de Nuestras Medidas de Protección
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              El cumplimiento de los lineamientos de SERNANP y nuestros protocolos adicionales han generado resultados medibles en la conservación del ecosistema marino.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {resultados.map((resultado, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden"
              >
                <div className={`h-2 bg-gradient-to-r ${resultado.color}`}></div>
                
                <div className="p-6 flex flex-col items-center text-center">
                  <div className={`bg-gradient-to-br ${resultado.color} text-white w-16 h-16 rounded-xl flex items-center justify-center mb-4 shadow-md`}>
                    {resultado.icono}
                  </div>
                  
                  <h3 className="text-4xl font-bold text-gray-800 mb-3">
                    {resultado.cifra}
                  </h3>
                  
                  <p className="text-gray-700">
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
        className="py-8 px-4 bg-white"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isBeneficiosInView ? "visible" : "hidden"}
            className="text-center mb-8"
          >
            <motion.h2 variants={fadeInUp} className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Beneficios para la Comunidad Local
            </motion.h2>
            
            <motion.p variants={fadeInUp} className="text-xl text-gray-700 max-w-3xl mx-auto">
              Nuestro compromiso va más allá de la conservación ambiental. Buscamos generar un impacto positivo en la comunidad de Paracas a través del turismo sostenible.
            </motion.p>
          </motion.div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
            {beneficios.map((beneficio, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100"
              >
                <div className="flex gap-5">
                  <div className={`flex-shrink-0 p-4 bg-gradient-to-br ${beneficio.color} text-white rounded-xl`}>
                    {beneficio.icono}
                  </div>
                  
                  <div>
                                     <h4 className="text-xl font-bold text-gray-800 mb-2">
                      {beneficio.titulo}
                    </h4>
                    <p className="text-gray-600">
                      {beneficio.descripcion}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Certificaciones y reconocimientos */}
      <div className="py-8 px-4 bg-blue-50">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-8"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">
              Certificaciones y Alianzas
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Trabajamos en colaboración con entidades comprometidas con la conservación del medio ambiente y el desarrollo sostenible de la región.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <img 
                src="https://via.placeholder.com/150x50?text=SERNANP" 
                alt="SERNANP" 
                className="h-16 mb-4 mx-auto" 
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2">SERNANP</h3>
              <p className="text-gray-600">
                Operador autorizado por el Servicio Nacional de Áreas Naturales Protegidas, cumpliendo con todas las normativas para la conservación de la Reserva Nacional de Paracas.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <img 
                src="https://via.placeholder.com/150x50?text=Reserva" 
                alt="Reserva Nacional de Paracas" 
                className="h-16 mb-4 mx-auto" 
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2">Reserva Nacional de Paracas</h3>
              <p className="text-gray-600">
                Comprometidos con la protección y conservación de esta importante área natural protegida, hogar de diversas especies de fauna marina.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <img 
                src="https://via.placeholder.com/150x50?text=WWF" 
                alt="WWF" 
                className="h-16 mb-4 mx-auto" 
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2">Alianza WWF</h3>
              <p className="text-gray-600">
                Colaboramos en proyectos de conservación marina y educación ambiental junto a World Wildlife Fund para promover prácticas sostenibles de turismo.
              </p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white p-6 rounded-xl shadow-lg text-center"
            >
              <img 
                src="https://via.placeholder.com/150x50?text=Ministerio" 
                alt="Ministerio" 
                className="h-16 mb-4 mx-auto" 
              />
              <h3 className="text-lg font-bold text-gray-800 mb-2">Ministerio de Comercio Exterior y Turismo</h3>
              <p className="text-gray-600">
                Reconocidos por implementar buenas prácticas en turismo sostenible, contribuyendo al desarrollo económico y social de la región.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Llamado a la acción */}
      <div className="py-12 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl font-bold mb-6"
            >
              Explora la Reserva de manera responsable
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl text-blue-100 mb-8"
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
                className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300 hover:-translate-y-1"
              >
                Reservar un Tour Sostenible
              </a>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaginaConservacion;