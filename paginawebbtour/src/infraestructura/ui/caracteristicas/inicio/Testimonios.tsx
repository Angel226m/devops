import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Testimonio {
  id: number;
  nombre: string;
  comentario: string;
  fecha: string;
  calificacion: number;
  avatar: string;
  tour: string;
}

const Testimonios = () => {
  const { t } = useTranslation();
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [testimonioActual, setTestimonioActual] = useState(0);

  useEffect(() => {
    const datos = [
      {
        id: 1,
        nombre: "María García",
        comentario: "Increíble experiencia en las Islas Ballestas. Los guías fueron muy amables y conocedores.",
        fecha: "2025-05-10",
        calificacion: 5,
        avatar: "https://randomuser.me/api/portraits/women/12.jpg",
        tour: "Tour Islas Ballestas"
      },
      {
        id: 2,
        nombre: "Carlos Mendoza",
        comentario: "El avistamiento de delfines superó mis expectativas. Pudimos ver muchos delfines saltando.",
        fecha: "2025-05-08",
        calificacion: 5,
        avatar: "https://randomuser.me/api/portraits/men/32.jpg",
        tour: "Avistamiento de Delfines"
      },
      {
        id: 3,
        nombre: "Lucía Rodríguez",
        comentario: "El tour al atardecer fue mágico. Los colores en el cielo y el mar crearon un ambiente perfecto.",
        fecha: "2025-05-15",
        calificacion: 4,
        avatar: "https://randomuser.me/api/portraits/women/44.jpg",
        tour: "Sunset Cruise"
      }
    ];
    setTestimonios(datos);
  }, []);

  const siguienteTestimonio = () => {
    setTestimonioActual((prev) => (prev + 1) % testimonios.length);
  };

  const testimonioAnterior = () => {
    setTestimonioActual((prev) => (prev - 1 + testimonios.length) % testimonios.length);
  };

  const renderEstrellas = (calificacion: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
          index < calificacion ? 'text-yellow-400' : 'text-blue-200'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  if (testimonios.length === 0) {
    return (
      <div className="flex justify-center bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 min-h-screen p-10">
        <div className="animate-pulse w-full max-w-4xl">
          <div className="h-4 bg-blue-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-blue-200 rounded w-2/3 mb-4"></div>
          <div className="flex mt-4">
            <div className="rounded-full bg-blue-200 h-12 w-12"></div>
            <div className="ml-4">
              <div className="h-4 bg-blue-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-blue-200 rounded w-32"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          key={testimonioActual}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl p-8 shadow-xl relative"
        >
          <div className="absolute top-4 left-4 text-6xl text-cyan-200 opacity-60">"</div>

          <div className="relative z-10">
            <div className="flex mb-4">{renderEstrellas(testimonios[testimonioActual].calificacion)}</div>
            <p className="text-blue-800 text-lg mb-6 italic">{testimonios[testimonioActual].comentario}</p>

            <div className="flex items-center">
              <img 
                src={testimonios[testimonioActual].avatar} 
                alt={testimonios[testimonioActual].nombre} 
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-blue-900">
                  {testimonios[testimonioActual].nombre}
                </h4>
                <p className="text-sm text-blue-600">
                  {testimonios[testimonioActual].tour} - {new Date(testimonios[testimonioActual].fecha).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {testimonios.length > 1 && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={testimonioAnterior}
              className="p-2 rounded-full bg-white shadow-md hover:bg-sky-100 transition-colors"
              aria-label="Testimonio anterior"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex space-x-2">
              {testimonios.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setTestimonioActual(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === testimonioActual 
                      ? 'bg-sky-500 w-6' 
                      : 'bg-blue-200 hover:bg-sky-300'
                  }`}
                  aria-label={`Ir a testimonio ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={siguienteTestimonio}
              className="p-2 rounded-full bg-white shadow-md hover:bg-sky-100 transition-colors"
              aria-label="Siguiente testimonio"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Testimonios;
