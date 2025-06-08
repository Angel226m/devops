 

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchPaquetesPasajes, 
  deletePaquetePasajes, 
  fetchPaquetesPasajesByTipoTour 
} from '../../../store/slices/paquetePasajesSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Modal from '../../components/Modal';
import Select from '../../components/Select';
import { FiPlus, FiFilter, FiEdit2, FiTrash2, FiRefreshCcw, FiPackage, FiEye, FiMapPin, FiDollarSign, FiArrowLeft } from 'react-icons/fi';

const PaquetePasajesList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { paquetesPasajes, loading, error } = useSelector((state: RootState) => state.paquetePasajes);
  const { sedes } = useSelector((state: RootState) => state.sede);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [paqueteIdToDelete, setPaqueteIdToDelete] = useState<number | null>(null);
  const [selectedSedeFilter, setSelectedSedeFilter] = useState<string>('');
  const [selectedTipoTourFilter, setSelectedTipoTourFilter] = useState<string>('');
  const [loadedInitialData, setLoadedInitialData] = useState(false);
  const [paquetesFiltrados, setPaquetesFiltrados] = useState<any[]>([]);

  // Carga inicial de datos
  useEffect(() => {
    // Cargar todos los datos necesarios primero
    dispatch(fetchSedes());
    dispatch(fetchTiposTour());
    
    // Cargar todos los paquetes de pasajes
    dispatch(fetchPaquetesPasajes())
      .then(() => setLoadedInitialData(true));
      
  }, [dispatch]);

  // Filtrar tipos de tour por sede seleccionada
  const tiposTourFiltrados = tiposTour.filter(tipo => {
    // Si hay una sede seleccionada, mostrar solo los tipos de tour de esa sede
    if (selectedSede?.id_sede) {
      return tipo.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada, mostrar todos los tipos de tour
    return true;
  });

  // Filtrado de paquetes por sede
  useEffect(() => {
    if (paquetesPasajes.length > 0) {
      let filtrados = paquetesPasajes;
      
      // Filtro por sede seleccionada en la aplicación
      if (selectedSede?.id_sede) {
        filtrados = filtrados.filter(paquete => 
          paquete.id_sede === selectedSede.id_sede
        );
      }
      
      // Filtro adicional por sede (si se seleccionó en el dropdown)
      if (selectedSedeFilter) {
        filtrados = filtrados.filter(paquete => 
          paquete.id_sede === parseInt(selectedSedeFilter)
        );
      }
      
      // Filtro por tipo de tour
      if (selectedTipoTourFilter) {
        filtrados = filtrados.filter(paquete => 
          paquete.id_tipo_tour === parseInt(selectedTipoTourFilter)
        );
      }
      
      setPaquetesFiltrados(filtrados);
    } else {
      setPaquetesFiltrados([]);
    }
  }, [paquetesPasajes, selectedSede, selectedSedeFilter, selectedTipoTourFilter]);

  // Manejadores de eventos
  const handleCreateClick = () => {
    navigate('/admin/paquetes-pasajes/nuevo');
  };

  const handleEditClick = (id: number) => {
    navigate(`/admin/paquetes-pasajes/editar/${id}`);
  };

  const handleViewClick = (id: number) => {
    navigate(`/admin/paquetes-pasajes/${id}`);
  };

  const handleDeleteClick = (id: number) => {
    setPaqueteIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (paqueteIdToDelete) {
      try {
        await dispatch(deletePaquetePasajes(paqueteIdToDelete)).unwrap();
        setShowDeleteModal(false);
        
        // Recargar datos después de eliminar
        dispatch(fetchPaquetesPasajes());
      } catch (error) {
        console.error('Error al eliminar paquete:', error);
      }
    }
  };

  const handleSedeFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSedeFilter(e.target.value);
  };

  const handleTipoTourFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedTipoTourFilter(e.target.value);
    
    // Si se selecciona un tipo de tour, hacer la llamada a la API
    if (e.target.value) {
      dispatch(fetchPaquetesPasajesByTipoTour(parseInt(e.target.value)));
    } else {
      // Si se deselecciona, volver a cargar todos los datos
      dispatch(fetchPaquetesPasajes());
    }
  };

  const handleResetFilters = () => {
    setSelectedSedeFilter('');
    setSelectedTipoTourFilter('');
    dispatch(fetchPaquetesPasajes());
  };

  // Obtener nombre del tipo de tour
  const getNombreTipoTour = (idTipoTour: number): string => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.nombre : `Tour #${idTipoTour}`;
  };
  
  // Obtener nombre de la sede
  const getNombreSede = (idSede: number): string => {
    const sede = sedes.find(s => s.id_sede === idSede);
    return sede ? sede.nombre : `Sede #${idSede}`;
  };

  const columns = [
    { header: 'ID', accessor: 'id_paquete' },
    { 
      header: 'Nombre', 
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiPackage className="text-green-600" />
          {row.nombre}
        </div>
      )
    },
    { 
      header: 'Tipo de Tour', 
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiMapPin className="text-blue-600" />
          {row.id_tipo_tour ? getNombreTipoTour(row.id_tipo_tour) : 'No asignado'}
        </div>
      )
    },
    { 
      header: 'Precio', 
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiDollarSign className="text-green-600" />
          ${row.precio_total?.toFixed(2) || '0.00'}
        </div>
      )
    },
    { header: 'Cantidad', accessor: 'cantidad_total' },
    {
      header: 'Acciones',
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary"
            size="sm" 
            onClick={() => handleViewClick(row.id_paquete)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <FiEye />
          </Button>
          <Button 
            variant="secondary"
            size="sm" 
            onClick={() => handleEditClick(row.id_paquete)}
            className="p-2 rounded-full"
            title="Editar paquete"
          >
            <FiEdit2 />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDeleteClick(row.id_paquete)}
            className="p-2 rounded-full"
            title="Eliminar paquete"
          >
            <FiTrash2 />
          </Button>
        </div>
      )
    }
  ];

  // Renderizar contenido cuando no hay datos
  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4 text-gray-300">
          <FiPackage className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay paquetes de pasajes disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {selectedSedeFilter || selectedTipoTourFilter || selectedSede
            ? `No se encontraron paquetes con los filtros seleccionados`
            : "Comienza agregando tu primer paquete de pasajes"
          }
        </p>
        <Button 
          onClick={handleCreateClick}
          className="p-2 rounded-full mx-auto"
          title="Nuevo Paquete"
        >
          <FiPlus />
        </Button>
      </div>
    );
  };

  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FiPackage className="text-green-600" />
            Gestión de Paquetes de Pasajes
          </h3>
          <p className="text-sm text-gray-600">
            {selectedSede?.nombre ? `Sede: ${selectedSede.nombre}` : 'Todos los paquetes de pasajes'}
          </p>
        </div>
        <Button
           onClick={() => navigate('/admin/pasajes')}
          className="flex items-center gap-2 text-green-600"
        >
          <FiArrowLeft /> Volver a Pasajes
        </Button>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Solo mostrar selector de sede si no hay sede seleccionada o si es un administrador */}
            {!selectedSede?.id_sede && (
              <div className="relative">
                <div className="absolute left-3 top-8 pointer-events-none z-10">
                  <FiMapPin className="text-gray-400" />
                </div>
                <Select
                  label="Filtrar por Sede"
                  name="filtroSede"
                  value={selectedSedeFilter}
                  onChange={handleSedeFilterChange}
                  className="pl-10"
                >
                  <option value="">Todas las sedes</option>
                  {sedes.map(sede => (
                    <option key={sede.id_sede} value={sede.id_sede.toString()}>
                      {sede.nombre}
                    </option>
                  ))}
                </Select>
              </div>
            )}
            
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <FiPackage className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Tipo de Tour"
                name="filtroTipoTour"
                value={selectedTipoTourFilter}
                onChange={handleTipoTourFilterChange}
                className="pl-10"
              >
                <option value="">Todos los tipos de tour</option>
                {tiposTourFiltrados.map(tipoTour => (
                  <option key={tipoTour.id_tipo_tour} value={tipoTour.id_tipo_tour.toString()}>
                    {tipoTour.nombre}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-end">
              <Button 
                onClick={handleCreateClick}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white"
                title="Crear nuevo paquete"
              >
                <FiPlus />
              </Button>
            </div>
          </div>
        </div>
        
        {paquetesFiltrados.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={paquetesFiltrados}
            loading={loading}
            emptyMessage="No hay paquetes de pasajes que mostrar" 
          />
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        onClose={() => setShowDeleteModal(false)}
      >
        <p>¿Está seguro de que desea eliminar este paquete de pasajes?</p>
        <p className="text-gray-500 text-sm mt-2">Esta acción no se puede deshacer.</p>
        <div className="flex justify-end mt-6 space-x-2">
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Eliminar
          </Button>
        </div>
      </Modal>
    </Card>
  );
};

export default PaquetePasajesList;