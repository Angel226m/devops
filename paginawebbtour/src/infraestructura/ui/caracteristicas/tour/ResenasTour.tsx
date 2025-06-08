import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

interface Resena {
  id: number;
  nombre: string;
  fecha: string;
  comentario: string;
  calificacion: number;
  avatar: string;
}

interface ResenasTourProps {
  idTour: number;
}

const ResenasTour = ({ idTour }: ResenasTourProps) => {
  const { t } = useTranslation();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [nuevaResena, setNuevaResena] = useState({
    nombre: '',
    correo: '',
    comentario: '',
    calificacion: 5
  });
  
  // Simulación de carga de datos
  useEffect(() => {
    // En un caso real, aquí se haría la petición a la API
    setTimeout(() => {
      const data = [
        {
          id: 1,
          nombre: "Juan Pérez",
          fecha: "2025-05-15",
          comentario: "Excelente tour, muy bien organizado. La vista de los lobos marinos fue impresionante. El guía nos explicó todo con mucho detalle y respondió todas nuestras preguntas. Definitivamente lo recomendaría.",
          calificacion: 5,
          avatar: "https://randomuser.me/api/portraits/men/1.jpg"
        },
        {
          id: 2,
          nombre: "María García",
          fecha: "2025-05-10",
          comentario: "Me encantó la experiencia. El viaje en lancha fue muy divertido y pudimos ver muchas especies diferentes. La única sugerencia sería proporcionar algo para el mareo, ya que el mar estaba un poco agitado.",
          calificacion: 4,
          avatar: "https://randomuser.me/api/portraits/women/2.jpg"
        },
        {
          id: 3,
          nombre: "Carlos Rodríguez",
          fecha: "2025-05-03",
          comentario: "Tour muy recomendable. Las islas son hermosas y la fauna marina es increíble. El personal fue muy atento y profesional. Sin duda, una experiencia que hay que vivir si visitas Paracas.",
          calificacion: 5,
          avatar: "https://randomuser.me/api/portraits/men/3.jpg"
        }
      ];
      setResenas(data);
      setCargando(false);
    }, 1000);
  }, [idTour]);
  
  // Renderizar estrellas según calificación
  const renderEstrellas = (calificacion: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <svg
        key={index}
        className={`h-5 w-5 ${
          index < calificacion ? 'text-yellow-400' : 'text-gray-300'
        }`}
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };
  
  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNuevaResena({
      ...nuevaResena,
      [name]: value
    });
  };
  
  // Manejar cambio de calificación
  const handleCalificacionChange = (valor: number) => {
    setNuevaResena({
      ...nuevaResena,
      calificacion: valor
    });
  };
  
  // Manejar envío del formulario
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulación de envío
    const nuevaResenaObj = {
      id: resenas.length + 1,
      nombre: nuevaResena.nombre,
      fecha: new Date().toISOString().split('T')[0],
      comentario: nuevaResena.comentario,
      calificacion: nuevaResena.calificacion,
      avatar: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`
    };
    
    setResenas([nuevaResenaObj, ...resenas]);
    setMostrarForm(false);
    setNuevaResena({
      nombre: '',
      correo: '',
      comentario: '',
      calificacion: 5
    });
  };
  
  if (cargando) {
    return (
      <div className="animate-pulse space-y-4">
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-white/80 rounded-lg p-4 mb-4 shadow-sm border border-sky-100">
            <div className="flex items-start mb-4">
              <div className="h-12 w-12 rounded-full bg-sky-100 mr-4"></div>
              <div className="flex-1">
                <div className="h-4 bg-sky-100 rounded w-1/4 mb-2"></div>
                <div className="h-3 bg-sky-100 rounded w-1/5 mb-2"></div>
                <div className="flex h-4 space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="w-4 h-4 bg-sky-100 rounded-full"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-sky-100 rounded w-full"></div>
              <div className="h-3 bg-sky-100 rounded w-full"></div>
              <div className="h-3 bg-sky-100 rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {/* Botón para dejar reseña */}
      <button
        onClick={() => setMostrarForm(!mostrarForm)}
        className="mb-6 inline-flex items-center px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 shadow-sm"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
        {mostrarForm ? t('resenas.cancelar') : t('resenas.dejarResena')}
      </button>
      
      {/* Formulario de reseña */}
      {mostrarForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-8 shadow-md border border-sky-100"
        >
          <h3 className="text-xl font-semibold text-black mb-4">
            {t('resenas.dejarResena')}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-blue-50/70 p-4 rounded-lg">
                <label htmlFor="nombre" className="block text-sm font-medium text-black mb-1">
                  {t('resenas.nombre')} *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={nuevaResena.nombre}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
              
              <div className="bg-cyan-50/70 p-4 rounded-lg">
                <label htmlFor="correo" className="block text-sm font-medium text-black mb-1">
                  {t('resenas.correo')} *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={nuevaResena.correo}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-sky-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black"
                />
              </div>
            </div>
            
            <div className="bg-teal-50/70 p-4 rounded-lg">
              <label className="block text-sm font-medium text-black mb-1">
                {t('resenas.calificacion')} *
              </label>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((valor) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => handleCalificacionChange(valor)}
                    className="focus:outline-none"
                    aria-label={`${valor} ${t('resenas.estrellas')}`}
                  >
                    <svg
                      className={`h-8 w-8 ${
                        valor <= nuevaResena.calificacion ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-sky-50/70 p-4 rounded-lg">
              <label htmlFor="comentario" className="block text-sm font-medium text-black mb-1">
                {t('resenas.comentario')} *
              </label>
              <textarea
                id="comentario"
                name="comentario"
                value={nuevaResena.comentario}
                onChange={handleInputChange}
                required
                rows={4}
                className="w-full px-4 py-2 border border-sky-200 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black resize-none"
              ></textarea>
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setMostrarForm(false)}
                className="px-4 py-2 border border-sky-200 text-blue-700 hover:bg-sky-50 rounded-lg transition-colors duration-300"
              >
                {t('resenas.cancelar')}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-lg transition-colors duration-300 shadow-sm"
              >
                {t('resenas.enviar')}
              </button>
            </div>
          </form>
        </motion.div>
      )}
      
      {/* Lista de reseñas */}
      <div className="space-y-6">
        {resenas.map((resena) => (
          <motion.div
            key={resena.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white/80 backdrop-blur-sm rounded-lg p-6 shadow-md border border-sky-100"
          >
            <div className="flex items-start mb-4">
              <img
                src={resena.avatar}
                alt={resena.nombre}
                className="w-12 h-12 rounded-full object-cover mr-4"
              />
              <div>
                <h4 className="font-semibold text-black">
                  {resena.nombre}
                </h4>
                <p className="text-sm text-blue-700">
                  {new Date(resena.fecha).toLocaleDateString()}
                </p>
                <div className="flex mt-1">
                  {renderEstrellas(resena.calificacion)}
                </div>
              </div>
            </div>
            <p className="text-black">
              {resena.comentario}
            </p>
          </motion.div>
        ))}
      </div>
      
      {/* Paginación */}
      {resenas.length > 5 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button className="px-3 py-1 border border-sky-200 rounded-md text-blue-700 hover:bg-sky-50 transition-colors duration-200">
              {t('general.anterior')}
            </button>
            <button className="px-3 py-1 bg-teal-500 text-white rounded-md">1</button>
            <button className="px-3 py-1 border border-sky-200 rounded-md text-blue-700 hover:bg-sky-50 transition-colors duration-200">2</button>
            <button className="px-3 py-1 border border-sky-200 rounded-md text-blue-700 hover:bg-sky-50 transition-colors duration-200">
              {t('general.siguiente')}
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ResenasTour;