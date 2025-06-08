 /*

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchHorarioTourPorId, 
  crearHorarioTour, 
  actualizarHorarioTour, 
  clearErrors 
} from '../../../store/slices/horarioTourSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Select from '../../components/Select';
import { FiSave, FiArrowLeft, FiClock, FiMapPin, FiCalendar, FiCheck } from 'react-icons/fi';

interface HorarioTourFormProps {
  isEditing?: boolean;
}

const HorarioTourForm: React.FC<HorarioTourFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { horarioTourActual, loading, error, success } = useSelector((state: RootState) => state.horarioTour);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    id_tipo_tour: 0,
    id_sede: selectedSede?.id_sede || 0,
    hora_inicio: '09:00',
    hora_fin: '11:00',
    disponible_lunes: false,
    disponible_martes: false,
    disponible_miercoles: false,
    disponible_jueves: false,
    disponible_viernes: false,
    disponible_sabado: false,
    disponible_domingo: false,
    eliminado: false
  });
  
  // Cargar datos necesarios
  useEffect(() => {
    dispatch(fetchTiposTour());
    
    if (isEditing && id) {
      dispatch(fetchHorarioTourPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, isEditing, id]);
  
  // Actualizar formulario cuando se carga el horario existente
  useEffect(() => {
    if (isEditing && horarioTourActual) {
      setFormData({
        id_tipo_tour: horarioTourActual.id_tipo_tour,
        id_sede: horarioTourActual.id_sede,
        hora_inicio: horarioTourActual.hora_inicio,
        hora_fin: horarioTourActual.hora_fin,
        disponible_lunes: horarioTourActual.disponible_lunes,
        disponible_martes: horarioTourActual.disponible_martes,
        disponible_miercoles: horarioTourActual.disponible_miercoles,
        disponible_jueves: horarioTourActual.disponible_jueves,
        disponible_viernes: horarioTourActual.disponible_viernes,
        disponible_sabado: horarioTourActual.disponible_sabado,
        disponible_domingo: horarioTourActual.disponible_domingo,
        eliminado: horarioTourActual.eliminado
      });
    } else if (!isEditing && selectedSede) {
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede
      }));
    }
  }, [isEditing, horarioTourActual, selectedSede]);
  
  // Manejar redirección después del éxito
  useEffect(() => {
    if (success) {
      navigate('/admin/horarios-tour');
    }
  }, [success, navigate]);
  
  // Filtrar tipos de tour por sede seleccionada
  const tiposTourFiltrados = tiposTour.filter(tipo => {
    // Si hay una sede seleccionada, mostrar solo los tipos de tour de esa sede
    if (selectedSede?.id_sede) {
      return tipo.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada, mostrar todos los tipos de tour
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
    } else if (name === 'id_tipo_tour') {
      setFormData(prev => ({
        ...prev,
        [name]: parseInt(value)
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
    
    if (!formData.id_tipo_tour) {
      alert('Por favor seleccione un tipo de tour');
      return;
    }
    
    if (formData.hora_inicio >= formData.hora_fin) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
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
      id_sede: selectedSede?.id_sede || formData.id_sede
    };
    
    if (isEditing && id) {
      dispatch(actualizarHorarioTour({
        id: parseInt(id),
        horarioTour: dataToSubmit
      }));
    } else {
      dispatch(crearHorarioTour(dataToSubmit));
    }
  };
  
  // Obtener nombre del tipo de tour
  const getNombreTipoTour = (idTipoTour: number): string => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.nombre : '';
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
            <FiClock className="text-blue-600" />
            {isEditing ? 'Editar Horario de Tour' : 'Nuevo Horario de Tour'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing && formData.id_tipo_tour ? `Tipo: ${getNombreTipoTour(formData.id_tipo_tour)}` : 'Configure los detalles del horario'}
            {selectedSede?.nombre && ` - Sede: ${selectedSede.nombre}`}
          </p>
        </div>
        <Button 
           onClick={() => navigate('/admin/horarios-tour')}
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
              <FiMapPin className="text-blue-600" /> Tipo de Tour <span className="text-red-500">*</span>
            </label>
            <Select
              name="id_tipo_tour"
              value={formData.id_tipo_tour.toString()}
              onChange={handleChange}
              required
              disabled={loading}
              className={formData.id_tipo_tour === 0 ? "border-red-300" : ""}
            >
              <option value="0">Seleccione un tipo de tour</option>
              {tiposTourFiltrados.map(tipo => (
                <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour.toString()}>
                  {tipo.nombre}
                </option>
              ))}
            </Select>
            {tiposTourFiltrados.length === 0 && selectedSede && (
              <p className="text-sm text-red-500 mt-1">
                No hay tipos de tour disponibles para esta sede. Por favor, cree primero un tipo de tour.
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiClock className="text-blue-600" /> Hora de Inicio <span className="text-red-500">*</span>
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
              <FiClock className="text-blue-600" /> Hora de Fin <span className="text-red-500">*</span>
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
        
        <div className="mb-6">
          <label className="block mb-1 font-medium flex items-center gap-1">
            <FiCalendar className="text-blue-600" /> Días Disponibles <span className="text-red-500">*</span>
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
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
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
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/horarios-tour')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || tiposTourFiltrados.length === 0}
            className="flex items-center gap-1"
          >
            <FiSave /> {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HorarioTourForm;*/
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { 
  fetchHorarioTourPorId, 
  crearHorarioTour, 
  actualizarHorarioTour, 
  clearErrors 
} from '../../../store/slices/horarioTourSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import FormInput from '../../components/FormInput';
import Button from '../../components/Button';
import Card from '../../components/Card';
import Select from '../../components/Select';
import { FiSave, FiArrowLeft, FiClock, FiMapPin, FiCalendar, FiCheck } from 'react-icons/fi';

interface HorarioTourFormProps {
  isEditing?: boolean;
}

const HorarioTourForm: React.FC<HorarioTourFormProps> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { horarioTourActual, loading, error, success } = useSelector((state: RootState) => state.horarioTour);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [formData, setFormData] = useState({
    id_tipo_tour: 0,
    id_sede: selectedSede?.id_sede || 0,
    hora_inicio: '09:00',
    hora_fin: '11:00',
    disponible_lunes: false,
    disponible_martes: false,
    disponible_miercoles: false,
    disponible_jueves: false,
    disponible_viernes: false,
    disponible_sabado: false,
    disponible_domingo: false,
    eliminado: false
  });
  
  // Cargar datos necesarios
  useEffect(() => {
    dispatch(fetchTiposTour());
    
    if (isEditing && id) {
      dispatch(fetchHorarioTourPorId(parseInt(id)));
    }
    
    return () => {
      dispatch(clearErrors());
    };
  }, [dispatch, isEditing, id]);
  
  // Actualizar formulario cuando se carga el horario existente
  useEffect(() => {
    if (isEditing && horarioTourActual) {
      setFormData({
        id_tipo_tour: horarioTourActual.id_tipo_tour,
        id_sede: horarioTourActual.id_sede,
        hora_inicio: horarioTourActual.hora_inicio,
        hora_fin: horarioTourActual.hora_fin,
        disponible_lunes: horarioTourActual.disponible_lunes,
        disponible_martes: horarioTourActual.disponible_martes,
        disponible_miercoles: horarioTourActual.disponible_miercoles,
        disponible_jueves: horarioTourActual.disponible_jueves,
        disponible_viernes: horarioTourActual.disponible_viernes,
        disponible_sabado: horarioTourActual.disponible_sabado,
        disponible_domingo: horarioTourActual.disponible_domingo,
        eliminado: horarioTourActual.eliminado
      });
    } else if (!isEditing && selectedSede) {
      setFormData(prev => ({
        ...prev,
        id_sede: selectedSede.id_sede
      }));
    }
  }, [isEditing, horarioTourActual, selectedSede]);
  
  // Manejar redirección después del éxito
  useEffect(() => {
    if (success) {
      navigate('/admin/horarios-tour');
    }
  }, [success, navigate]);
  
  // Filtrar tipos de tour por sede seleccionada
  const tiposTourFiltrados = tiposTour.filter(tipo => {
    // Si hay una sede seleccionada, mostrar solo los tipos de tour de esa sede
    if (selectedSede?.id_sede) {
      return tipo.id_sede === selectedSede.id_sede;
    }
    // Si no hay sede seleccionada, mostrar todos los tipos de tour
    return true;
  });
  
  // Calcular hora_fin automáticamente basado en la duración del tipo de tour
  const calcularHoraFin = (idTipoTour: number, horaInicio: string): string => {
    // Buscar el tipo de tour seleccionado
    const tipoTourSeleccionado = tiposTour.find(tipo => tipo.id_tipo_tour === idTipoTour);
    
    if (!tipoTourSeleccionado || !tipoTourSeleccionado.duracion_minutos) {
      return horaInicio; // Si no hay duración, devolver la misma hora de inicio
    }
    
    try {
      // Convertir hora_inicio a Date para poder calcular
      const [horas, minutos] = horaInicio.split(':').map(Number);
      const fecha = new Date();
      fecha.setHours(horas, minutos, 0, 0);
      
      // Añadir la duración en minutos
      fecha.setMinutes(fecha.getMinutes() + tipoTourSeleccionado.duracion_minutos);
      
      // Formatear la nueva hora como HH:MM
      const horasFinales = fecha.getHours().toString().padStart(2, '0');
      const minutosFinales = fecha.getMinutes().toString().padStart(2, '0');
      
      return `${horasFinales}:${minutosFinales}`;
    } catch (error) {
      console.error('Error al calcular la hora de fin:', error);
      return horaInicio;
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else if (name === 'id_tipo_tour') {
      const idTipoTour = parseInt(value);
      
      // Actualizar el tipo de tour y calcular automáticamente la hora de fin
      setFormData(prev => {
        const nuevaHoraFin = calcularHoraFin(idTipoTour, prev.hora_inicio);
        
        return {
          ...prev,
          [name]: idTipoTour,
          hora_fin: nuevaHoraFin
        };
      });
    } else if (name === 'hora_inicio') {
      // Cuando cambia la hora de inicio, recalcular la hora de fin
      setFormData(prev => {
        const nuevaHoraFin = calcularHoraFin(prev.id_tipo_tour, value);
        
        return {
          ...prev,
          hora_inicio: value,
          hora_fin: nuevaHoraFin
        };
      });
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
    
    if (!formData.id_tipo_tour) {
      alert('Por favor seleccione un tipo de tour');
      return;
    }
    
    if (formData.hora_inicio >= formData.hora_fin) {
      alert('La hora de inicio debe ser anterior a la hora de fin');
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
      id_sede: selectedSede?.id_sede || formData.id_sede
    };
    
    if (isEditing && id) {
      dispatch(actualizarHorarioTour({
        id: parseInt(id),
        horarioTour: dataToSubmit
      }));
    } else {
      dispatch(crearHorarioTour(dataToSubmit));
    }
  };
  
  // Obtener nombre del tipo de tour
  const getNombreTipoTour = (idTipoTour: number): string => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.nombre : '';
  };
  
  // Obtener duración del tipo de tour
  const getDuracionTipoTour = (idTipoTour: number): number => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.duracion_minutos || 0 : 0;
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
  
  // Convertir minutos a formato legible
  const formatearDuracion = (minutos: number): string => {
    if (!minutos) return 'No especificada';
    
    const horas = Math.floor(minutos / 60);
    const minutosRestantes = minutos % 60;
    
    if (horas > 0 && minutosRestantes > 0) {
      return `${horas}h ${minutosRestantes}min`;
    } else if (horas > 0) {
      return `${horas} hora${horas > 1 ? 's' : ''}`;
    } else {
      return `${minutosRestantes} minutos`;
    }
  };
  
  return (
    <Card className="w-full">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FiClock className="text-blue-600" />
            {isEditing ? 'Editar Horario de Tour' : 'Nuevo Horario de Tour'}
          </h3>
          <p className="text-sm text-gray-600">
            {isEditing && formData.id_tipo_tour ? (
              <>
                Tipo: {getNombreTipoTour(formData.id_tipo_tour)}
                {getDuracionTipoTour(formData.id_tipo_tour) > 0 && 
                  ` - Duración: ${formatearDuracion(getDuracionTipoTour(formData.id_tipo_tour))}`
                }
              </>
            ) : (
              'Configure los detalles del horario'
            )}
            {selectedSede?.nombre && ` - Sede: ${selectedSede.nombre}`}
          </p>
        </div>
        <Button 
           onClick={() => navigate('/admin/horarios-tour')}
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
              <FiMapPin className="text-blue-600" /> Tipo de Tour <span className="text-red-500">*</span>
            </label>
            <Select
              name="id_tipo_tour"
              value={formData.id_tipo_tour.toString()}
              onChange={handleChange}
              required
              disabled={loading}
              className={formData.id_tipo_tour === 0 ? "border-red-300" : ""}
            >
              <option value="0">Seleccione un tipo de tour</option>
              {tiposTourFiltrados.map(tipo => (
                <option key={tipo.id_tipo_tour} value={tipo.id_tipo_tour.toString()}>
                  {tipo.nombre} {tipo.duracion_minutos ? `(${formatearDuracion(tipo.duracion_minutos)})` : ''}
                </option>
              ))}
            </Select>
            {tiposTourFiltrados.length === 0 && selectedSede && (
              <p className="text-sm text-red-500 mt-1">
                No hay tipos de tour disponibles para esta sede. Por favor, cree primero un tipo de tour.
              </p>
            )}
            {formData.id_tipo_tour > 0 && !getDuracionTipoTour(formData.id_tipo_tour) && (
              <p className="text-sm text-amber-600 mt-1">
                El tipo de tour seleccionado no tiene duración especificada. Por favor, configure la hora de fin manualmente.
              </p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block mb-1 font-medium flex items-center gap-1">
              <FiClock className="text-blue-600" /> Hora de Inicio <span className="text-red-500">*</span>
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
              <FiClock className="text-blue-600" /> Hora de Fin <span className="text-red-500">*</span>
              {formData.id_tipo_tour > 0 && getDuracionTipoTour(formData.id_tipo_tour) > 0 && (
                <span className="text-xs text-green-600 font-normal">
                  (Calculada automáticamente)
                </span>
              )}
            </label>
            <FormInput
              type="time"
              name="hora_fin"
              value={formData.hora_fin}
              onChange={handleChange}
              required
              disabled={loading || (formData.id_tipo_tour > 0 && getDuracionTipoTour(formData.id_tipo_tour) > 0)}
              className={formData.id_tipo_tour > 0 && getDuracionTipoTour(formData.id_tipo_tour) > 0 ? "bg-gray-100" : ""}
            />
            {formData.id_tipo_tour > 0 && getDuracionTipoTour(formData.id_tipo_tour) > 0 && (
              <p className="text-xs text-green-600 mt-1">
                Duración del tour: {formatearDuracion(getDuracionTipoTour(formData.id_tipo_tour))}
              </p>
            )}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="block mb-1 font-medium flex items-center gap-1">
            <FiCalendar className="text-blue-600" /> Días Disponibles <span className="text-red-500">*</span>
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
                      ? 'bg-blue-100 border-blue-300 text-blue-800' 
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
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/admin/horarios-tour')}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={loading || tiposTourFiltrados.length === 0}
            className="flex items-center gap-1"
          >
            <FiSave /> {isEditing ? 'Actualizar' : 'Guardar'}
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default HorarioTourForm;