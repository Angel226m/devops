import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTipoPasajeById, clearTipoPasajeActual } from '../../../store/slices/tipoPasajeSlice';
import { fetchTipoTourPorId } from '../../../store/slices/tipoTourSlice';
import { fetchSedePorId } from '../../../store/slices/sedeSlice';
import Button from '../../components/Button';
import { FiArrowLeft, FiEdit2, FiTrash2 } from 'react-icons/fi';

const TipoPasajeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { tipoPasajeActual, loading, error } = useSelector((state: RootState) => state.tipoPasaje);
  const { tipoTourActual } = useSelector((state: RootState) => state.tipoTour);
  const { sedeSeleccionada } = useSelector((state: RootState) => state.sede);

  useEffect(() => {
    if (id) {
      dispatch(fetchTipoPasajeById(parseInt(id)));
    }

    return () => {
      dispatch(clearTipoPasajeActual());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (tipoPasajeActual) {
      dispatch(fetchTipoTourPorId(tipoPasajeActual.id_tipo_tour));
      dispatch(fetchSedePorId(tipoPasajeActual.id_sede));
    }
  }, [dispatch, tipoPasajeActual]);

  const handleEdit = () => {
    navigate(`/admin/tipos-pasaje/editar/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/tipos-pasaje');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded">
        <p className="font-bold">Error</p>
        <p>{error}</p>
        <Button variant="secondary" onClick={handleBack} className="mt-4">
          Volver a la lista
        </Button>
      </div>
    );
  }

  if (!tipoPasajeActual) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-bold">No encontrado</p>
        <p>No se encontró el tipo de pasaje solicitado.</p>
        <Button variant="secondary" onClick={handleBack} className="mt-4">
          Volver a la lista
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <Button
         onClick={handleBack}
        className="mb-4 flex items-center text-blue-600 hover:text-blue-800"
      >
        <FiArrowLeft className="mr-2" /> Volver a la lista
      </Button>
      
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{tipoPasajeActual.nombre}</h1>
              <p className="text-gray-600">Tipo de Pasaje ID: {tipoPasajeActual.id_tipo_pasaje}</p>
            </div>
            <div className="flex space-x-2">
              <Button
                variant="primary"
                onClick={handleEdit}
                className="flex items-center"
              >
                <FiEdit2 className="mr-2" /> Editar
              </Button>
            </div>
          </div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Información Básica</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-medium">{tipoPasajeActual.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Costo</p>
                  <p className="font-medium text-green-600">${tipoPasajeActual.costo.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Edad</p>
                  <p className="font-medium">{tipoPasajeActual.edad || 'No especificada'}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Relaciones</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Sede</p>
                  <p className="font-medium">
                    {sedeSeleccionada ? sedeSeleccionada.nombre : `ID: ${tipoPasajeActual.id_sede}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Tour</p>
                  <p className="font-medium">
                    {tipoTourActual ? tipoTourActual.nombre : `ID: ${tipoPasajeActual.id_tipo_tour}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Estado</h2>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${tipoPasajeActual.eliminado ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
              <p>{tipoPasajeActual.eliminado ? 'Inactivo' : 'Activo'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipoPasajeDetail;