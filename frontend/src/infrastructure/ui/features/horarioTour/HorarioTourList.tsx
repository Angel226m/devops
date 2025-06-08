 /*

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchHorariosTour, 
  eliminarHorarioTour,
  fetchHorariosTourPorTipoTour,
  fetchHorariosTourPorDia
} from '../../../store/slices/horarioTourSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import { FiClock, FiCalendar, FiMapPin, FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const diasSemana = [
  { valor: 'todos', etiqueta: 'Todos los días' },
  { valor: 'lunes', etiqueta: 'Lunes' },
  { valor: 'martes', etiqueta: 'Martes' },
  { valor: 'miercoles', etiqueta: 'Miércoles' },
  { valor: 'jueves', etiqueta: 'Jueves' },
  { valor: 'viernes', etiqueta: 'Viernes' },
  { valor: 'sabado', etiqueta: 'Sábado' },
  { valor: 'domingo', etiqueta: 'Domingo' }
];

const HorarioTourList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { horariosTour, loading, error } = useSelector((state: RootState) => state.horarioTour);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [filtroTipoTour, setFiltroTipoTour] = useState<string>('');
  const [filtroDia, setFiltroDia] = useState<string>('todos');
  const [horariosFiltrados, setHorariosFiltrados] = useState<any[]>([]);
  
  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horarioIdToDelete, setHorarioIdToDelete] = useState<number | null>(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchHorariosTour());
    dispatch(fetchTiposTour());
  }, [dispatch]);
  
  // Filtrar horarios por sede del usuario
  useEffect(() => {
    if (horariosTour.length > 0) {
      // Si hay una sede seleccionada, filtrar los horarios por esa sede
      if (selectedSede?.id_sede) {
        setHorariosFiltrados(horariosTour.filter(horario => 
          horario.id_sede === selectedSede.id_sede
        ));
      } else {
        // Si no hay sede seleccionada, mostrar todos los horarios
        setHorariosFiltrados(horariosTour);
      }
    }
  }, [horariosTour, selectedSede]);
  
  // Manejar filtrado
  const handleFilterChange = () => {
    if (filtroTipoTour && filtroTipoTour !== 'todos') {
      dispatch(fetchHorariosTourPorTipoTour(parseInt(filtroTipoTour)));
    } else if (filtroDia && filtroDia !== 'todos') {
      dispatch(fetchHorariosTourPorDia(filtroDia));
    } else {
      dispatch(fetchHorariosTour());
    }
  };
  
  useEffect(() => {
    handleFilterChange();
  }, [filtroTipoTour, filtroDia]);
  
  // Filtrar tipos de tour por sede seleccionada
  const tiposTourFiltrados = tiposTour.filter(tipo => {
    // Si hay una sede seleccionada, mostrar solo los tipos de tour de esa sede
    if (selectedSede?.id_sede) {
      return tipo.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada, mostrar todos los tipos de tour
    return true;
  });
  
  const handleEdit = (id: number) => {
    navigate(`/admin/horarios-tour/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/horarios-tour/${id}`);
  };
  
  // Función modificada para mostrar el modal de confirmación
  const handleDelete = (id: number) => {
    setHorarioIdToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Función para confirmar la eliminación
  const confirmDelete = async () => {
    if (horarioIdToDelete) {
      try {
        await dispatch(eliminarHorarioTour(horarioIdToDelete)).unwrap();
        setShowDeleteModal(false);
        // Opcional: mostrar mensaje de éxito
        alert('Horario de tour eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar horario:', error);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/horarios-tour/nuevo');
  };
  
  // Formatear hora
  const formatHora = (hora: string) => {
    try {
      // Asegurar formato HH:MM:SS
      if (!hora) return '00:00';
      
      const parts = hora.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      return hora;
    } catch (e) {
      return hora || '00:00';
    }
  };
  
  // Obtener nombre del tipo de tour
  const getNombreTipoTour = (idTipoTour: number): string => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.nombre : `Tour #${idTipoTour}`;
  };
  
  // Columnas para la tabla
  const columns = [
    { 
      header: "Tipo de Tour",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiMapPin className="text-blue-600" />
          {getNombreTipoTour(row.id_tipo_tour)}
        </div>
      )
    },
    { 
      header: "Horario",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiClock className="text-gray-600" />
          {formatHora(row.hora_inicio)} - {formatHora(row.hora_fin)}
        </div>
      )
    },
    { 
      header: "Días",
      accessor: (row: any) => (
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="text-xs">
            {row.disponible_lunes ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>L</div>
          </div>
          <div className="text-xs">
            {row.disponible_martes ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>M</div>
          </div>
          <div className="text-xs">
            {row.disponible_miercoles ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>X</div>
          </div>
          <div className="text-xs">
            {row.disponible_jueves ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>J</div>
          </div>
          <div className="text-xs">
            {row.disponible_viernes ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>V</div>
          </div>
          <div className="text-xs">
            {row.disponible_sabado ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>S</div>
          </div>
          <div className="text-xs">
            {row.disponible_domingo ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>D</div>
          </div>
        </div>
      )
    },
    { 
      header: "Acciones",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_horario)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <FiEye />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_horario)}
            className="p-2 rounded-full"
            title="Editar horario"
          >
            <FiEdit />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_horario)}
            className="p-2 rounded-full"
            title="Eliminar horario"
          >
            <FiTrash2 />
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
          <FiClock className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay horarios de tour disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroTipoTour || filtroDia !== 'todos'
            ? `No se encontraron horarios con los filtros seleccionados`
            : "Comienza agregando tu primer horario de tour"
          }
        </p>
        <Button 
          onClick={handleCreate}
          className="p-2 rounded-full mx-auto"
          title="Nuevo Horario"
        >
          <FiPlus />
        </Button>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FiClock className="text-blue-600" />
          Gestión de Horarios de Tour
        </h3>
        <p className="text-sm text-gray-600">
          {selectedSede?.nombre ? `Sede: ${selectedSede.nombre}` : 'Todos los horarios de tour'}
        </p>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <FiMapPin className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Tipo de Tour"
                name="filtroTipoTour"
                value={filtroTipoTour}
                onChange={(e) => setFiltroTipoTour(e.target.value)}
                className="pl-10"
              >
                <option value="">Todos los tipos de tour</option>
                {tiposTourFiltrados.map(tipo => (
                  <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour.toString()}>
                    {tipo.nombre}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <FiCalendar className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Día"
                name="filtroDia"
                value={filtroDia}
                onChange={(e) => setFiltroDia(e.target.value)}
                className="pl-10"
              >
                {diasSemana.map(dia => (
                  <option key={dia.valor} value={dia.valor}>
                    {dia.etiqueta}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-end">
              <Button 
                onClick={handleCreate}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                title="Crear nuevo horario"
              >
                <FiPlus />
              </Button>
            </div>
          </div>
        </div>
        
        {horariosFiltrados.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={horariosFiltrados}
            loading={loading}
            emptyMessage="No hay horarios de tour que mostrar" 
          />
        )}
      </div>

      {/* Modal de confirmación para eliminar *//*}
      <Modal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-4">
          <div className="flex items-center mb-4 text-red-600">
            <FiAlertCircle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">¿Está seguro de que desea eliminar este horario de tour?</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Esta acción no se puede deshacer. El horario se eliminará permanentemente del sistema.
          </p>
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              variant="secondary" 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(false);
              }}
              type="button"
              className="z-50"
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete();
              }}
              type="button"
              className="z-50"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default HorarioTourList;*/


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchHorariosTour, 
  eliminarHorarioTour,
  fetchHorariosTourPorTipoTour,
  fetchHorariosTourPorDia
} from '../../../store/slices/horarioTourSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import { FiClock, FiCalendar, FiMapPin, FiEye, FiEdit, FiTrash2, FiPlus, FiFilter, FiCheck, FiX, FiAlertCircle } from 'react-icons/fi';

const diasSemana = [
  { valor: 'todos', etiqueta: 'Todos los días' },
  { valor: 'lunes', etiqueta: 'Lunes' },
  { valor: 'martes', etiqueta: 'Martes' },
  { valor: 'miercoles', etiqueta: 'Miércoles' },
  { valor: 'jueves', etiqueta: 'Jueves' },
  { valor: 'viernes', etiqueta: 'Viernes' },
  { valor: 'sabado', etiqueta: 'Sábado' },
  { valor: 'domingo', etiqueta: 'Domingo' }
];

const HorarioTourList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { horariosTour, loading, error } = useSelector((state: RootState) => state.horarioTour);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [filtroTipoTour, setFiltroTipoTour] = useState<string>('');
  const [filtroDia, setFiltroDia] = useState<string>('todos');
  const [horariosFiltrados, setHorariosFiltrados] = useState<any[]>([]);
  
  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horarioIdToDelete, setHorarioIdToDelete] = useState<number | null>(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchHorariosTour());
    dispatch(fetchTiposTour());
  }, [dispatch]);
  
  // Filtrar horarios por sede del usuario y por tipos de tour no eliminados
  useEffect(() => {
    if (horariosTour.length > 0) {
      // Obtener los IDs de tipos de tour que NO están eliminados
      const tiposTourActivosIds = tiposTour
        .filter(tipo => !tipo.eliminado)
        .map(tipo => tipo.id_tipo_tour);
      
      // Filtrar los horarios por sede y por tipos de tour activos
      let horariosFiltrados = horariosTour.filter(horario => {
        // Verificar si el tipo de tour asociado al horario está activo (no eliminado)
        const tipoTourActivo = tiposTourActivosIds.includes(horario.id_tipo_tour);
        
        // Verificar la sede si hay una seleccionada
        const sedeCorrecta = selectedSede?.id_sede 
          ? horario.id_sede === selectedSede.id_sede 
          : true;
        
        // Solo incluir el horario si cumple ambas condiciones
        return tipoTourActivo && sedeCorrecta;
      });
      
      setHorariosFiltrados(horariosFiltrados);
    } else {
      setHorariosFiltrados([]);
    }
  }, [horariosTour, tiposTour, selectedSede]);
  
  // Manejar filtrado
  const handleFilterChange = () => {
    if (filtroTipoTour && filtroTipoTour !== 'todos') {
      dispatch(fetchHorariosTourPorTipoTour(parseInt(filtroTipoTour)));
    } else if (filtroDia && filtroDia !== 'todos') {
      dispatch(fetchHorariosTourPorDia(filtroDia));
    } else {
      dispatch(fetchHorariosTour());
    }
  };
  
  useEffect(() => {
    handleFilterChange();
  }, [filtroTipoTour, filtroDia]);
  
  // Filtrar tipos de tour por sede seleccionada y que no estén eliminados
  const tiposTourFiltrados = tiposTour.filter(tipo => {
    // Excluir tipos de tour eliminados
    if (tipo.eliminado) return false;
    
    // Si hay una sede seleccionada, mostrar solo los tipos de tour de esa sede
    if (selectedSede?.id_sede) {
      return tipo.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada, mostrar todos los tipos de tour no eliminados
    return true;
  });
  
  const handleEdit = (id: number) => {
    navigate(`/admin/horarios-tour/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/horarios-tour/${id}`);
  };
  
  // Función modificada para mostrar el modal de confirmación
  const handleDelete = (id: number) => {
    setHorarioIdToDelete(id);
    setShowDeleteModal(true);
  };
  
  // Función para confirmar la eliminación
  const confirmDelete = async () => {
    if (horarioIdToDelete) {
      try {
        await dispatch(eliminarHorarioTour(horarioIdToDelete)).unwrap();
        setShowDeleteModal(false);
        // Opcional: mostrar mensaje de éxito
        alert('Horario de tour eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar horario:', error);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/horarios-tour/nuevo');
  };
  
  // Formatear hora
  const formatHora = (hora: string) => {
    try {
      // Asegurar formato HH:MM:SS
      if (!hora) return '00:00';
      
      const parts = hora.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      return hora;
    } catch (e) {
      return hora || '00:00';
    }
  };
  
  // Obtener nombre del tipo de tour
  const getNombreTipoTour = (idTipoTour: number): string => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.nombre : `Tour #${idTipoTour}`;
  };
  
  // Verificar si un tipo de tour está eliminado
  const isTipoTourEliminado = (idTipoTour: number): boolean => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.eliminado : false;
  };
  
  // Columnas para la tabla
  const columns = [
    { 
      header: "Tipo de Tour",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiMapPin className="text-blue-600" />
          {getNombreTipoTour(row.id_tipo_tour)}
        </div>
      )
    },
    { 
      header: "Horario",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiClock className="text-gray-600" />
          {formatHora(row.hora_inicio)} - {formatHora(row.hora_fin)}
        </div>
      )
    },
    { 
      header: "Días",
      accessor: (row: any) => (
        <div className="grid grid-cols-7 gap-1 text-center">
          <div className="text-xs">
            {row.disponible_lunes ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>L</div>
          </div>
          <div className="text-xs">
            {row.disponible_martes ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>M</div>
          </div>
          <div className="text-xs">
            {row.disponible_miercoles ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>X</div>
          </div>
          <div className="text-xs">
            {row.disponible_jueves ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>J</div>
          </div>
          <div className="text-xs">
            {row.disponible_viernes ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>V</div>
          </div>
          <div className="text-xs">
            {row.disponible_sabado ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>S</div>
          </div>
          <div className="text-xs">
            {row.disponible_domingo ? <FiCheck className="h-4 w-4 text-green-600 mx-auto" /> : <FiX className="h-4 w-4 text-red-600 mx-auto" />}
            <div>D</div>
          </div>
        </div>
      )
    },
    { 
      header: "Acciones",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_horario)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <FiEye />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_horario)}
            className="p-2 rounded-full"
            title="Editar horario"
          >
            <FiEdit />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_horario)}
            className="p-2 rounded-full"
            title="Eliminar horario"
          >
            <FiTrash2 />
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
          <FiClock className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay horarios de tour disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroTipoTour || filtroDia !== 'todos'
            ? `No se encontraron horarios con los filtros seleccionados`
            : "Comienza agregando tu primer horario de tour"
          }
        </p>
        <Button 
          onClick={handleCreate}
          className="p-2 rounded-full mx-auto"
          title="Nuevo Horario"
        >
          <FiPlus />
        </Button>
      </div>
    );
  };
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <FiClock className="text-blue-600" />
          Gestión de Horarios de Tour
        </h3>
        <p className="text-sm text-gray-600">
          {selectedSede?.nombre ? `Sede: ${selectedSede.nombre}` : 'Todos los horarios de tour'}
        </p>
      </div>
      
      <div className="px-6 py-4">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <FiMapPin className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Tipo de Tour"
                name="filtroTipoTour"
                value={filtroTipoTour}
                onChange={(e) => setFiltroTipoTour(e.target.value)}
                className="pl-10"
              >
                <option value="">Todos los tipos de tour</option>
                {tiposTourFiltrados.map(tipo => (
                  <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour.toString()}>
                    {tipo.nombre}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <FiCalendar className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Día"
                name="filtroDia"
                value={filtroDia}
                onChange={(e) => setFiltroDia(e.target.value)}
                className="pl-10"
              >
                {diasSemana.map(dia => (
                  <option key={dia.valor} value={dia.valor}>
                    {dia.etiqueta}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-end">
              <Button 
                onClick={handleCreate}
                className="p-3 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                title="Crear nuevo horario"
              >
                <FiPlus />
              </Button>
            </div>
          </div>
        </div>
        
        {horariosFiltrados.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={horariosFiltrados}
            loading={loading}
            emptyMessage="No hay horarios de tour que mostrar" 
          />
        )}
      </div>

      {/* Modal de confirmación para eliminar */}
      <Modal
        isOpen={showDeleteModal}
        title="Confirmar Eliminación"
        onClose={() => setShowDeleteModal(false)}
      >
        <div className="p-4">
          <div className="flex items-center mb-4 text-red-600">
            <FiAlertCircle className="w-6 h-6 mr-2" />
            <h3 className="text-lg font-medium">¿Está seguro de que desea eliminar este horario de tour?</h3>
          </div>
          <p className="text-gray-500 text-sm mb-4">
            Esta acción no se puede deshacer. El horario se eliminará permanentemente del sistema.
          </p>
          <div className="flex justify-end mt-6 space-x-2">
            <Button 
              variant="secondary" 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteModal(false);
              }}
              type="button"
              className="z-50"
            >
              Cancelar
            </Button>
            <Button 
              variant="danger" 
              onClick={(e) => {
                e.stopPropagation();
                confirmDelete();
              }}
              type="button"
              className="z-50"
            >
              Eliminar
            </Button>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default HorarioTourList;