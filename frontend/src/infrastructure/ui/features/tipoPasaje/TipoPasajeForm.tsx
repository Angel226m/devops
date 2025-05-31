import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useNavigate, useParams } from 'react-router-dom';
import {
  fetchTipoPasajeById,
  createTipoPasaje,
  updateTipoPasaje,
  clearTipoPasajeActual,
  clearError,
} from '../../../store/slices/tipoPasajeSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { NuevoTipoPasajeRequest, ActualizarTipoPasajeRequest } from '../../../../domain/entities/TipoPasaje';
import { FiSave, FiX, FiAlertTriangle } from 'react-icons/fi';

interface TipoPasajeFormProps {
  isEditing?: boolean;
}

const TipoPasajeForm: React.FC<TipoPasajeFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { tipoPasajeActual, loading, error } = useSelector((state: RootState) => state.tipoPasaje);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formState, setFormState] = useState<NuevoTipoPasajeRequest>({
    id_sede: selectedSede?.id_sede || 0,
    id_tipo_tour: 0,
    nombre: '',
    costo: 0,
    edad: '',
  });
  
  const [formErrors, setFormErrors] = useState<{
    id_sede?: string;
    id_tipo_tour?: string;
    nombre?: string;
    costo?: string;
    edad?: string;
  }>({});

  useEffect(() => {
    dispatch(clearError());
    dispatch(fetchSedes());
    dispatch(fetchTiposTour());

    if (isEditing && id) {
      dispatch(fetchTipoPasajeById(parseInt(id)));
    }

    return () => {
      dispatch(clearTipoPasajeActual());
    };
  }, [dispatch, id, isEditing]);

  useEffect(() => {
    if (isEditing && tipoPasajeActual) {
      setFormState({
        id_sede: tipoPasajeActual.id_sede,
        id_tipo_tour: tipoPasajeActual.id_tipo_tour,
        nombre: tipoPasajeActual.nombre,
        costo: tipoPasajeActual.costo,
        edad: tipoPasajeActual.edad || '',
      });
    }
  }, [tipoPasajeActual, isEditing]);

  const validateForm = (): boolean => {
    const errors: {
      id_sede?: string;
      id_tipo_tour?: string;
      nombre?: string;
      costo?: string;
      edad?: string;
    } = {};
    
    if (!formState.id_sede) {
      errors.id_sede = 'Debe seleccionar una sede';
    }
    
    if (!formState.id_tipo_tour) {
      errors.id_tipo_tour = 'Debe seleccionar un tipo de tour';
    }
    
    if (!formState.nombre.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
    
    if (formState.costo <= 0) {
      errors.costo = 'El costo debe ser mayor a 0';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    let updatedValue: string | number = value;
    
    if (name === 'costo') {
      updatedValue = parseFloat(value) || 0;
    } else if (name === 'id_sede' || name === 'id_tipo_tour') {
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
      if (isEditing && id) {
        const updateData: ActualizarTipoPasajeRequest = {
          id_tipo_tour: formState.id_tipo_tour,
          nombre: formState.nombre,
          costo: formState.costo,
          edad: formState.edad,
        };
        
        await dispatch(
          updateTipoPasaje({
            id: parseInt(id),
            tipoPasaje: updateData,
          })
        );
        navigate('/admin/tipos-pasaje');
      } else {
        await dispatch(createTipoPasaje(formState));
        navigate('/admin/tipos-pasaje');
      }
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/tipos-pasaje');
  };

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {isEditing ? 'Editar Tipo de Pasaje' : 'Crear Nuevo Tipo de Pasaje'}
        </h1>
        <p className="text-gray-600">
          {isEditing 
            ? 'Modifique los datos del tipo de pasaje seleccionado' 
            : 'Complete el formulario para crear un nuevo tipo de pasaje'}
        </p>
      </div>
      
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          <div className="flex items-center">
            <FiAlertTriangle className="h-5 w-5 mr-2" />
            <p>{error}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {!isEditing && (
              <div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sede
                  </label>
                  <select
                    name="id_sede"
                    value={formState.id_sede}
                    onChange={handleChange}
                    disabled={!!selectedSede}
                    className={`block w-full px-3 py-2 border ${formErrors.id_sede ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                  >
                    <option value="">Seleccione una sede</option>
                    {sedes.map((sede) => (
                      <option key={sede.id_sede} value={sede.id_sede}>
                        {sede.nombre}
                      </option>
                    ))}
                  </select>
                  {formErrors.id_sede && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.id_sede}</p>
                  )}
                  {selectedSede && (
                    <p className="text-sm text-gray-500 mt-1">
                      Usando la sede seleccionada: {selectedSede.nombre}
                    </p>
                  )}
                </div>
              </div>
            )}
            
            <div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Tour
                </label>
                <select
                  name="id_tipo_tour"
                  value={formState.id_tipo_tour}
                  onChange={handleChange}
                  className={`block w-full px-3 py-2 border ${formErrors.id_tipo_tour ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                >
                  <option value="">Seleccione un tipo de tour</option>
                  {tiposTour.map((tipoTour) => (
                    <option key={tipoTour.id_tipo_tour} value={tipoTour.id_tipo_tour}>
                      {tipoTour.nombre}
                    </option>
                  ))}
                </select>
                {formErrors.id_tipo_tour && (
                  <p className="mt-1 text-sm text-red-500">{formErrors.id_tipo_tour}</p>
                )}
              </div>
            </div>
            
            <div>
              <FormInput
                label="Nombre"
                name="nombre"
                type="text"
                value={formState.nombre}
                onChange={handleChange}
                error={formErrors.nombre}
                required
                placeholder="Ej: Adulto, Niño, Tercera Edad"
              />
            </div>
            
            <div>
              <FormInput
                label="Costo"
                name="costo"
                type="number"
                step="0.01"
                min="0"
                value={formState.costo.toString()}
                onChange={handleChange}
                error={formErrors.costo}
                required
                placeholder="Ej: 25.50"
              />
            </div>
            
            <div>
              <FormInput
                label="Edad"
                name="edad"
                type="text"
                value={formState.edad}
                onChange={handleChange}
                error={formErrors.edad}
                placeholder="Ej: 18-65 años, Menores de 12 años"
              />
            </div>
          </div>
          
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
              variant="primary"
              disabled={loading}
              className="flex items-center"
            >
              <FiSave className="mr-2" />
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TipoPasajeForm;