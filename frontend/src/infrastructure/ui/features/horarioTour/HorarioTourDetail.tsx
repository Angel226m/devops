 
// src/infrastructure/ui/features/horarioTour/HorarioTourDetail.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchHorarioTourPorId } from '../../../store/slices/horarioTourSlice';
import { fetchTiposTour } from '../../../store/slices/tipoTourSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { 
  FiClock, FiMapPin, FiCalendar, FiEdit, 
  FiArrowLeft, FiCheck, FiX, FiTag, FiHome 
} from 'react-icons/fi';

const HorarioTourDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { horarioTourActual, loading, error } = useSelector((state: RootState) => state.horarioTour);
  const { tiposTour } = useSelector((state: RootState) => state.tipoTour);
  const { sedes } = useSelector((state: RootState) => state.sede);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchHorarioTourPorId(parseInt(id)));
      dispatch(fetchTiposTour());
    }
  }, [dispatch, id]);
  
  if (loading) {
    return (
      <Card>
        <div className="p-6 flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Card>
    );
  }
  
  if (error || !horarioTourActual) {
    return (
      <Card>
        <div className="p-6">
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4 text-red-700">
            <strong>Error:</strong> {error || 'No se pudo cargar el horario de tour'}
          </div>
          <div className="flex justify-center">
            <Button
              onClick={() => navigate('/admin/horarios-tour')}
              className="flex items-center gap-1"
            >
              <FiArrowLeft /> Volver a la lista
            </Button>
          </div>
        </div>
      </Card>
    );
  }
  
  const getNombreTipoTour = (idTipoTour: number): string => {
    const tipoTour = tiposTour.find(t => t.id_tipo_tour === idTipoTour);
    return tipoTour ? tipoTour.nombre : `Tipo #${idTipoTour}`;
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
            <FiClock className="text-blue-600" />
            Detalles del Horario
          </h3>
          <p className="text-sm text-gray-600">
            {getNombreTipoTour(horarioTourActual.id_tipo_tour)} - {formatHora(horarioTourActual.hora_inicio)} a {formatHora(horarioTourActual.hora_fin)}
          </p>
        </div>
        <div className="flex gap-2">
          <Button
             onClick={() => navigate('/admin/horarios-tour')}
            className="flex items-center gap-1"
          >
            <FiArrowLeft /> Volver
          </Button>
          <Button
             onClick={() => navigate(`/admin/horarios-tour/editar/${id}`)}
            className="flex items-center gap-1"
          >
            <FiEdit /> Editar
          </Button>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 font-medium text-blue-700 flex items-center gap-2">
                <FiTag />
                Información General
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiMapPin className="text-blue-600" /> Tipo de Tour
                  </div>
                  <div className="w-2/3 font-medium">
                    {getNombreTipoTour(horarioTourActual.id_tipo_tour)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiHome className="text-blue-600" /> Sede
                  </div>
                  <div className="w-2/3 font-medium">
                    {getNombreSede(horarioTourActual.id_sede)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiClock className="text-blue-600" /> Horario
                  </div>
                  <div className="w-2/3 font-medium">
                    {formatHora(horarioTourActual.hora_inicio)} - {formatHora(horarioTourActual.hora_fin)}
                  </div>
                </div>
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiClock className="text-blue-600" /> Duración
                  </div>
                  <div className="w-2/3 font-medium">
                    {(() => {
                      try {
                        const start = new Date(`2000-01-01T${horarioTourActual.hora_inicio}`);
                        const end = new Date(`2000-01-01T${horarioTourActual.hora_fin}`);
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
                
                <div className="flex py-3 px-4">
                  <div className="w-1/3 text-gray-600 flex items-center gap-1">
                    <FiTag className="text-blue-600" /> Estado
                  </div>
                  <div className="w-2/3">
                    {horarioTourActual.eliminado ? (
                      <span className="inline-block px-2 py-1 text-xs text-red-800 bg-red-100 rounded-full">
                        Eliminado
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs text-green-800 bg-green-100 rounded-full">
                        Activo
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="border rounded-md overflow-hidden">
              <div className="bg-blue-50 px-4 py-2 border-b border-blue-100 font-medium text-blue-700 flex items-center gap-2">
                <FiCalendar />
                Disponibilidad
              </div>
              <div className="p-4">
                <div className="space-y-2">
                  <DiaSemana disponible={horarioTourActual.disponible_lunes} dia="Lunes" />
                  <DiaSemana disponible={horarioTourActual.disponible_martes} dia="Martes" />
                  <DiaSemana disponible={horarioTourActual.disponible_miercoles} dia="Miércoles" />
                  <DiaSemana disponible={horarioTourActual.disponible_jueves} dia="Jueves" />
                  <DiaSemana disponible={horarioTourActual.disponible_viernes} dia="Viernes" />
                  <DiaSemana disponible={horarioTourActual.disponible_sabado} dia="Sábado" />
                  <DiaSemana disponible={horarioTourActual.disponible_domingo} dia="Domingo" />
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-md text-sm text-blue-800">
                  <div className="mb-1 font-medium flex items-center gap-1">
                    <FiCheck className="text-green-600" /> Resumen
                  </div>
                  <p>
                    {(() => {
                      const dias = [];
                      if (horarioTourActual.disponible_lunes) dias.push('lunes');
                      if (horarioTourActual.disponible_martes) dias.push('martes');
                      if (horarioTourActual.disponible_miercoles) dias.push('miércoles');
                      if (horarioTourActual.disponible_jueves) dias.push('jueves');
                      if (horarioTourActual.disponible_viernes) dias.push('viernes');
                      if (horarioTourActual.disponible_sabado) dias.push('sábados');
                      if (horarioTourActual.disponible_domingo) dias.push('domingos');
                      
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
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default HorarioTourDetail;