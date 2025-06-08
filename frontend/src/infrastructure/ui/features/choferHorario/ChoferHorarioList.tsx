 
/*
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchHorariosChofer, 
  eliminarChoferHorario,
  fetchHorariosChoferPorChofer,
  fetchHorariosChoferPorDia
} from '../../../store/slices/choferHorarioSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import { 
  FiClock, FiCalendar, FiUser, FiEye, FiEdit, FiTrash2, 
  FiPlus, FiFilter, FiCheck, FiX, FiHome, FiAlertCircle 
} from 'react-icons/fi';

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

const ChoferHorarioList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { horariosChofer, loading, error } = useSelector((state: RootState) => state.choferHorario);
  const { usuarios } = useSelector((state: RootState) => state.usuario);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [filtroChofer, setFiltroChofer] = useState<string>('');
  const [filtroDia, setFiltroDia] = useState<string>('todos');
  const [mostrarSoloActivos, setMostrarSoloActivos] = useState<boolean>(true);
  const [horariosFiltrados, setHorariosFiltrados] = useState<any[]>([]);
  
  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horarioIdToDelete, setHorarioIdToDelete] = useState<number | null>(null);
  
  // Cargar datos iniciales
  useEffect(() => {
    dispatch(fetchHorariosChofer());
  }, [dispatch]);
  
  // Manejar filtrado
  const handleFilterChange = () => {
    if (filtroChofer && filtroChofer !== 'todos') {
      dispatch(fetchHorariosChoferPorChofer(parseInt(filtroChofer)));
    } else if (filtroDia && filtroDia !== 'todos') {
      dispatch(fetchHorariosChoferPorDia(filtroDia));
    } else {
      dispatch(fetchHorariosChofer());
    }
  };
  
  useEffect(() => {
    handleFilterChange();
  }, [filtroChofer, filtroDia]);
  
  // Filtrar por sede y estado activo
  useEffect(() => {
    if (horariosChofer.length > 0) {
      // Primero filtramos por sede si hay una seleccionada
      let filtrados = horariosChofer;
      if (selectedSede?.id_sede) {
        filtrados = horariosChofer.filter(horario => 
          horario.id_sede === selectedSede.id_sede
        );
      }

      // Luego aplicamos el filtro de activos si está seleccionado
      if (mostrarSoloActivos) {
        const hoy = new Date();
        filtrados = filtrados.filter(horario => {
          const fechaInicio = new Date(horario.fecha_inicio);
          const fechaFin = horario.fecha_fin ? new Date(horario.fecha_fin) : null;
          
          return !horario.eliminado && 
            fechaInicio <= hoy && 
            (!fechaFin || fechaFin >= hoy);
        });
      }

      setHorariosFiltrados(filtrados);
    } else {
      setHorariosFiltrados([]);
    }
  }, [horariosChofer, selectedSede, mostrarSoloActivos]);
  
  const handleEdit = (id: number) => {
    navigate(`/admin/horarios-chofer/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/horarios-chofer/${id}`);
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
        await dispatch(eliminarChoferHorario(horarioIdToDelete)).unwrap();
        setShowDeleteModal(false);
        // Opcional: mostrar mensaje de éxito
        alert('Horario de chofer eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar horario:', error);
      }
    }
  };
  
  const handleCreate = () => {
    navigate('/admin/horarios-chofer/nuevo');
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
  
  // Formatear fecha
  const formatFecha = (fecha: string | null) => {
    if (!fecha) return 'No definida';
    
    try {
      const date = new Date(fecha);
      return new Intl.DateTimeFormat('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).format(date);
    } catch (e) {
      return fecha;
    }
  };
  
  // Obtener nombre del chofer
  const getNombreChofer = (idUsuario: number): string => {
    const chofer = usuarios.find(u => u.id_usuario === idUsuario);
    return chofer 
      ? `${chofer.nombres} ${chofer.apellidos}`
      : `Chofer #${idUsuario}`;
  };
  
  // Verificar si un horario está activo
  const isHorarioActivo = (horario: any): boolean => {
    const hoy = new Date();
    const fechaInicio = new Date(horario.fecha_inicio);
    const fechaFin = horario.fecha_fin ? new Date(horario.fecha_fin) : null;
    
    return fechaInicio <= hoy && (!fechaFin || fechaFin >= hoy);
  };
  
  // Filtrar choferes por sede seleccionada
  const choferesFiltrados = usuarios.filter(usuario => {
    // Primero filtrar por rol CHOFER
    if (usuario.rol !== 'CHOFER') return false;
    
    // Si hay una sede seleccionada, mostrar solo los choferes de esa sede
    if (selectedSede?.id_sede) {
      return usuario.id_sede === selectedSede.id_sede;
    }
    
    // Si no hay sede seleccionada, mostrar todos los choferes
    return true;
  });
  
  // Columnas para la tabla
  const columns = [
    { 
      header: "Chofer",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiUser className="text-green-600" />
          {getNombreChofer(row.id_usuario)}
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
      header: "Vigencia",
      accessor: (row: any) => (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <FiCalendar className="text-blue-600" />
            <span>Desde: {formatFecha(row.fecha_inicio)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="text-red-600" />
            <span>Hasta: {formatFecha(row.fecha_fin)}</span>
          </div>
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
      header: "Estado",
      accessor: (row: any) => {
        const activo = isHorarioActivo(row);
        return (
          <div className={`flex items-center gap-1 ${activo ? 'text-green-600' : 'text-red-600'}`}>
            {activo ? <FiCheck /> : <FiX />}
            <span>{activo ? 'Activo' : 'Inactivo'}</span>
          </div>
        );
      }
    },
    { 
      header: "Acciones",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_horario_chofer)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <FiEye />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_horario_chofer)}
            className="p-2 rounded-full"
            title="Editar horario"
          >
            <FiEdit />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_horario_chofer)}
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
          <FiUser className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay horarios de chofer disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroChofer || filtroDia !== 'todos' || selectedSede
            ? `No se encontraron horarios con los filtros seleccionados`
            : "Comienza agregando tu primer horario de chofer"
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
          <FiUser className="text-green-600" />
          Gestión de Horarios de Chofer
        </h3>
        <p className="text-sm text-gray-600">
          {selectedSede?.nombre ? `Sede: ${selectedSede.nombre}` : 'Todos los horarios de chofer'}
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
                <FiUser className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Chofer"
                name="filtroChofer"
                value={filtroChofer}
                onChange={(e) => setFiltroChofer(e.target.value)}
                className="pl-10"
              >
                <option value="">Todos los choferes</option>
                {choferesFiltrados.map(chofer => (
                  <option key={chofer.id_usuario} value={chofer.id_usuario.toString()}>
                    {chofer.nombres} {chofer.apellidos}
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
            
            <div className="flex items-end justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soloActivos"
                  checked={mostrarSoloActivos}
                  onChange={(e) => setMostrarSoloActivos(e.target.checked)}
                  className="mr-2"
                />
                <label htmlFor="soloActivos" className="text-sm text-gray-700">
                  Solo mostrar activos
                </label>
              </div>
              
              <Button 
                onClick={handleCreate}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white"
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
            emptyMessage="No hay horarios de chofer que mostrar" 
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
            <h3 className="text-lg font-medium">¿Está seguro de que desea eliminar este horario de chofer?</h3>
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

export default ChoferHorarioList; */

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchHorariosChofer, 
  eliminarChoferHorario,
  fetchHorariosChoferPorChofer,
  fetchHorariosChoferPorDia
} from '../../../store/slices/choferHorarioSlice';
import { fetchUsuarios } from '../../../store/slices/usuarioSlice';
import Card from '../../components/Card';
import Table from '../../components/Table';
import Button from '../../components/Button';
import Select from '../../components/Select';
import Modal from '../../components/Modal';
import { 
  FiClock, FiCalendar, FiUser, FiEye, FiEdit, FiTrash2, 
  FiPlus, FiFilter, FiCheck, FiX, FiHome, FiAlertCircle, FiLoader 
} from 'react-icons/fi';

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

const ChoferHorarioList: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  // Obtener datos del estado de Redux
  const { horariosChofer, loading: loadingHorarios, error: errorHorarios } = useSelector((state: RootState) => state.choferHorario);
  const { usuarios, loading: loadingUsuarios, error: errorUsuarios } = useSelector((state: RootState) => state.usuario);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  // Estados locales
  const [filtroChofer, setFiltroChofer] = useState<string>('');
  const [filtroDia, setFiltroDia] = useState<string>('todos');
  const [mostrarSoloActivos, setMostrarSoloActivos] = useState<boolean>(true);
  const [horariosFiltrados, setHorariosFiltrados] = useState<any[]>([]);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  
  // Estado para el modal de confirmación de eliminación
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [horarioIdToDelete, setHorarioIdToDelete] = useState<number | null>(null);
  
  // Control de carga inicial de datos
  const [initialLoadAttempted, setInitialLoadAttempted] = useState<boolean>(false);
  
  // Cargar datos iniciales - ahora incluye la carga de usuarios
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setInitialLoadAttempted(true);
        // Cargar usuarios primero
        if (usuarios.length === 0) {
          await dispatch(fetchUsuarios()).unwrap();
        }
        // Luego cargar horarios
        await dispatch(fetchHorariosChofer()).unwrap();
        setDataLoaded(true);
      } catch (error) {
        console.error("Error al cargar datos iniciales:", error);
      }
    };
    
    if (!initialLoadAttempted) {
      loadInitialData();
    }
  }, [dispatch, initialLoadAttempted, usuarios.length]);
  
  // Memoizamos los choferes filtrados para evitar recálculos innecesarios
  const choferesFiltrados = useMemo(() => {
    return usuarios.filter(usuario => {
      // Primero filtrar por rol CHOFER y que no esté eliminado
      if (usuario.rol !== 'CHOFER' || usuario.eliminado) return false;
      
      // Si hay una sede seleccionada, mostrar solo los choferes de esa sede
      if (selectedSede?.id_sede) {
        return usuario.id_sede === selectedSede.id_sede;
      }
      
      // Si no hay sede seleccionada, mostrar todos los choferes no eliminados
      return true;
    });
  }, [usuarios, selectedSede]);
  
  // Memoizamos los IDs de choferes activos para evitar recálculos innecesarios
  const choferesActivosIds = useMemo(() => {
    return choferesFiltrados.map(chofer => chofer.id_usuario);
  }, [choferesFiltrados]);
  
  // Manejar cambios en los filtros
  const applyFilters = useCallback(async () => {
    try {
      if (filtroChofer && filtroChofer !== 'todos') {
        await dispatch(fetchHorariosChoferPorChofer(parseInt(filtroChofer))).unwrap();
      } else if (filtroDia && filtroDia !== 'todos') {
        await dispatch(fetchHorariosChoferPorDia(filtroDia)).unwrap();
      } else {
        await dispatch(fetchHorariosChofer()).unwrap();
      }
    } catch (error) {
      console.error("Error al aplicar filtros:", error);
    }
  }, [dispatch, filtroChofer, filtroDia]);
  
  // Aplicar filtros cuando cambien y los datos estén cargados
  useEffect(() => {
    if (dataLoaded) {
      applyFilters();
    }
  }, [dataLoaded, applyFilters]);
  
  // Efecto para actualizar el estado cuando cambia el filtro de chofer
  useEffect(() => {
    if (dataLoaded) {
      applyFilters();
    }
  }, [filtroChofer, dataLoaded, applyFilters]);
  
  // Efecto para actualizar el estado cuando cambia el filtro de día
  useEffect(() => {
    if (dataLoaded) {
      applyFilters();
    }
  }, [filtroDia, dataLoaded, applyFilters]);
  
  // Filtrar los horarios localmente con los datos que ya tenemos
  useEffect(() => {
    // Solo proceder si ya tenemos datos cargados
    if (horariosChofer.length > 0 && usuarios.length > 0) {
      try {
        // Primero filtramos por choferes no eliminados
        let filtrados = horariosChofer.filter(horario => 
          choferesActivosIds.includes(horario.id_usuario)
        );
        
        // Luego filtramos por sede si hay una seleccionada
        if (selectedSede?.id_sede) {
          filtrados = filtrados.filter(horario => 
            horario.id_sede === selectedSede.id_sede
          );
        }

        // Luego aplicamos el filtro de activos si está seleccionado
        if (mostrarSoloActivos) {
          const hoy = new Date();
          filtrados = filtrados.filter(horario => {
            try {
              const fechaInicio = new Date(horario.fecha_inicio);
              const fechaFin = horario.fecha_fin ? new Date(horario.fecha_fin) : null;
              
              return !horario.eliminado && 
                fechaInicio <= hoy && 
                (!fechaFin || fechaFin >= hoy);
            } catch (error) {
              console.error("Error al procesar fechas para horario:", horario, error);
              return false;
            }
          });
        }

        setHorariosFiltrados(filtrados);
      } catch (error) {
        console.error("Error al filtrar horarios:", error);
        setHorariosFiltrados([]);
      }
    } else {
      setHorariosFiltrados([]);
    }
  }, [horariosChofer, usuarios, selectedSede, mostrarSoloActivos, choferesActivosIds]);
  
  // Manejadores de eventos
  const handleEdit = useCallback((id: number) => {
    navigate(`/admin/horarios-chofer/editar/${id}`);
  }, [navigate]);
  
  const handleView = useCallback((id: number) => {
    navigate(`/admin/horarios-chofer/${id}`);
  }, [navigate]);
  
  // Función modificada para mostrar el modal de confirmación
  const handleDelete = useCallback((id: number) => {
    setHorarioIdToDelete(id);
    setShowDeleteModal(true);
  }, []);
  
  // Función para confirmar la eliminación
  const confirmDelete = useCallback(async () => {
    if (horarioIdToDelete) {
      try {
        await dispatch(eliminarChoferHorario(horarioIdToDelete)).unwrap();
        setShowDeleteModal(false);
        // Actualizar datos después de eliminar
        dispatch(fetchHorariosChofer());
        // Mensaje de éxito
        alert('Horario de chofer eliminado con éxito');
      } catch (error) {
        console.error('Error al eliminar horario:', error);
        alert('Error al eliminar el horario. Inténtelo de nuevo.');
      }
    }
  }, [dispatch, horarioIdToDelete]);
  
  const handleCreate = useCallback(() => {
    navigate('/admin/horarios-chofer/nuevo');
  }, [navigate]);
  
  // Formatear hora
  const formatHora = useCallback((hora: string) => {
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
  }, []);
  
  // Formatear fecha
  const formatFecha = useCallback((fecha: string | null) => {
    if (!fecha) return 'No definida';
    
    try {
      const date = new Date(fecha);
      return new Intl.DateTimeFormat('es-ES', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit' 
      }).format(date);
    } catch (e) {
      return fecha;
    }
  }, []);
  
  // Obtener nombre del chofer - memoizado para evitar búsquedas repetidas
  const getNombreChofer = useCallback((idUsuario: number): string => {
    try {
      const chofer = usuarios.find(u => u.id_usuario === idUsuario && !u.eliminado);
      return chofer 
        ? `${chofer.nombres} ${chofer.apellidos}`
        : `Chofer #${idUsuario}`;
    } catch (error) {
      console.error("Error al obtener nombre de chofer:", error);
      return `Chofer #${idUsuario}`;
    }
  }, [usuarios]);
  
  // Verificar si un horario está activo
  const isHorarioActivo = useCallback((horario: any): boolean => {
    try {
      const hoy = new Date();
      const fechaInicio = new Date(horario.fecha_inicio);
      const fechaFin = horario.fecha_fin ? new Date(horario.fecha_fin) : null;
      
      return fechaInicio <= hoy && (!fechaFin || fechaFin >= hoy);
    } catch (error) {
      console.error("Error al verificar si el horario está activo:", error);
      return false;
    }
  }, []);
  
  // Columnas para la tabla - memoizadas para evitar recálculos innecesarios
  const columns = useMemo(() => [
    { 
      header: "Chofer",
      accessor: (row: any) => (
        <div className="flex items-center gap-1">
          <FiUser className="text-green-600" />
          {getNombreChofer(row.id_usuario)}
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
      header: "Vigencia",
      accessor: (row: any) => (
        <div>
          <div className="flex items-center gap-1 mb-1">
            <FiCalendar className="text-blue-600" />
            <span>Desde: {formatFecha(row.fecha_inicio)}</span>
          </div>
          <div className="flex items-center gap-1">
            <FiCalendar className="text-red-600" />
            <span>Hasta: {formatFecha(row.fecha_fin)}</span>
          </div>
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
      header: "Estado",
      accessor: (row: any) => {
        const activo = isHorarioActivo(row);
        return (
          <div className={`flex items-center gap-1 ${activo ? 'text-green-600' : 'text-red-600'}`}>
            {activo ? <FiCheck /> : <FiX />}
            <span>{activo ? 'Activo' : 'Inactivo'}</span>
          </div>
        );
      }
    },
    { 
      header: "Acciones",
      accessor: (row: any) => (
        <div className="flex gap-2">
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => handleView(row.id_horario_chofer)}
            className="p-2 rounded-full"
            title="Ver detalles"
          >
            <FiEye />
          </Button>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={() => handleEdit(row.id_horario_chofer)}
            className="p-2 rounded-full"
            title="Editar horario"
          >
            <FiEdit />
          </Button>
          <Button 
            variant="danger" 
            size="sm" 
            onClick={() => handleDelete(row.id_horario_chofer)}
            className="p-2 rounded-full"
            title="Eliminar horario"
          >
            <FiTrash2 />
          </Button>
        </div>
      )
    },
  ], [getNombreChofer, formatHora, formatFecha, isHorarioActivo, handleView, handleEdit, handleDelete]);

  // Estado de carga
  const isLoading = loadingHorarios || loadingUsuarios || !dataLoaded;
  const hasError = errorHorarios || errorUsuarios;
  
  // Renderizar contenido cuando no hay datos
  const renderEmptyState = () => {
    if (isLoading) {
      return (
        <div className="text-center py-12">
          <div className="flex justify-center mb-4 text-blue-500 animate-spin">
            <FiLoader className="w-12 h-12" />
          </div>
          <p className="text-gray-600">Cargando datos...</p>
        </div>
      );
    }

    return (
      <div className="text-center py-12 text-gray-500">
        <div className="flex justify-center mb-4 text-gray-300">
          <FiUser className="w-16 h-16" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No hay horarios de chofer disponibles
        </h3>
        <p className="text-gray-500 mb-4">
          {filtroChofer || filtroDia !== 'todos' || mostrarSoloActivos
            ? `No se encontraron horarios con los filtros seleccionados`
            : "Comienza agregando tu primer horario de chofer"
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
          <FiUser className="text-green-600" />
          Gestión de Horarios de Chofer
        </h3>
        {selectedSede && (
          <p className="text-sm text-gray-600">
            Sede: {selectedSede.nombre}
          </p>
        )}
      </div>
      
      <div className="px-6 py-4">
        {hasError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {errorHorarios || errorUsuarios || "Ocurrió un error al cargar los datos. Por favor, intente de nuevo."}
          </div>
        )}
        
        <div className="filters mb-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <div className="absolute left-3 top-8 pointer-events-none z-10">
                <FiUser className="text-gray-400" />
              </div>
              <Select
                label="Filtrar por Chofer"
                name="filtroChofer"
                value={filtroChofer}
                onChange={(e) => setFiltroChofer(e.target.value)}
                className="pl-10"
                disabled={isLoading}
              >
                <option value="">Todos los choferes</option>
                {choferesFiltrados.map(chofer => (
                  <option key={chofer.id_usuario} value={chofer.id_usuario.toString()}>
                    {chofer.nombres} {chofer.apellidos}
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
                disabled={isLoading}
              >
                {diasSemana.map(dia => (
                  <option key={dia.valor} value={dia.valor}>
                    {dia.etiqueta}
                  </option>
                ))}
              </Select>
            </div>
            
            <div className="flex items-end justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="soloActivos"
                  checked={mostrarSoloActivos}
                  onChange={(e) => setMostrarSoloActivos(e.target.checked)}
                  className="mr-2"
                  disabled={isLoading}
                />
                <label htmlFor="soloActivos" className="text-sm text-gray-700">
                  Solo mostrar activos
                </label>
              </div>
              
              <Button 
                onClick={handleCreate}
                className="p-3 rounded-full bg-green-600 hover:bg-green-700 text-white"
                title="Crear nuevo horario"
                disabled={isLoading}
              >
                <FiPlus />
              </Button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4 text-blue-500 animate-spin">
              <FiLoader className="w-12 h-12" />
            </div>
            <p className="text-gray-600">Cargando datos...</p>
          </div>
        ) : horariosFiltrados.length === 0 ? (
          renderEmptyState()
        ) : (
          <Table
            columns={columns}
            data={horariosFiltrados}
            loading={isLoading}
            emptyMessage="No hay horarios de chofer que mostrar" 
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
            <h3 className="text-lg font-medium">¿Está seguro de que desea eliminar este horario de chofer?</h3>
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

export default ChoferHorarioList;