import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { createTipoTour, updateTipoTour, fetchTipoTourPorId, resetTipoTourSeleccionado } from '../../../store/slices/tipoTourSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { fetchIdiomas } from '../../../store/slices/idiomaSlice';
import Card from '../../components/Card';
import FormInput from '../../components/FormInput';
import Select from '../../components/Select';
import Button from '../../components/Button';

// Iconos SVG
const Icons = {
  Tour: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Clock: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Description: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
    </svg>
  ),
  Image: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
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
  ),
  Language: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  )
};

const TipoTourForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { tipoTourSeleccionado, loading, error } = useSelector((state: RootState) => state.tipoTour);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { idiomas } = useSelector((state: RootState) => state.idioma);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    nombre: '',
    id_sede: '',
    id_idioma: '1',  // Default value, typically 1 for Spanish
    descripcion: '',
    duracion_minutos: '',
    cantidad_pasajeros: '',
    url_imagen: '',
  });
  
  const [sedeDetails, setSedeDetails] = useState<{
    nombre: string;
    ubicacion?: string;
  } | null>(null);
  
  const [imagenPreview, setImagenPreview] = useState<string | null>(null);
  
  // Cargar datos relacionados
  useEffect(() => {
    dispatch(fetchSedes());
    dispatch(fetchIdiomas());
    
    if (id) {
      dispatch(fetchTipoTourPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(resetTipoTourSeleccionado());
    };
  }, [dispatch, id]);
  
  // Llenar formulario con datos del tipo de tour seleccionado o sede actual
  useEffect(() => {
    if (tipoTourSeleccionado && id) {
      setFormData({
        nombre: tipoTourSeleccionado.nombre || '',
        id_sede: tipoTourSeleccionado.id_sede.toString() || '',
        id_idioma: tipoTourSeleccionado.id_idioma?.toString() || '1',
        descripcion: tipoTourSeleccionado.descripcion || '',
        duracion_minutos: tipoTourSeleccionado.duracion_minutos.toString() || '',
        cantidad_pasajeros: tipoTourSeleccionado.cantidad_pasajeros.toString() || '',
        url_imagen: tipoTourSeleccionado.url_imagen || '',
      });
      
      if (tipoTourSeleccionado.url_imagen) {
        setImagenPreview(tipoTourSeleccionado.url_imagen);
      }
      
      // Buscar detalles de la sede para mostrar
      updateSedeDetails(tipoTourSeleccionado.id_sede.toString());
    } else if (selectedSede && !id) {
      // Si estamos creando un nuevo tipo de tour, usar la sede seleccionada
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede.toString(),
        id_idioma: '1'  // Default to idioma 1 (usually Spanish)
      }));
      
      // Mostrar detalles de la sede seleccionada
      updateSedeDetails(selectedSede.id_sede.toString());
    }
  }, [tipoTourSeleccionado, selectedSede, id, sedes]);
  
  // Función para actualizar detalles de la sede seleccionada
  const updateSedeDetails = (sedeId: string) => {
    if (!sedeId || !Array.isArray(sedes)) return;
    
    const sede = sedes.find(s => s && s.id_sede.toString() === sedeId);
    if (sede) {
      setSedeDetails({
        nombre: sede.nombre,
        
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
    
    // Si cambia la URL de la imagen, actualizar la vista previa
    if (name === 'url_imagen') {
      setImagenPreview(value || null);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar que campos requeridos estén completos
    if (!formData.nombre || !formData.id_sede || !formData.id_idioma || !formData.duracion_minutos || !formData.cantidad_pasajeros) {
      alert('Por favor complete todos los campos requeridos');
      return;
    }
    
    try {
      const tipoTourData = {
        nombre: formData.nombre,
        id_sede: parseInt(formData.id_sede),
        id_idioma: parseInt(formData.id_idioma),
        descripcion: formData.descripcion,
        duracion_minutos: parseInt(formData.duracion_minutos),
        cantidad_pasajeros: parseInt(formData.cantidad_pasajeros),
        url_imagen: formData.url_imagen,
      };
      
      if (id) {
        // Actualizar
        await dispatch(updateTipoTour({ id: parseInt(id), tipoTour: tipoTourData })).unwrap();
        alert('Tipo de tour actualizado con éxito');
      } else {
        // Crear
        await dispatch(createTipoTour(tipoTourData)).unwrap();
        alert('Tipo de tour creado con éxito');
      }
      
      navigate('/admin/tipos-tour');
    } catch (error) {
      console.error('Error:', error);
    }
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Icons.Tour />
          {id ? 'Editar Tipo de Tour' : 'Nuevo Tipo de Tour'}
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
                <Icons.Tour />
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
                <Icons.Language />
              </div>
              <Select
                label="Idioma"
                name="id_idioma"
                value={formData.id_idioma}
                onChange={handleChange}
                required
                className="pl-10"
              >
                <option value="">Seleccione un idioma</option>
                {Array.isArray(idiomas) && idiomas.map(idioma => (
                  idioma && idioma.id_idioma ? (
                    <option key={idioma.id_idioma} value={idioma.id_idioma.toString()}>
                      {idioma.nombre}
                    </option>
                  ) : null
                ))}
              </Select>
            </div>

            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Clock />
              </div>
              <FormInput
                label="Duración (minutos)"
                name="duracion_minutos"
                type="number"
                value={formData.duracion_minutos}
                onChange={handleChange}
                required
                min="1"
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Users />
              </div>
              <FormInput
                label="Capacidad (pasajeros)"
                name="cantidad_pasajeros"
                type="number"
                value={formData.cantidad_pasajeros}
                onChange={handleChange}
                required
                min="1"
                className="pl-10"
              />
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Image />
              </div>
              <FormInput
                label="URL de la imagen"
                name="url_imagen"
                value={formData.url_imagen}
                onChange={handleChange}
                className="pl-10"
              />
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
          
          {/* Vista previa de la imagen */}
          {imagenPreview && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vista previa
              </label>
              <div className="w-full h-48 border border-gray-300 rounded-lg overflow-hidden">
                <img 
                  src={imagenPreview} 
                  alt="Vista previa" 
                  className="w-full h-full object-cover"
                  onError={() => setImagenPreview(null)}
                />
              </div>
            </div>
          )}
          
          <div className="button-group mt-6 flex gap-3 justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/admin/tipos-tour')}
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

export default TipoTourForm;