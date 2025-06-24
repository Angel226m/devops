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

  // Iconos para especies
  const iconos = {
    pinguino: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path d="M15.75 8.25a.75.75 0 01.75.75c0 1.12-.492 2.126-1.27 2.812a.75.75 0 11-.992-1.124A2.243 2.243 0 0015 9a.75.75 0 01.75-.75z" />
        <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM4.575 15.6a8.25 8.25 0 009.348 4.425 1.966 1.966 0 00-1.84-1.275.983.983 0 01-.97-.822l-.073-.437c-.094-.565.25-1.11.8-1.267l.99-.282c.427-.123.783-.418.982-.816l.036-.073a1.453 1.453 0 012.328-.377L16.5 15h.628a2.25 2.25 0 011.983 1.186 8.25 8.25 0 00-6.345-12.4c.044.262.18.503.389.676l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.575 15.6z" clipRule="evenodd" />
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
        <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 01.359.852L12.982 9.75h7.268a.75.75 0 01.548 1.262l-10.5 11.25a.75.75 0 01-1.272-.71l1.992-7.302H3.75a.75.75 0 01-.548-1.262l10.5-11.25a.75.75 0 01.913-.143z" clipRule="evenodd" />
      </svg>
    ),
    ave: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
        <path fillRule="evenodd" d="M9 4.5a.75.75 0 01.721.544l.813 2.846a3.75 3.75 0 002.576 2.576l2.846.813a.75.75 0 010 1.442l-2.846.813a3.75 3.75 0 00-2.576 2.576l-.813 2.846a.75.75 0 01-1.442 0l-.813-2.846a3.75 3.75 0 00-2.576-2.576l-2.846-.813a.75.75 0 010-1.442l2.846-.813A3.75 3.75 0 007.466 7.89l.813-2.846A.75.75 0 019 4.5zM18 1.5a.75.75 0 01.728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 010 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 01-1.456 0l-.258-1.036a2.625 2.625 0 00-1.91-1.91l-1.036-.258a.75.75 0 010-1.456l1.036-.258a2.625 2.625 0 001.91-1.91l.258-1.036A.75.75 0 0118 1.5zM16.5 15a.75.75 0 01.712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 010 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 01-1.422 0l-.395-1.183a1.5 1.5 0 00-.948-.948l-1.183-.395a.75.75 0 010-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0116.5 15z" clipRule="evenodd" />
      </svg>
    )
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
      color: 'bg-blue-600',
      gradient: 'from-blue-600 via-blue-500 to-indigo-700',
      icono: iconos.pinguino
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
      color: 'bg-teal-600',
      gradient: 'from-teal-600 via-teal-500 to-cyan-700',
      icono: iconos.lobo
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
      color: 'bg-purple-600',
      gradient: 'from-purple-600 via-purple-500 to-indigo-700',
      icono: iconos.ballena
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
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-blue-500 to-blue-700'
    },
    {
      titulo: 'Control de Aforo',
      descripcion: 'Cumplimos con los límites de capacidad de carga establecidos por SERNANP para la Reserva Nacional de Paracas, evitando la saturación del ecosistema.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M4.5 6.375a4.125 4.125 0 118.25 0 4.125 4.125 0 01-8.25 0zM14.25 8.625a3.375 3.375 0 116.75 0 3.375 3.375 0 01-6.75 0zM1.5 19.125a7.125 7.125 0 0114.25 0v.003l-.001.119a.75.75 0 01-.363.63 13.067 13.067 0 01-6.761 1.873c-2.472 0-4.786-.684-6.76-1.873a.75.75 0 01-.364-.63l-.001-.122zM17.25 19.128l-.001.144a2.25 2.25 0 01-.233.96 10.088 10.088 0 005.06-1.01.75.75 0 00.42-.643 4.875 4.875 0 00-6.957-4.611 8.586 8.586 0 011.71 5.157v.003z" />
        </svg>
      ),
      color: 'from-teal-500 to-teal-700'
    },
    {
      titulo: 'Zonas Restringidas',
      descripcion: 'Respetamos las zonas de exclusión y amortiguamiento establecidas por SERNANP, especialmente durante temporadas críticas de reproducción y anidación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-red-500 to-red-700'
    },
    {
      titulo: 'Navegación Responsable',
      descripcion: 'Nuestras embarcaciones siguen rutas predefinidas aprobadas por SERNANP, controlando la velocidad para reducir el impacto acústico y la contaminación.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
          <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
          <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        </svg>
      ),
      color: 'from-indigo-500 to-indigo-700'
    },
    {
      titulo: 'Guías Certificados',
      descripcion: 'Nuestros guías están capacitados y certificados por SERNANP para garantizar prácticas responsables de observación de fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-green-500 to-green-700'
    },
    {
      titulo: 'Cero Residuos',
      descripcion: 'Implementamos una política estricta de "no dejar rastro" en todas nuestras embarcaciones, en cumplimiento con las normativas ambientales de SERNANP.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-purple-500 to-purple-700'
    }
  ];

  // Tecnologías para conservación
  const tecnologias: TecnologiaData[] = [
    {
      titulo: 'GPS y Seguimiento de Rutas',
      descripcion: 'Todas nuestras embarcaciones están equipadas con GPS que monitorean la velocidad y aseguran que se respeten las rutas establecidas por SERNANP.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.144-.742 19.58 19.58 0 002.683-2.282c1.944-1.99 3.963-4.98 3.963-8.827a8.25 8.25 0 00-16.5 0c0 3.846 2.02 6.837 3.963 8.827a19.58 19.58 0 002.682 2.282 16.975 16.975 0 001.145.742zM12 13.5a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-blue-600 to-indigo-800'
    },
    {
      titulo: 'Sensores Acústicos',
      descripcion: 'Monitoreamos los niveles de ruido de nuestras embarcaciones para garantizar que se mantengan por debajo de los umbrales que podrían afectar a la fauna.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 001.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06zM18.584 5.106a.75.75 0 011.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 11-1.06-1.06 8.25 8.25 0 000-11.668.75.75 0 010-1.06z" />
          <path d="M15.932 7.757a.75.75 0 011.061 0 6 6 0 010 8.486.75.75 0 01-1.06-1.061 4.5 4.5 0 000-6.364.75.75 0 010-1.06z" />
        </svg>
      ),
      color: 'from-teal-600 to-green-800'
    },
    {
      titulo: 'Motores de Bajo Impacto',
      descripcion: 'Nuestras embarcaciones utilizan motores de última generación con tecnología de reducción de emisiones y baja huella acústica.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.378 1.602a.75.75 0 00-.756 0L3 6.632l9 5.25 9-5.25-8.622-5.03zM21.75 7.93l-9 5.25v9l8.628-5.032a.75.75 0 00.372-.648V7.93zM11.25 22.18v-9l-9-5.25v8.57a.75.75 0 00.372.648l8.628 5.033z" />
        </svg>
      ),
      color: 'from-amber-600 to-orange-800'
    },
    {
      titulo: 'Sistema de Registro Digital',
      descripcion: 'Documentamos cada avistamiento para contribuir a la base de datos científica de SERNANP sobre poblaciones y comportamiento de la fauna marina.',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
          <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zM6 12a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V12zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 15a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V15zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75zM6 18a.75.75 0 01.75-.75h.008a.75.75 0 01.75.75v.008a.75.75 0 01-.75.75H6.75a.75.75 0 01-.75-.75V18zm2.25 0a.75.75 0 01.75-.75h3.75a.75.75 0 010 1.5H9a.75.75 0 01-.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-purple-600 to-pink-800'
    }
  ];

  // Resultados tangibles
  const resultados: ResultadoData[] = [
    {
      cifra: '+5.000',
      descripcion: 'Kg de residuos plásticos evitados en el ecosistema marino',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-emerald-400 to-emerald-600'
    },
    {
      cifra: '15%',
      descripcion: 'Reducción en el número de embarcaciones en zonas sensibles',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h.375a3 3 0 116 0h3a.75.75 0 00.75-.75V15z" />
        </svg>
      ),
      color: 'from-sky-400 to-sky-600'
    },
    {
      cifra: '+20%',
      descripcion: 'Aumento en la población de pingüinos de Humboldt',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M1.5 9.832v1.793c0 1.036.84 1.875 1.875 1.875h17.25c1.035 0 1.875-.84 1.875-1.875V9.832a3 3 0 00-.722-1.952l-3.285-3.832A3 3 0 0016.215 3h-8.43a3 3 0 00-2.278 1.048L2.222 7.88A3 3 0 001.5 9.832zM7.785 4.5a1.5 1.5 0 00-1.139.524L3.881 8.25h3.165a3 3 0 012.496 1.336l.164.246a1.5 1.5 0 001.248.668h2.092a1.5 1.5 0 001.248-.668l.164-.246a3 3 0 012.496-1.336h3.165l-2.765-3.226a1.5 1.5 0 00-1.139-.524h-8.43z" clipRule="evenodd" />
          <path d="M2.813 15c-.725 0-1.313.588-1.313 1.313V18a3 3 0 003 3h15a3 3 0 003-3v-1.688c0-.724-.588-1.312-1.313-1.312h-4.233a3 3 0 00-2.496 1.336l-.164.246a1.5 1.5 0 01-1.248.668h-2.092a1.5 1.5 0 01-1.248-.668l-.164-.246A3 3 0 007.046 15H2.812z" />
        </svg>
      ),
      color: 'from-indigo-400 to-indigo-600'
    },
    {
      cifra: '0',
      descripcion: 'Incidentes de perturbación significativa en los últimos 3 años',
      icono: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" viewBox="0 0 24 24" fill="currentColor">
          <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.942 4.064 10.933 9.563 12.348a.749.749 0 00.374 0c5.499-1.415 9.563-6.406 9.563-12.348 0-1.39-.223-2.73-.635-3.985a.75.75 0 00-.722-.516l-.143.001c-2.996 0-5.717-1.17-7.734-3.08zm3.094 8.016a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
        </svg>
      ),
      color: 'from-rose-400 to-rose-600'
    }
  ];

  // Animaciones (versión simplificada y compatible)
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
  
  const scaleIn = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <div className="bg-white overflow-hidden">
      {/* Cabecera */}
      <div 
        ref={headerRef}
        className="relative h-screen overflow-hidden flex items-center justify-center"
      >
        {/* Fondo paralaje */}
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1583212292454-1fe6229603b7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80')",
            transform: `translateY(${scrollY * 0.4}px)`,
            opacity: 0.6
          }}
        />
        
        {/* Gradiente de fondo */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/60 via-teal-800/50 to-transparent backdrop-blur-[2px]" />
        
        {/* Elementos flotantes decorativos */}
        <motion.div 
          animate={{ 
            y: [0, -15, 0],
            rotate: [0, 5, 0, -5, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20,
            ease: "linear" 
          }}
          className="absolute right-[20%] top-[30%] opacity-30"
        >
          <svg width="120" height="120" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M48.1 35.8C56.9 16.4 80.6 10.2 98 21.5C112.4 30.9 133.5 22.8 150.2 28.5C173.8 36.7 187.6 65.9 180.2 90.2C173 114 141.5 122.1 124.5 139.2C108.1 155.7 97.4 183.6 72.2 186.8C47.4 190 22.7 167.1 10.5 143.6C-1.3 120.9 2.6 92.9 17.5 72.5C26.2 60.7 41.5 50.1 48.1 35.8Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#60A5FA" />
                <stop offset="1" stopColor="#34D399" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        
        <motion.div 
          animate={{ 
            y: [0, 20, 0],
            rotate: [0, -10, 0, 10, 0],
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 25,
            ease: "linear" 
          }}
          className="absolute left-[15%] bottom-[25%] opacity-20"
        >
          <svg width="160" height="160" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M143.033 13.2918C171.535 29.9806 200.243 65.0771 196.519 97.6C192.796 130.123 156.64 159.991 123.25 169.398C89.8594 178.806 59.2357 167.751 35.0617 149.15C10.8878 130.55 -6.83675 104.401 3.47987 76.5191C13.7965 48.6376 52.1503 18.9235 88.7409 6.83682C125.332 -5.24985 160.159 0.0967097 172.018 5.4433C183.877 10.7899 174.766 16.1365 165.655 21.4831C156.544 26.8297 147.434 32.1763 138.323 37.5229C129.212 42.8695 120.101 48.2161 110.99 53.5627C101.879 58.9093 92.7686 64.2559 83.6578 69.6025C74.5471 74.9491 65.4363 80.2957 60.0617 88.1525C54.687 96.0094 53.0485 106.376 57.4503 117.259C61.852 128.142 72.294 139.54 85.2962 143.287C98.2984 147.033 113.861 143.127 127.083 131.868C140.305 120.609 151.187 101.998 157.417 85.5124C163.646 69.0264 165.222 54.6659 153.778 45.3801C142.333 36.0943 117.869 31.8833 106.933 22.7472C95.9976 13.6111 98.5909 -0.425039 107.251 0.0225023C115.911 0.470044 130.639 15.429 143.033 13.2918Z" fill="url(#paint0_linear)" />
            <defs>
              <linearGradient id="paint0_linear" x1="0" y1="0" x2="200" y2="200" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0EA5E9" />
                <stop offset="1" stopColor="#7C3AED" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
        
        {/* Contenido del header */}
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
            <span className="bg-gradient-to-r from-teal-400 to-blue-500 text-transparent bg-clip-text text-xl font-semibold uppercase tracking-wider">
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
            <span className="bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
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
              className="px-8 py-4 bg-gradient-to-r from-teal-500 to-blue-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2 group"
            >
              <span>Descubrir Nuestros Protocolos</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" 
                viewBox="0 0 20 20" 
                fill="currentColor"
              >
                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </a>
          </motion.div>
        </div>
        
        {/* Onda decorativa en la parte inferior */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
            <path fill="#ffffff" fillOpacity="1" d="M0,224L60,213.3C120,203,240,181,360,181.3C480,181,600,203,720,213.3C840,224,960,224,1080,208C1200,192,1320,160,1380,144L1440,128L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"></path>
          </svg>
        </div>
      </div>
      
      {/* Introducción con efectos 3D */}
      <div className="py-20 px-4">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="mb-6"
            >
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                Nuestro Compromiso
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
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                Ecosistema Marino
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
      </div>
      
      {/* Sección de especies protegidas */}
      <div id="especies" ref={especiesRef} className="py-16 px-4 bg-gradient-to-b from-white to-blue-50">
        <div className="container mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate={isEspeciesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                Fauna Marina Protegida
              </span>
            </motion.div>
            
            <motion.h2 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
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
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                className="relative overflow-hidden group"
              >
                <div className={`px-8 py-4 rounded-full font-medium transition-all duration-300 shadow-md flex items-center gap-3 ${
                  tabActivo === key 
                    ? `text-white ${especiesData[key].color}`
                    : 'bg-white text-gray-700 hover:text-blue-600 border border-gray-200'
                }`}
                >
                  <span className={`${tabActivo === key ? 'text-white' : 'text-blue-600'}`}>
                    {especiesData[key].icono}
                  </span>
                  <span className="font-medium text-lg">{especiesData[key].titulo}</span>
                </div>
                
                {/* Efecto de ondulación al hacer clic */}
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
              className={`bg-gradient-to-br ${especiesData[tabActivo].gradient} rounded-3xl overflow-hidden shadow-2xl mb-16 transform`}
              style={{
                boxShadow: '0 20px 80px -20px rgba(0, 0, 0, 0.2)'
              }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-10 md:p-12">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-3 bg-white/20 rounded-xl text-white">
                      {especiesData[tabActivo].icono}
                    </div>
                    <h3 className="text-3xl md:text-4xl font-bold text-white">
                      {especiesData[tabActivo].titulo}
                    </h3>
                  </div>
                  
                  <div className="text-white/90 space-y-6">
                    <p className="text-xl leading-relaxed">{especiesData[tabActivo].descripcion}</p>
                    
                    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mt-8">
                      <h4 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                          <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
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
                            className="flex items-start gap-4"
                          >
                            <div className="mt-1 bg-white/20 p-1 rounded-full">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <span className="text-white/95 text-lg">{protocolo}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="h-80 lg:h-auto overflow-hidden">
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
                  </motion.div>
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
        className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isProtocolosInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                Normativas SERNANP
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
                className="bg-white rounded-2xl shadow-xl overflow-hidden group"
              >
                <div className={`h-2 bg-gradient-to-r ${protocolo.color}`}></div>
                <div className="p-8">
                  <div className="rounded-xl p-4 bg-gradient-to-r from-gray-50 to-blue-50 mb-6 w-16 h-16 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform duration-300">
                    {protocolo.icono}
                  </div>
                  
                  <h4 className="text-2xl font-bold text-gray-800 mb-4 group-hover:text-blue-600 transition-colors duration-300">
                    {protocolo.titulo}
                  </h4>
                  
                  <p className="text-gray-600 text-lg">
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
        className="py-20 px-4 bg-gradient-to-b from-white to-blue-50"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isResultadosInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                Impacto Medible
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
                className="relative bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className={`absolute top-0 left-0 w-full h-full bg-gradient-to-br ${resultado.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="p-8 relative z-10 flex flex-col items-center">
                  <div className={`bg-gradient-to-br ${resultado.color} text-white w-20 h-20 rounded-2xl flex items-center justify-center mb-6 shadow-lg`}>
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
                    <h3 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text">
                      {resultado.cifra}
                    </h3>
                  </motion.div>
                  
                  <p className="text-gray-700 text-lg text-center">
                    {resultado.descripcion}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Tecnología para conservación */}
      <div 
        ref={tecnologiaRef}
        className="py-20 px-4 bg-gradient-to-b from-blue-50 to-white"
      >
        <div className="container mx-auto">
          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            animate={isTecnologiaInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="mb-4">
              <span className="bg-gradient-to-r from-teal-600 to-blue-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider">
                Innovación
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
              <div className="aspect-square rounded-3xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1587930508275-3a869c8f0ac3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80" 
                  alt="Tecnología de conservación" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Elemento decorativo */}
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
                  className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-l-4 border-blue-600"
                >
                  <div className="flex gap-5">
                    <div className={`flex-shrink-0 p-4 bg-gradient-to-br ${tecnologia.color} text-white rounded-xl`}>
                      {tecnologia.icono}
                    </div>
                    
                    <div>
                      <h4 className="text-xl font-bold text-gray-800 mb-2">
                        {tecnologia.titulo}
                      </h4>
                      <p className="text-gray-600">
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
      
      {/* Sección de certificaciones */}
      <div className="py-20 px-4 bg-blue-50">
        <div className="container mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <span className="bg-gradient-to-r from-blue-600 to-teal-600 text-transparent bg-clip-text text-lg font-semibold uppercase tracking-wider mb-4 inline-block">
              Reconocimiento
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
                className="bg-white p-6 rounded-2xl shadow-lg"
              >
                <img 
                  src={`https://via.placeholder.com/150x50?text=${logo}`} 
                  alt={`${logo} de Turismo Sostenible`} 
                  className="h-16 grayscale hover:grayscale-0 transition-all duration-300" 
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Llamado a la acción */}
      <div className="py-20 px-4 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
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
              className="text-xl text-blue-100 mb-10"
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
                className="inline-block px-8 py-4 bg-white text-blue-600 font-medium rounded-full text-lg shadow-lg hover:shadow-xl hover:bg-blue-50 transition-all duration-300"
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