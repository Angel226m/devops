// src/infrastructure/ui/features/choferHorario/ChoferHorarioForm.tsx
/*import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchChoferHorarioPorId, 
  crearChoferHorario, 
  actualizarChoferHorario, 
  clearErrors 
} from '../../../store/slices/choferHorarioSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Select from '../../components/Select';
import { 
  FiSave, FiArrowLeft, FiClock, FiUser, FiCalendar, 
  FiCheck, FiHome, FiAlertCircle, FiInfo 
} from 'react-icons/fi';

interface ChoferHorarioFormProps {
  isEditing?: boolean;
}

const ChoferHorarioForm: React.FC<ChoferHorarioFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { horarioChoferActual, loading, error, success } = useSelector((state: RootState) => state.choferHorario);
  const { usuarios } = useSelector((state: RootState) => state.usuario);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  const [formData, setFormData] = useState({
    id_usuario: 0,
    id_sede: selectedSede?.id_sede || 0,
    hora_inicio: '08:00',
    hora_fin: '17:00',
    disponible_lunes: true,
    disponible_martes: true,
    disponible_miercoles: true,
    disponible_jueves: true,
    disponible_viernes: true,
    disponible_sabado: false,
    disponible_domingo: false,
    fecha_inicio: hoy,
    fecha_fin: '',
    eliminado: false
  });
  
  // Función para formatear fechas para la API
  const formatDateForAPI = (dateStr: string): string => {
    if (!dateStr) return ''; // Retorna string vacío en lugar de null
    // Convertir de YYYY-MM-DD a YYYY-MM-DDT00:00:00Z
    return `${dateStr}T00:00:00Z`;
  };
  
  // Función para parsear fechas de la API al formato del input date
  const parseApiDate = (isoDateStr: string | null): string => {
    if (!isoDateStr) return '';
    try {
      // Si ya tiene una T, extrae solo la parte de la fecha
      if (isoDateStr.includes('T')) {
        return isoDateStr.split('T')[0];
      }
      return isoDateStr; // Si no tiene T, devuelve como está
    } catch (e) {
      console.error("Error parsing date:", e);
      return '';
    }
  };
  
  // Cargar datos necesarios
  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchChoferHorarioPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, isEditing, id]);
  
  // Actualizar formulario cuando se carga el horario existente
  useEffect(() => {
    if (isEditing && horarioChoferActual) {
      setFormData({
        id_usuario: horarioChoferActual.id_usuario,
        id_sede: horarioChoferActual.id_sede,
        hora_inicio: horarioChoferActual.hora_inicio,
        hora_fin: horarioChoferActual.hora_fin,
        disponible_lunes: horarioChoferActual.disponible_lunes,
        disponible_martes: horarioChoferActual.disponible_martes,
        disponible_miercoles: horarioChoferActual.disponible_miercoles,
        disponible_jueves: horarioChoferActual.disponible_jueves,
        disponible_viernes: horarioChoferActual.disponible_viernes,
        disponible_sabado: horarioChoferActual.disponible_sabado,
        disponible_domingo: horarioChoferActual.disponible_domingo,
        fecha_inicio: parseApiDate(horarioChoferActual.fecha_inicio),
        fecha_fin: parseApiDate(horarioChoferActual.fecha_fin),
        eliminado: horarioChoferActual.eliminado
      });
    } else if (!isEditing && selectedSede) {
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede
      }));
    }
  }, [isEditing, horarioChoferActual, selectedSede]);
  
  // Manejar redirección después del éxito
  useEffect(() => {
    if (success) {
      navigate('/admin/horarios-chofer');
    }
  }, [success, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'id_usuario' || name === 'id_sede') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleToggleDia = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      [dia]: !prev[dia as keyof typeof prev]
    }));
  };
  
  const handleQuickSelectDias = (option: string) => {
    if (option === 'todos') {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: true,
        disponible_domingo: true
      }));
    } else if (option === 'semana') {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: false,
        disponible_domingo: false
      }));
    } else if (option === 'finsemana') {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: false,
        disponible_martes: false,
        disponible_miercoles: false,
        disponible_jueves: false,
        disponible_viernes: false,
        disponible_sabado: true,
        disponible_domingo: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: false,
        disponible_martes: false,
        disponible_miercoles: false,
        disponible_jueves: false,
        disponible_viernes: false,
        disponible_sabado: false,
        disponible_domingo: false
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_usuario) {
      alert('Por favor seleccione un chofer');
      return;
    }
    
    if (formData.hora_inicio >= formData.hora_fin) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }
    
    if (!formData.fecha_inicio) {
      alert('Por favor seleccione una fecha de inicio');
      return;
    }
    
    if (formData.fecha_fin && new Date(formData.fecha_fin) <= new Date(formData.fecha_inicio)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }
    
    const hasSelectedDays = 
      formData.disponible_lunes || 
      formData.disponible_martes || 
      formData.disponible_miercoles || 
      formData.disponible_jueves || 
      formData.disponible_viernes || 
      formData.disponible_sabado || 
      formData.disponible_domingo;
      
    if (!hasSelectedDays) {
      alert('Por favor seleccione al menos un día de la semana');
      return;
    }
    
    // Preparamos los datos con el formato correcto para la API
    if (isEditing && id) {
      const dataToSubmit = {
        ...formData,
        fecha_inicio: formatDateForAPI(formData.fecha_inicio),
        fecha_fin: formData.fecha_fin ? formatDateForAPI(formData.fecha_fin) : ''
      };
      
      dispatch(actualizarChoferHorario({
        id: parseInt(id),
        choferHorario: dataToSubmit
      }));
    } else {
      const dataToSubmit = {
        ...formData,
        fecha_inicio: formatDateForAPI(formData.fecha_inicio),
        fecha_fin: formData.fecha_fin ? formatDateForAPI(formData.fecha_fin) : ''
      };
      
      dispatch(crearChoferHorario(dataToSubmit));
    }
  };
  
  // Obtener nombre del chofer
  const getNombreChofer = (idUsuario: number): string => {
    const usuario = usuarios.find(u => u.id_usuario === idUsuario);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : '';
  };
  
  const choferes = usuarios.filter(usuario => usuario.rol === 'CHOFER');
  
  const diasSemana = [
    { id: 'disponible_lunes', nombre: 'Lunes', abrev: 'L' },
    { id: 'disponible_martes', nombre: 'Martes', abrev: 'M' },
    { id: 'disponible_miercoles', nombre: 'Miércoles', abrev: 'X' },
    { id: 'disponible_jueves', nombre: 'Jueves', abrev: 'J' },
    { id: 'disponible_viernes', nombre: 'Viernes', abrev: 'V' },
    { id: 'disponible_sabado', nombre: 'Sábado', abrev: 'S' },
    { id: 'disponible_domingo', nombre: 'Domingo', abrev: 'D' }
  ];
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FiUser className="text-green-600" />
            {isEditing ? 'Editar Horario de Chofer' : 'Nuevo Horario de Chofer'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing && formData.id_usuario ? `Chofer: ${getNombreChofer(formData.id_usuario)}` : 'Configure los detalles del horario'}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/admin/horarios-chofer')}
          className="flex items-center gap-1"
        >
          <FiArrowLeft /> Volver
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiUser className="text-green-600" /> Chofer <span className="text-red-500">*</span>
            </label>
            <Select
              name="id_usuario"
              value={formData.id_usuario.toString()}
              onChange={handleChange}
              required
              disabled={loading}
              className={formData.id_usuario === 0 ? "border-red-300" : ""}
            >
              <option value="0">Seleccione un chofer</option>
              {choferes.map(chofer => (
                <option key={chofer.id_usuario} value={chofer.id_usuario.toString()}>
                  {chofer.nombres} {chofer.apellidos}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiHome className="text-green-600" /> Sede
            </label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded border border-gray-200">
              {selectedSede?.nombre || 'Sede no seleccionada'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiClock className="text-green-600" /> Hora de Inicio <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiClock className="text-green-600" /> Hora de Fin <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="time"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiCalendar className="text-green-600" /> Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
              min={isEditing ? undefined : hoy}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiCalendar className="text-red-600" /> Fecha de Fin
              <span className="text-xs text-gray-500 ml-2">(opcional)</span>
            </label>
            <FormInput
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              min={formData.fecha_inicio || hoy}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Si no se especifica, el horario no tendrá fecha de expiración.</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium flex items-center gap-1">
            <FiCalendar className="text-green-600" /> Días Disponibles <span className="text-red-500">*</span>
          </label>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleQuickSelectDias('todos')}
              >
                Todos los días
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => handleQuickSelectDias('semana')}
              >
                Días laborables
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={() => handleQuickSelectDias('finsemana')}
              >
                Fin de semana
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => handleQuickSelectDias('ninguno')}
              >
                Ninguno
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {diasSemana.map(dia => (
                <div 
                  key={dia.id} 
                  className={`
                    p-3 rounded-md text-center cursor-pointer transition-colors border
                    ${formData[dia.id as keyof typeof formData] 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}
                  `}
                  onClick={() => handleToggleDia(dia.id)}
                >
                  <div className="flex justify-center mb-1">
                    {formData[dia.id as keyof typeof formData] && <FiCheck className="text-green-600" />}
                  </div>
                  <div className="font-medium">{dia.abrev}</div>
                  <div className="text-xs">{dia.nombre}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="eliminado"
                checked={formData.eliminado}
                onChange={handleChange}
              />
              <span>Marcar como Eliminado</span>
            </label>
          </div>
        )}
        
        <div className="p-4 border-l-4 border-blue-400 bg-blue-50 text-blue-800 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FiInfo className="text-blue-600" />
            <strong>Información importante</strong>
          </div>
          <p className="text-sm">
            Este horario define la disponibilidad del chofer para ser asignado a tours programados. 
            Asegúrese de que el horario no se superponga con otros ya existentes para el mismo chofer en las mismas fechas.
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/horarios-chofer')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading}
            className="flex items-center gap-1"
          >
            <FiSave /> {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChoferHorarioForm;*/


import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchChoferHorarioPorId, 
  crearChoferHorario, 
  actualizarChoferHorario, 
  clearErrors 
} from '../../../store/slices/choferHorarioSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Select from '../../components/Select';
import { 
  FiSave, FiArrowLeft, FiClock, FiUser, FiCalendar, 
  FiCheck, FiHome, FiAlertCircle, FiInfo 
} from 'react-icons/fi';

interface ChoferHorarioFormProps {
  isEditing?: boolean;
}

const ChoferHorarioForm: React.FC<ChoferHorarioFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { horarioChoferActual, loading, error, success } = useSelector((state: RootState) => state.choferHorario);
  const { usuarios } = useSelector((state: RootState) => state.usuario);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const hoy = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
  
  const [formData, setFormData] = useState({
    id_usuario: 0,
    id_sede: selectedSede?.id_sede || 0,
    hora_inicio: '08:00',
    hora_fin: '17:00',
    disponible_lunes: true,
    disponible_martes: true,
    disponible_miercoles: true,
    disponible_jueves: true,
    disponible_viernes: true,
    disponible_sabado: false,
    disponible_domingo: false,
    fecha_inicio: hoy,
    fecha_fin: '',
    eliminado: false
  });
  
  // Función para formatear fechas para la API
  const formatDateForAPI = (dateStr: string): string => {
    if (!dateStr) return ''; // Retorna string vacío en lugar de null
    // Convertir de YYYY-MM-DD a YYYY-MM-DDT00:00:00Z
    return `${dateStr}T00:00:00Z`;
  };
  
  // Función para parsear fechas de la API al formato del input date
  const parseApiDate = (isoDateStr: string | null): string => {
    if (!isoDateStr) return '';
    try {
      // Si ya tiene una T, extrae solo la parte de la fecha
      if (isoDateStr.includes('T')) {
        return isoDateStr.split('T')[0];
      }
      return isoDateStr; // Si no tiene T, devuelve como está
    } catch (e) {
      console.error("Error parsing date:", e);
      return '';
    }
  };
  
  // Cargar datos necesarios
  useEffect(() => {
    if (isEditing && id) {
      dispatch(fetchChoferHorarioPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, isEditing, id]);
  
  // Actualizar formulario cuando se carga el horario existente
  useEffect(() => {
    if (isEditing && horarioChoferActual) {
      setFormData({
        id_usuario: horarioChoferActual.id_usuario,
        id_sede: horarioChoferActual.id_sede,
        hora_inicio: horarioChoferActual.hora_inicio,
        hora_fin: horarioChoferActual.hora_fin,
        disponible_lunes: horarioChoferActual.disponible_lunes,
        disponible_martes: horarioChoferActual.disponible_martes,
        disponible_miercoles: horarioChoferActual.disponible_miercoles,
        disponible_jueves: horarioChoferActual.disponible_jueves,
        disponible_viernes: horarioChoferActual.disponible_viernes,
        disponible_sabado: horarioChoferActual.disponible_sabado,
        disponible_domingo: horarioChoferActual.disponible_domingo,
        fecha_inicio: parseApiDate(horarioChoferActual.fecha_inicio),
        fecha_fin: parseApiDate(horarioChoferActual.fecha_fin),
        eliminado: horarioChoferActual.eliminado
      });
    } else if (!isEditing && selectedSede) {
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede
      }));
    }
  }, [isEditing, horarioChoferActual, selectedSede]);
  
  // Manejar redirección después del éxito
  useEffect(() => {
    if (success) {
      navigate('/admin/horarios-chofer');
    }
  }, [success, navigate]);
  
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
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'id_usuario' || name === 'id_sede') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value) || 0
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleToggleDia = (dia: string) => {
    setFormData(prev => ({
      ...prev,
      [dia]: !prev[dia as keyof typeof prev]
    }));
  };
  
  const handleQuickSelectDias = (option: string) => {
    if (option === 'todos') {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: true,
        disponible_domingo: true
      }));
    } else if (option === 'semana') {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: true,
        disponible_martes: true,
        disponible_miercoles: true,
        disponible_jueves: true,
        disponible_viernes: true,
        disponible_sabado: false,
        disponible_domingo: false
      }));
    } else if (option === 'finsemana') {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: false,
        disponible_martes: false,
        disponible_miercoles: false,
        disponible_jueves: false,
        disponible_viernes: false,
        disponible_sabado: true,
        disponible_domingo: true
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        disponible_lunes: false,
        disponible_martes: false,
        disponible_miercoles: false,
        disponible_jueves: false,
        disponible_viernes: false,
        disponible_sabado: false,
        disponible_domingo: false
      }));
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.id_usuario) {
      alert('Por favor seleccione un chofer');
      return;
    }
    
    if (formData.hora_inicio >= formData.hora_fin) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
      return;
    }
    
    if (!formData.fecha_inicio) {
      alert('Por favor seleccione una fecha de inicio');
      return;
    }
    
    if (formData.fecha_fin && new Date(formData.fecha_fin) <= new Date(formData.fecha_inicio)) {
      alert('La fecha de fin debe ser posterior a la fecha de inicio');
      return;
    }
    
    const hasSelectedDays = 
      formData.disponible_lunes || 
      formData.disponible_martes || 
      formData.disponible_miercoles || 
      formData.disponible_jueves || 
      formData.disponible_viernes || 
      formData.disponible_sabado || 
      formData.disponible_domingo;
      
    if (!hasSelectedDays) {
      alert('Por favor seleccione al menos un día de la semana');
      return;
    }
    
    // Asegurarse de que se envía la sede seleccionada
    const dataToSubmit = {
      ...formData,
      id_sede: selectedSede?.id_sede || formData.id_sede,
      fecha_inicio: formatDateForAPI(formData.fecha_inicio),
      fecha_fin: formData.fecha_fin ? formatDateForAPI(formData.fecha_fin) : ''
    };
    
    if (isEditing && id) {
      dispatch(actualizarChoferHorario({
        id: parseInt(id),
        choferHorario: dataToSubmit
      }));
    } else {
      dispatch(crearChoferHorario(dataToSubmit));
    }
  };
  
  // Obtener nombre del chofer
  const getNombreChofer = (idUsuario: number): string => {
    const usuario = usuarios.find(u => u.id_usuario === idUsuario);
    return usuario ? `${usuario.nombres} ${usuario.apellidos}` : '';
  };
  
  const diasSemana = [
    { id: 'disponible_lunes', nombre: 'Lunes', abrev: 'L' },
    { id: 'disponible_martes', nombre: 'Martes', abrev: 'M' },
    { id: 'disponible_miercoles', nombre: 'Miércoles', abrev: 'X' },
    { id: 'disponible_jueves', nombre: 'Jueves', abrev: 'J' },
    { id: 'disponible_viernes', nombre: 'Viernes', abrev: 'V' },
    { id: 'disponible_sabado', nombre: 'Sábado', abrev: 'S' },
    { id: 'disponible_domingo', nombre: 'Domingo', abrev: 'D' }
  ];
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FiUser className="text-green-600" />
            {isEditing ? 'Editar Horario de Chofer' : 'Nuevo Horario de Chofer'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing && formData.id_usuario ? `Chofer: ${getNombreChofer(formData.id_usuario)}` : 'Configure los detalles del horario'}
            {selectedSede?.nombre && ` - Sede: ${selectedSede.nombre}`}
          </p>
        </div>
        <Button 
          onClick={() => navigate('/admin/horarios-chofer')}
          className="flex items-center gap-1"
        >
          <FiArrowLeft /> Volver
        </Button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 text-red-700">
            <strong>Error:</strong> {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiUser className="text-green-600" /> Chofer <span className="text-red-500">*</span>
            </label>
            <Select
              name="id_usuario"
              value={formData.id_usuario.toString()}
              onChange={handleChange}
              required
              disabled={loading}
              className={formData.id_usuario === 0 ? "border-red-300" : ""}
            >
              <option value="0">Seleccione un chofer</option>
              {choferesFiltrados.map(chofer => (
                <option key={chofer.id_usuario} value={chofer.id_usuario.toString()}>
                  {chofer.nombres} {chofer.apellidos}
                </option>
              ))}
            </Select>
            {choferesFiltrados.length === 0 && selectedSede && (
              <p className="text-sm text-red-500 mt-1">
                No hay choferes disponibles para esta sede. Por favor, asigne choferes a esta sede primero.
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiHome className="text-green-600" /> Sede
            </label>
            <p className="text-gray-700 bg-gray-100 p-2 rounded border border-gray-200">
              {selectedSede?.nombre || 'Sede no seleccionada'}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiClock className="text-green-600" /> Hora de Inicio <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="time"
              name="hora_inicio"
              value={formData.hora_inicio}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiClock className="text-green-600" /> Hora de Fin <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="time"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiCalendar className="text-green-600" /> Fecha de Inicio <span className="text-red-500">*</span>
            </label>
            <FormInput
              type="date"
              name="fecha_inicio"
              value={formData.fecha_inicio}
              onChange={handleChange}
              required
              min={isEditing ? undefined : hoy}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiCalendar className="text-red-600" /> Fecha de Fin
              <span className="text-xs text-gray-500 ml-2">(opcional)</span>
            </label>
            <FormInput
              type="date"
              name="fecha_fin"
              value={formData.fecha_fin}
              onChange={handleChange}
              min={formData.fecha_inicio || hoy}
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Si no se especifica, el horario no tendrá fecha de expiración.</p>
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium flex items-center gap-1">
            <FiCalendar className="text-green-600" /> Días Disponibles <span className="text-red-500">*</span>
          </label>
          
          <div className="bg-gray-50 p-4 rounded-md border border-gray-200">
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={() => handleQuickSelectDias('todos')}
              >
                Todos los días
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-green-600 text-white rounded-md hover:bg-green-700"
                onClick={() => handleQuickSelectDias('semana')}
              >
                Días laborables
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-purple-600 text-white rounded-md hover:bg-purple-700"
                onClick={() => handleQuickSelectDias('finsemana')}
              >
                Fin de semana
              </button>
              <button 
                type="button" 
                className="px-3 py-1 text-xs bg-gray-600 text-white rounded-md hover:bg-gray-700"
                onClick={() => handleQuickSelectDias('ninguno')}
              >
                Ninguno
              </button>
            </div>
            
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
              {diasSemana.map(dia => (
                <div 
                  key={dia.id} 
                  className={`
                    p-3 rounded-md text-center cursor-pointer transition-colors border
                    ${formData[dia.id as keyof typeof formData] 
                      ? 'bg-green-100 border-green-300 text-green-800' 
                      : 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-200'}
                  `}
                  onClick={() => handleToggleDia(dia.id)}
                >
                  <div className="flex justify-center mb-1">
                    {formData[dia.id as keyof typeof formData] && <FiCheck className="text-green-600" />}
                  </div>
                  <div className="font-medium">{dia.abrev}</div>
                  <div className="text-xs">{dia.nombre}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {isEditing && (
          <div className="mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="eliminado"
                checked={formData.eliminado}
                onChange={handleChange}
              />
              <span>Marcar como Eliminado</span>
            </label>
          </div>
        )}
        
        <div className="p-4 border-l-4 border-blue-400 bg-blue-50 text-blue-800 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <FiInfo className="text-blue-600" />
            <strong>Información importante</strong>
          </div>
          <p className="text-sm">
            Este horario define la disponibilidad del chofer para ser asignado a tours programados. 
            Asegúrese de que el horario no se superponga con otros ya existentes para el mismo chofer en las mismas fechas.
          </p>
        </div>
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/horarios-chofer')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || choferesFiltrados.length === 0}
            className="flex items-center gap-1"
          >
            <FiSave /> {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ChoferHorarioForm;