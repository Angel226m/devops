import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { createSede, updateSede, fetchSedePorId, resetSedeSeleccionada } from '../../../store/slices/sedeSlice';
import Card from '../../components/Card';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';

const SedeForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { sedeSeleccionada, loading, error } = useSelector((state: RootState) => state.sede);
  
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    correo: '',
    ciudad: '',
    provincia: '',
    pais: '',
  });
  
  // Cargar datos si estamos en modo edición
  useEffect(() => {
    if (id) {
      dispatch(fetchSedePorId(parseInt(id)));
    }
    
    return () => {
      dispatch(resetSedeSeleccionada());
    };
  }, [dispatch, id]);
  
  // Llenar formulario con datos de la sede seleccionada
  useEffect(() => {
    if (sedeSeleccionada && id) {
      setFormData({
        nombre: sedeSeleccionada.nombre || '',
        direccion: sedeSeleccionada.direccion || '',
        telefono: sedeSeleccionada.telefono || '',
        correo: sedeSeleccionada.correo || '',
        ciudad: sedeSeleccionada.ciudad || '',
        provincia: sedeSeleccionada.provincia || '',
        pais: sedeSeleccionada.pais || '',
      });
    }
  }, [sedeSeleccionada, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que campos requeridos estén completos
    if (!formData.nombre || !formData.direccion || !formData.ciudad || !formData.pais) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      if (id) {
        // Actualizar
        await dispatch(updateSede({ id: parseInt(id), sede: formData })).unwrap();
        alert('Sede actualizada con éxito');
      } else {
        // Crear
        await dispatch(createSede(formData as any)).unwrap();
        alert('Sede creada con éxito');
      }
      navigate('/admin/sedes');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">
          {id ? 'Editar Sede' : 'Nueva Sede'}
        </h3>
      </div>
      
      <div className="px-6 py-4">
        {error && <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Dirección"
            name="direccion"
            value={formData.direccion}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Teléfono"
            name="telefono"
            value={formData.telefono}
            onChange={handleChange}
          />
          
          <FormInput
            label="Correo"
            name="correo"
            type="email"
            value={formData.correo}
            onChange={handleChange}
          />
          
          <FormInput
            label="Ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleChange}
            required
          />
          
          <FormInput
            label="Provincia"
            name="provincia"
            value={formData.provincia}
            onChange={handleChange}
          />
          
          <FormInput
            label="País"
            name="pais"
            value={formData.pais}
            onChange={handleChange}
            required
          />
          
          <div className="button-group mt-6 flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/admin/sedes')}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
            >
              {loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear')}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default SedeForm;