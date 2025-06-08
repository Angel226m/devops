 
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Seccion from '../../componentes/layout/Seccion';
import Boton from '../../componentes/comunes/Boton';

const PaginaNoEncontrada = () => {
  const { t } = useTranslation();

  // Animación para la ola
  const wave = {
    animate: {
      y: [0, -10, 0],
      transition: {
        duration: 2,
        repeat: Infinity,
        repeatType: "reverse"
      }
    }
  };

  return (
    <Seccion className="flex items-center justify-center py-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative mb-10">
            <motion.div
              animate="animate"
               className="text-9xl font-bold text-ocean-500 dark:text-ocean-400"
            >
              404
            </motion.div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-8 left-0 right-0"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 1440 200" 
                className="w-full"
              >
                <path 
                  fill="currentColor" 
                  fillOpacity="0.2" 
                  className="text-ocean-300 dark:text-ocean-800"
                  d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,106.7C960,117,1056,149,1152,149.3C1248,149,1344,117,1392,101.3L1440,85L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
                />
              </svg>
            </motion.div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('404.titulo')}
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
            {t('404.descripcion')}
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Boton
              texto={t('404.volverInicio')}
              variante="primary"
              tamano="lg"
              ruta="/inicio"
              icono={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
              }
            />
            <Boton
              texto={t('404.contactarSoporte')}
              variante="outline"
              tamano="lg"
              ruta="/contacto"
              icono={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              }
            />
          </div>

          <div className="mt-16">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">
              {t('404.sugerencias')}
            </h3>
            <ul className="flex flex-wrap justify-center gap-3">
              <li>
                <Link to="/tours" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('menu.tours')}
                </Link>
              </li>
              <li>
                <Link to="/sedes" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('menu.sedes')}
                </Link>
              </li>
              <li>
                <Link to="/sobre-nosotros" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('menu.sobreNosotros')}
                </Link>
              </li>
              <li>
                <Link to="/preguntas-frecuentes" className="text-primary-600 dark:text-primary-400 hover:underline">
                  {t('menu.preguntasFrecuentes')}
                </Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </Seccion>
  );
};

export default PaginaNoEncontrada;