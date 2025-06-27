import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { FaArrowLeft, FaSave, FaExclamationTriangle } from 'react-icons/fa';

// Interfaces
interface Reserva {
  id_reserva?: number;
  id_vendedor?: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  total_pagar: number;
  notas?: string;
  estado: string;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_tour?: string;
}

interface Cliente {
  id_cliente: number;
  tipo_documento: string;
  numero_documento: string;
  nombres?: string;
  apellidos?: string;
  razon_social?: string;
  direccion_fiscal?: string;
  nombre_completo?: string;
}

// Componente principal
const ReservaForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = false }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Estados
  const [reserva, setReserva] = useState<Reserva>({
    id_cliente: 0,
    id_instancia: 0,
    total_pagar: 0,
    estado: 'RESERVADO'
  });
  
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Cargar datos de la reserva en modo edición
  useEffect(() => {
    const fetchReserva = async () => {
      if (!isEditing || !id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar el endpoint correcto para obtener reserva
        const response = await axios.get(endpoints.reserva.vendedorGetById(parseInt(id)));
        
        if (response.data && response.data.data) {
          setReserva(response.data.data);
        } else {
          throw new Error('No se encontró la reserva');
        }
      } catch (error: any) {
        console.error('Error al cargar reserva:', error);
        setError(error.message || 'Error al cargar la reserva');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReserva();
  }, [isEditing, id]);
  
  // Cargar lista de clientes para búsqueda
  useEffect(() => {
    const fetchClientes = async () => {
      if (!searchTerm.trim() || searchTerm.length < 3) return;
      
      try {
        // Usar el endpoint correcto para buscar clientes que comprobamos que funciona
        const response = await axios.get(endpoints.cliente.vendedorBuscarDocumento, {
          params: { query: searchTerm }
        });
        
        if (response.data && response.data.data) {
          setClientes(response.data.data);
        }
      } catch (error) {
        console.error('Error al buscar clientes:', error);
      }
    };
    
    const timer = setTimeout(() => {
      fetchClientes();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // Función para manejar cambios en los campos
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setReserva({
      ...reserva,
      [name]: value
    });
  };
  
  // Función para seleccionar un cliente
  const handleSelectCliente = (cliente: Cliente) => {
    setReserva({
      ...reserva,
      id_cliente: cliente.id_cliente,
      nombre_cliente: cliente.tipo_documento === 'RUC' 
        ? cliente.razon_social 
        : cliente.nombre_completo || `${cliente.nombres} ${cliente.apellidos}`,
      documento_cliente: `${cliente.tipo_documento}: ${cliente.numero_documento}`
    });
    setSearchTerm('');
    setClientes([]);
  };
  
  // Función para guardar la reserva
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reserva.id_cliente || !reserva.id_instancia) {
      setError('Debe seleccionar un cliente y una instancia de tour');
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      const data = {
        ...reserva,
        id_vendedor: user?.id_usuario
      };
      
      let response;
      
      if (isEditing && id) {
        // Usar el endpoint correcto para actualizar reserva
        response = await axios.put(endpoints.reserva.vendedorUpdate(parseInt(id)), data);
      } else {
        // Usar el endpoint correcto para crear reserva
        response = await axios.post(endpoints.reserva.vendedorCreate, data);
      }
      
      if (response.data && response.data.data) {
        setSuccessMessage(isEditing 
          ? 'Reserva actualizada exitosamente' 
          : 'Reserva creada exitosamente');
        
        // Redirigir después de un breve tiempo
        setTimeout(() => {
          navigate('/vendedor/reservas/' + (isEditing ? id : response.data.data.id_reserva));
        }, 2000);
      } else {
        throw new Error('No se pudo ' + (isEditing ? 'actualizar' : 'crear') + ' la reserva');
      }
    } catch (error: any) {
      console.error('Error al guardar reserva:', error);
      setError(error.message || 'Error al guardar la reserva');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/vendedor/reservas')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Volver a Reservas
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {isEditing ? `Editar Reserva #${id}` : 'Crear Nueva Reserva'}
        </h1>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            
            {successMessage && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                <p className="font-medium">{successMessage}</p>
              </div>
            )}
            
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Información de la Reserva</h2>
              
              {/* Selección de cliente */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Cliente *
                </label>
                
                {reserva.id_cliente ? (
                  <div className="mb-2 p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{reserva.nombre_cliente}</p>
                    <p className="text-sm text-gray-600">{reserva.documento_cliente}</p>
                    
                    <button
                      type="button"
                      className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                      onClick={() => setReserva({
                        ...reserva,
                        id_cliente: 0,
                        nombre_cliente: undefined,
                        documento_cliente: undefined
                      })}
                    >
                      Cambiar cliente
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="relative">
                      <input
                        type="text"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Buscar cliente por nombre o documento..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      
                      {clientes.length > 0 && (
                        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                          {clientes.map((cliente) => (
                            <div
                              key={cliente.id_cliente}
                              className="p-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100"
                              onClick={() => handleSelectCliente(cliente)}
                            >
                              <p className="font-medium">
                                {cliente.tipo_documento === 'RUC'
                                  ? cliente.razon_social
                                  : cliente.nombre_completo || `${cliente.nombres} ${cliente.apellidos}`}
                              </p>
                              <p className="text-sm text-gray-600">
                                {cliente.tipo_documento}: {cliente.numero_documento}
                              </p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <p className="mt-2 text-sm text-gray-600">
                      Ingrese al menos 3 caracteres para buscar un cliente. Para agregar un nuevo cliente,
                      <a href="/vendedor/clientes/nuevo" className="text-blue-600 hover:text-blue-800 ml-1">
                        haga clic aquí
                      </a>.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Información del tour - Mostramos solo info en modo edición */}
              {isEditing && (
                <div className="mb-6">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tour
                  </label>
                  <div className="p-3 border border-gray-200 rounded-lg">
                    <p className="font-medium">{reserva.nombre_tour}</p>
                    <div className="flex flex-wrap mt-1 text-sm text-gray-600">
                      <p className="mr-4">Fecha: {reserva.fecha_tour}</p>
                      <p>Hora: {reserva.hora_tour}</p>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Estado de la reserva */}
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  value={reserva.estado}
                  onChange={handleChange}
                >
                  <option value="RESERVADO">Reservado</option>
                  <option value="CONFIRMADO">Confirmado</option>
                  <option value="COMPLETADO">Completado</option>
                  <option value="CANCELADO">Cancelado</option>
                </select>
              </div>
              
              {/* Notas */}
              <div className="mb-2">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  name="notas"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  rows={3}
                  placeholder="Ingrese notas adicionales para esta reserva..."
                  value={reserva.notas || ''}
                  onChange={handleChange}
                ></textarea>
              </div>
            </div>
            
            {/* Botones de acción */}
            <div className="flex justify-end">
              <button
                type="button"
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
                onClick={() => navigate('/vendedor/reservas')}
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                    Guardando...
                  </>
                ) : (
                  <>
                    <FaSave className="mr-2" />
                    {isEditing ? 'Actualizar Reserva' : 'Crear Reserva'}
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReservaForm;