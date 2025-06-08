import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const FiltrosTour = () => {
  const { t } = useTranslation();
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const [rangoPrecio, setRangoPrecio] = useState<[number, number]>([0, 200]);
  const [rangoDuracion, setRangoDuracion] = useState<[number, number]>([0, 300]);
  
  // Función para actualizar el rango de precios
  const actualizarPrecio = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value);
    if (e.target.id === "minPrecio") {
      setRangoPrecio([valor, rangoPrecio[1]]);
    } else {
      setRangoPrecio([rangoPrecio[0], valor]);
    }
  };
  
  // Función para actualizar el rango de duración
  const actualizarDuracion = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = parseInt(e.target.value);
    if (e.target.id === "minDuracion") {
      setRangoDuracion([valor, rangoDuracion[1]]);
    } else {
      setRangoDuracion([rangoDuracion[0], valor]);
    }
  };

  return (
    <>
      {/* Botón móvil para mostrar/ocultar filtros */}
      <button
        className="lg:hidden w-full py-3 px-4 bg-white/90 rounded-lg shadow-md flex items-center justify-between mb-4 border border-sky-100"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        <span className="font-medium text-black flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
          </svg>
          {t('filtros.titulo')}
        </span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-blue-700 transform transition-transform duration-300 ${mostrarFiltros ? 'rotate-180' : ''}`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {/* Filtros */}
      <motion.div
        initial={{ height: 'auto' }}
        animate={{ height: mostrarFiltros || window.innerWidth >= 1024 ? 'auto' : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden lg:overflow-visible"
      >
        <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-md p-6 border border-sky-100">
          <h2 className="text-lg font-semibold text-black mb-4 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-teal-600" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
            </svg>
            {t('filtros.titulo')}
          </h2>
          
          {/* Filtro de precio */}
          <div className="mb-6 bg-blue-50/70 p-4 rounded-lg">
            <h3 className="font-medium text-black mb-3">
              {t('filtros.precio')}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-800">${rangoPrecio[0]}</span>
              <span className="text-sm text-blue-800">${rangoPrecio[1]}</span>
            </div>
            <div className="relative pt-1">
              <div className="w-full h-2 bg-blue-200 rounded-full mt-1">
                <div
                  className="absolute h-2 bg-teal-500 rounded-full"
                  style={{
                    width: `${((rangoPrecio[1] - rangoPrecio[0]) / 200) * 100}%`,
                    left: `${(rangoPrecio[0] / 200) * 100}%`
                  }}
                ></div>
              </div>
              <input
                type="range"
                id="minPrecio"
                min="0"
                max="200"
                value={rangoPrecio[0]}
                onChange={actualizarPrecio}
                className="absolute z-10 w-full appearance-none bg-transparent pointer-events-none thumb-teal"
                style={{
                  height: '15px',
                  outline: 'none',
                }}
              />
              <input
                type="range"
                id="maxPrecio"
                min="0"
                max="200"
                value={rangoPrecio[1]}
                onChange={actualizarPrecio}
                className="absolute z-20 w-full appearance-none bg-transparent pointer-events-none thumb-teal"
                style={{
                  height: '15px',
                  outline: 'none',
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label htmlFor="minPrecioInput" className="block text-sm text-blue-800 mb-1">
                  {t('filtros.min')}
                </label>
                <input
                  type="number"
                  id="minPrecioInput"
                  min="0"
                  max={rangoPrecio[1]}
                  value={rangoPrecio[0]}
                  onChange={actualizarPrecio}
                  className="w-full px-3 py-2 border border-sky-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
              <div>
                <label htmlFor="maxPrecioInput" className="block text-sm text-blue-800 mb-1">
                  {t('filtros.max')}
                </label>
                <input
                  type="number"
                  id="maxPrecioInput"
                  min={rangoPrecio[0]}
                  max="200"
                  value={rangoPrecio[1]}
                  onChange={actualizarPrecio}
                  className="w-full px-3 py-2 border border-sky-200 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          </div>
          
          {/* Filtro de duración */}
          <div className="mb-6 bg-cyan-50/70 p-4 rounded-lg">
            <h3 className="font-medium text-black mb-3">
              {t('filtros.duracion')}
            </h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-blue-800">{rangoDuracion[0]} min</span>
              <span className="text-sm text-blue-800">{rangoDuracion[1]} min</span>
            </div>
            <div className="relative pt-1">
              <div className="w-full h-2 bg-cyan-200 rounded-full mt-1">
                <div
                  className="absolute h-2 bg-teal-500 rounded-full"
                  style={{
                    width: `${((rangoDuracion[1] - rangoDuracion[0]) / 300) * 100}%`,
                    left: `${(rangoDuracion[0] / 300) * 100}%`
                  }}
                ></div>
              </div>
              <input
                type="range"
                id="minDuracion"
                min="0"
                max="300"
                value={rangoDuracion[0]}
                onChange={actualizarDuracion}
                className="absolute z-10 w-full appearance-none bg-transparent pointer-events-none thumb-teal"
                style={{
                  height: '15px',
                  outline: 'none',
                }}
              />
              <input
                type="range"
                id="maxDuracion"
                min="0"
                max="300"
                value={rangoDuracion[1]}
                onChange={actualizarDuracion}
                className="absolute z-20 w-full appearance-none bg-transparent pointer-events-none thumb-teal"
                style={{
                  height: '15px',
                  outline: 'none',
                }}
              />
            </div>
          </div>
          
          {/* Filtro de calificación */}
          <div className="mb-6 bg-teal-50/70 p-4 rounded-lg">
            <h3 className="font-medium text-black mb-3">
              {t('filtros.calificacion')}
            </h3>
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`star${star}`}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor={`star${star}`} className="ml-2 text-black flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < star ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    {star === 1 && (
                      <span className="ml-1 text-sm text-gray-500">
                        {t('filtros.yMas')}
                      </span>
                    )}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Filtro de ubicación */}
          <div className="mb-6 bg-sky-50/70 p-4 rounded-lg">
            <h3 className="font-medium text-black mb-3">
              {t('filtros.ubicacion')}
            </h3>
            <div className="space-y-2">
              {['Pisco', 'Paracas', 'San Andrés'].map((ubicacion) => (
                <div key={ubicacion} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`ubicacion-${ubicacion}`}
                    className="h-4 w-4 text-teal-500 focus:ring-teal-400 border-gray-300 rounded"
                  />
                  <label htmlFor={`ubicacion-${ubicacion}`} className="ml-2 text-black">
                    {ubicacion}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex space-x-2">
            <button className="flex-1 py-2 px-4 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-lg transition-colors duration-300 shadow-sm hover:shadow-md">
              {t('filtros.aplicar')}
            </button>
            <button className="py-2 px-4 border border-sky-200 text-blue-700 font-medium hover:bg-sky-50 rounded-lg transition-colors duration-300">
              {t('filtros.limpiar')}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default FiltrosTour;