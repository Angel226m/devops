import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { FaCalendarPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';

const ReservasVendedorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [reservas, setReservas] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  
  useEffect(() => {
    const fetchReservas = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo
        setTimeout(() => {
          setReservas([
            { id: 1, cliente: 'Juan Pérez', tour: 'Islas Ballestas', fecha: '2025-06-12', hora: '10:30', pasajeros: 3, estado: 'Confirmada', total: 'S/ 150.00' },
            { id: 2, cliente: 'María López', tour: 'Reserva de Paracas', fecha: '2025-06-15', hora: '09:00', pasajeros: 2, estado: 'Pendiente', total: 'S/ 100.00' },
            { id: 3, cliente: 'Carlos Rodríguez', tour: 'Islas Ballestas', fecha: '2025-06-18', hora: '11:00', pasajeros: 4, estado: 'Pagada', total: 'S/ 200.00' }
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
  
  const handleCreateReserva = () => {
    setSelectedReserva(null);
    setIsModalOpen(true);
  };
  
  const handleEditReserva = (reserva: any) => {
    setSelectedReserva(reserva);
    setIsModalOpen(true);
  };
  
  const handleViewReserva = (reserva: any) => {
    // Aquí podrías navegar a una vista detallada o abrir un modal con detalles
    console.log('Ver reserva:', reserva);
  };
  
  const handleDeleteReserva = (reserva: any) => {
    // Lógica para eliminar una reserva
    if (window.confirm(`¿Estás seguro de eliminar la reserva de ${reserva.cliente}?`)) {
      console.log('Eliminar reserva:', reserva);
    }
  };
  
  const filteredReservas = reservas.filter(reserva => 
    reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reserva.tour.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const columns = [
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Tour', accessor: 'tour' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Hora', accessor: 'hora' },
    { header: 'Pasajeros', accessor: 'pasajeros' },
    { 
      header: 'Estado', 
      accessor: (row: any) => {
        let bgColor = '';
        switch (row.estado) {
          case 'Confirmada':
            bgColor = 'bg-blue-100 text-blue-800';
            break;
          case 'Pendiente':
            bgColor = 'bg-yellow-100 text-yellow-800';
            break;
          case 'Pagada':
            bgColor = 'bg-green-100 text-green-800';
            break;
          default:
            bgColor = 'bg-gray-100 text-gray-800';
        }
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>{row.estado}</span>;
      }
    },
    { header: 'Total', accessor: 'total' },
    {
      header: 'Acciones',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewReserva(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
          >
            <FaEye />
          </button>
          <button 
            onClick={() => handleEditReserva(row)}
            className="p-1 text-yellow-600 hover:text-yellow-800"
          >
            <FaEdit />
          </button>
          <button 
            onClick={() => handleDeleteReserva(row)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            <FaTrash />
          </button>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reservas</h1>
        <Button 
          onClick={handleCreateReserva}
          className="flex items-center gap-2"
          variant="success"
        >
          <FaCalendarPlus /> Nueva Reserva
        </Button>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
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
            <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos los estados</option>
              <option value="confirmada">Confirmada</option>
              <option value="pendiente">Pendiente</option>
              <option value="pagada">Pagada</option>
            </select>
            <select className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
              <option value="">Todos los tours</option>
              <option value="islas-ballestas">Islas Ballestas</option>
              <option value="reserva-paracas">Reserva de Paracas</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Tabla de reservas */}
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Cargando reservas...</p>
          </div>
        ) : filteredReservas.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">No se encontraron reservas</p>
          </div>
        ) : (
          <Table 
            columns={columns}
            data={filteredReservas}
          />
        )}
      </div>
      
      {/* Modal para crear/editar reserva */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedReserva ? "Editar Reserva" : "Nueva Reserva"}
      >
        <div className="p-4">
          <form className="space-y-4">
            {/* Aquí irían los campos del formulario de reserva */}
            <p className="text-gray-500">Formulario de reserva aquí...</p>
            <div className="flex justify-end space-x-2 pt-4">
              <Button 
                onClick={() => setIsModalOpen(false)}
                variant="secondary"
              >
                Cancelar
              </Button>
              <Button 
                variant="success"
              >
                {selectedReserva ? "Actualizar" : "Guardar"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default ReservasVendedorPage;