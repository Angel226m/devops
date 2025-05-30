/*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { createEmbarcacion, updateEmbarcacion, fetchEmbarcacionPorId, resetEmbarcacionSeleccionada } from '../../../store/slices/embarcacionSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { EstadoEmbarcacion } from '../../../../domain/entities/Embarcacion';
import Card from '../../components/Card';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Button from '../../components/Button';

const EmbarcacionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { embarcacionSeleccionada, loading, error } = useSelector((state: RootState) => state.embarcacion);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    nombre: '',
    id_sede: '',
    capacidad: '',
    descripcion: '',
    estado: EstadoEmbarcacion.DISPONIBLE,
  });
  
  // Cargar datos relacionados
  useEffect(() => {
    dispatch(fetchSedes());
    
    if (id) {
      dispatch(fetchEmbarcacionPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(resetEmbarcacionSeleccionada());
    };
  }, [dispatch, id]);
  
  // Llenar formulario con datos de la embarcación seleccionada o sede actual
  useEffect(() => {
    if (embarcacionSeleccionada && id) {
      setFormData({
        nombre: embarcacionSeleccionada.nombre || '',
        id_sede: embarcacionSeleccionada.id_sede.toString() || '',
        capacidad: embarcacionSeleccionada.capacidad.toString() || '',
        descripcion: embarcacionSeleccionada.descripcion || '',
        estado: embarcacionSeleccionada.estado || EstadoEmbarcacion.DISPONIBLE,
      });
    } else if (selectedSede && !id) {
      // Si estamos creando una nueva embarcación, usar la sede seleccionada
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede.toString()
      }));
    }
  }, [embarcacionSeleccionada, selectedSede, id]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que campos requeridos estén completos
    if (!formData.nombre || !formData.id_sede || !formData.capacidad) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      const embarcacionData = {
        nombre: formData.nombre,
        id_sede: parseInt(formData.id_sede),
        capacidad: parseInt(formData.capacidad),
        descripcion: formData.descripcion,
        estado: formData.estado,
      };
      
      if (id) {
        // Actualizar
        await dispatch(updateEmbarcacion({ id: parseInt(id), embarcacion: embarcacionData })).unwrap();
        alert('Embarcación actualizada con éxito');
      } else {
        // Crear
        await dispatch(createEmbarcacion(embarcacionData as any)).unwrap();
        alert('Embarcación creada con éxito');
      }
      
      navigate('/admin/embarcaciones');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">
          {id ? 'Editar Embarcación' : 'Nueva Embarcación'}
        </h3>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <FormInput
            label="Nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            required
          />
          
          <Select
            label="Sede"
            name="id_sede"
            value={formData.id_sede}
            onChange={handleChange}
            required
            disabled={!!selectedSede} // Deshabilitar si ya hay una sede seleccionada
          >
            <option value="">Seleccione una sede</option>
            {sedes.map(sede => (
              <option key={sede.id_sede} value={sede.id_sede.toString()}>
                {sede.nombre}
              </option>
            ))}
          </Select>
          
          <FormInput
            label="Capacidad"
            name="capacidad"
            type="number"
            value={formData.capacidad}
            onChange={handleChange}
            required
            min="1"
          />
          
          <FormInput
            label="Descripción"
            name="descripcion"
            as="textarea"
            value={formData.descripcion}
            onChange={handleChange}
            rows={3}
          />
          
          <Select
            label="Estado"
            name="estado"
            value={formData.estado}
            onChange={handleChange}
            required
          >
            {Object.values(EstadoEmbarcacion).map(estado => (
              <option key={estado} value={estado}>
                {estado}
              </option>
            ))}
          </Select>
          
          <div className="button-group mt-6 flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/admin/embarcaciones')}
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

export default EmbarcacionForm;*/
 import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { createEmbarcacion, updateEmbarcacion, fetchEmbarcacionPorId, resetEmbarcacionSeleccionada } from '../../../store/slices/embarcacionSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { EstadoEmbarcacion } from '../../../../domain/entities/Embarcacion';
import Card from '../../components/Card';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Button from '../../components/Button';

// Iconos SVG mejorados
const Icons = {
  Ship: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  ),
  Description: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  Status: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Save: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  Cancel: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  Error: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  )
};

const EmbarcacionForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { embarcacionSeleccionada, loading, error } = useSelector((state: RootState) => state.embarcacion);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    nombre: '',
    id_sede: '',
    capacidad: '',
    descripcion: '',
    estado: EstadoEmbarcacion.DISPONIBLE,
  });
  
  const [sedeDetails, setSedeDetails] = useState<{
    nombre: string;
    ubicacion?: string;
  } | null>(null);
  
  // Cargar datos relacionados
  useEffect(() => {
    dispatch(fetchSedes());
    
    if (id) {
      dispatch(fetchEmbarcacionPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(resetEmbarcacionSeleccionada());
    };
  }, [dispatch, id]);
  
  // Llenar formulario con datos de la embarcación seleccionada o sede actual
  useEffect(() => {
    if (embarcacionSeleccionada && id) {
      setFormData({
        nombre: embarcacionSeleccionada.nombre || '',
        id_sede: embarcacionSeleccionada.id_sede.toString() || '',
        capacidad: embarcacionSeleccionada.capacidad.toString() || '',
        descripcion: embarcacionSeleccionada.descripcion || '',
        estado: embarcacionSeleccionada.estado || EstadoEmbarcacion.DISPONIBLE,
      });
      
      // Buscar detalles de la sede para mostrar
      updateSedeDetails(embarcacionSeleccionada.id_sede.toString());
    } else if (selectedSede && !id) {
      // Si estamos creando una nueva embarcación, usar la sede seleccionada
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede.toString()
      }));
      
      // Mostrar detalles de la sede seleccionada
      updateSedeDetails(selectedSede.id_sede.toString());
    }
  }, [embarcacionSeleccionada, selectedSede, id, sedes]);
  
  // Función para actualizar detalles de la sede seleccionada
  const updateSedeDetails = (sedeId: string) => {
    if (!sedeId || !Array.isArray(sedes)) return;
    
    const sede = sedes.find(s => s && s.id_sede.toString() === sedeId);
    if (sede) {
      setSedeDetails({
        nombre: sede.nombre
      });
    } else {
      setSedeDetails(null);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Si cambia la sede, actualizar los detalles de la sede
    if (name === 'id_sede') {
      updateSedeDetails(value);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que campos requeridos estén completos
    if (!formData.nombre || !formData.id_sede || !formData.capacidad) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      const embarcacionData = {
        nombre: formData.nombre,
        id_sede: parseInt(formData.id_sede),
        capacidad: parseInt(formData.capacidad),
        descripcion: formData.descripcion,
        estado: formData.estado,
      };
      
      if (id) {
        // Actualizar
        await dispatch(updateEmbarcacion({ id: parseInt(id), embarcacion: embarcacionData })).unwrap();
        alert('Embarcación actualizada con éxito');
      } else {
        // Crear
        await dispatch(createEmbarcacion(embarcacionData as any)).unwrap();
        alert('Embarcación creada con éxito');
      }
      
      navigate('/admin/embarcaciones');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  // Renderiza iconos junto a las etiquetas sin cambiar el tipo esperado
  const renderIconWithLabel = (icon: React.ReactNode, text: string) => (
    <div className="flex items-center gap-1">
      {icon}
      <span>{text}</span>
    </div>
  );
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Icons.Ship />
          {id ? 'Editar Embarcación' : 'Nueva Embarcación'}
        </h3>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 flex items-start gap-2">
            <Icons.Error />
            <div>{error}</div>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          {/* Información de la sede asociada */}
          {sedeDetails && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h4 className="text-blue-800 font-medium mb-2 flex items-center gap-2">
                <Icons.Building />
                Sede Asociada
              </h4>
              <div className="text-sm text-blue-700">
                <p><strong>Nombre:</strong> {sedeDetails.nombre}</p>
                {sedeDetails.ubicacion && (
                  <p><strong>Ubicación:</strong> {sedeDetails.ubicacion}</p>
                )}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Ship />
              </div>
              <FormInput
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Building />
              </div>
              <Select
                label="Sede"
                name="id_sede"
                value={formData.id_sede}
                onChange={handleChange}
                required
                disabled={!!selectedSede} // Deshabilitar si ya hay una sede seleccionada
                className="pl-10"
              >
                <option value="">Seleccione una sede</option>
                {Array.isArray(sedes) && sedes.map(sede => (
                  sede && sede.id_sede ? (
                    <option key={sede.id_sede} value={sede.id_sede.toString()}>
                      {sede.nombre}
                    </option>
                  ) : null
                ))}
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Users />
              </div>
              <FormInput
                label="Capacidad"
                name="capacidad"
                type="number"
                value={formData.capacidad}
                onChange={handleChange}
                required
                min="1"
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Status />
              </div>
              <Select
                label="Estado"
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                required
                className="pl-10"
              >
                {Object.values(EstadoEmbarcacion).map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </Select>
            </div>
          </div>
          
          <div className="mt-4 relative">
            <div className="absolute left-3 top-8 pointer-events-none z-10">
              <Icons.Description />
            </div>
            <FormInput
              label="Descripción"
              name="descripcion"
              as="textarea"
              value={formData.descripcion}
              onChange={handleChange}
              rows={3}
              className="pl-10"
            />
          </div>
          
          <div className="button-group mt-6 flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/admin/embarcaciones')}
              className="p-2 rounded-full"
              title="Cancelar"
            >
              <Icons.Cancel />
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="p-2 rounded-full"
              title={loading ? 'Guardando...' : (id ? 'Actualizar' : 'Crear')}
            >
              <Icons.Save />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default EmbarcacionForm;