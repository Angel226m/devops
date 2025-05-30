/*import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchEmbarcaciones, deleteEmbarcacion, fetchEmbarcacionesPorSede } from '../../../store/slices/embarcacionSlice';
import { fetchSedes, ensureSedesArray } from '../../../store/slices/sedeSlice';
import { EstadoEmbarcacion } from '../../../../domain/entities/Embarcacion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';

// 🎨 Iconos en formato SVG
const Icons = {
  Ship: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
    </svg>
  ),
  Available: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Busy: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  Maintenance: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  OutOfService: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 008.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
    </svg>
  ),
  Eye: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ),
  Edit: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
    </svg>
  ),
  Trash: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
    </svg>
  ),
  Plus: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
    </svg>
  ),
  Filter: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
    </svg>
  ),
  Building: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Users: () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )
};

const EmbarcacionList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { embarcaciones, loading, error } = useSelector((state: RootState) => state.embarcacion);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  const { sedes } = useSelector((state: RootState) => state.sede);
  
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  
  // 🔧 Cargar datos necesarios
  useEffect(() => {
    // Asegurar que sedes sea un array antes de cargar datos
    dispatch(ensureSedesArray());
    dispatch(fetchSedes());
    
    if (selectedSede?.id_sede) {
      dispatch(fetchEmbarcacionesPorSede(selectedSede.id_sede));
    } else {
      dispatch(fetchEmbarcaciones());
    }
  }, [dispatch, selectedSede]);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/embarcaciones/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/embarcaciones/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta embarcación?')) {
      try {
        await dispatch(deleteEmbarcacion(id)).unwrap();
        alert('Embarcación eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/embarcaciones/nueva');
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(e.target.value);
  };
  
  // Filtrar embarcaciones según el estado seleccionado
  const embarcacionesFiltradas = filtroEstado
    ? embarcaciones.filter(e => e.estado === filtroEstado)
    : embarcaciones;
  
  // 🛡️ Obtener nombre de sede - CON VALIDACIÓN MEJORADA
  const getNombreSede = (idSede: number): string => {
    try {
      // ✅ Validación simple y efectiva
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
  
  // 🎨 Mapear estado a etiqueta visual con iconos
  const renderEstado = (estado: EstadoEmbarcacion) => {
    const config = {
      [EstadoEmbarcacion.DISPONIBLE]: {
        icon: <Icons.Available />,
        className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1",
        label: "Disponible"
      },
      [EstadoEmbarcacion.OCUPADA]: {
        icon: <Icons.Busy />,
        className: "px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1",
        label: "Ocupada"
      },
      [EstadoEmbarcacion.MANTENIMIENTO]: {
        icon: <Icons.Maintenance />,
        className: "px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center gap-1",
        label: "Mantenimiento"
      },
      [EstadoEmbarcacion.FUERA_DE_SERVICIO]: {
        icon: <Icons.OutOfService />,
        className: "px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1",
        label: "Fuera de servicio"
      }
    };
    
    const estadoConfig = config[estado];
    
    if (!estadoConfig) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{estado}</span>;
    }
    
    return (
      <span className={estadoConfig.className}>
        {estadoConfig.icon}
        {estadoConfig.label}
      </span>
    );
  };
  
  // 📊 Columnas para la tabla
  const columns = [
    { 
      header: "🚢 ID",
      accessor: 'id_embarcacion' 
    },
    { 
      header: "🚢 Nombre",
      accessor: 'nombre' 
    },
    { 
      header: "🏢 Sede",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Icons.Building />
          {getNombreSede(row.id_sede)}
        </div>
      )
    },
    { 
      header: "👥 Capacidad",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Icons.Users />
          {row.capacidad} pasajeros
        </div>
      )
    },
    { 
      header: "📊 Estado",
      accessor: (row: any) => renderEstado(row.estado) 
    },
    { 
      header: "⚙️ Acciones",
      accessor: (row: any) => (
        <div className="flex gap-1">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_embarcacion)}
            className="flex items-center gap-1"
            title="Ver detalles"
          >
            <Icons.Eye />
            Ver
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_embarcacion)}
            className="flex items-center gap-1"
            title="Editar embarcación"
          >
            <Icons.Edit />
            Editar
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_embarcacion)}
            className="flex items-center gap-1"
            title="Eliminar embarcación"
          >
            <Icons.Trash />
            Eliminar
          </Button>
        </div>
      )
    },
  ];

  // 🔧 Renderizar contenido cuando no hay datos
  const renderEmptyState = () => {
    if (loading) return null; // No mostrar mensaje vacío mientras carga

    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4 text-gray-300">
          <Icons.Ship />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay embarcaciones disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroEstado 
            ? `No se encontraron embarcaciones con estado "${filtroEstado}"`
            : "Comienza agregando tu primera embarcación"
          }
        </p>
        {!filtroEstado && (
          <Button 
            onClick={handleCreate}
            className="flex items-center gap-2 mx-auto"
          >
            <Icons.Plus />
            Nueva Embarcación
          </Button>
        )}
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Icons.Ship />
          Gestión de Embarcaciones
        </h3>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 flex items-start gap-2">
            <Icons.OutOfService />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Filter />
              </div>
              <Select
                label="🔍 Filtrar por Estado"
                name="filtroEstado"
                value={filtroEstado}
                onChange={handleFilterChange}
                className="pl-10"
              >
                <option value="">Todos los estados</option>
                {Object.values(EstadoEmbarcacion).map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-end">
              <Button 
                onClick={handleCreate}
                className="flex items-center gap-2"
                title="Crear nueva embarcación"
              >
                <Icons.Plus />
                Nueva Embarcación
              </Button>
            </div>
          </div>
        </div>
        
        {/* 🐛 Panel de debug mejorado - solo en desarrollo *//*}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1">
              🔍 Debug Info
            </h4>
            <div className="grid grid-cols-2 gap-2 text-blue-700">
              <div>
                <strong>Sedes tipo:</strong> {typeof sedes}
              </div>
              <div>
                <strong>Es array:</strong> {Array.isArray(sedes) ? '✅' : '❌'}
              </div>
              <div>
                <strong>Sedes count:</strong> {Array.isArray(sedes) ? sedes.length : 'N/A'}
              </div>
              <div>
                <strong>Embarcaciones:</strong> {embarcaciones.length}
              </div>
              <div>
                <strong>Loading:</strong> {loading ? '⏳' : '✅'}
              </div>
              <div>
                <strong>Selected Sede:</strong> {selectedSede?.nombre || 'Ninguna'}
              </div>
            </div>
          </div>
        )}
        
        {/* ✅ Manejo condicional de la tabla vs estado vacío *//*}
        {embarcacionesFiltradas.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={embarcacionesFiltradas}
            loading={loading}
            emptyMessage="🚢 No hay embarcaciones que mostrar" // ✅ Ahora es un string
          />
        )}
      </div>
    </Card>
  );
};

export default EmbarcacionList;*/


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchEmbarcaciones, deleteEmbarcacion, fetchEmbarcacionesPorSede } from '../../../store/slices/embarcacionSlice';
import { fetchSedes, ensureSedesArray } from '../../../store/slices/sedeSlice';
import { EstadoEmbarcacion } from '../../../../domain/entities/Embarcacion';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';

// 🎨 Iconos en formato SVG
const Icons = {
  Ship: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
    </svg>
  ),
  Available: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
    </svg>
  ),
  Busy: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
    </svg>
  ),
  Maintenance: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
    </svg>
  ),
  OutOfService: () => (
    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 008.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
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
  Building: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  Users: () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
    </svg>
  )
};

const EmbarcacionList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { embarcaciones, loading, error } = useSelector((state: RootState) => state.embarcacion);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  const { sedes } = useSelector((state: RootState) => state.sede);
  
  const [filtroEstado, setFiltroEstado] = useState<string>('');
  
  // 🔧 Cargar datos necesarios
  useEffect(() => {
    // Asegurar que sedes sea un array antes de cargar datos
    dispatch(ensureSedesArray());
    dispatch(fetchSedes());
    
    if (selectedSede?.id_sede) {
      dispatch(fetchEmbarcacionesPorSede(selectedSede.id_sede));
    } else {
      dispatch(fetchEmbarcaciones());
    }
  }, [dispatch, selectedSede]);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/embarcaciones/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/embarcaciones/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta embarcación?')) {
      try {
        await dispatch(deleteEmbarcacion(id)).unwrap();
        alert('Embarcación eliminada con éxito');
      } catch (error) {
        console.error('Error al eliminar:', error);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/embarcaciones/nueva');
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroEstado(e.target.value);
  };
  
  // Filtrar embarcaciones según el estado seleccionado
  const embarcacionesFiltradas = filtroEstado
    ? embarcaciones.filter(e => e.estado === filtroEstado)
    : embarcaciones;
  
  // 🛡️ Obtener nombre de sede - CON VALIDACIÓN MEJORADA
  const getNombreSede = (idSede: number): string => {
    try {
      // ✅ Validación simple y efectiva
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
  
  // 🎨 Mapear estado a etiqueta visual con iconos
  const renderEstado = (estado: EstadoEmbarcacion) => {
    const config = {
      [EstadoEmbarcacion.DISPONIBLE]: {
        icon: <Icons.Available />,
        className: "px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center gap-1",
        label: "Disponible"
      },
      [EstadoEmbarcacion.OCUPADA]: {
        icon: <Icons.Busy />,
        className: "px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center gap-1",
        label: "Ocupada"
      },
      [EstadoEmbarcacion.MANTENIMIENTO]: {
        icon: <Icons.Maintenance />,
        className: "px-2 py-1 bg-orange-100 text-orange-800 rounded-full text-xs flex items-center gap-1",
        label: "Mantenimiento"
      },
      [EstadoEmbarcacion.FUERA_DE_SERVICIO]: {
        icon: <Icons.OutOfService />,
        className: "px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center gap-1",
        label: "Fuera de servicio"
      }
    };
    
    const estadoConfig = config[estado];
    
    if (!estadoConfig) {
      return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">{estado}</span>;
    }
    
    return (
      <span className={estadoConfig.className}>
        {estadoConfig.icon}
        {estadoConfig.label}
      </span>
    );
  };
  
  // 📊 Columnas para la tabla
  const columns = [
    { 
      header: "🚢 ID",
      accessor: 'id_embarcacion' 
    },
    { 
      header: "🚢 Nombre",
      accessor: 'nombre' 
    },
    { 
      header: "🏢 Sede",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Icons.Building />
          {getNombreSede(row.id_sede)}
        </div>
      )
    },
    { 
      header: "👥 Capacidad",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <Icons.Users />
          {row.capacidad} pasajeros
        </div>
      )
    },
    { 
      header: "📊 Estado",
      accessor: (row: any) => renderEstado(row.estado) 
    },
    { 
      header: "⚙️ Acciones",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_embarcacion)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <Icons.Eye />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_embarcacion)}
            className="p-2 rounded-full"
            title="Editar embarcación"
          >
            <Icons.Edit />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_embarcacion)}
            className="p-2 rounded-full"
            title="Eliminar embarcación"
          >
            <Icons.Trash />
          </Button>
        </div>
      )
    },
  ];

  // 🔧 Renderizar contenido cuando no hay datos
  const renderEmptyState = () => {
    if (loading) return null; // No mostrar mensaje vacío mientras carga

    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4 text-gray-300">
          <Icons.Ship />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay embarcaciones disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroEstado 
            ? `No se encontraron embarcaciones con estado "${filtroEstado}"`
            : "Comienza agregando tu primera embarcación"
          }
        </p>
        {!filtroEstado && (
          <Button 
            onClick={handleCreate}
            className="p-2 rounded-full mx-auto"
            title="Nueva Embarcación"
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
          <Icons.Ship />
          Gestión de Embarcaciones
        </h3>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700 flex items-start gap-2">
            <Icons.OutOfService />
            <div>
              <strong>Error:</strong> {error}
            </div>
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <Icons.Filter />
              </div>
              <Select
                label="🔍 Filtrar por Estado"
                name="filtroEstado"
                value={filtroEstado}
                onChange={handleFilterChange}
                className="pl-10"
              >
                <option value="">Todos los estados</option>
                {Object.values(EstadoEmbarcacion).map(estado => (
                  <option key={estado} value={estado}>
                    {estado}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-end">
              <Button 
                onClick={handleCreate}
                className="p-3 rounded-full"
                title="Crear nueva embarcación"
              >
                <Icons.Plus />
              </Button>
            </div>
          </div>
        </div>
        
        {/* 🐛 Panel de debug mejorado - solo en desarrollo */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg text-xs">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-1">
              🔍 Debug Info
            </h4>
            <div className="grid grid-cols-2 gap-2 text-blue-700">
              <div>
                <strong>Sedes tipo:</strong> {typeof sedes}
              </div>
              <div>
                <strong>Es array:</strong> {Array.isArray(sedes) ? '✅' : '❌'}
              </div>
              <div>
                <strong>Sedes count:</strong> {Array.isArray(sedes) ? sedes.length : 'N/A'}
              </div>
              <div>
                <strong>Embarcaciones:</strong> {embarcaciones.length}
              </div>
              <div>
                <strong>Loading:</strong> {loading ? '⏳' : '✅'}
              </div>
              <div>
                <strong>Selected Sede:</strong> {selectedSede?.nombre || 'Ninguna'}
              </div>
            </div>
          </div>
        )}
        
        {/* ✅ Manejo condicional de la tabla vs estado vacío */}
        {embarcacionesFiltradas.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={embarcacionesFiltradas}
            loading={loading}
            emptyMessage="🚢 No hay embarcaciones que mostrar" 
          />
        )}
      </div>
    </Card>
  );
};

export default EmbarcacionList;