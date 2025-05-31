import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../store';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchPaquetePasajesById, clearPaquetePasajesActual } from '../../../store/slices/paquetePasajesSlice';
import { fetchTipoTourPorId } from '../../../store/slices/tipoTourSlice';
import { fetchSedePorId } from '../../../store/slices/sedeSlice';
import { fetchTiposPasajeByTipoTour } from '../../../store/slices/tipoPasajeSlice';
import Button from '../../components/Button';
import { FiArrowLeft, FiEdit2, FiPackage } from 'react-icons/fi';

const PaquetePasajesDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { paquetePasajesActual, loading, error } = useSelector((state: RootState) => state.paquetePasajes);
  const { tipoTourActual } = useSelector((state: RootState) => state.tipoTour);
  const { sedeSeleccionada } = useSelector((state: RootState) => state.sede);
  const { tiposPasaje } = useSelector((state: RootState) => state.tipoPasaje);

  useEffect(() => {
    if (id) {
      dispatch(fetchPaquetePasajesById(parseInt(id)));
    }

    return () => {
      dispatch(clearPaquetePasajesActual());
    };
  }, [dispatch, id]);

  useEffect(() => {
    if (paquetePasajesActual) {
      dispatch(fetchTipoTourPorId(paquetePasajesActual.id_tipo_tour));
      dispatch(fetchSedePorId(paquetePasajesActual.id_sede));
      dispatch(fetchTiposPasajeByTipoTour(paquetePasajesActual.id_tipo_tour));
    }
  }, [dispatch, paquetePasajesActual]);

  const handleEdit = () => {
    navigate(`/admin/paquetes-pasajes/editar/${id}`);
  };

  const handleBack = () => {
    navigate('/admin/paquetes-pasajes');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
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

  if (!paquetePasajesActual) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded">
        <p className="font-bold">No encontrado</p>
        <p>No se encontró el paquete de pasajes solicitado.</p>
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
              <h1 className="text-2xl font-bold flex items-center">
                <FiPackage className="mr-2 text-green-600" />
                {paquetePasajesActual.nombre}
              </h1>
              <p className="text-gray-600">Paquete ID: {paquetePasajesActual.id_paquete}</p>
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
                  <p className="font-medium">{paquetePasajesActual.nombre}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Precio Total</p>
                  <p className="font-medium text-green-600">${paquetePasajesActual.precio_total.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Cantidad Total de Pasajes</p>
                  <p className="font-medium">{paquetePasajesActual.cantidad_total}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Relaciones</h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-500">Sede</p>
                  <p className="font-medium">
                    {sedeSeleccionada ? sedeSeleccionada.nombre : `ID: ${paquetePasajesActual.id_sede}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tipo de Tour</p>
                  <p className="font-medium">
                    {tipoTourActual ? tipoTourActual.nombre : `ID: ${paquetePasajesActual.id_tipo_tour}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {paquetePasajesActual.descripcion && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Descripción</h2>
              <p className="whitespace-pre-line">{paquetePasajesActual.descripcion}</p>
            </div>
          )}
          
          {tiposPasaje.length > 0 && (
            <div className="mt-6 bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Tipos de Pasaje Disponibles para este Tour</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tiposPasaje.map(tipoPasaje => (
                  <div key={tipoPasaje.id_tipo_pasaje} className="border border-gray-200 p-3 rounded-md bg-white">
                    <p className="font-medium">{tipoPasaje.nombre}</p>
                    <p className="text-sm text-gray-600">Precio: ${tipoPasaje.costo.toFixed(2)}</p>
                    {tipoPasaje.edad && <p className="text-sm text-gray-600">Edad: {tipoPasaje.edad}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="mt-6 bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-4">Estado</h2>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full ${paquetePasajesActual.eliminado ? 'bg-red-500' : 'bg-green-500'} mr-2`}></div>
              <p>{paquetePasajesActual.eliminado ? 'Inactivo' : 'Activo'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaquetePasajesDetail;