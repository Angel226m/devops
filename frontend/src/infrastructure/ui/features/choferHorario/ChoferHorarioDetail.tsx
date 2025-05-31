 
// src/infrastructure/ui/features/choferHorario/ChoferHorarioDetail.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchChoferHorarioPorId } from '../../../store/slices/choferHorarioSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  FiClock, FiUser, FiCalendar, FiEdit, 
  FiArrowLeft, FiCheck, FiX, FiTag, FiHome, 
  FiAlertCircle, FiInfo
} from 'react-icons/fi';

const ChoferHorarioDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { horarioChoferActual, loading, error } = useSelector((state: RootState) => state.choferHorario);
  const { usuarios } = useSelector((state: RootState) => state.usuario);
  const { sedes } = useSelector((state: RootState) => state.sede);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchChoferHorarioPorId(parseInt(id)));
    }
  }, [dispatch, id]);
  
  if (loading) {
    return (
      <Card>
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        </div>
      </Card>
    );
  }
  
  if (error || !horarioChoferActual) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {error || 'No se pudo cargar el horario de chofer'}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/admin/horarios-chofer')}
              className="flex items-center gap-1"
            >
              <FiArrowLeft /> Volver a la lista
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  const getNombreChofer = (idUsuario: number): string => {
    const usuario = usuarios.find(u => u.id_usuario === idUsuario);
    return usuario 
      ? `${usuario.nombres} ${usuario.apellidos}`
      : `Usuario #${idUsuario}`;
  };
  
  const getNombreSede = (idSede: number): string => {
    const sede = sedes.find(s => s.id_sede === idSede);
    return sede ? sede.nombre : `Sede #${idSede}`;
  };
  
  const formatHora = (hora: string) => {
    try {
      const parts = hora.split(':');
      if (parts.length >= 2) {
        return `${parts[0].padStart(2, '0')}:${parts[1].padStart(2, '0')}`;
      }
      return hora;
    } catch (e) {
      return hora || '--:--';
    }
  };
  
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
  
  // Verificar si el horario está activo actualmente
  const isHorarioActivo = (): boolean => {
    const hoy = new Date();
    const fechaInicio = new Date(horarioChoferActual.fecha_inicio);
    const fechaFin = horarioChoferActual.fecha_fin ? new Date(horarioChoferActual.fecha_fin) : null;
    
    return !horarioChoferActual.eliminado && 
      fechaInicio <= hoy && 
      (!fechaFin || fechaFin >= hoy);
  };
  
  const DiaSemana = ({ disponible, dia }: { disponible: boolean, dia: string }) => (
    <div className="flex items-center gap-2">
      {disponible ? 
        <FiCheck className="text-green-600" /> : 
        <FiX className="text-red-500" />}
      <span>{dia}</span>
    </div>
  );
  
  return (
    <Card>
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
            <FiUser className="text-green-600" />
            Detalles del Horario de Chofer
          </h3>
          <p className="text-sm text-gray-600">
            {getNombreChofer(horarioChoferActual.id_usuario)} - {formatHora(horarioChoferActual.hora_inicio)} a {formatHora(horarioChoferActual.hora_fin)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
             onClick={() => navigate('/admin/horarios-chofer')}
            className="flex items-center gap-1"
          >
            <FiArrowLeft /> Volver
          </Button>
          <Button
             onClick={() => navigate(`/admin/horarios-chofer/editar/${id}`)}
            className="flex items-center gap-1"
          >
            <FiEdit /> Editar
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="mb-6">
          {isHorarioActivo() ? (
            <div className="p-3 bg-green-100 border-l-4 border-green-500 text-green-800 rounded-sm flex items-center gap-2">
              <FiCheck className="text-green-600" />
              <span>Este horario está actualmente activo</span>
            </div>
          ) : (
            <div className="p-3 bg-red-100 border-l-4 border-red-500 text-red-800 rounded-sm flex items-center gap-2">
              <FiAlertCircle className="text-red-600" />
              <span>
                {horarioChoferActual.eliminado ? 
                  'Este horario ha sido eliminado' : 
                  'Este horario no está activo en la fecha actual'
                }
              </span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-green-50 px-4 py-2 border-b border-green-100 font-medium text-green-700 flex items-center gap-2">
                <FiUser />
                Información del Chofer
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiUser className="text-green-600" /> Nombre
                  </div>
                  <div className="w-2/3 font-medium">
                    {getNombreChofer(horarioChoferActual.id_usuario)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiHome className="text-green-600" /> Sede
                  </div>
                  <div className="w-2/3 font-medium">
                    {getNombreSede(horarioChoferActual.id_sede)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden mt-6">
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 font-medium text-blue-700 flex items-center gap-2">
                <FiClock />
                Horario de Trabajo
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiClock className="text-blue-600" /> Hora Inicio
                  </div>
                  <div className="w-2/3 font-medium">
                    {formatHora(horarioChoferActual.hora_inicio)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiClock className="text-blue-600" /> Hora Fin
                  </div>
                  <div className="w-2/3 font-medium">
                    {formatHora(horarioChoferActual.hora_fin)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiClock className="text-blue-600" /> Duración
                  </div>
                  <div className="w-2/3 font-medium">
                    {(() => {
                      try {
                        const start = new Date(`2000-01-01T${horarioChoferActual.hora_inicio}`);
                        const end = new Date(`2000-01-01T${horarioChoferActual.hora_fin}`);
                        const diff = Math.abs(end.getTime() - start.getTime());
                        const minutes = Math.floor(diff / 60000);
                        const hours = Math.floor(minutes / 60);
                        const mins = minutes % 60;
                        return hours > 0 
                          ? `${hours} ${hours === 1 ? 'hora' : 'horas'}${mins > 0 ? ` ${mins} minutos` : ''}` 
                          : `${minutes} minutos`;
                      } catch (e) {
                        return 'No disponible';
                      }
                    })()}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden mt-6">
              <div className="bg-purple-50 px-4 py-2 border-b border-purple-100 font-medium text-purple-700 flex items-center gap-2">
                <FiCalendar />
                Período de Vigencia
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiCalendar className="text-purple-600" /> Fecha Inicio
                  </div>
                  <div className="w-2/3 font-medium">
                    {formatFecha(horarioChoferActual.fecha_inicio)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiCalendar className="text-purple-600" /> Fecha Fin
                  </div>
                  <div className="w-2/3 font-medium">
                    {formatFecha(horarioChoferActual.fecha_fin)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiTag className="text-purple-600" /> Estado
                  </div>
                  <div className="w-2/3">
                    {horarioChoferActual.eliminado ? (
                      <span className="inline-block px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">
                        Eliminado
                      </span>
                    ) : isHorarioActivo() ? (
                      <span className="inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs text-yellow-800 bg-yellow-100 rounded-full">
                        Inactivo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-yellow-50 px-4 py-2 border-b border-yellow-100 font-medium text-yellow-700 flex items-center gap-2">
                <FiCalendar />
                Días de Disponibilidad
              </div>
              <div className="p-4 space-y-2">
                <DiaSemana disponible={horarioChoferActual.disponible_lunes} dia="Lunes" />
                <DiaSemana disponible={horarioChoferActual.disponible_martes} dia="Martes" />
                <DiaSemana disponible={horarioChoferActual.disponible_miercoles} dia="Miércoles" />
                <DiaSemana disponible={horarioChoferActual.disponible_jueves} dia="Jueves" />
                <DiaSemana disponible={horarioChoferActual.disponible_viernes} dia="Viernes" />
                <DiaSemana disponible={horarioChoferActual.disponible_sabado} dia="Sábado" />
                <DiaSemana disponible={horarioChoferActual.disponible_domingo} dia="Domingo" />
              </div>
              
              <div className="mx-4 mb-4 p-3 bg-yellow-50 rounded-md text-sm text-yellow-800">
                <div className="mb-1 font-medium flex items-center gap-1">
                  <FiInfo className="text-yellow-600" /> Resumen
                </div>
                <p>
                  {(() => {
                    const dias = [];
                    if (horarioChoferActual.disponible_lunes) dias.push('lunes');
                    if (horarioChoferActual.disponible_martes) dias.push('martes');
                    if (horarioChoferActual.disponible_miercoles) dias.push('miércoles');
                    if (horarioChoferActual.disponible_jueves) dias.push('jueves');
                    if (horarioChoferActual.disponible_viernes) dias.push('viernes');
                    if (horarioChoferActual.disponible_sabado) dias.push('sábados');
                    if (horarioChoferActual.disponible_domingo) dias.push('domingos');
                    
                    if (dias.length === 7) {
                      return 'Disponible todos los días de la semana';
                    } else if (dias.length === 0) {
                      return 'No disponible ningún día de la semana';
                    } else {
                      return `Disponible los ${dias.join(', ')}`;
                    }
                  })()}
                </p>
              </div>
            </div>
            
            <div className="border rounded-md overflow-hidden mt-6 p-4 bg-blue-50 border-blue-200">
              <div className="flex items-center gap-2 text-blue-700 font-medium mb-2">
                <FiInfo className="text-blue-600" />
                <span>Información de Asignaciones</span>
              </div>
              <p className="text-blue-800 text-sm">
                Este horario determina cuándo el chofer está disponible para ser asignado a tours programados. 
                Para ver los tours asignados al chofer, consulte la sección de Tours Programados.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ChoferHorarioDetail;