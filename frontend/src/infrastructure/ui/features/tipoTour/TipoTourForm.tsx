import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import { 
  crearTipoTour,
  actualizarTipoTour, 
  clearErrors,
  fetchTipoTourPorId
} from '../../../store/slices/tipoTourSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { RootState } from '../../../store';

// Función auxiliar para manejar valores nulos
const getNullString = (value: any): string => {
  if (typeof value === 'object' && value !== null && 'Valid' in value && 'String' in value) {
    return value.Valid ? value.String : '';
  }
  return value || '';
};

interface TipoTourFormProps {
  isEditing?: boolean;
}

const TipoTourForm: React.FC<TipoTourFormProps> = ({ isEditing = false }) => {
  const { id } = useParams();
  const dispatch = useDispatch<any>();
  const navigate = useNavigate();
  const { tipoTourActual, loading, error, success } = useSelector((state: RootState) => state.tipoTour);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { selectedSede } = useSelector((state: RootState) => state.auth);

  // Valores iniciales simplificados
  const [formData, setFormData] = useState({
    id_sede: selectedSede?.id_sede || 0,
    nombre: '',
    descripcion: '',
    duracion_minutos: 30,
    url_imagen: '',
    eliminado: false
  });

  // Cargar datos necesarios
  useEffect(() => {
    dispatch(fetchSedes());
    
    if (isEditing && id) {
      dispatch(fetchTipoTourPorId(parseInt(id)));
    }
  }, [dispatch, isEditing, id]);

  // Actualizar formulario cuando se carga el tipo de tour para edición
  useEffect(() => {
    if (isEditing && tipoTourActual) {
      setFormData({
        id_sede: tipoTourActual.id_sede || (selectedSede?.id_sede || 0),
        nombre: tipoTourActual.nombre || '',
        descripcion: getNullString(tipoTourActual.descripcion),
        duracion_minutos: tipoTourActual.duracion_minutos || 30,
        url_imagen: getNullString(tipoTourActual.url_imagen),
        eliminado: tipoTourActual.eliminado || false
      });
    }
  }, [isEditing, tipoTourActual, selectedSede]);

  // Manejar redirección después del éxito
  useEffect(() => {
    if (success) {
      navigate('/admin/tipos-tour');
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [success, dispatch, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'duracion_minutos') {
      setFormData({
        ...formData,
        [name]: parseInt(value) || 0
      });
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isEditing) {
      setFormData({
        ...formData,
        eliminado: e.target.checked
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Asegurarse de que siempre se use la sede seleccionada del usuario
    const dataToSubmit = {
      ...formData,
      id_sede: isEditing ? formData.id_sede : selectedSede?.id_sede || 0
    };
    
    if (!dataToSubmit.id_sede) {
      alert('No hay sede seleccionada. Por favor seleccione una sede en su perfil antes de continuar.');
      return;
    }
    
    if (isEditing && id) {
      dispatch(actualizarTipoTour({
        id: parseInt(id),
        tipoTour: dataToSubmit
      }));
    } else {
      dispatch(crearTipoTour(dataToSubmit));
    }
  };

  // Encontrar el nombre de la sede actual (solo para mostrar información)
  const getCurrentSedeName = () => {
    if (!Array.isArray(sedes) || sedes.length === 0) {
      return `Sede ${formData.id_sede}`;
    }
    
    const sede = sedes.find(s => s && s.id_sede === formData.id_sede);
    return sede?.nombre || `Sede ${formData.id_sede}`;
  };

  if (!selectedSede?.id_sede && !isEditing) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">No hay sede seleccionada</h2>
          <p className="mb-4">Debe seleccionar una sede antes de crear un tipo de tour.</p>
          <Button onClick={() => navigate('/admin')}>
            Volver al panel de administración
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Tipo de Tour' : 'Nuevo Tipo de Tour'}
      </h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-800">
        <p className="font-semibold">Sede actual:</p>
        <p>{getCurrentSedeName()}</p>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-1">Nombre <span className="text-red-500">*</span></label>
            <FormInput
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="Nombre del tipo de tour"
            />
          </div>
          
          <div>
            <label className="block mb-1">Duración (minutos) <span className="text-red-500">*</span></label>
            <FormInput
              type="number"
              name="duracion_minutos"
              value={formData.duracion_minutos.toString()}
              onChange={handleChange}
              required
              min={1}
              disabled={loading}
              placeholder="Duración en minutos"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows={4}
              placeholder="Descripción del tipo de tour"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block mb-1">URL de imagen</label>
            <FormInput
              type="text"
              name="url_imagen"
              value={formData.url_imagen}
              onChange={handleChange}
              disabled={loading}
              placeholder="URL de la imagen del tour"
            />
          </div>
          
          {isEditing && (
            <div>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="eliminado"
                  checked={formData.eliminado}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <span>Eliminado</span>
              </label>
            </div>
          )}
        </div>
        
        <div className="flex justify-end mt-6 gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/tipos-tour')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default TipoTourForm;