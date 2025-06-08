/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  fetchTiposTour,
  fetchTiposTourPorSede,
  TipoTourState 
} from '../../../infrastructure/store/slices/tipoTourSlice';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { FaWalking, FaUtensils, FaUmbrellaBeach, FaMoon, FaLandmark, FaSearch, FaMapMarkedAlt, FaClock } from 'react-icons/fa';

// Función para asegurar que los valores sean cadenas de texto
const asegurarTexto = (valor: any): string => {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number') return valor.toString();
  // Si es un objeto, convertirlo a JSON string
  if (typeof valor === 'object') {
    try {
      // Intentar acceder a propiedades comunes de objetos SQL como String o Valid
      if (valor.String !== undefined) return valor.String || '';
      if (valor.Valid !== undefined) return valor.Valid ? valor.String || '' : '';
      return JSON.stringify(valor);
    } catch (e) {
      console.error('Error al convertir objeto a texto:', e);
      return '';
    }
  }
  return '';
};

// Mapeo de iconos para cada tipo de tour
const getTourIcon = (tourName: string) => {
  const name = tourName.toLowerCase();
  if (name.includes('cultural')) return <FaLandmark className="h-6 w-6 text-blue-600" />;
  if (name.includes('aventura')) return <FaWalking className="h-6 w-6 text-green-600" />;
  if (name.includes('gastronómico') || name.includes('gastronomico')) return <FaUtensils className="h-6 w-6 text-orange-600" />;
  if (name.includes('playa')) return <FaUmbrellaBeach className="h-6 w-6 text-cyan-600" />;
  if (name.includes('nocturno')) return <FaMoon className="h-6 w-6 text-indigo-600" />;
  return <FaMapMarkedAlt className="h-6 w-6 text-blue-600" />; // Icono por defecto
};

// Función para obtener colores de gradiente según el tipo de tour
const getTourGradient = (tourName: string) => {
  const name = tourName.toLowerCase();
  if (name.includes('cultural')) return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
  if (name.includes('aventura')) return 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800';
  if (name.includes('gastronómico') || name.includes('gastronomico')) return 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700';
  if (name.includes('playa')) return 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
  if (name.includes('nocturno')) return 'from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800';
  return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'; // Gradiente por defecto
};

const ToursProgramadosPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tiposTour, loading, error } = useSelector<RootState, TipoTourState>(
    (state) => state.tipoTour
  );
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTour, setHoveredTour] = useState<number | null>(null);

  useEffect(() => {
    try {
      // Si hay una sede seleccionada, filtramos por esa sede
      if (selectedSede?.id_sede) {
        dispatch(fetchTiposTourPorSede(selectedSede.id_sede));
      } else {
        // Si no hay sede seleccionada, cargamos todos los tipos de tour
        dispatch(fetchTiposTour());
      }
    } catch (error) {
      console.error("Error al cargar los tipos de tour:", error);
    }
  }, [dispatch, selectedSede]);

  // Filtrar tipos de tour según el término de búsqueda y asegurar que son objetos válidos
  const filteredTiposTour = tiposTour
    .filter(tipo => tipo && typeof tipo === 'object')  // Verificar que sea un objeto válido
    .filter(tipo => {
      const nombreStr = asegurarTexto(tipo.nombre);
      const descripcionStr = asegurarTexto(tipo.descripcion);
      return nombreStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
             descripcionStr.toLowerCase().includes(searchTerm.toLowerCase());
    });

  const handleSeleccionTour = (tipoId: number) => {
    console.log(`Tipo de tour seleccionado: ${tipoId}`);
    // Aquí solo registramos la selección, sin navegación
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando tipos de tour...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tours Programados
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Selecciona el tipo de tour que deseas programar
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{asegurarTexto(error)}</p>
            </div>
          </motion.div>
        )}

        {/* Barra de búsqueda *//*}
        {tiposTour.length > 0 && (
          <motion.div 
            className="mb-8 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Buscar tipo de tour..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid de Botones de Tipos de Tour *//*}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTiposTour.map((tipo) => {
            // Asegurar que todos los valores son strings
            const nombre = asegurarTexto(tipo.nombre);
            const descripcion = asegurarTexto(tipo.descripcion);
            const duracionMinutos = tipo.duracion_minutos !== undefined ? 
              (typeof tipo.duracion_minutos === 'number' ? 
                tipo.duracion_minutos : 
                parseInt(asegurarTexto(tipo.duracion_minutos)) || 0) : 
              0;
            const urlImagen = asegurarTexto(tipo.url_imagen);
            
            return (
              <motion.div 
                key={tipo.id_tipo_tour}
                variants={childVariants}
                onMouseEnter={() => setHoveredTour(tipo.id_tipo_tour)}
                onMouseLeave={() => setHoveredTour(null)}
                className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 ${
                  hoveredTour === tipo.id_tipo_tour ? 'scale-105 shadow-lg' : ''
                }`}
                onClick={() => handleSeleccionTour(tipo.id_tipo_tour)}
              >
                <div className="p-6 cursor-pointer">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-100 p-3 mr-3">
                      {getTourIcon(nombre)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{nombre || 'Sin nombre'}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      {descripcion || 'Sin descripción disponible'}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaClock className="mr-1" /> 
                    <span>Duración: {duracionMinutos} minutos</span>
                  </div>
                  
                  {urlImagen && (
                    <div className="h-32 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={urlImagen} 
                        alt={nombre} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div
                    className={`mt-2 w-full bg-gradient-to-r ${getTourGradient(nombre)} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] flex justify-center items-center`}
                  >
                    Programar Tours
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {tiposTour.length === 0 && !loading && (
          <motion.div 
            className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-6 rounded-md shadow-md max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold">No hay tipos de tour disponibles</p>
                <p className="text-sm mt-1">No se encontraron tipos de tour en el sistema. Póngase en contacto con el administrador.</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {tiposTour.length > 0 && (
          <motion.div 
            className="text-center mt-8 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Se {filteredTiposTour.length === 1 ? 'encontró' : 'encontraron'} {filteredTiposTour.length} {filteredTiposTour.length === 1 ? 'tipo de tour' : 'tipos de tour'} {searchTerm && 'para la búsqueda actual'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ToursProgramadosPage;*/

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  fetchTiposTour,
  fetchTiposTourPorSede,
  TipoTourState 
} from '../../../infrastructure/store/slices/tipoTourSlice';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { FaWalking, FaUtensils, FaUmbrellaBeach, FaMoon, FaLandmark, FaSearch, FaMapMarkedAlt, FaClock } from 'react-icons/fa';

// Función para asegurar que los valores sean cadenas de texto
const asegurarTexto = (valor: any): string => {
  if (valor === null || valor === undefined) return '';
  if (typeof valor === 'string') return valor;
  if (typeof valor === 'number') return valor.toString();
  // Si es un objeto, convertirlo a JSON string
  if (typeof valor === 'object') {
    try {
      // Intentar acceder a propiedades comunes de objetos SQL como String o Valid
      if (valor.String !== undefined) return valor.String || '';
      if (valor.Valid !== undefined) return valor.Valid ? valor.String || '' : '';
      return JSON.stringify(valor);
    } catch (e) {
      console.error('Error al convertir objeto a texto:', e);
      return '';
    }
  }
  return '';
};

// Mapeo de iconos para cada tipo de tour
const getTourIcon = (tourName: string) => {
  const name = tourName.toLowerCase();
  if (name.includes('cultural')) return <FaLandmark className="h-6 w-6 text-blue-600" />;
  if (name.includes('aventura')) return <FaWalking className="h-6 w-6 text-green-600" />;
  if (name.includes('gastronómico') || name.includes('gastronomico')) return <FaUtensils className="h-6 w-6 text-orange-600" />;
  if (name.includes('playa')) return <FaUmbrellaBeach className="h-6 w-6 text-cyan-600" />;
  if (name.includes('nocturno')) return <FaMoon className="h-6 w-6 text-indigo-600" />;
  return <FaMapMarkedAlt className="h-6 w-6 text-blue-600" />; // Icono por defecto
};

// Función para obtener colores de gradiente según el tipo de tour
const getTourGradient = (tourName: string) => {
  const name = tourName.toLowerCase();
  if (name.includes('cultural')) return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800';
  if (name.includes('aventura')) return 'from-green-600 to-green-700 hover:from-green-700 hover:to-green-800';
  if (name.includes('gastronómico') || name.includes('gastronomico')) return 'from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700';
  if (name.includes('playa')) return 'from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700';
  if (name.includes('nocturno')) return 'from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800';
  return 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800'; // Gradiente por defecto
};

const ToursProgramadosPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { tiposTour, loading, error } = useSelector<RootState, TipoTourState>(
    (state) => state.tipoTour
  );
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredTour, setHoveredTour] = useState<number | null>(null);

  useEffect(() => {
    try {
      // Si hay una sede seleccionada, filtramos por esa sede
      if (selectedSede?.id_sede) {
        dispatch(fetchTiposTourPorSede(selectedSede.id_sede));
      } else {
        // Si no hay sede seleccionada, cargamos todos los tipos de tour
        dispatch(fetchTiposTour());
      }
    } catch (error) {
      console.error("Error al cargar los tipos de tour:", error);
    }
  }, [dispatch, selectedSede]);

  // Filtrar tipos de tour según el término de búsqueda y asegurar que son objetos válidos
  const filteredTiposTour = tiposTour
    .filter(tipo => tipo && typeof tipo === 'object')  // Verificar que sea un objeto válido
    .filter(tipo => {
      const nombreStr = asegurarTexto(tipo.nombre);
      const descripcionStr = asegurarTexto(tipo.descripcion);
      return nombreStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
             descripcionStr.toLowerCase().includes(searchTerm.toLowerCase());
    });

const handleSeleccionTour = (tipoId: number) => {
  console.log(`Tipo de tour seleccionado: ${tipoId}`);
  // Navegar a la lista de tours programados con el tipo seleccionado
  // Corregido para usar la ruta completa correcta:
  navigate(`/admin/tours/lista/${tipoId}`);
};

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };
  
  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100">
        <div className="w-16 h-16 relative">
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-4 border-blue-600 rounded-full animate-spin border-t-transparent"></div>
        </div>
        <p className="mt-4 text-lg text-blue-800 font-medium animate-pulse">Cargando tipos de tour...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h1 
            className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Tours Programados
          </motion.h1>
          <motion.p 
            className="text-lg text-slate-600 max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Selecciona el tipo de tour que deseas programar
          </motion.p>
        </div>

        {error && (
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-sm mb-8 max-w-3xl mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="font-medium">{asegurarTexto(error)}</p>
            </div>
          </motion.div>
        )}

        {/* Barra de búsqueda */}
        {tiposTour.length > 0 && (
          <motion.div 
            className="mb-8 mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex justify-center">
              <div className="relative w-full max-w-lg">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                  placeholder="Buscar tipo de tour..."
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* Grid de Botones de Tipos de Tour */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredTiposTour.map((tipo) => {
            // Asegurar que todos los valores son strings
            const nombre = asegurarTexto(tipo.nombre);
            const descripcion = asegurarTexto(tipo.descripcion);
            const duracionMinutos = tipo.duracion_minutos !== undefined ? 
              (typeof tipo.duracion_minutos === 'number' ? 
                tipo.duracion_minutos : 
                parseInt(asegurarTexto(tipo.duracion_minutos)) || 0) : 
              0;
            const urlImagen = asegurarTexto(tipo.url_imagen);
            
            return (
              <motion.div 
                key={tipo.id_tipo_tour}
                variants={childVariants}
                onMouseEnter={() => setHoveredTour(tipo.id_tipo_tour)}
                onMouseLeave={() => setHoveredTour(null)}
                className={`bg-white rounded-xl shadow-md overflow-hidden transform transition-all duration-300 ${
                  hoveredTour === tipo.id_tipo_tour ? 'scale-105 shadow-lg' : ''
                }`}
                onClick={() => handleSeleccionTour(tipo.id_tipo_tour)}
              >
                <div className="p-6 cursor-pointer">
                  <div className="flex items-center mb-4">
                    <div className="rounded-full bg-blue-100 p-3 mr-3">
                      {getTourIcon(nombre)}
                    </div>
                    <h2 className="text-xl font-bold text-gray-800">{nombre || 'Sin nombre'}</h2>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600 text-sm">
                      {descripcion || 'Sin descripción disponible'}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-gray-500 text-sm mb-4">
                    <FaClock className="mr-1" /> 
                    <span>Duración: {duracionMinutos} minutos</span>
                  </div>
                  
                  {urlImagen && (
                    <div className="h-32 mb-4 overflow-hidden rounded-lg">
                      <img 
                        src={urlImagen} 
                        alt={nombre} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  
                  <div
                    className={`mt-2 w-full bg-gradient-to-r ${getTourGradient(nombre)} text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 transform hover:translate-y-[-2px] flex justify-center items-center`}
                  >
                    Programar Tours
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
        
        {tiposTour.length === 0 && !loading && (
          <motion.div 
            className="bg-amber-50 border-l-4 border-amber-500 text-amber-700 p-6 rounded-md shadow-md max-w-3xl mx-auto mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center">
              <svg className="w-6 h-6 mr-3 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 4a1 1 0 00-1 1v3a1 1 0 102 0v-3a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="font-bold">No hay tipos de tour disponibles</p>
                <p className="text-sm mt-1">No se encontraron tipos de tour en el sistema. Póngase en contacto con el administrador.</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {tiposTour.length > 0 && (
          <motion.div 
            className="text-center mt-8 text-gray-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Se {filteredTiposTour.length === 1 ? 'encontró' : 'encontraron'} {filteredTiposTour.length} {filteredTiposTour.length === 1 ? 'tipo de tour' : 'tipos de tour'} {searchTerm && 'para la búsqueda actual'}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ToursProgramadosPage;