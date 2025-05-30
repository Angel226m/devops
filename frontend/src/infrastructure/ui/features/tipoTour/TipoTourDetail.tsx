import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchTipoTourPorId, deleteTipoTour } from '../../../store/slices/tipoTourSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { fetchIdiomas } from '../../../store/slices/idiomaSlice';
import Card from '../../components/Card';
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
  Edit: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Back: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
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
  Language: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
    </svg>
  )
};

const TipoTourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { tipoTourSeleccionado, loading, error } = useSelector((state: RootState) => state.tipoTour);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { idiomas } = useSelector((state: RootState) => state.idioma);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchTipoTourPorId(parseInt(id)))
        .unwrap()
        .then(data => {
          console.log("Datos del tipo de tour cargados:", data);
        })
        .catch(error => {
          console.error("Error al cargar el tipo de tour:", error);
        });
      dispatch(fetchSedes());
      dispatch(fetchIdiomas());
    }
  }, [dispatch, id]);
  
  const handleEdit = () => {
    navigate(`/admin/tipos-tour/editar/${id}`);
  };
  
  const handleDelete = async () => {
    if (window.confirm('¿Está seguro de que desea eliminar este tipo de tour?')) {
      try {
        await dispatch(deleteTipoTour(parseInt(id!))).unwrap();
        alert('Tipo de tour eliminado con éxito');
        navigate('/admin/tipos-tour');
      } catch (error) {
        console.error('Error al eliminar:', error);
        alert('Error al eliminar el tipo de tour. Por favor intente nuevamente.');
      }
    }
  };
  
  const handleBack = () => {
    navigate('/admin/tipos-tour');
  };
  
  // Obtener nombre de sede
  const getNombreSede = (idSede: number): string => {
    try {
      if (!Array.isArray(sedes) || sedes.length === 0) {
        return `Sede ${idSede}`;
      }
      
      const sede = sedes.find(s => s && s.id_sede === idSede);
      return sede?.nombre || `Sede ${idSede}`;
      
    } catch (error) {
      console.error('Error en getNombreSede:', error);
      return `Sede ${idSede}`;
    }
  };
  
  // Obtener nombre de idioma
  const getNombreIdioma = (idIdioma: number): string => {
    try {
      if (!Array.isArray(idiomas) || idiomas.length === 0) {
        return `Idioma ${idIdioma}`;
      }
      
      const idioma = idiomas.find(i => i && i.id_idioma === idIdioma);
      return idioma?.nombre || `Idioma ${idIdioma}`;
      
    } catch (error) {
      console.error('Error en getNombreIdioma:', error);
      return `Idioma ${idIdioma}`;
    }
  };
  
  // Formatear duración en minutos a horas y minutos
  const formatDuracion = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${min > 0 ? `${min}m` : ''}`;
    }
    return `${min}m`;
  };
  
  if (loading) {
    return (
      <Card className="max-w-3xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Cargando...</h3>
        </div>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="max-w-3xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Error</h3>
        </div>
        <div className="px-6 py-4">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
            {error}
          </div>
          <div className="mt-4">
            <Button 
              onClick={handleBack}
              className="p-2 rounded-full"
              title="Volver"
            >
              <Icons.Back />
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  if (!tipoTourSeleccionado) {
    return (
      <Card className="max-w-3xl mx-auto">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900">Tipo de Tour no encontrado</h3>
        </div>
        <div className="px-6 py-4">
          <p className="text-gray-500 mb-4">
            El tipo de tour que está buscando no existe o ha sido eliminado.
          </p>
          <Button 
            onClick={handleBack}
            className="p-2 rounded-full"
            title="Volver"
          >
            <Icons.Back />
          </Button>
        </div>
      </Card>
    );
  }
  
  // Asegurarse de que las propiedades existan antes de renderizar
  const tourData = {
    nombre: tipoTourSeleccionado.nombre || '',
    id_sede: tipoTourSeleccionado.id_sede || 0,
    id_idioma: tipoTourSeleccionado.id_idioma || 0,
    descripcion: tipoTourSeleccionado.descripcion || '',
    duracion_minutos: tipoTourSeleccionado.duracion_minutos || 0,
    cantidad_pasajeros: tipoTourSeleccionado.cantidad_pasajeros || 0,
    url_imagen: tipoTourSeleccionado.url_imagen || ''
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Icons.Tour />
          Detalle de Tipo de Tour
        </h3>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:items-start gap-6">
          {/* Imagen del tour si existe */}
          {tourData.url_imagen && (
            <div className="w-full md:w-1/3">
              <div className="rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src={tourData.url_imagen} 
                  alt={tourData.nombre} 
                  className="w-full h-auto object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Sin+Imagen';
                  }}
                />
              </div>
            </div>
          )}
          
          {/* Información del tour */}
          <div className={`w-full ${tourData.url_imagen ? 'md:w-2/3' : ''}`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {tourData.nombre}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Icons.Building />
                <div>
                  <span className="font-medium block">Sede</span>
                  <span>{getNombreSede(tourData.id_sede)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Icons.Language />
                <div>
                  <span className="font-medium block">Idioma</span>
                  <span>{getNombreIdioma(tourData.id_idioma)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Icons.Clock />
                <div>
                  <span className="font-medium block">Duración</span>
                  <span>{formatDuracion(tourData.duracion_minutos)}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Icons.Users />
                <div>
                  <span className="font-medium block">Capacidad</span>
                  <span>{tourData.cantidad_pasajeros} pasajeros</span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-gray-700">
                <Icons.Image />
                <div>
                  <span className="font-medium block">Imagen</span>
                  <span>{tourData.url_imagen ? 'Disponible' : 'No disponible'}</span>
                </div>
              </div>
            </div>
            
            {tourData.descripcion && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2 flex items-center gap-2">
                  <Icons.Description />
                  Descripción
                </h3>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-gray-700 whitespace-pre-line">
                    {tourData.descripcion}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-3 mt-6">
              <Button 
                onClick={handleBack}
                variant="secondary"
                className="p-2 rounded-full"
                title="Volver"
              >
                <Icons.Back />
              </Button>
              
              <Button 
                onClick={handleEdit}
                variant="primary"
                className="p-2 rounded-full"
                title="Editar"
              >
                <Icons.Edit />
              </Button>
              
              <Button 
                onClick={handleDelete}
                variant="danger"
                className="p-2 rounded-full"
                title="Eliminar"
              >
                <Icons.Trash />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TipoTourDetail;