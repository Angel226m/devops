 /*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPaquetePasajesById,
  createPaquetePasajes,
  updatePaquetePasajes,
  clearPaquetePasajesActual,
  clearError,
} from '../../../store/slices/paquetePasajesSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import { fetchTiposPasajeByTipoTour } from '../../../store/slices/tipoPasajeSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { NuevoPaquetePasajesRequest, ActualizarPaquetePasajesRequest } from '../../../../domain/entities/PaquetePasajes';
import { FiSave, FiX, FiAlertTriangle, FiPackage, FiDollarSign, FiList, FiInfo } from 'react-icons/fi';

interface PaquetePasajesFormProps {
  isEditing?: boolean;
}

const PaquetePasajesForm: React.FC<PaquetePasajesFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { paquetePasajesActual, loading, error } = useSelector((state: RootState) => state.paquetePasajes);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { tiposPasaje } = useSelector((state: RootState) => state.tipoPasaje);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formState, setFormState] = useState<NuevoPaquetePasajesRequest>({
    id_sede: selectedSede?.id_sede || 0,
    id_tipo_tour: 0,
    nombre: '',
    descripcion: '',
    precio_total: 0,
    cantidad_total: 0,
  });
  
  const [formErrors, setFormErrors] = useState<{
    id_tipo_tour?: string;
    nombre?: string;
    descripcion?: string;
    precio_total?: string;
    cantidad_total?: string;
  }>({});

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchTiposTour());

    // Solución al error: Validar que id sea un número válido
    if (isEditing && id && !isNaN(parseInt(id))) {
      dispatch(fetchPaquetePasajesById(parseInt(id)));
    } else if (isEditing) {
      // Si estamos en modo edición pero el id no es válido, redirigir
      console.error('ID de paquete inválido:', id);
      navigate('/admin/paquetes-pasajes');
    }

    return () => {
      dispatch(clearPaquetePasajesActual());
    };
  }, [dispatch, id, isEditing, navigate]);

  useEffect(() => {
    if (formState.id_tipo_tour > 0) {
      dispatch(fetchTiposPasajeByTipoTour(formState.id_tipo_tour));
    }
  }, [dispatch, formState.id_tipo_tour]);

  useEffect(() => {
    if (isEditing && paquetePasajesActual) {
      setFormState({
        id_sede: paquetePasajesActual.id_sede || selectedSede?.id_sede || 0,
        id_tipo_tour: paquetePasajesActual.id_tipo_tour || 0,
        nombre: paquetePasajesActual.nombre || '',
        descripcion: paquetePasajesActual.descripcion || '',
        precio_total: paquetePasajesActual.precio_total || 0,
        cantidad_total: paquetePasajesActual.cantidad_total || 0,
      });
    }
  }, [paquetePasajesActual, isEditing, selectedSede]);

  const validateForm = (): boolean => {
    const errors: {
      id_tipo_tour?: string;
      nombre?: string;
      precio_total?: string;
      cantidad_total?: string;
    } = {};
    
    if (!formState.id_tipo_tour) {
      errors.id_tipo_tour = 'Debe seleccionar un tipo de tour';
    }
    
    if (!formState.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (formState.precio_total <= 0) {
      errors.precio_total = 'El precio total debe ser mayor a 0';
    }
    
    if (formState.cantidad_total <= 0) {
      errors.cantidad_total = 'La cantidad total debe ser mayor a 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let updatedValue: string | number = value;
    
    if (name === 'precio_total') {
      updatedValue = parseFloat(value) || 0;
    } else if (name === 'cantidad_total') {
      updatedValue = parseInt(value) || 0;
    } else if (name === 'id_tipo_tour') {
      updatedValue = parseInt(value) || 0;
    }
    
    setFormState((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
    
    // Limpiar error específico cuando el usuario modifica el campo
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && id && !isNaN(parseInt(id))) {
        const updateData: ActualizarPaquetePasajesRequest = {
          id_tipo_tour: formState.id_tipo_tour,
          nombre: formState.nombre,
          descripcion: formState.descripcion,
          precio_total: formState.precio_total,
          cantidad_total: formState.cantidad_total,
        };
        
        await dispatch(
          updatePaquetePasajes({
            id: parseInt(id),
            paquetePasajes: updateData,
          })
        ).unwrap();
        navigate('/admin/paquetes-pasajes');
      } else {
        const newPaquete = {
          ...formState,
          id_sede: selectedSede?.id_sede || 0,
        };
        await dispatch(createPaquetePasajes(newPaquete)).unwrap();
        navigate('/admin/paquetes-pasajes');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/paquetes-pasajes');
  };

  if (loading && isEditing) {
    return (
      <Card className="w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FiPackage className="text-green-600" />
          {isEditing ? 'Editar Paquete de Pasajes' : 'Crear Nuevo Paquete de Pasajes'}
        </h3>
        <p className="text-sm text-gray-600">
          {isEditing 
            ? 'Modifique los datos del paquete de pasajes seleccionado' 
            : 'Complete el formulario para crear un nuevo paquete de pasajes'}
        </p>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 rounded">
            <div className="flex items-center">
              <FiAlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Tour
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiList className="text-gray-400" />
                  </div>
                  <select
                    name="id_tipo_tour"
                    value={formState.id_tipo_tour}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.id_tipo_tour ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  >
                    <option value="">Seleccione un tipo de tour</option>
                    {tiposTour.map((tipoTour) => (
                      <option key={tipoTour.id_tipo_tour} value={tipoTour.id_tipo_tour}>
                        {tipoTour.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.id_tipo_tour && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.id_tipo_tour}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPackage className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    value={formState.nombre}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ej: Paquete Familiar, Grupo Escolar"
                  />
                </div>
                {formErrors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Total
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="precio_total"
                    step="0.01"
                    min="0"
                    value={formState.precio_total}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.precio_total ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ej: 99.90"
                  />
                </div>
                {formErrors.precio_total && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.precio_total}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad Total de Pasajes
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiList className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="cantidad_total"
                    min="1"
                    value={formState.cantidad_total}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.cantidad_total ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ej: 4"
                  />
                </div>
                {formErrors.cantidad_total && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.cantidad_total}</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiInfo className="text-gray-400" />
                  </div>
                  <textarea
                    name="descripcion"
                    value={formState.descripcion}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Describa los detalles del paquete, incluyendo las ventajas y limitaciones"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {selectedSede && (
            <div className="mt-2 mb-4 bg-blue-50 border border-blue-200 p-3 rounded-md">
              <p className="text-sm text-blue-700 flex items-center">
                <FiInfo className="mr-2" />
                Sede seleccionada: <span className="font-semibold ml-1">{selectedSede.nombre}</span>
              </p>
            </div>
          )}
          
          {tiposPasaje.length > 0 && formState.id_tipo_tour > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                <FiList className="mr-2 text-green-600" />
                Tipos de Pasaje Disponibles
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Estos son los tipos de pasaje disponibles para el tipo de tour seleccionado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiposPasaje.map(tipoPasaje => (
                  <div key={tipoPasaje.id_tipo_pasaje} className="border border-gray-200 p-3 rounded-md bg-white shadow-sm hover:shadow transition-shadow duration-200">
                    <p className="font-medium text-gray-800">{tipoPasaje.nombre}</p>
                    <div className="flex items-center mt-1 text-green-600">
                      <FiDollarSign className="mr-1" />
                      <p className="text-sm">{tipoPasaje.costo.toFixed(2)}</p>
                    </div>
                    {tipoPasaje.edad && (
                      <p className="text-sm text-gray-600 mt-1">{tipoPasaje.edad}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex items-center"
            >
              <FiX className="mr-2" /> Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={loading}
              className="flex items-center"
            >
              <FiSave className="mr-2" />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaquetePasajesForm;*/



import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchPaquetePasajesById,
  createPaquetePasajes,
  updatePaquetePasajes,
  clearPaquetePasajesActual,
  clearError,
} from '../../../store/slices/paquetePasajesSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import { fetchTiposPasajeByTipoTour } from '../../../store/slices/tipoPasajeSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { NuevoPaquetePasajesRequest, ActualizarPaquetePasajesRequest } from '../../../../domain/entities/PaquetePasajes';
import { FiSave, FiX, FiAlertTriangle, FiPackage, FiDollarSign, FiList, FiInfo } from 'react-icons/fi';

interface PaquetePasajesFormProps {
  isEditing?: boolean;
}

const PaquetePasajesForm: React.FC<PaquetePasajesFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { paquetePasajesActual, loading, error } = useSelector((state: RootState) => state.paquetePasajes);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { tiposPasaje } = useSelector((state: RootState) => state.tipoPasaje);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formState, setFormState] = useState<NuevoPaquetePasajesRequest>({
    id_sede: selectedSede?.id_sede || 0,
    id_tipo_tour: 0,
    nombre: '',
    descripcion: '',
    precio_total: 0,
    cantidad_total: 0,
  });
  
  const [formErrors, setFormErrors] = useState<{
    id_tipo_tour?: string;
    nombre?: string;
    descripcion?: string;
    precio_total?: string;
    cantidad_total?: string;
  }>({});

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchTiposTour());

    // Solución al error: Validar que id sea un número válido
    if (isEditing && id && !isNaN(parseInt(id))) {
      dispatch(fetchPaquetePasajesById(parseInt(id)));
    } else if (isEditing) {
      // Si estamos en modo edición pero el id no es válido, redirigir
      console.error('ID de paquete inválido:', id);
      navigate('/admin/paquetes-pasajes');
    }

    return () => {
      dispatch(clearPaquetePasajesActual());
    };
  }, [dispatch, id, isEditing, navigate]);

  useEffect(() => {
    if (formState.id_tipo_tour > 0) {
      dispatch(fetchTiposPasajeByTipoTour(formState.id_tipo_tour));
    }
  }, [dispatch, formState.id_tipo_tour]);

  useEffect(() => {
    if (isEditing && paquetePasajesActual) {
      setFormState({
        id_sede: paquetePasajesActual.id_sede || selectedSede?.id_sede || 0,
        id_tipo_tour: paquetePasajesActual.id_tipo_tour || 0,
        nombre: paquetePasajesActual.nombre || '',
        descripcion: paquetePasajesActual.descripcion || '',
        precio_total: paquetePasajesActual.precio_total || 0,
        cantidad_total: paquetePasajesActual.cantidad_total || 0,
      });
    }
  }, [paquetePasajesActual, isEditing, selectedSede]);

  // Filtrar tipos de tour por sede seleccionada
  const tiposTourFiltrados = tiposTour.filter(tipo => {
    // Si hay una sede seleccionada, mostrar solo los tipos de tour de esa sede
    if (selectedSede?.id_sede) {
      return tipo.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada, mostrar todos los tipos de tour
    return true;
  });

  const validateForm = (): boolean => {
    const errors: {
      id_tipo_tour?: string;
      nombre?: string;
      precio_total?: string;
      cantidad_total?: string;
    } = {};
    
    if (!formState.id_tipo_tour) {
      errors.id_tipo_tour = 'Debe seleccionar un tipo de tour';
    }
    
    if (!formState.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (formState.precio_total <= 0) {
      errors.precio_total = 'El precio total debe ser mayor a 0';
    }
    
    if (formState.cantidad_total <= 0) {
      errors.cantidad_total = 'La cantidad total debe ser mayor a 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    let updatedValue: string | number = value;
    
    if (name === 'precio_total') {
      updatedValue = parseFloat(value) || 0;
    } else if (name === 'cantidad_total') {
      updatedValue = parseInt(value) || 0;
    } else if (name === 'id_tipo_tour') {
      updatedValue = parseInt(value) || 0;
    }
    
    setFormState((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));
    
    // Limpiar error específico cuando el usuario modifica el campo
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      if (isEditing && id && !isNaN(parseInt(id))) {
        const updateData: ActualizarPaquetePasajesRequest = {
          id_tipo_tour: formState.id_tipo_tour,
          nombre: formState.nombre,
          descripcion: formState.descripcion,
          precio_total: formState.precio_total,
          cantidad_total: formState.cantidad_total,
        };
        
        await dispatch(
          updatePaquetePasajes({
            id: parseInt(id),
            paquetePasajes: updateData,
          })
        ).unwrap();
        navigate('/admin/paquetes-pasajes');
      } else {
        const newPaquete = {
          ...formState,
          id_sede: selectedSede?.id_sede || 0,
        };
        await dispatch(createPaquetePasajes(newPaquete)).unwrap();
        navigate('/admin/paquetes-pasajes');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/paquetes-pasajes');
  };

  if (loading && isEditing) {
    return (
      <Card className="w-full">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FiPackage className="text-green-600" />
          {isEditing ? 'Editar Paquete de Pasajes' : 'Crear Nuevo Paquete de Pasajes'}
        </h3>
        <p className="text-sm text-gray-600">
          {isEditing 
            ? 'Modifique los datos del paquete de pasajes seleccionado' 
            : 'Complete el formulario para crear un nuevo paquete de pasajes'}
          {selectedSede?.nombre && ` - Sede: ${selectedSede.nombre}`}
        </p>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 rounded">
            <div className="flex items-center">
              <FiAlertTriangle className="h-5 w-5 mr-2" />
              <p>{error}</p>
            </div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Tour
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiList className="text-gray-400" />
                  </div>
                  <select
                    name="id_tipo_tour"
                    value={formState.id_tipo_tour}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.id_tipo_tour ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                  >
                    <option value="">Seleccione un tipo de tour</option>
                    {tiposTourFiltrados.map((tipoTour) => (
                      <option key={tipoTour.id_tipo_tour} value={tipoTour.id_tipo_tour}>
                        {tipoTour.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                {formErrors.id_tipo_tour && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.id_tipo_tour}</p>
                )}
                {tiposTourFiltrados.length === 0 && selectedSede && (
                  <p className="mt-1 text-sm text-red-500">
                    No hay tipos de tour disponibles para esta sede. Por favor, cree primero un tipo de tour.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiPackage className="text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="nombre"
                    value={formState.nombre}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.nombre ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ej: Paquete Familiar, Grupo Escolar"
                  />
                </div>
                {formErrors.nombre && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.nombre}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Precio Total
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiDollarSign className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="precio_total"
                    step="0.01"
                    min="0"
                    value={formState.precio_total}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.precio_total ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ej: 99.90"
                  />
                </div>
                {formErrors.precio_total && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.precio_total}</p>
                )}
              </div>
            </div>
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad Total de Pasajes
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiList className="text-gray-400" />
                  </div>
                  <input
                    type="number"
                    name="cantidad_total"
                    min="1"
                    value={formState.cantidad_total}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${formErrors.cantidad_total ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500`}
                    placeholder="Ej: 4"
                  />
                </div>
                {formErrors.cantidad_total && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.cantidad_total}</p>
                )}
              </div>
            </div>
            
            <div className="md:col-span-2">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3 pointer-events-none">
                    <FiInfo className="text-gray-400" />
                  </div>
                  <textarea
                    name="descripcion"
                    value={formState.descripcion}
                    onChange={handleChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
                    rows={4}
                    placeholder="Describa los detalles del paquete, incluyendo las ventajas y limitaciones"
                  />
                </div>
              </div>
            </div>
          </div>
          
          {selectedSede && (
            <div className="mt-2 mb-4 bg-blue-50 border border-blue-200 p-3 rounded-md">
              <p className="text-sm text-blue-700 flex items-center">
                <FiInfo className="mr-2" />
                Sede seleccionada: <span className="font-semibold ml-1">{selectedSede.nombre}</span>
              </p>
            </div>
          )}
          
          {tiposPasaje.length > 0 && formState.id_tipo_tour > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium text-gray-700 mb-2 flex items-center">
                <FiList className="mr-2 text-green-600" />
                Tipos de Pasaje Disponibles
              </h3>
              <p className="text-sm text-gray-500 mb-3">
                Estos son los tipos de pasaje disponibles para el tipo de tour seleccionado.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiposPasaje.map(tipoPasaje => (
                  <div key={tipoPasaje.id_tipo_pasaje} className="border border-gray-200 p-3 rounded-md bg-white shadow-sm hover:shadow transition-shadow duration-200">
                    <p className="font-medium text-gray-800">{tipoPasaje.nombre}</p>
                    <div className="flex items-center mt-1 text-green-600">
                      <FiDollarSign className="mr-1" />
                      <p className="text-sm">{tipoPasaje.costo.toFixed(2)}</p>
                    </div>
                    {tipoPasaje.edad && (
                      <p className="text-sm text-gray-600 mt-1">{tipoPasaje.edad}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="flex justify-end mt-6 space-x-3">
            <Button
              type="button"
              variant="secondary"
              onClick={handleCancel}
              className="flex items-center"
            >
              <FiX className="mr-2" /> Cancelar
            </Button>
            <Button
              type="submit"
              variant="success"
              disabled={loading || tiposTourFiltrados.length === 0}
              className="flex items-center"
            >
              <FiSave className="mr-2" />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default PaquetePasajesForm;