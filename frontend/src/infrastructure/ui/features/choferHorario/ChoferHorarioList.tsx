 
// src/infrastructure/ui/features/choferHorario/ChoferHorarioList.tsx
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
  
  // Filtrar para mostrar solo activos si es necesario
  const horariosFiltrados = mostrarSoloActivos 
    ? horariosChofer.filter(horario => {
        const hoy = new Date();
        const fechaInicio = new Date(horario.fecha_inicio);
        const fechaFin = horario.fecha_fin ? new Date(horario.fecha_fin) : null;
        
        return !horario.eliminado && 
          fechaInicio <= hoy && 
          (!fechaFin || fechaFin >= hoy);
      })
    : horariosChofer;
  
  const handleEdit = (id: number) => {
    navigate(`/admin/horarios-chofer/editar/${id}`);
  };
  
  const handleView = (id: number) => {
    navigate(`/admin/horarios-chofer/${id}`);
  };
  
  const handleDelete = async (id: number) => {
    if (window.confirm('¿Está seguro de que desea eliminar este horario de chofer?')) {
      try {
        await dispatch(eliminarChoferHorario(id)).unwrap();
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
          {filtroChofer || filtroDia !== 'todos'
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
  
  const choferes = usuarios.filter(usuario => usuario.rol === 'CHOFER');
  
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
                {choferes.map(chofer => (
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
    </Card>
  );
};

export default ChoferHorarioList;