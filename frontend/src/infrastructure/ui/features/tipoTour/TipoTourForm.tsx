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
import { 
  createGaleriaTour, 
  getGaleriaTourById, 
  listGaleriaTourByTipoTour,
  updateGaleriaTour,
  deleteGaleriaTour,
  clearError
} from '../../../store/slices/galeriaTourSlice';
import { RootState } from '../../../store';

// Definimos las interfaces aquí para evitar problemas de importación
interface GaleriaTour {
  id_galeria: number;
  id_tipo_tour: number;
  url_imagen: string;
  descripcion: string | null;
  orden: number;
  creado_en?: string;
  actualizado_en?: string;
}

interface GaleriaTourRequest {
  id_tipo_tour: number;
  url_imagen: string;
  descripcion: string;
  orden: number;
}

interface GaleriaTourUpdateRequest {
  url_imagen: string;
  descripcion: string;
  orden: number;
}

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
  const { tipoTourActual, loading: loadingTipoTour, error: errorTipoTour, success } = useSelector((state: RootState) => state.tipoTour);
  const { list: galeriasListFromStore, loading: loadingGaleria, error: errorGaleria } = useSelector((state: RootState) => state.galeriaTour);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { selectedSede } = useSelector((state: RootState) => state.auth);

  // Aseguramos que galeriasList siempre sea un array
  const galeriasList = galeriasListFromStore || [];

  // Estado para controlar si mostrar el gestor de galería
  const [showGalleryManager, setShowGalleryManager] = useState(false);
  // Estado para almacenar el ID del tipo de tour actual
  const [currentTourId, setCurrentTourId] = useState<number | null>(null);
  // Estado para controlar el formulario de galería
  const [showGaleriaForm, setShowGaleriaForm] = useState(false);
  const [selectedGaleriaId, setSelectedGaleriaId] = useState<number | null>(null);
  // Estado para el formulario de la galería
  const [galeriaFormData, setGaleriaFormData] = useState<GaleriaTourRequest>({
    id_tipo_tour: 0,
    url_imagen: '',
    descripcion: '',
    orden: 1
  });

  // Valores iniciales simplificados para el tipo de tour
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
      setCurrentTourId(parseInt(id));
      
      // Si estamos editando, cargamos la galería
      dispatch(listGaleriaTourByTipoTour(parseInt(id)));
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
    if (success && !isEditing) {
      // Si acabamos de crear un tipo de tour y fue exitoso
      if (tipoTourActual && tipoTourActual.id_tipo_tour) {
        setCurrentTourId(tipoTourActual.id_tipo_tour);
        setShowGalleryManager(true);
        // Cargar la lista de galería (que estará vacía para un tour nuevo)
        dispatch(listGaleriaTourByTipoTour(tipoTourActual.id_tipo_tour));
      } else {
        navigate('/admin/tipos-tour');
      }
    } else if (success && isEditing) {
      // Si solo estamos actualizando, no cambiamos la vista
      dispatch(clearErrors());
    }
    
    return () => {
      dispatch(clearErrors());
      dispatch(clearError());
    };
  }, [success, dispatch, navigate, isEditing, tipoTourActual]);

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

  // Funciones para gestionar la galería
  const handleAddImage = () => {
    if (!currentTourId) return;
    
    setGaleriaFormData({
      id_tipo_tour: currentTourId,
      url_imagen: '',
      descripcion: '',
      orden: galeriasList.length + 1
    });
    
    setSelectedGaleriaId(null);
    setShowGaleriaForm(true);
  };

  const handleEditImage = (id: number) => {
    dispatch(getGaleriaTourById(id))
      .unwrap()
      .then((galeria: GaleriaTour) => {
        setGaleriaFormData({
          id_tipo_tour: galeria.id_tipo_tour,
          url_imagen: galeria.url_imagen || '',
          descripcion: galeria.descripcion || '',
          orden: galeria.orden || 1
        });
        
        setSelectedGaleriaId(id);
        setShowGaleriaForm(true);
      })
      .catch((error: Error) => {
        console.error("Error al cargar la galería:", error);
      });
  };

  const handleDeleteImage = (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta imagen?')) {
      dispatch(deleteGaleriaTour(id))
        .unwrap()
        .then(() => {
          // Recargar la lista de imágenes
          if (currentTourId) {
            dispatch(listGaleriaTourByTipoTour(currentTourId));
          }
        })
        .catch((error: Error) => {
          console.error("Error al eliminar la imagen:", error);
        });
    }
  };

  const handleGaleriaFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === 'orden') {
      setGaleriaFormData({
        ...galeriaFormData,
        [name]: parseInt(value) || 1
      });
    } else {
      setGaleriaFormData({
        ...galeriaFormData,
        [name]: value
      });
    }
  };

  const handleGaleriaFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedGaleriaId) {
      // Actualizar imagen existente
      const updateData: GaleriaTourUpdateRequest = {
        url_imagen: galeriaFormData.url_imagen,
        descripcion: galeriaFormData.descripcion,
        orden: galeriaFormData.orden
      };
      
      dispatch(updateGaleriaTour({
        id: selectedGaleriaId,
        galeria: updateData
      }))
        .unwrap()
        .then(() => {
          setShowGaleriaForm(false);
          // Recargar la lista de imágenes
          if (currentTourId) {
            dispatch(listGaleriaTourByTipoTour(currentTourId));
          }
        })
        .catch((error: Error) => {
          console.error("Error al actualizar la imagen:", error);
        });
    } else {
      // Crear nueva imagen
      dispatch(createGaleriaTour(galeriaFormData))
        .unwrap()
        .then(() => {
          setShowGaleriaForm(false);
          // Recargar la lista de imágenes
          if (currentTourId) {
            dispatch(listGaleriaTourByTipoTour(currentTourId));
          }
        })
        .catch((error: Error) => {
          console.error("Error al crear la imagen:", error);
        });
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

  // Función para finalizar y volver a la lista
  const handleFinish = () => {
    navigate('/admin/tipos-tour');
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

  // Renderizar formulario de galería
  if (showGaleriaForm) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h3 className="text-lg font-semibold mb-4">
          {selectedGaleriaId ? 'Editar imagen' : 'Agregar nueva imagen'}
        </h3>
        
        {errorGaleria && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {errorGaleria}
          </div>
        )}
        
        <form onSubmit={handleGaleriaFormSubmit}>
          <div className="mb-4">
            <label className="block mb-1 font-medium">URL de imagen <span className="text-red-500">*</span></label>
            <FormInput
              type="text"
              name="url_imagen"
              value={galeriaFormData.url_imagen}
              onChange={handleGaleriaFormChange}
              required
              disabled={loadingGaleria}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Descripción</label>
            <textarea
              name="descripcion"
              value={galeriaFormData.descripcion}
              onChange={handleGaleriaFormChange}
              disabled={loadingGaleria}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              rows={3}
              placeholder="Descripción opcional de la imagen"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 font-medium">Orden <span className="text-red-500">*</span></label>
            <FormInput
              type="number"
              name="orden"
              value={galeriaFormData.orden.toString()}
              onChange={handleGaleriaFormChange}
              required
              min={1}
              disabled={loadingGaleria}
              placeholder="Posición en la galería"
            />
          </div>
          
          {galeriaFormData.url_imagen && (
            <div className="mb-4">
              <label className="block mb-1 font-medium">Vista previa</label>
              <div className="w-full h-48 border border-gray-300 rounded overflow-hidden">
                <img 
                  src={galeriaFormData.url_imagen} 
                  alt="Vista previa" 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=URL+Inválida';
                  }}
                />
              </div>
            </div>
          )}
          
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowGaleriaForm(false)}
              disabled={loadingGaleria}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loadingGaleria}
            >
              {selectedGaleriaId ? 'Actualizar' : 'Guardar'}
            </Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold mb-4">
        {isEditing ? 'Editar Tipo de Tour' : 'Nuevo Tipo de Tour'}
      </h2>
      
      {errorTipoTour && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {errorTipoTour}
        </div>
      )}
      
      <div className="mb-4 bg-blue-50 p-3 rounded-lg border border-blue-200 text-blue-800">
        <p className="font-semibold">Sede actual:</p>
        <p>{getCurrentSedeName()}</p>
      </div>
      
      {!showGalleryManager ? (
        // Formulario principal del tipo de tour
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
                disabled={loadingTipoTour}
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
                disabled={loadingTipoTour}
                placeholder="Duración en minutos"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block mb-1">Descripción</label>
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                disabled={loadingTipoTour}
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
                disabled={loadingTipoTour}
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
              disabled={loadingTipoTour}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loadingTipoTour}
            >
              {isEditing ? 'Actualizar' : 'Guardar'}
            </Button>
            
            {isEditing && (
              <Button
                type="button"
                onClick={() => setShowGalleryManager(true)}
              >
                Gestionar Galería
              </Button>
            )}
          </div>
        </form>
      ) : (
        // Sección de gestión de galería
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Galería de imágenes</h3>
            <div className="flex gap-2">
              {isEditing && (
                <Button
                  variant="secondary"
                  onClick={() => setShowGalleryManager(false)}
                >
                  Volver al formulario
                </Button>
              )}
              <Button onClick={handleFinish}>
                Finalizar
              </Button>
            </div>
          </div>
          
          {errorGaleria && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {errorGaleria}
            </div>
          )}
          
          <div className="mb-4">
            <Button onClick={handleAddImage}>
              Agregar imagen
            </Button>
          </div>
          
          {loadingGaleria ? (
            <div className="text-center py-8">
              <p>Cargando imágenes...</p>
            </div>
          ) : galeriasList.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-500">No hay imágenes en la galería</p>
              <p className="text-sm text-gray-400 mt-2">Haga clic en "Agregar imagen" para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galeriasList.map((imagen) => (
                <div key={imagen.id_galeria} className="border rounded-lg overflow-hidden shadow-sm">
                  <div className="h-48 bg-gray-100">
                    <img 
                      src={imagen.url_imagen} 
                      alt={imagen.descripcion || `Imagen ${imagen.orden}`}
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=URL+Inválida';
                      }}
                    />
                  </div>
                  
                  <div className="p-3">
                    <p className="text-sm truncate mb-1">
                      {imagen.descripcion || `Imagen ${imagen.orden}`}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      Orden: {imagen.orden}
                    </p>
                    
                    <div className="flex justify-between">
                      <button 
                        className="text-blue-600 text-sm" 
                        onClick={() => handleEditImage(imagen.id_galeria)}
                      >
                        Editar
                      </button>
                      <button 
                        className="text-red-600 text-sm" 
                        onClick={() => handleDeleteImage(imagen.id_galeria)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TipoTourForm;

/*import React, { useState, useEffect } from 'react';
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

export default TipoTourForm;*/