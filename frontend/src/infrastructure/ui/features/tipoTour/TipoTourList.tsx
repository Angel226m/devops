import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchTiposTour, eliminarTipoTour, fetchTiposTourPorSede } from '../../../store/slices/tipoTourSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';

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
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
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
  Plus: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
  ),
  Image: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
};

const TipoTourList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { tiposTour, loading, error } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  const { sedes } = useSelector((state: RootState) => state.sede);
  
  const [filtroSede, setFiltroSede] = useState<string>('');
  
  // Cargar datos necesarios
  useEffect(() => {
    dispatch(fetchSedes());
    
    if (selectedSede?.id_sede) {
      // Intentar cargar por sede, pero manejar posibles errores
      dispatch(fetchTiposTourPorSede(selectedSede.id_sede))
        .unwrap()
        .catch(error => {
          console.warn("Error al cargar tipos de tour por sede, intentando cargar todos:", error);
          // Si falla la carga por sede, intentar cargar todos
          dispatch(fetchTiposTour());
        });
    } else {
      dispatch(fetchTiposTour());
    }
  }, [dispatch, selectedSede]);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/tipos-tour/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/tipos-tour/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este tipo de tour?')) {
      try {
        await dispatch(eliminarTipoTour(id)).unwrap();
        alert('Tipo de tour eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/tipos-tour/nuevo');
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const sedeId = e.target.value;
    setFiltroSede(sedeId);
    
    if (sedeId) {
      // Intentar cargar por sede, pero manejar posibles errores
      dispatch(fetchTiposTourPorSede(parseInt(sedeId)))
        .unwrap()
        .catch(error => {
          console.warn("Error al filtrar por sede, mostrando todos:", error);
          dispatch(fetchTiposTour());
        });
    } else {
      dispatch(fetchTiposTour());
    }
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
  
  // Formatear duración en minutos a horas y minutos
  const formatDuracion = (minutos: number): string => {
    const horas = Math.floor(minutos / 60);
    const min = minutos % 60;
    
    if (horas > 0) {
      return `${horas}h ${min > 0 ? `${min}m` : ''}`;
    }
    return `${min}m`;
  };
  
  // Columnas para la tabla
  const columns = [
    { 
      header: "ID",
      accessor: 'id_tipo_tour' 
    },
    { 
      header: "Nombre",
      accessor: 'nombre' 
    },
    { 
      header: "Sede",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Icons.Building />
          {getNombreSede(row.id_sede)}
        </div>
      )
    },
    { 
      header: "Duración",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Icons.Clock />
          {formatDuracion(row.duracion_minutos)}
        </div>
      )
    },
    { 
      header: "Imagen",
      accessor: (row: any) => (
        row.url_imagen ? (
          <div className="w-12 h-12 overflow-hidden rounded">
            <img 
              src={row.url_imagen} 
              alt={row.nombre} 
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="flex items-center gap-1 text-gray-400">
            <Icons.Image />
            <span>Sin imagen</span>
          </div>
        )
      )
    },
    { 
      header: "Acciones",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_tipo_tour)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <Icons.Eye />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_tipo_tour)}
            className="p-2 rounded-full"
            title="Editar tipo de tour"
          >
            <Icons.Edit />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_tipo_tour)}
            className="p-2 rounded-full"
            title="Eliminar tipo de tour"
          >
            <Icons.Trash />
          </Button>
        </div>
      )
    },
  ];

  // Renderizar contenido cuando no hay datos
  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4 text-gray-300">
          <Icons.Tour />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay tipos de tour disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroSede 
            ? `No se encontraron tipos de tour para la sede seleccionada`
            : "Comienza agregando tu primer tipo de tour"
          }
        </p>
        {!filtroSede && (
          <Button 
            onClick={handleCreate}
            className="p-2 rounded-full mx-auto"
            title="Nuevo Tipo de Tour"
          >
            <Icons.Plus />
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Icons.Tour />
          Gestión de Tipos de Tour
        </h3>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Filter />
              </div>
              <Select
                label="Filtrar por Sede"
                name="filtroSede"
                value={filtroSede}
                onChange={handleFilterChange}
                className="pl-10"
              >
                <option value="">Todas las sedes</option>
                {Array.isArray(sedes) && sedes.map(sede => (
                  sede && sede.id_sede ? (
                    <option key={sede.id_sede} value={sede.id_sede.toString()}>
                      {sede.nombre}
                    </option>
                  ) : null
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-end">
              <Button 
                onClick={handleCreate}
                className="p-3 rounded-full"
                title="Crear nuevo tipo de tour"
              >
                <Icons.Plus />
              </Button>
            </div>
          </div>
        </div>
        
        {tiposTour.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={tiposTour}
            loading={loading}
            emptyMessage="No hay tipos de tour que mostrar" 
          />
        )}
      </div>
    </Card>
  );
};

export default TipoTourList;