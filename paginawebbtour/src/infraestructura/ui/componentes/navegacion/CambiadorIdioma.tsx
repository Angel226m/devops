 
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';

const CambiadorIdioma = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const { i18n, t } = useTranslation();
  const menuRef = useRef<HTMLDivElement>(null);

  const idiomasDisponibles = [
    { codigo: 'es', nombre: 'Español', bandera: '🇪🇸' },
    { codigo: 'en', nombre: 'English', bandera: '🇺🇸' }
  ];

  const idiomaActual = idiomasDisponibles.find(idioma => idioma.codigo === i18n.language) || idiomasDisponibles[0];

  const cambiarIdioma = (codigo: string) => {
    i18n.changeLanguage(codigo);
    setMenuAbierto(false);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickFuera = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuAbierto(false);
      }
    };

    document.addEventListener('mousedown', handleClickFuera);
    return () => {
      document.removeEventListener('mousedown', handleClickFuera);
    };
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-primary-500 dark:hover:text-primary-400 transition-colors"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label={t('idioma.cambiar')}
      >
        <span className="text-lg">{idiomaActual.bandera}</span>
        <span className="hidden sm:inline-block">{idiomaActual.nombre}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-4 w-4 transition-transform duration-300 ${menuAbierto ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      <AnimatePresence>
        {menuAbierto && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 overflow-hidden"
          >
            <div className="py-1">
              {idiomasDisponibles.map((idioma) => (
                <button
                  key={idioma.codigo}
                  className={`w-full text-left px-4 py-2 flex items-center space-x-2 ${
                    idioma.codigo === i18n.language
                      ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                  onClick={() => cambiarIdioma(idioma.codigo)}
                >
                  <span className="text-lg">{idioma.bandera}</span>
                  <span>{idioma.nombre}</span>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CambiadorIdioma;