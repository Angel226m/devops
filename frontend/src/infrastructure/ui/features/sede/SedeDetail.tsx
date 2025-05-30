import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { AppDispatch, RootState } from '../../../store';
import { fetchSedePorId, resetSedeSeleccionada } from '../../../store/slices/sedeSlice';
import Card from '../../components/Card';
import Button from '../../components/Button';

const SedeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  
  const { sedeSeleccionada, loading, error } = useSelector((state: RootState) => state.sede);
  
  useEffect(() => {
    if (id) {
      dispatch(fetchSedePorId(parseInt(id)));
    }
    
    return () => {
      dispatch(resetSedeSeleccionada());
    };
  }, [dispatch, id]);
  
  if (loading) return <div className="loading">Cargando...</div>;
  if (error) return <div className="error-message">{error}</div>;
  if (!sedeSeleccionada) return <div>No se encontró la sede</div>;
  
  return (
    <Card className="max-w-3xl mx-auto">
      <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Sede: {sedeSeleccionada.nombre}</h3>
      </div>
      
      <div className="px-6 py-4">
        <div className="detail-content">
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">ID:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.id_sede}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Nombre:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.nombre}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Dirección:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.direccion}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Ciudad:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.ciudad}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Provincia:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.provincia || 'No especificada'}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">País:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.pais}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Teléfono:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.telefono || 'No especificado'}</span>
          </div>
          
          <div className="detail-row mb-3">
            <span className="detail-label font-medium text-gray-700">Correo:</span>
            <span className="detail-value ml-2">{sedeSeleccionada.correo || 'No especificado'}</span>
          </div>
        </div>
        
        <div className="button-group mt-6 flex gap-3 justify-end">
          <Button 
            variant="secondary" 
            onClick={() => navigate('/admin/sedes')}
          >
            Volver
          </Button>
          <Button 
            onClick={() => navigate(`/admin/sedes/editar/${id}`)}
          >
            Editar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SedeDetail;