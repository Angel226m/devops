 
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { fetchReservas } from '../../../store/slices/reservaSlice';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Card from '../../components/Card';
import FormInput from '../../components/FormInput';
import { FaCalendarPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ROUTES from '../../../../shared/constants/appRoutes';

const ReservaList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas, loading, error } = useSelector((state: RootState) => state.reserva);
  
  const [searchTerm, setSearchTerm] = useState('');
  
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
  
  const handleCreateReserva = () => {
    // Usar la nueva ruta de creación
    navigate(ROUTES.VENDEDOR.RESERVA.CREAR);
  };
  
  const handleViewReserva = (reserva: any) => {
    // Usar la nueva ruta de visualización
    const idReserva = reserva.id_reserva || reserva.id;
    navigate(ROUTES.VENDEDOR.RESERVA.VER(idReserva));
  };
  
  const handleEditReserva = (reserva: any) => {
    // Usar la nueva ruta de edición
    const idReserva = reserva.id_reserva || reserva.id;
    navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(idReserva));
  };
  
  const columns = [
    // Tus columnas existentes...
    {
      header: 'Acciones',
      accessor: (row: any) => (
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="primary" 
            onClick={() => handleViewReserva(row)}
          >
            <FaEye className="mr-1" /> Ver
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            onClick={() => handleEditReserva(row)}
          >
            <FaEdit className="mr-1" /> Editar
          </Button>
          <Button 
            size="sm" 
            variant="danger"
          >
            <FaTrash className="mr-1" /> Eliminar
          </Button>
        </div>
      )
    }
  ];
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gestión de Reservas (Nuevo Sistema)</h1>
        <Button 
          onClick={handleCreateReserva}
          className="flex items-center gap-2"
          variant="success"
        >
          <FaCalendarPlus /> Nueva Reserva
        </Button>
      </div>
      
      {/* Resto de tu componente */}
    </div>
  );
};

export default ReservaList;