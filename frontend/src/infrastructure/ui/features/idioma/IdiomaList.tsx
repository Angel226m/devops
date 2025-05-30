import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchIdiomas, deleteIdioma } from '../../../store/slices/idiomaSlice';
import { FiEdit, FiTrash2, FiPlus, FiSearch, FiGlobe, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { ROUTES } from '../../../../shared/constants/appRoutes';
const IdiomaList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { idiomas, loading, error } = useSelector((state: RootState) => state.idioma);
  
  const [busqueda, setBusqueda] = useState('');
  const [modalConfirmacion, setModalConfirmacion] = useState<{ mostrar: boolean; id: number | null; nombre: string }>({
    mostrar: false,
    id: null,
    nombre: '',
  });

  useEffect(() => {
    dispatch(fetchIdiomas());
  }, [dispatch]);

  const handleBusqueda = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBusqueda(e.target.value);
  };

  const idiomasFiltrados = idiomas.filter(idioma =>
    idioma.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const confirmarEliminar = (id: number, nombre: string) => {
    setModalConfirmacion({ mostrar: true, id, nombre });
  };

  const eliminarIdioma = async () => {
    if (modalConfirmacion.id) {
      try {
        await dispatch(deleteIdioma(modalConfirmacion.id)).unwrap();
        setModalConfirmacion({ mostrar: false, id: null, nombre: '' });
      } catch (error) {
        console.error('Error al eliminar idioma:', error);
      }
    }
  };

  const cancelarEliminar = () => {
    setModalConfirmacion({ mostrar: false, id: null, nombre: '' });
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

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  if (loading && idiomas.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando idiomas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-lg shadow-md overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Link 
                  to={ROUTES.AUTH.SELECT_SEDE} 
                  className="mr-3 text-white hover:text-blue-200 transition-colors"
                >
                  <FiArrowLeft size={20} />
                </Link>
                <div className="flex items-center">
                  <FiGlobe className="h-6 w-6 text-white mr-3" />
                  <h1 className="text-2xl font-bold text-white">Gestión de Idiomas</h1>
                </div>
              </div>
              <button
                onClick={() => navigate(ROUTES.ADMIN.IDIOMAS.NEW)}
                className="inline-flex items-center px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg shadow-md hover:bg-blue-50 transition-colors duration-300"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Nuevo Idioma
              </button>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md"
            role="alert"
          >
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Search Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-white rounded-lg shadow-md p-6 mb-8"
        >
          <div className="relative max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar idioma..."
              value={busqueda}
              onChange={handleBusqueda}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {busqueda && (
            <p className="mt-2 text-sm text-gray-600">
              {idiomasFiltrados.length} resultado(s) encontrado(s)
            </p>
          )}
        </motion.div>

        {/* Content */}
        {idiomasFiltrados.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="bg-white rounded-lg shadow-md p-8 text-center"
          >
            <FiGlobe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {busqueda ? 'No se encontraron idiomas' : 'No hay idiomas registrados'}
            </h3>
            <p className="text-gray-500 mb-6">
              {busqueda 
                ? 'Intenta con otros términos de búsqueda'
                : 'Comienza agregando idiomas disponibles en el sistema'
              }
            </p>
            {!busqueda && (
              <button
                onClick={() => navigate(ROUTES.ADMIN.IDIOMAS.NEW)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-300"
              >
                <FiPlus className="mr-2 h-4 w-4" />
                Crear Primer Idioma
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nombre del Idioma
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {idiomasFiltrados.map((idioma, index) => (
                    <motion.tr 
                      key={idioma.id_idioma} 
                      variants={itemVariants}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {idioma.id_idioma}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-8 w-8">
                            <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <FiGlobe className="h-4 w-4 text-blue-600" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {idioma.nombre}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <Link 
                            to={ROUTES.ADMIN.IDIOMAS.EDIT(idioma.id_idioma)}
                            className="inline-flex items-center p-2 border border-transparent rounded-md text-amber-600 hover:bg-amber-50 transition-colors duration-150"
                            title="Editar idioma"
                          >
                            <FiEdit size={16} />
                          </Link>
                          <button
                            onClick={() => confirmarEliminar(idioma.id_idioma, idioma.nombre)}
                            className="inline-flex items-center p-2 border border-transparent rounded-md text-red-600 hover:bg-red-50 transition-colors duration-150"
                            title="Eliminar idioma"
                          >
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Estadísticas */}
        {idiomas.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 bg-white rounded-lg shadow-md p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Resumen</h3>
                <p className="text-sm text-gray-500">
                  Total de idiomas disponibles en el sistema
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600">{idiomas.length}</div>
                <div className="text-sm text-gray-500">
                  {idiomas.length === 1 ? 'Idioma' : 'Idiomas'}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Modal de confirmación de eliminación */}
      {modalConfirmacion.mostrar && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4"
          >
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Confirmar eliminación</h3>
              </div>
            </div>
            <p className="text-gray-500 mb-6">
              ¿Está seguro de que desea eliminar el idioma <span className="font-semibold">"{modalConfirmacion.nombre}"</span>? 
              Esta acción no se puede deshacer y podría afectar a los usuarios que tengan este idioma asignado.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelarEliminar}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={eliminarIdioma}
                className="px-4 py-2 border border-transparent rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Eliminar
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default IdiomaList;