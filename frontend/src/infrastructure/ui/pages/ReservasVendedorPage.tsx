import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Table from '../components/Table';
import Button from '../components/Button';
import { 
  FaSearch, FaEye, FaEdit, FaTrash, 
  FaFilter, FaSortAmountDown, FaExclamationTriangle, 
  FaCalendarAlt, FaInfoCircle
} from 'react-icons/fa';
import ROUTES from '../../../shared/constants/appRoutes';

const ReservasVendedorPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [selectedTour, setSelectedTour] = useState('');
  
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo
        setTimeout(() => {
          setReservas([
            { id: 1, cliente: 'Juan Pérez', tour: 'Islas Ballestas', fecha: '2025-06-12', hora: '10:30', pasajeros: 3, estado: 'Confirmada', total: 'S/ 150.00' },
            { id: 2, cliente: 'María López', tour: 'Reserva de Paracas', fecha: '2025-06-15', hora: '09:00', pasajeros: 2, estado: 'Pendiente', total: 'S/ 100.00' },
            { id: 3, cliente: 'Carlos Rodríguez', tour: 'Islas Ballestas', fecha: '2025-06-18', hora: '11:00', pasajeros: 4, estado: 'Pagada', total: 'S/ 200.00' },
            { id: 4, cliente: 'Ana Martínez', tour: 'Tour de Viñedos', fecha: '2025-06-20', hora: '08:30', pasajeros: 2, estado: 'Confirmada', total: 'S/ 180.00' },
            { id: 5, cliente: 'Roberto Sánchez', tour: 'Reserva de Paracas', fecha: '2025-06-22', hora: '10:00', pasajeros: 5, estado: 'Pendiente', total: 'S/ 250.00' },
          ]);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error al cargar reservas:', error);
        setLoading(false);
      }
    };
    
    fetchReservas();
  }, [dispatch, selectedSede]);
  
  const handleEditReserva = (reserva: any) => {
    // Redirigir a la página de edición
    navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(reserva.id));
  };
  
  const handleViewReserva = (reserva: any) => {
    // Redirigir a la página de detalle
    navigate(ROUTES.VENDEDOR.RESERVA.VER(reserva.id));
  };
  
  const handleDeleteReserva = (reserva: any) => {
    // Lógica para eliminar una reserva
    if (window.confirm(`¿Estás seguro de eliminar la reserva de ${reserva.cliente}?`)) {
      console.log('Eliminar reserva:', reserva);
      // Aquí iría la llamada al API para eliminar
      
      // Actualizar UI eliminando la reserva del estado
      setReservas(reservas.filter(r => r.id !== reserva.id));
    }
  };
  
  const filteredReservas = reservas.filter(reserva => {
    const matchesSearch = reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         reserva.tour.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesEstado = selectedEstado ? 
                         reserva.estado.toLowerCase() === selectedEstado.toLowerCase() : true;
    
    const matchesTour = selectedTour ? 
                      reserva.tour.toLowerCase() === selectedTour.toLowerCase() : true;
                      
    return matchesSearch && matchesEstado && matchesTour;
  });
  
  const columns = [
    { header: 'Cliente', accessor: 'cliente' },
    { 
      header: 'Tour',
      accessor: (row: any) => (
        <div>
          <p className="font-medium">{row.tour}</p>
          <p className="text-xs text-gray-500">{row.fecha}</p>
        </div>
      )
    },
    { 
      header: 'Hora', 
      accessor: (row: any) => (
        <div className="flex items-center">
          <FaCalendarAlt className="text-blue-500 mr-2" />
          <span>{row.hora}</span>
        </div>
      )
    },
    { 
      header: 'Pasajeros', 
      accessor: (row: any) => (
        <div className="flex justify-center">
          <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full border border-blue-200">
            {row.pasajeros}
          </span>
        </div>
      )
    },
    { 
      header: 'Estado', 
      accessor: (row: any) => {
        let bgColor = '';
        switch (row.estado) {
          case 'Confirmada':
            bgColor = 'bg-green-100 text-green-800 border border-green-200';
            break;
          case 'Pendiente':
            bgColor = 'bg-yellow-100 text-yellow-800 border border-yellow-200';
            break;
          case 'Pagada':
            bgColor = 'bg-blue-100 text-blue-800 border border-blue-200';
            break;
          default:
            bgColor = 'bg-gray-100 text-gray-800 border border-gray-200';
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>{row.estado}</span>;
      }
    },
    { header: 'Total', accessor: 'total' },
    {
      header: 'Acciones',
      accessor: (row: any) => (
        <div className="flex space-x-1">
          <Button 
            size="sm"
            variant="primary"
            onClick={() => handleViewReserva(row)}
            className="p-1 text-white bg-blue-600 hover:bg-blue-700 rounded"
            title="Ver detalles"
          >
            <FaEye />
          </Button>
          <Button 
            size="sm"
            variant="secondary"
            onClick={() => handleEditReserva(row)}
            className="p-1 text-white bg-yellow-600 hover:bg-yellow-700 rounded"
            title="Editar reserva"
          >
            <FaEdit />
          </Button>
          <Button 
            size="sm"
            variant="danger"
            onClick={() => handleDeleteReserva(row)}
            className="p-1 text-white bg-red-600 hover:bg-red-700 rounded"
            title="Eliminar reserva"
          >
            <FaTrash />
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <span className="bg-gradient-to-r from-blue-500 to-blue-700 text-white p-2 rounded-lg mr-3">
              <FaCalendarAlt />
            </span>
            Gestión de Reservas
          </h1>
          <p className="text-gray-600 text-sm mt-1">Sistema de reservas antiguo</p>
        </div>
        
        {/* Botón de nueva reserva eliminado según lo solicitado */}
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-4 rounded-lg shadow-sm border border-blue-100">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por cliente o tour..."
                className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
              <option value="confirmada">Confirmada</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
            </select>
            <select 
              className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
              value={selectedTour}
              onChange={(e) => setSelectedTour(e.target.value)}
            >
              <option value="">Todos los tours</option>
              <option value="islas ballestas">Islas Ballestas</option>
              <option value="reserva de paracas">Reserva de Paracas</option>
              <option value="tour de viñedos">Tour de Viñedos</option>
            </select>
            <Button 
              variant="primary"
              className="flex items-center gap-2"
              onClick={() => console.log("Aplicando filtros")}
            >
              <FaFilter /> Filtrar
            </Button>
          </div>
        </div>
      </div>
      
      {/* Información sobre el nuevo sistema */}
      <div className="bg-amber-50 p-4 rounded-lg border border-amber-200 flex items-start">
        <FaExclamationTriangle className="text-amber-500 mt-1 mr-3 flex-shrink-0" />
        <div>
          <p className="font-medium text-amber-800">Sistema Antiguo</p>
          <p className="text-amber-700 mt-1">Este es el sistema antiguo de reservas. Para utilizar el nuevo sistema con características mejoradas, vaya a:</p>
          <Button 
            onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.LIST)}
            variant="secondary"
            className="mt-2 bg-amber-200 hover:bg-amber-300 text-amber-800 border-amber-300"
          >
            Ir al Nuevo Sistema de Reservas
          </Button>
        </div>
      </div>
      
      {/* Tabla de reservas */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Cargando reservas...</p>
          </div>
        ) : filteredReservas.length === 0 ? (
          <div className="p-8 text-center">
            <div className="bg-blue-50 inline-flex p-4 rounded-full mb-4">
              <FaInfoCircle className="text-blue-500 text-3xl" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No se encontraron reservas</h3>
            <p className="text-gray-500 mb-6">No hay resultados para los filtros seleccionados</p>
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
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <Table 
                columns={columns}
                data={filteredReservas}
              />
            </div>
            <div className="px-4 py-3 bg-gray-50 text-sm text-gray-600 border-t border-gray-200 flex justify-between items-center">
              <span>Mostrando {filteredReservas.length} de {reservas.length} reservas</span>
              <div className="flex items-center">
                <FaSortAmountDown className="mr-2" />
                <span>Ordenado por fecha</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReservasVendedorPage;