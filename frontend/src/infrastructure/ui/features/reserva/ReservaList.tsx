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
  FaTrash, FaFilter, FaCalendarAlt 
} from 'react-icons/fa';
import ROUTES from '../../../../shared/constants/appRoutes';

const ReservaList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas, loading, error } = useSelector((state: RootState) => state.reserva);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedTour, setSelectedTour] = useState('');
  
  useEffect(() => {
    dispatch(fetchReservas());
  }, [dispatch]);
  
  // Filtrar reservas por término de búsqueda
  const filteredReservas = Array.isArray(reservas) ? 
    reservas.filter(reserva => {
      const clientName = reserva.nombre_cliente || '';
      const tourName = reserva.nombre_tour || '';
      const searchLower = searchTerm.toLowerCase();
      
      return clientName.toLowerCase().includes(searchLower) || 
             tourName.toLowerCase().includes(searchLower);
    }) : [];
  
  // Si no hay reservas, usar datos de ejemplo temporales
  const displayReservas = filteredReservas.length > 0 ? filteredReservas : [
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
  
  const handleViewReserva = (reserva: any) => {
    const idReserva = reserva.id_reserva || reserva.id;
    navigate(ROUTES.VENDEDOR.RESERVA.VER(idReserva));
  };
  
  const handleEditReserva = (reserva: any) => {
    const idReserva = reserva.id_reserva || reserva.id;
    navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(idReserva));
  };
  
  const handleDeleteReserva = (reserva: any) => {
    if (window.confirm(`¿Estás seguro de eliminar la reserva de ${reserva.nombre_cliente || 'este cliente'}?`)) {
      // Lógica para eliminar
      console.log('Eliminar reserva:', reserva);
    }
  };
  
  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800';
      case 'RESERVADO':
        return 'bg-blue-100 text-blue-800';
      case 'COMPLETADO':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const columns = [
    { 
      header: 'Cliente', 
      accessor: (reserva: any) => (
        <div>
          <p className="font-medium">{reserva.nombre_cliente || 'Sin nombre'}</p>
          <p className="text-xs text-gray-500">{reserva.documento_cliente || 'Sin documento'}</p>
        </div>
      )
    },
    { 
      header: 'Tour', 
      accessor: (reserva: any) => (
        <div>
          <p className="font-medium">{reserva.nombre_tour || 'Sin tour'}</p>
          <p className="text-xs text-gray-500">
            {new Date(reserva.fecha_tour || Date.now()).toLocaleDateString('es-ES')}
          </p>
        </div>
      )
    },
    { 
      header: 'Hora', 
      accessor: (reserva: any) => (
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-500 mr-2" />
          <span>{reserva.hora_inicio_tour || '--:--'}</span>
        </div>
      )
    },
    { 
      header: 'Pasajeros', 
      accessor: (reserva: any) => (
        <div className="text-center">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            {reserva.total_pasajeros || 0}
          </span>
        </div>
      )
    },
    { 
      header: 'Estado', 
      accessor: (reserva: any) => {
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
      accessor: (reserva: any) => (
        <div className="font-medium text-right">
          S/ {(reserva.total_pagar || 0).toFixed(2)}
        </div>
      )
    },
    {
      header: 'Acciones',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => handleViewReserva(row)}
            className="p-1 text-white rounded"
          >
            <FaEye className="mr-1" /> Ver
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => handleEditReserva(row)}
            className="p-1 text-white rounded"
          >
            <FaEdit className="mr-1" /> Editar
          </Button>
          <Button 
            size="sm" 
            variant="danger"
            onClick={() => handleDeleteReserva(row)}
            className="p-1 text-white rounded"
          >
            <FaTrash className="mr-1" /> Eliminar
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <Card className="shadow-md">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sistema de Reservas</h1>
        <Button 
          onClick={handleCreateReserva}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
          variant="success"
        >
          <FaCalendarPlus /> Nueva Reserva
        </Button>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <FormInput
                placeholder="Buscar por cliente o tour..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <select 
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
            >
              <option value="">Todos los tours</option>
              <option value="islas-ballestas">Islas Ballestas</option>
              <option value="reserva-paracas">Reserva de Paracas</option>
            </select>
            <Button 
              variant="primary"
              className="flex items-center gap-2"
            >
              <FaFilter /> Filtrar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Tabla de reservas */}
      <div className="bg-white rounded-lg overflow-hidden border border-gray-200">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando reservas...</p>
          </div>
        ) : displayReservas.length === 0 ? (
          <div className="p-12 text-center">
            <div className="bg-gray-100 inline-flex p-4 rounded-full mb-4">
              <FaCalendarAlt className="text-gray-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron reservas</h3>
            <p className="text-gray-500 mb-6">Crea una nueva reserva para comenzar</p>
            <Button 
              onClick={handleCreateReserva}
              variant="primary"
              className="mx-auto"
            >
              <FaCalendarPlus className="mr-2" /> Crear Primera Reserva
            </Button>
          </div>
        ) : (
          <Table 
            columns={columns}
            data={displayReservas}
          />
        )}
      </div>
    </Card>
  );
};

export default ReservaList;