import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchReservas } from '../../../store/slices/reservaSlice';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FormInput from '../../components/FormInput';
import { 
  FaCalendarPlus, FaSearch, FaEye, FaEdit, 
  FaTrash, FaFilter, FaCalendarAlt, FaSort,
  FaInfoCircle, FaExclamationTriangle
} from 'react-icons/fa';
import ROUTES from '../../../../shared/constants/appRoutes';

// Define la interfaz para la reserva
interface Reserva {
  id_reserva?: number;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  total_pasajeros?: number;
  estado?: string;
  total_pagar?: number;
  [key: string]: any; // Esta es la firma de índice que permite indexación con string
}

// Define la interfaz para la columna según el componente Table
interface Column {
  header: string;
  accessor: (item: any) => any;
}

// Define los tipos de campos para ordenación
type SortableField = 'nombre_cliente' | 'nombre_tour' | 'fecha_tour' | 'estado' | 'total_pagar';
type SortDirection = 'asc' | 'desc';

const ReservaList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas, loading, error } = useSelector((state: RootState) => state.reserva);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedTour, setSelectedTour] = useState('');
  const [sortField, setSortField] = useState<SortableField>('fecha_tour');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  
  useEffect(() => {
    dispatch(fetchReservas());
  }, [dispatch]);
  
  // Filtrar reservas por término de búsqueda y filtros seleccionados
  const filteredReservas = Array.isArray(reservas) ? 
    reservas.filter((reserva: Reserva) => {
      const clientName = reserva.nombre_cliente || '';
      const tourName = reserva.nombre_tour || '';
      const estado = reserva.estado || '';
      const tour = reserva.nombre_tour || '';
      const searchLower = searchTerm.toLowerCase();
      
      const matchesSearch = clientName.toLowerCase().includes(searchLower) || 
                          tourName.toLowerCase().includes(searchLower);
                          
      const matchesEstado = selectedEstado ? estado === selectedEstado : true;
      const matchesTour = selectedTour ? tour.toLowerCase().includes(selectedTour.toLowerCase()) : true;
      
      return matchesSearch && matchesEstado && matchesTour;
    }) : [];
  
  // Función segura para obtener un valor de ordenación de un objeto
  const getSortValue = (obj: Reserva, field: SortableField): any => {
    switch (field) {
      case 'nombre_cliente':
        return obj.nombre_cliente || '';
      case 'nombre_tour':
        return obj.nombre_tour || '';
      case 'fecha_tour':
        return obj.fecha_tour ? new Date(obj.fecha_tour).getTime() : 0;
      case 'estado':
        return obj.estado || '';
      case 'total_pagar':
        return obj.total_pagar || 0;
      default:
        return '';
    }
  };
  
  // Ordenar reservas
  const sortedReservas = [...filteredReservas].sort((a: Reserva, b: Reserva) => {
    const valueA = getSortValue(a, sortField);
    const valueB = getSortValue(b, sortField);
    
    if (valueA < valueB) return sortDirection === 'asc' ? -1 : 1;
    if (valueA > valueB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });
  
  // Si no hay reservas, usar datos de ejemplo temporales
  const displayReservas: Reserva[] = sortedReservas.length > 0 ? sortedReservas : [
    { 
      id_reserva: 1, 
      nombre_cliente: 'Juan Pérez', 
      nombre_tour: 'Islas Ballestas',
      fecha_tour: '2025-06-12',
      hora_inicio_tour: '10:30',
      total_pasajeros: 3,
      estado: 'CONFIRMADO',
      total_pagar: 150.00
    },
    { 
      id_reserva: 2, 
      nombre_cliente: 'María López', 
      nombre_tour: 'Reserva de Paracas',
      fecha_tour: '2025-06-15',
      hora_inicio_tour: '09:00',
      total_pasajeros: 2,
      estado: 'RESERVADO',
      total_pagar: 100.00
    }
  ];
  
  const handleCreateReserva = () => {
    navigate(ROUTES.VENDEDOR.RESERVA.CREAR);
  };
  
  const handleViewReserva = (reserva: Reserva) => {
    const idReserva = reserva.id_reserva || 0;
    navigate(ROUTES.VENDEDOR.RESERVA.VER(idReserva));
  };
  
  const handleEditReserva = (reserva: Reserva) => {
    const idReserva = reserva.id_reserva || 0;
    navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(idReserva));
  };
  
  const handleDeleteReserva = (reserva: Reserva) => {
    if (window.confirm(`¿Estás seguro de eliminar la reserva de ${reserva.nombre_cliente || 'este cliente'}?`)) {
      // Lógica para eliminar
      console.log('Eliminar reserva:', reserva);
    }
  };
  
  // Cambiar el orden de clasificación
  const toggleSort = (field: SortableField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'RESERVADO':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      case 'COMPLETADO':
        return 'bg-purple-100 text-purple-800 border border-purple-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };
  
  const formatFecha = (fechaStr: string) => {
    try {
      const fecha = new Date(fechaStr);
      return fecha.toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (e) {
      return fechaStr || 'N/A';
    }
  };
  
  // Aplicar filtros
  const handleApplyFilters = () => {
    // Ya se aplican automáticamente en la función de filtrado
    console.log("Aplicando filtros:", { searchTerm, selectedEstado, selectedTour });
  };
  
  // Definir columnas con headers como strings para compatibilidad con el componente Table
  const columns: Column[] = [
    { 
      header: 'Cliente', 
      accessor: (reserva: Reserva) => (
        <div>
          <p className="font-medium">{reserva.nombre_cliente || 'Sin nombre'}</p>
          <p className="text-xs text-gray-500">{reserva.documento_cliente || 'Sin documento'}</p>
        </div>
      )
    },
    { 
      header: 'Tour',
      accessor: (reserva: Reserva) => (
        <div>
          <p className="font-medium">{reserva.nombre_tour || 'Sin tour'}</p>
          <p className="text-xs text-gray-500">
            {formatFecha(reserva.fecha_tour || '')}
          </p>
        </div>
      )
    },
    { 
      header: 'Hora',
      accessor: (reserva: Reserva) => (
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-500 mr-2" />
          <span>{reserva.hora_inicio_tour || '--:--'}</span>
        </div>
      )
    },
    { 
      header: 'Pasajeros', 
      accessor: (reserva: Reserva) => (
        <div className="text-center">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
            {reserva.total_pasajeros || 0}
          </span>
        </div>
      )
    },
    { 
      header: 'Estado', 
      accessor: (reserva: Reserva) => {
        const statusClass = getStatusColor(reserva.estado || 'RESERVADO');
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>
            {reserva.estado || 'RESERVADO'}
          </span>
        );
      }
    },
    { 
      header: 'Total',
      accessor: (reserva: Reserva) => (
        <div className="font-medium text-right">
          S/ {(reserva.total_pagar || 0).toFixed(2)}
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: (row: Reserva) => (
        <div className="flex space-x-1">
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => handleViewReserva(row)}
            className="p-1 text-white rounded"
            title="Ver detalles"
          >
            <FaEye />
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => handleEditReserva(row)}
            className="p-1 text-white rounded"
            title="Editar reserva"
          >
            <FaEdit />
          </Button>
          <Button 
            size="sm" 
            variant="danger"
            onClick={() => handleDeleteReserva(row)}
            className="p-1 text-white rounded"
            title="Eliminar reserva"
          >
            <FaTrash />
          </Button>
        </div>
      )
    }
  ];
  
  // Componente de encabezado para mostrar con los iconos de ordenación
  const renderTableHeader = () => (
    <div className="flex items-center justify-between py-2 px-4 bg-gray-50 border-b">
      <div className="flex items-center space-x-2">
        <span className="font-medium text-gray-700">
          Ordenar por: 
        </span>
        <button 
          onClick={() => toggleSort('nombre_cliente')}
          className={`px-2 py-1 rounded text-sm ${sortField === 'nombre_cliente' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Cliente {sortField === 'nombre_cliente' && (
            <FaSort className="inline ml-1 text-xs" />
          )}
        </button>
        <button 
          onClick={() => toggleSort('nombre_tour')}
          className={`px-2 py-1 rounded text-sm ${sortField === 'nombre_tour' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Tour {sortField === 'nombre_tour' && (
            <FaSort className="inline ml-1 text-xs" />
          )}
        </button>
        <button 
          onClick={() => toggleSort('fecha_tour')}
          className={`px-2 py-1 rounded text-sm ${sortField === 'fecha_tour' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Fecha {sortField === 'fecha_tour' && (
            <FaSort className="inline ml-1 text-xs" />
          )}
        </button>
        <button 
          onClick={() => toggleSort('estado')}
          className={`px-2 py-1 rounded text-sm ${sortField === 'estado' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100'}`}
        >
          Estado {sortField === 'estado' && (
            <FaSort className="inline ml-1 text-xs" />
          )}
        </button>
      </div>
      <div className="text-sm text-gray-600">
        {sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
      </div>
    </div>
  );
  
  return (
    <Card className="shadow-lg border border-gray-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-lg mr-3">
              <FaCalendarAlt />
            </span>
            Sistema de Reservas
          </h1>
          <p className="text-gray-600 text-sm mt-1">Gestión de reservas para vendedores</p>
        </div>
        
        <Button 
          onClick={handleCreateReserva}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white shadow-md transition-all"
          variant="success"
        >
          <FaCalendarPlus /> Nueva Reserva
        </Button>
      </div>
      
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
          <FaExclamationTriangle className="mt-0.5 mr-2 flex-shrink-0" />
          <p>Error al cargar reservas: {error}</p>
        </div>
      )}
      
      {/* Filtros y búsqueda */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg mb-6 border border-blue-100 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <FormInput
                placeholder="Buscar por cliente o tour..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedEstado}
              onChange={(e) => setSelectedEstado(e.target.value)}
            >
              <option value="">Todos los estados</option>
              <option value="RESERVADO">Reservado</option>
              <option value="CONFIRMADO">Confirmado</option>
              <option value="COMPLETADO">Completado</option>
              <option value="CANCELADO">Cancelado</option>
            </select>
            <select 
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
            >
              <option value="">Todos los tours</option>
              <option value="Islas Ballestas">Islas Ballestas</option>
              <option value="Reserva de Paracas">Reserva de Paracas</option>
            </select>
            <Button 
              variant="primary"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
              onClick={handleApplyFilters}
            >
              <FaFilter /> Filtrar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabla de reservas */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando reservas...</p>
          </div>
        ) : displayReservas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-blue-50 inline-flex p-4 rounded-full mb-4">
              <FaInfoCircle className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron reservas</h3>
            <p className="text-gray-500 mb-6">No hay resultados para los filtros seleccionados</p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedEstado('');
                  setSelectedTour('');
                }}
                variant="secondary"
                className="mx-auto"
              >
                Limpiar filtros
              </Button>
              <Button 
                onClick={handleCreateReserva}
                variant="primary"
                className="mx-auto"
              >
                <FaCalendarPlus className="mr-2" /> Crear Reserva
              </Button>
            </div>
          </div>
        ) : (
          <>
            {renderTableHeader()}
            <Table 
              columns={columns}
              data={displayReservas}
            />
          </>
        )}
      </div>
      
      {/* Resumen de resultados */}
      {displayReservas.length > 0 && (
        <div className="flex justify-between items-center mt-4 px-2 text-sm text-gray-600">
          <span>Mostrando {displayReservas.length} reservas</span>
          <span>Última actualización: {new Date().toLocaleString()}</span>
        </div>
      )}
    </Card>
  );
};

export default ReservaList;