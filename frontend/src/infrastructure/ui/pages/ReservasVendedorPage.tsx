import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { fetchReservas, clearErrors } from '../../store/slices/reservaSlice';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import FormInput from '../components/FormInput';
import { toast } from 'react-toastify';
import { FaCalendarPlus, FaSearch, FaEye, FaEdit, FaTrash } from 'react-icons/fa';
import ROUTES, { navigateHelpers } from '../../../shared/constants/appRoutes';

const ReservasVendedorPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { reservas, loading, error } = useSelector((state: RootState) => state.reserva);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEstado, setSelectedEstado] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState<any>(null);
  
  useEffect(() => {
    dispatch(fetchReservas());
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch]);
  
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);
  
  const handleCreateReserva = () => {
    // Usar la función helper para navegar a nueva reserva
    navigate(navigateHelpers.nuevaReserva());
  };
  
  const handleCreateReservaWithInstancia = (instanciaId: number) => {
    // Ejemplo: crear reserva preseleccionando un tour
    navigate(navigateHelpers.nuevaReserva({ instanciaId }));
  };
  
  const handleViewReserva = (reserva: any) => {
    // Usar la definición de ruta de ROUTES
    navigate(ROUTES.VENDEDOR.RESERVAS.DETAIL(reserva.id_reserva || reserva.id));
  };
  
  const handleEditReserva = (reserva: any) => {
    // Usar la definición de ruta de ROUTES
    navigate(ROUTES.VENDEDOR.RESERVAS.EDIT(reserva.id_reserva || reserva.id));
  };
  
  const handleDeleteClick = (reserva: any) => {
    setSelectedReserva(reserva);
    setShowDeleteModal(true);
  };
  
  const confirmDelete = () => {
    // Lógica para eliminar (si es permitido)
    setShowDeleteModal(false);
  };
  
  // Resto del código del componente...
  
  return (
    <div className="space-y-6">
      {/* Implementación del resto de la UI... */}
      <Button 
        onClick={handleCreateReserva}
        className="flex items-center gap-2"
        variant="success"
      >
        <FaCalendarPlus /> Nueva Reserva
      </Button>
      
      {/* Ejemplo de cómo crear un botón que navega a nueva reserva con instancia preseleccionada */}
      <Button 
        onClick={() => handleCreateReservaWithInstancia(15)}
        className="ml-2"
        variant="primary"
      >
        Reservar Tour Específico
      </Button>
      
      {/* Resto del componente... */}
    </div>
  );
};

export default ReservasVendedorPage;