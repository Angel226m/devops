 
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const Hero = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const slides = [
    {
      id: 1,
      bgImage: 'https://www.infobae.com/resizer/v2/QXQ5XVQ22ZDCNFWD34F36LGVBE.jpg?auth=78c31e4d240a5c8e679809a5744461e831d069a328c4c3cef6e46740ef4d404a&smart=true&width=350&height=197&quality=85',

      title: t('hero.slide1.titulo'),
      subtitle: t('hero.slide1.subtitulo')
    },
     
     
    {
      id: 2,
      bgImage:  'https://www.inkanmilkyway.com/wp-content/uploads/las-islas-ballestas_4.webp',
      title: t('hero.slide2.titulo'),
      subtitle: t('hero.slide2.subtitulo')
    },
    {
      id: 3,
      bgImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e',
      title: t('hero.slide3.titulo'),
      subtitle: t('hero.slide3.subtitulo')
    }
  ];

  // Autorotación de slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  // Cambiar slide
  const handleSlideChange = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div className="relative h-[90vh] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ 
              backgroundImage: `url(${slide.bgImage})`,
              transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)',
              transition: 'transform 6s ease-out'
            }}
          />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      ))}

      {/* Contenido */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="max-w-3xl text-white"
          >
            <motion.h1 
              key={slides[currentSlide].title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight"
            >
              {slides[currentSlide].title}
            </motion.h1>
            <motion.p 
              key={slides[currentSlide].subtitle}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-xl md:text-2xl mb-8 max-w-xl"
            >
              {slides[currentSlide].subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <Link
                to="/tours"
                className="px-8 py-4 bg-primary-500 hover:bg-primary-600 text-white rounded-full text-lg font-semibold transition-colors duration-300 shadow-lg hover:shadow-xl inline-block text-center"
              >
                {t('hero.botonExplorar')}
              </Link>
              <Link
                to="/contacto"
                className="px-8 py-4 bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-white border border-white border-opacity-40 rounded-full text-lg font-semibold transition-all duration-300 inline-block text-center"
              >
                {t('hero.botonContacto')}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Indicadores de slides */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center space-x-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => handleSlideChange(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-10' 
                : 'bg-white/50 hover:bg-white/80'
            }`}
            aria-label={`Ir a slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Ola decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 1440 100" 
          className="w-full"
        >
          <path 
            fill="#fff" 
            fillOpacity="1" 
            d="M0,32L60,48C120,64,240,96,360,96C480,96,600,64,720,48C840,32,960,32,1080,42.7C1200,53,1320,75,1380,85.3L1440,96L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z"
          />
        </svg>
      </div>
    </div>
  );
};

export default Hero;