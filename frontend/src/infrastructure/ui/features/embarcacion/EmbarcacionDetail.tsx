import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchEmbarcacionPorId, resetEmbarcacionSeleccionada } from '../../../store/slices/embarcacionSlice';
import { fetchSedes } from '../../../store/slices/sedeSlice';
import { RootState, AppDispatch } from '../../../store';
import { EstadoEmbarcacion } from '../../../../domain/entities/Embarcacion';
import Card from '../../components/Card';
import Button from '../../components/Button';

const EmbarcacionDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { embarcacionSeleccionada, loading, error } = useSelector((state: RootState) => state.embarcacion);
  const { sedes } = useSelector((state: RootState) => state.sede);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchEmbarcacionPorId(parseInt(id)));
      dispatch(fetchSedes());
    }
    
    return () => {
      dispatch(resetEmbarcacionSeleccionada());
    };
  }, [dispatch, id]);
  
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!embarcacionSeleccionada) return <div>No se encontró la embarcación</div>;
  
  // Obtener nombre de sede
  const sede = sedes.find(s => s.id_sede === embarcacionSeleccionada.id_sede);
  
  // Mapear estado a etiqueta visual
  const getEstadoLabel = (estado: EstadoEmbarcacion) => {
    const estados = {
      [EstadoEmbarcacion.DISPONIBLE]: <span className="estado-disponible px-2 py-1 bg-green-100 text-green-800 rounded-full">Disponible</span>,
      [EstadoEmbarcacion.OCUPADA]: <span className="estado-ocupada px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">Ocupada</span>,
      [EstadoEmbarcacion.MANTENIMIENTO]: <span className="estado-mantenimiento px-2 py-1 bg-orange-100 text-orange-800 rounded-full">En Mantenimiento</span>,
      [EstadoEmbarcacion.FUERA_DE_SERVICIO]: <span className="estado-fuera px-2 py-1 bg-red-100 text-red-800 rounded-full">Fuera de Servicio</span>,
    };
    return estados[estado] || estado;
  };
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">
          Embarcación: {embarcacionSeleccionada.nombre}
        </h3>
      </div>
      
      <div className="px-6 py-4">
        <div className="detail-content">
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">ID:</span>
            <span className="detail-value ml-2">{embarcacionSeleccionada.id_embarcacion}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Sede:</span>
            <span className="detail-value ml-2">{sede?.nombre || 'Desconocida'}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Capacidad:</span>
            <span className="detail-value ml-2">{embarcacionSeleccionada.capacidad} pasajeros</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Descripción:</span>
            <span className="detail-value ml-2">
              {embarcacionSeleccionada.descripcion || 'Sin descripción'}
            </span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Estado:</span>
            <span className="detail-value ml-2">
              {getEstadoLabel(embarcacionSeleccionada.estado)}
            </span>
          </div>
        </div>
        
        <div className="button-group mt-6 flex gap-3 justify-end">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/admin/embarcaciones')}
          >
            Volver
          </Button>
          <Button 
            onClick={() => navigate(`/admin/embarcaciones/editar/${id}`)}
          >
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default EmbarcacionDetail;