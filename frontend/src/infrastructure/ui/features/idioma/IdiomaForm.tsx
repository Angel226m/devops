/*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  createIdioma, 
  updateIdioma, 
  fetchIdiomaPorId, 
  clearIdiomaError 
} from '../../../store/slices/idiomaSlice';
import { NuevoIdiomaRequest, ActualizarIdiomaRequest } from '../../../../domain/entities/Idioma';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { ROUTES } from '../../../../shared/constants/appRoutes';
const IdiomaForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { idiomaSeleccionado, loading, error } = useSelector((state: RootState) => state.idioma);

  const [formData, setFormData] = useState<NuevoIdiomaRequest>({
    nombre: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchIdiomaPorId(parseInt(id)));
    }

    return () => {
      dispatch(clearIdiomaError());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && idiomaSeleccionado) {
      setFormData({
        nombre: idiomaSeleccionado.nombre,
      });
    }
  }, [isEditing, idiomaSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormError(null);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setFormError('El nombre del idioma es obligatorio.');
      return false;
    }

    if (formData.nombre.trim().length < 2) {
      setFormError('El nombre del idioma debe tener al menos 2 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const nombreTrimmed = formData.nombre.trim();
      
      if (isEditing && id) {
        const updateData: ActualizarIdiomaRequest = {
          nombre: nombreTrimmed
        };
        await dispatch(updateIdioma({ id: parseInt(id), idioma: updateData })).unwrap();
      } else {
        await dispatch(createIdioma({ nombre: nombreTrimmed })).unwrap();
      }
      
      navigate(ROUTES.ADMIN.IDIOMAS.LIST); // ACTUALIZADO
    } catch (err: any) {
      console.error('Error al guardar idioma:', err);
      setFormError(err.message || 'Error al guardar idioma. Verifica los datos e intenta nuevamente.');
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando idioma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header *//*}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link 
                  to={ROUTES.ADMIN.IDIOMAS.LIST} 
                  className="mr-3 text-white hover:text-blue-200 transition-colors"
                >
                  <FiArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-white">
                  {isEditing ? 'Editar Idioma' : 'Crear Nuevo Idioma'}
                </h1>
              </div>
            </div>
          </div>

          {/* Content *//*}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
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
              </div>
            )}

            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Idioma *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Ej: Español, English, Français..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ingrese el nombre del idioma (máximo 50 caracteres)
                </p>
              </div>

              {/* Buttons *//*}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ADMIN.IDIOMAS.LIST)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomaForm;*/


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  createIdioma, 
  updateIdioma, 
  fetchIdiomaPorId, 
  clearIdiomaError 
} from '../../../store/slices/idiomaSlice';
import { NuevoIdiomaRequest, ActualizarIdiomaRequest } from '../../../../domain/entities/Idioma';
import { FiArrowLeft, FiSave, FiX } from 'react-icons/fi';
import { ROUTES } from '../../../../shared/constants/appRoutes';

const IdiomaForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;

  const { idiomaSeleccionado, loading, error } = useSelector((state: RootState) => state.idioma);

  const [formData, setFormData] = useState<NuevoIdiomaRequest>({
    nombre: '',
  });

  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchIdiomaPorId(parseInt(id)));
    }

    return () => {
      dispatch(clearIdiomaError());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && idiomaSeleccionado) {
      setFormData({
        nombre: idiomaSeleccionado.nombre,
      });
    }
  }, [isEditing, idiomaSeleccionado]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setFormError(null);
  };

  const validateForm = () => {
    if (!formData.nombre.trim()) {
      setFormError('El nombre del idioma es obligatorio.');
      return false;
    }

    if (formData.nombre.trim().length < 2) {
      setFormError('El nombre del idioma debe tener al menos 2 caracteres.');
      return false;
    }

    if (formData.nombre.trim().length > 50) {
      setFormError('El nombre del idioma no puede tener más de 50 caracteres.');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const nombreTrimmed = formData.nombre.trim();
      
      if (isEditing && id) {
        const updateData: ActualizarIdiomaRequest = {
          nombre: nombreTrimmed
        };
        await dispatch(updateIdioma({ id: parseInt(id), idioma: updateData })).unwrap();
      } else {
        await dispatch(createIdioma({ nombre: nombreTrimmed })).unwrap();
      }
      
      navigate(ROUTES.ADMIN.IDIOMAS.LIST);
    } catch (err: any) {
      console.error('Error al guardar idioma:', err);
      setFormError(err.message || 'Error al guardar idioma. Verifica los datos e intenta nuevamente.');
    }
  };

  if (loading && isEditing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando idioma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Link 
                  to={ROUTES.ADMIN.IDIOMAS.LIST} 
                  className="mr-3 text-white hover:text-blue-200 transition-colors"
                >
                  <FiArrowLeft size={20} />
                </Link>
                <h1 className="text-xl font-bold text-white">
                  {isEditing ? 'Editar Idioma' : 'Crear Nuevo Idioma'}
                </h1>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
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
              </div>
            )}

            {formError && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md" role="alert">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm">{formError}</p>
                  </div>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Idioma *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  placeholder="Ej: Español, English, Français..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Ingrese el nombre del idioma (máximo 50 caracteres)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.ADMIN.IDIOMAS.LIST)}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <FiX className="mr-2 h-4 w-4" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <FiSave className="mr-2 h-4 w-4" />
                  {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IdiomaForm;