 /*

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { 
  FaArrowLeft, 
  FaSave, 
  FaExclamationTriangle, 
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { actualizarReserva } from '../../../store/slices/reservaSlice';

// Constantes para opciones disponibles
const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'YAPE', 'PLIN', 'MERCADOPAGO', 'DEPOSITO'];
const ESTADOS_RESERVA = ['CONFIRMADA', 'RESERVADO', 'COMPLETADA', 'CANCELADA'];

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
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  cantidad_pasajes?: PasajeCantidad[];
  paquetes?: PaquetePasajeDetalle[];
}

interface PasajeCantidad {
  id_tipo_pasaje: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaquetePasajeDetalle {
  id_paquete: number;
  nombre_paquete?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_total: number;
  cupo_disponible: number;
  estado: string;
  nombre_tour?: string;
  precio_base?: number;
}

// Componente principal
const ReservaForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = true }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user, selectedSede } = useSelector((state: any) => state.auth);
  
  // Estados
  const [reserva, setReserva] = useState<Reserva>({
    id_cliente: 0,
    id_instancia: 0,
    total_pagar: 0,
    estado: 'CONFIRMADA'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados para la reserva existente
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<InstanciaTour | null>(null);
  const [pasajesSeleccionados, setPasajesSeleccionados] = useState<PasajeCantidad[]>([]);
  const [totalPasajeros, setTotalPasajeros] = useState(0);
  const [totalAPagar, setTotalAPagar] = useState(0);
  
  // Estados para manejo de pago
  const [registrarPago, setRegistrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoPagado, setMontoPagado] = useState<number>(0);
  const [numeroComprobante, setNumeroComprobante] = useState('');
  const [pagosExistentes, setPagosExistentes] = useState<any[]>([]);
  const [totalPagado, setTotalPagado] = useState(0);
  
  // Cargar datos de la reserva
  useEffect(() => {
    const fetchReserva = async () => {
      if (!id) {
        navigate('/vendedor/reservas');
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar el endpoint correcto para obtener reserva
        const response = await axios.get(endpoints.reserva.vendedorGetById(parseInt(id)));
        
        if (response.data && response.data.data) {
          const reservaData = response.data.data;
          setReserva(reservaData);
          
          // Si hay pasajes, establecer los pasajes seleccionados
          if (reservaData.cantidad_pasajes && reservaData.cantidad_pasajes.length > 0) {
            setPasajesSeleccionados(reservaData.cantidad_pasajes);
          }
          
          // Cargar instancia del tour
          if (reservaData.id_instancia) {
            const instanciaResponse = await axios.get(
              endpoints.instanciaTour.vendedorGetById(reservaData.id_instancia)
            );
            if (instanciaResponse.data && instanciaResponse.data.data) {
              setInstanciaSeleccionada(instanciaResponse.data.data);
            }
          }
          
          // Calcular total de pasajeros
          let totalPax = 0;
          if (reservaData.cantidad_pasajes) {
            totalPax = reservaData.cantidad_pasajes.reduce((sum: number, p: PasajeCantidad) => sum + p.cantidad, 0);
          }
          setTotalPasajeros(totalPax);
          setTotalAPagar(reservaData.total_pagar);
          
          // Cargar pagos existentes para esta reserva
          const pagosResponse = await axios.get(
            endpoints.pago.vendedorListByReserva(parseInt(id))
          );
          
          if (pagosResponse.data && pagosResponse.data.data) {
            setPagosExistentes(pagosResponse.data.data);
            
            // Calcular total pagado
            const totalPagadoAcumulado = pagosResponse.data.data.reduce(
              (sum: number, pago: any) => sum + pago.monto, 0
            );
            setTotalPagado(totalPagadoAcumulado);
          }
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
  }, [id, navigate]);
  
  // Calcular totales cuando cambian los pasajes seleccionados
  useEffect(() => {
    // Calcular total de pasajeros
    const totalPax = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => sum + pasaje.cantidad, 0);
    setTotalPasajeros(totalPax);
    
    // Calcular total a pagar
    const totalPago = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => {
      return sum + (pasaje.cantidad * (pasaje.precio_unitario || 0));
    }, 0);
    
    // Solo actualizar si el total calculado es diferente del que ya teníamos
    if (totalPago !== totalAPagar) {
      setTotalAPagar(totalPago);
      setReserva(prev => ({
        ...prev,
        total_pagar: totalPago
      }));
    }
  }, [pasajesSeleccionados, totalAPagar]);
  
  // Función para actualizar cantidad de pasajes
  const handlePasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Verificar que la cantidad no sea negativa
    if (cantidad < 0) return;
    
    // Actualizar la lista de pasajes seleccionados
    const nuevoPasajes = pasajesSeleccionados.map(pasaje => {
      if (pasaje.id_tipo_pasaje === idTipoPasaje) {
        const precioUnitario = pasaje.precio_unitario || 0;
        return {
          ...pasaje,
          cantidad,
          subtotal: cantidad * precioUnitario
        };
      }
      return pasaje;
    });
    
    setPasajesSeleccionados(nuevoPasajes);
  };
  
  // Función para formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  };
  
  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), 'EEEE dd MMMM yyyy', {locale: es});
    } catch (error) {
      return fecha;
    }
  };
  
  // Validar antes de enviar
  const validarCambios = () => {
    if (totalPasajeros <= 0) {
      setError('Debe haber al menos un pasajero');
      return false;
    }
    
    if (instanciaSeleccionada) {
      // Obtener la suma de pasajeros de otras reservas para esta instancia
      // Esto es un ejemplo, en un caso real necesitarías verificar con el backend
      
      // Solo para ilustrar, asumimos que la capacidad disponible ya incluye estos cálculos
      if (totalPasajeros > instanciaSeleccionada.cupo_disponible + totalPasajeros) {
        // Sumamos totalPasajeros porque asumimos que son los que ya están asignados a esta reserva
        setError(`No hay suficiente cupo disponible. Cupo disponible: ${instanciaSeleccionada.cupo_disponible + totalPasajeros}`);
        return false;
      }
    }
    
    return true;
  };
  
  // Función para guardar los cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !validarCambios()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Filtrar pasajes con cantidad > 0
      const pasajesFiltrados = pasajesSeleccionados
        .filter(p => p.cantidad > 0)
        .map(p => ({
          id_tipo_pasaje: p.id_tipo_pasaje,
          cantidad: p.cantidad
        }));
      
      // Verificar que haya al menos un pasaje
      if (pasajesFiltrados.length === 0) {
        setError('Debe seleccionar al menos un tipo de pasaje');
        setSaving(false);
        return;
      }
      
      // Estructura para actualizar la reserva
      const actualizarData = {
        total_pagar: totalAPagar,
        notas: reserva.notas || "Reserva actualizada por vendedor",
        estado: reserva.estado,
        cantidad_pasajes: pasajesFiltrados
      };
      
      console.log('📤 Datos de actualización a enviar:', JSON.stringify(actualizarData, null, 2));
      
      // Actualizar reserva
      const response = await axios.put(endpoints.reserva.vendedorUpdate(parseInt(id)), actualizarData);
      
      console.log('✅ Respuesta de actualización:', response.data);
      
      // Registrar pago adicional si es necesario
      if (registrarPago && montoPagado > 0) {
        try {
          const pagoData = {
            id_reserva: parseInt(id),
            metodo_pago: metodoPago,
            canal_pago: 'LOCAL',
            id_sede: selectedSede?.id_sede,
            monto: montoPagado,
            numero_comprobante: numeroComprobante || undefined
          };
          
          console.log('💰 Datos de pago a enviar:', JSON.stringify(pagoData, null, 2));
          
          const pagosResponse = await axios.post(endpoints.pago.vendedorCreate, pagoData);
          console.log('✅ Pago registrado exitosamente:', pagosResponse.data);
          setSuccessMessage('Reserva actualizada y pago registrado exitosamente');
        } catch (pagoError: any) {
          console.error('⚠️ Error al registrar pago:', pagoError);
          setSuccessMessage('Reserva actualizada exitosamente, pero hubo un problema al registrar el pago');
        }
      } else {
        setSuccessMessage('Reserva actualizada exitosamente');
      }
      
      // Actualizar el estado en Redux si estás usando Redux
      dispatch(actualizarReserva({
        id: parseInt(id),
        reserva: actualizarData
      }));
      
      // Redirigir después de un breve tiempo
      setTimeout(() => {
        navigate('/vendedor/reservas/' + id);
      }, 1500);
    } catch (error: any) {
      console.error('❌ Error al actualizar reserva:', error);
      
      if (error.response) {
        console.error('Respuesta de error:', error.response.data);
      }
      
      setError(error.response?.data?.message || error.message || 'Error al actualizar la reserva');
    } finally {
      setSaving(false);
    }
  };
  
  // Vista de carga
  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        </div>
      </div>
    );
  }
  
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
          Editar Reserva #{id}
        </h1>
        
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
          
          {/* Información del Cliente (solo lectura) *//*}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaUsers className="mr-2 text-blue-500" /> Información del Cliente
            </h2>
            
            <div className="mb-2 p-3 border border-gray-200 rounded-lg bg-gray-50">
              <p className="font-medium">{reserva.nombre_cliente || 'Cliente no especificado'}</p>
              <p className="text-sm text-gray-600">{reserva.documento_cliente || 'Sin documento'}</p>
              <p className="mt-2 text-xs text-blue-600">
                Para cambiar el cliente, debe crear una nueva reserva.
              </p>
            </div>
          </div>
          
          {/* Información del Tour (solo lectura) *//*}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaCalendarAlt className="mr-2 text-blue-500" /> Información del Tour
            </h2>
            
            {instanciaSeleccionada ? (
              <div className="mb-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <div>
                  <p className="font-semibold text-lg">{instanciaSeleccionada.nombre_tour || reserva.nombre_tour}</p>
                  <p className="text-gray-600">
                    Fecha: {formatFecha(instanciaSeleccionada.fecha_especifica)}
                  </p>
                  <p className="text-gray-600">
                    Horario: {instanciaSeleccionada.hora_inicio} - {instanciaSeleccionada.hora_fin}
                  </p>
                  <p className="text-gray-600">
                    Cupo disponible: {instanciaSeleccionada.cupo_disponible} de {instanciaSeleccionada.cupo_total}
                  </p>
                  <p className="mt-2 text-xs text-blue-600">
                    Para cambiar el tour, debe crear una nueva reserva.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800">
                  <FaExclamationTriangle className="inline mr-2" />
                  No se pudo cargar la información del tour.
                </p>
              </div>
            )}
          </div>
          
          {/* Edición de Pasajes *//*}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Pasajeros</h2>
            
            {pasajesSeleccionados.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tipo de Pasaje
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Precio Unitario
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pasajesSeleccionados.map((pasaje) => (
                        <tr key={pasaje.id_tipo_pasaje}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{pasaje.nombre_tipo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatMoneda(pasaje.precio_unitario || 0)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="bg-gray-200 rounded-l p-1 w-8 h-8 flex items-center justify-center"
                                onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad - 1)}
                                disabled={pasaje.cantidad <= 0}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="border-t border-b text-center w-12 h-8"
                                value={pasaje.cantidad}
                                onChange={(e) => handlePasajeChange(pasaje.id_tipo_pasaje, parseInt(e.target.value) || 0)}
                                min="0"
                                max={instanciaSeleccionada ? instanciaSeleccionada.cupo_disponible + totalPasajeros : 99}
                              />
                              <button
                                type="button"
                                className="bg-gray-200 rounded-r p-1 w-8 h-8 flex items-center justify-center"
                                onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {formatMoneda((pasaje.cantidad || 0) * (pasaje.precio_unitario || 0))}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="px-6 py-4 font-medium text-right">
                          Total Pasajeros:
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {totalPasajeros}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          {formatMoneda(totalAPagar)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {totalPasajeros === 0 && (
                  <div className="mt-3 text-amber-600 flex items-center">
                    <FaExclamationTriangle className="mr-1" />
                    Debe seleccionar al menos un pasajero.
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic">No hay tipos de pasaje disponibles para este tour.</p>
            )}
          </div>
          
          {/* Estado de la reserva *//*}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Estado de la reserva</h2>
            
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Estado
              </label>
              <select
                className="shadow appearance-none border rounded w-full md:w-1/3 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={reserva.estado}
                onChange={(e) => setReserva({...reserva, estado: e.target.value})}
              >
                {ESTADOS_RESERVA.map(estado => (
                  <option key={estado} value={estado}>{estado}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-semibold mb-2">
                Notas (opcional)
              </label>
              <textarea
                name="notas"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                rows={3}
                placeholder="Ingrese notas adicionales para esta reserva..."
                value={reserva.notas || ''}
                onChange={(e) => setReserva({...reserva, notas: e.target.value})}
              ></textarea>
            </div>
          </div>
          
          {/* Pagos registrados *//*}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <FaMoneyBillWave className="mr-2 text-blue-500" /> Pagos
            </h2>
            
            {pagosExistentes.length > 0 ? (
              <div className="mb-6">
                <h3 className="text-md font-medium text-gray-700 mb-3">Pagos registrados:</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Método</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Monto</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Comprobante</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagosExistentes.map((pago, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {format(new Date(pago.fecha_creacion), 'dd/MM/yyyy HH:mm', {locale: es})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{pago.metodo_pago}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{formatMoneda(pago.monto)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">{pago.numero_comprobante || '-'}</td>
                        </tr>
                      ))}
                      <tr className="bg-gray-50">
                        <td colSpan={2} className="px-6 py-3 text-right text-sm font-medium">Total pagado:</td>
                        <td className="px-6 py-3 text-sm font-medium">{formatMoneda(totalPagado)}</td>
                        <td></td>
                      </tr>
                      {totalPagado < totalAPagar && (
                        <tr>
                          <td colSpan={2} className="px-6 py-3 text-right text-sm font-medium text-red-600">Saldo pendiente:</td>
                          <td className="px-6 py-3 text-sm font-medium text-red-600">{formatMoneda(totalAPagar - totalPagado)}</td>
                          <td></td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mb-4 bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
                <p className="text-yellow-800">
                  <FaExclamationTriangle className="inline mr-1" />
                  No se han registrado pagos para esta reserva.
                </p>
              </div>
            )}
            
            {/* Registrar pago adicional *//*}
            <div className="mt-6">
              <div className="mb-4">
                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600"
                    checked={registrarPago}
                    onChange={(e) => setRegistrarPago(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-700">Registrar pago adicional</span>
                </label>
              </div>
              
              {registrarPago && (
                <div className="space-y-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Método de Pago
                      </label>
                      <select
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      >
                        {METODOS_PAGO.map(metodo => (
                          <option key={metodo} value={metodo}>{metodo}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Monto a Pagar
                      </label>
                      <input
                        type="number"
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        value={montoPagado}
                        onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Número de Comprobante (opcional)
                    </label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      value={numeroComprobante}
                      onChange={(e) => setNumeroComprobante(e.target.value)}
                      placeholder="Ingrese número de comprobante si aplica"
                    />
                  </div>
                  
                  {totalPagado + montoPagado > totalAPagar && (
                    <div className="text-red-600 flex items-center">
                      <FaExclamationTriangle className="mr-1" />
                      El total pagado excederá el monto total de la reserva.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Botones de acción *//*}
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
              onClick={() => navigate(`/vendedor/reservas/${id}`)}
            >
              Cancelar
            </button>
            
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center"
              disabled={saving || totalPasajeros === 0}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservaForm;*/

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { 
  FaArrowLeft, 
  FaSave, 
  FaExclamationTriangle, 
  FaCalendarAlt,
  FaUsers,
  FaMoneyBillWave,
  FaCheckCircle,
  FaClipboardList,
  FaTicketAlt
} from 'react-icons/fa';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { actualizarReserva } from '../../../store/slices/reservaSlice';
import ROUTES from '../../../../shared/constants/appRoutes';

// Constantes para opciones disponibles
const METODOS_PAGO = ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA', 'YAPE', 'PLIN', 'MERCADOPAGO', 'DEPOSITO'];
const ESTADOS_RESERVA = ['CONFIRMADA', 'RESERVADO', 'COMPLETADA', 'CANCELADA'];

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
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  cantidad_pasajes?: PasajeCantidad[];
  paquetes?: PaquetePasajeDetalle[];
}

interface PasajeCantidad {
  id_tipo_pasaje: number;
  nombre_tipo?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface PaquetePasajeDetalle {
  id_paquete: number;
  nombre_paquete?: string;
  cantidad: number;
  precio_unitario?: number;
  subtotal?: number;
}

interface InstanciaTour {
  id_instancia: number;
  id_tour_programado: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  cupo_total: number;
  cupo_disponible: number;
  estado: string;
  nombre_tour?: string;
  precio_base?: number;
}

// Componente principal
const ReservaForm: React.FC<{ isEditing?: boolean }> = ({ isEditing = true }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useDispatch<any>();
  const { user, selectedSede } = useSelector((state: any) => state.auth);
  
  // Estados
  const [reserva, setReserva] = useState<Reserva>({
    id_cliente: 0,
    id_instancia: 0,
    total_pagar: 0,
    estado: 'CONFIRMADA'
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // Estados para la reserva existente
  const [instanciaSeleccionada, setInstanciaSeleccionada] = useState<InstanciaTour | null>(null);
  const [pasajesSeleccionados, setPasajesSeleccionados] = useState<PasajeCantidad[]>([]);
  const [totalPasajeros, setTotalPasajeros] = useState(0);
  const [totalAPagar, setTotalAPagar] = useState(0);
  
  // Estados para manejo de pago
  const [registrarPago, setRegistrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState('EFECTIVO');
  const [montoPagado, setMontoPagado] = useState<number>(0);
  const [numeroComprobante, setNumeroComprobante] = useState('');
  const [pagosExistentes, setPagosExistentes] = useState<any[]>([]);
  const [totalPagado, setTotalPagado] = useState(0);
  
  // Cargar datos de la reserva
  useEffect(() => {
    const fetchReserva = async () => {
      if (!id) {
        navigate(ROUTES.VENDEDOR.RESERVA.LIST);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        // Usar el endpoint correcto para obtener reserva
        const response = await axios.get(endpoints.reserva.vendedorGetById(parseInt(id)));
        
        if (response.data && response.data.data) {
          const reservaData = response.data.data;
          setReserva(reservaData);
          
          // Si hay pasajes, establecer los pasajes seleccionados
          if (reservaData.cantidad_pasajes && reservaData.cantidad_pasajes.length > 0) {
            setPasajesSeleccionados(reservaData.cantidad_pasajes);
          }
          
          // Cargar instancia del tour
          if (reservaData.id_instancia) {
            const instanciaResponse = await axios.get(
              endpoints.instanciaTour.vendedorGetById(reservaData.id_instancia)
            );
            if (instanciaResponse.data && instanciaResponse.data.data) {
              setInstanciaSeleccionada(instanciaResponse.data.data);
            }
          }
          
          // Calcular total de pasajeros
          let totalPax = 0;
          if (reservaData.cantidad_pasajes) {
            totalPax = reservaData.cantidad_pasajes.reduce((sum: number, p: PasajeCantidad) => sum + p.cantidad, 0);
          }
          setTotalPasajeros(totalPax);
          setTotalAPagar(reservaData.total_pagar);
          
          // Cargar pagos existentes para esta reserva
          const pagosResponse = await axios.get(
            endpoints.pago.vendedorListByReserva(parseInt(id))
          );
          
          if (pagosResponse.data && pagosResponse.data.data) {
            setPagosExistentes(pagosResponse.data.data);
            
            // Calcular total pagado
            const totalPagadoAcumulado = pagosResponse.data.data.reduce(
              (sum: number, pago: any) => sum + pago.monto, 0
            );
            setTotalPagado(totalPagadoAcumulado);
          }
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
  }, [id, navigate]);
  
  // Calcular totales cuando cambian los pasajes seleccionados
  useEffect(() => {
    // Calcular total de pasajeros
    const totalPax = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => sum + pasaje.cantidad, 0);
    setTotalPasajeros(totalPax);
    
    // Calcular total a pagar
    const totalPago = pasajesSeleccionados.reduce((sum: number, pasaje: PasajeCantidad) => {
      return sum + (pasaje.cantidad * (pasaje.precio_unitario || 0));
    }, 0);
    
    // Solo actualizar si el total calculado es diferente del que ya teníamos
    if (totalPago !== totalAPagar) {
      setTotalAPagar(totalPago);
      setReserva(prev => ({
        ...prev,
        total_pagar: totalPago
      }));
    }
  }, [pasajesSeleccionados, totalAPagar]);
  
  // Función para actualizar cantidad de pasajes
  const handlePasajeChange = (idTipoPasaje: number, cantidad: number) => {
    // Verificar que la cantidad no sea negativa
    if (cantidad < 0) return;
    
    // Actualizar la lista de pasajes seleccionados
    const nuevoPasajes = pasajesSeleccionados.map(pasaje => {
      if (pasaje.id_tipo_pasaje === idTipoPasaje) {
        const precioUnitario = pasaje.precio_unitario || 0;
        return {
          ...pasaje,
          cantidad,
          subtotal: cantidad * precioUnitario
        };
      }
      return pasaje;
    });
    
    setPasajesSeleccionados(nuevoPasajes);
  };
  
  // Función para formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  };
  
  // Función para formatear fecha
  const formatFecha = (fecha: string) => {
    try {
      return format(parseISO(fecha), 'EEEE dd MMMM yyyy', {locale: es});
    } catch (error) {
      return fecha;
    }
  };
  
  // Validar antes de enviar
  const validarCambios = () => {
    if (totalPasajeros <= 0) {
      setError('Debe haber al menos un pasajero');
      return false;
    }
    
    if (instanciaSeleccionada) {
      // Obtener la suma de pasajeros de otras reservas para esta instancia
      // Esto es un ejemplo, en un caso real necesitarías verificar con el backend
      
      // Solo para ilustrar, asumimos que la capacidad disponible ya incluye estos cálculos
      if (totalPasajeros > instanciaSeleccionada.cupo_disponible + totalPasajeros) {
        // Sumamos totalPasajeros porque asumimos que son los que ya están asignados a esta reserva
        setError(`No hay suficiente cupo disponible. Cupo disponible: ${instanciaSeleccionada.cupo_disponible + totalPasajeros}`);
        return false;
      }
    }
    
    return true;
  };
  
  // Función para guardar los cambios
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!id || !validarCambios()) {
      return;
    }
    
    try {
      setSaving(true);
      setError(null);
      
      // Filtrar pasajes con cantidad > 0
      const pasajesFiltrados = pasajesSeleccionados
        .filter(p => p.cantidad > 0)
        .map(p => ({
          id_tipo_pasaje: p.id_tipo_pasaje,
          cantidad: p.cantidad
        }));
      
      // Verificar que haya al menos un pasaje
      if (pasajesFiltrados.length === 0) {
        setError('Debe seleccionar al menos un tipo de pasaje');
        setSaving(false);
        return;
      }
      
      // Estructura para actualizar la reserva
      const actualizarData = {
        total_pagar: totalAPagar,
        notas: reserva.notas || "Reserva actualizada por vendedor",
        estado: reserva.estado,
        cantidad_pasajes: pasajesFiltrados
      };
      
      console.log('📤 Datos de actualización a enviar:', JSON.stringify(actualizarData, null, 2));
      
      // Actualizar reserva
      const response = await axios.put(endpoints.reserva.vendedorUpdate(parseInt(id)), actualizarData);
      
      console.log('✅ Respuesta de actualización:', response.data);
      
      // Registrar pago adicional si es necesario
      if (registrarPago && montoPagado > 0) {
        try {
          const pagoData = {
            id_reserva: parseInt(id),
            metodo_pago: metodoPago,
            canal_pago: 'LOCAL',
            id_sede: selectedSede?.id_sede,
            monto: montoPagado,
            numero_comprobante: numeroComprobante || undefined
          };
          
          console.log('💰 Datos de pago a enviar:', JSON.stringify(pagoData, null, 2));
          
          const pagosResponse = await axios.post(endpoints.pago.vendedorCreate, pagoData);
          console.log('✅ Pago registrado exitosamente:', pagosResponse.data);
          setSuccessMessage('Reserva actualizada y pago registrado exitosamente');
        } catch (pagoError: any) {
          console.error('⚠️ Error al registrar pago:', pagoError);
          setSuccessMessage('Reserva actualizada exitosamente, pero hubo un problema al registrar el pago');
        }
      } else {
        setSuccessMessage('Reserva actualizada exitosamente');
      }
      
      // Actualizar el estado en Redux si estás usando Redux
      dispatch(actualizarReserva({
        id: parseInt(id),
        reserva: actualizarData
      }));
      
      // Redirigir después de un breve tiempo
      setTimeout(() => {
        navigate(ROUTES.VENDEDOR.RESERVA.VER(id));
      }, 1500);
    } catch (error: any) {
      console.error('❌ Error al actualizar reserva:', error);
      
      if (error.response) {
        console.error('Respuesta de error:', error.response.data);
      }
      
      setError(error.response?.data?.message || error.message || 'Error al actualizar la reserva');
    } finally {
      setSaving(false);
    }
  };
  
  // Vista de carga
  if (loading) {
    return (
      <div className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.LIST)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow"
        >
          <FaArrowLeft className="mr-2" /> Volver a Reservas
        </button>
        
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-800">
            Editar Reserva #{id}
          </h1>

          <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            Editor de Reserva
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start animate-fade-in">
              <FaExclamationTriangle className="mt-1 mr-2 flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}
          
          {successMessage && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg animate-fade-in flex items-center">
              <FaCheckCircle className="mr-2" />
              <p className="font-medium">{successMessage}</p>
            </div>
          )}
          
          {/* Información del Cliente (solo lectura) */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-md text-white mr-3">
                <FaUsers className="text-xl" />
              </div>
              Información del Cliente
            </h2>
            
            <div className="mb-2 p-4 border border-blue-100 rounded-lg bg-blue-50">
              <p className="font-medium text-lg">{reserva.nombre_cliente || 'Cliente no especificado'}</p>
              <p className="text-gray-600 mt-1">{reserva.documento_cliente || 'Sin documento'}</p>
              <p className="mt-3 text-sm text-blue-600 flex items-center">
                <FaExclamationTriangle className="mr-2 text-xs" />
                Para cambiar el cliente, debe crear una nueva reserva.
              </p>
            </div>
          </div>
          
          {/* Información del Tour (solo lectura) */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-md text-white mr-3">
                <FaCalendarAlt className="text-xl" />
              </div>
              Información del Tour
            </h2>
            
            {instanciaSeleccionada ? (
              <div className="mb-4 p-4 border border-green-100 rounded-lg bg-green-50">
                <p className="font-semibold text-lg text-green-800">
                  {instanciaSeleccionada.nombre_tour || reserva.nombre_tour}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  <div>
                    <p className="text-sm text-gray-600">Fecha:</p>
                    <p className="font-medium">{formatFecha(instanciaSeleccionada.fecha_especifica)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Horario:</p>
                    <p className="font-medium">{instanciaSeleccionada.hora_inicio} - {instanciaSeleccionada.hora_fin}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Cupo disponible:</p>
                    <p className="font-medium">{instanciaSeleccionada.cupo_disponible} de {instanciaSeleccionada.cupo_total}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-green-600 flex items-center">
                  <FaExclamationTriangle className="mr-2 text-xs" />
                  Para cambiar el tour, debe crear una nueva reserva.
                </p>
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-yellow-800 flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  No se pudo cargar la información del tour.
                </p>
              </div>
            )}
          </div>
          
          {/* Edición de Pasajes */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-md text-white mr-3">
                <FaTicketAlt className="text-xl" />
              </div>
              Pasajeros
            </h2>
            
            {pasajesSeleccionados.length > 0 ? (
              <div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 rounded-lg overflow-hidden">
                    <thead className="bg-gradient-to-r from-gray-100 to-gray-200">
                      <tr>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Tipo de Pasaje
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Precio Unitario
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Cantidad
                        </th>
                        <th scope="col" className="px-6 py-4 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pasajesSeleccionados.map((pasaje) => (
                        <tr key={pasaje.id_tipo_pasaje} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">{pasaje.nombre_tipo}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-purple-700 font-medium">
                              {formatMoneda(pasaje.precio_unitario || 0)}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <button
                                type="button"
                                className="bg-gray-200 hover:bg-gray-300 rounded-l p-1 w-8 h-8 flex items-center justify-center transition-colors"
                                onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad - 1)}
                                disabled={pasaje.cantidad <= 0}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                className="border-t border-b text-center w-12 h-8 focus:outline-none"
                                value={pasaje.cantidad}
                                onChange={(e) => handlePasajeChange(pasaje.id_tipo_pasaje, parseInt(e.target.value) || 0)}
                                min="0"
                                max={instanciaSeleccionada ? instanciaSeleccionada.cupo_disponible + totalPasajeros : 99}
                              />
                              <button
                                type="button"
                                className="bg-gray-200 hover:bg-gray-300 rounded-r p-1 w-8 h-8 flex items-center justify-center transition-colors"
                                onClick={() => handlePasajeChange(pasaje.id_tipo_pasaje, pasaje.cantidad + 1)}
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-bold text-gray-900">
                              {formatMoneda((pasaje.cantidad || 0) * (pasaje.precio_unitario || 0))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <td colSpan={2} className="px-6 py-4 font-medium text-right text-gray-700">
                          Total Pasajeros:
                        </td>
                        <td className="px-6 py-4 font-medium text-purple-700">
                          {totalPasajeros}
                        </td>
                        <td className="px-6 py-4 font-bold text-lg text-purple-700">
                          {formatMoneda(totalAPagar)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                {totalPasajeros === 0 && (
                  <div className="mt-3 text-amber-600 flex items-center bg-amber-50 p-3 rounded-lg border border-amber-200">
                    <FaExclamationTriangle className="mr-2" />
                    Debe seleccionar al menos un pasajero.
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500 italic p-4 bg-gray-50 rounded-lg border border-gray-200">
                No hay tipos de pasaje disponibles para este tour.
              </p>
            )}
          </div>
          
          {/* Estado de la reserva */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-amber-500 to-amber-700 p-2 rounded-md text-white mr-3">
                <FaClipboardList className="text-xl" />
              </div>
              Estado de la reserva
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Estado
                </label>
                <select
                  className="shadow-sm border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  value={reserva.estado}
                  onChange={(e) => setReserva({...reserva, estado: e.target.value})}
                >
                  {ESTADOS_RESERVA.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-gray-700 text-sm font-semibold mb-2">
                  Notas (opcional)
                </label>
                <textarea
                  name="notas"
                  className="shadow-sm border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all"
                  rows={3}
                  placeholder="Ingrese notas adicionales para esta reserva..."
                  value={reserva.notas || ''}
                  onChange={(e) => setReserva({...reserva, notas: e.target.value})}
                ></textarea>
              </div>
            </div>
          </div>
          
          {/* Pagos registrados */}
          <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <div className="bg-gradient-to-br from-teal-500 to-teal-700 p-2 rounded-md text-white mr-3">
                <FaMoneyBillWave className="text-xl" />
              </div>
              Pagos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100 flex flex-col justify-between">
                <p className="text-sm text-blue-700">Total de Reserva</p>
                <p className="text-xl font-bold text-blue-800 mt-2">{formatMoneda(totalAPagar)}</p>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 border border-green-100 flex flex-col justify-between">
                <p className="text-sm text-green-700">Total Pagado</p>
                <p className="text-xl font-bold text-green-800 mt-2">{formatMoneda(totalPagado)}</p>
              </div>
              
              <div className={`rounded-lg p-4 border flex flex-col justify-between ${
                totalPagado < totalAPagar ? 'bg-red-50 border-red-100' : 'bg-green-50 border-green-100'
              }`}>
                <p className={`text-sm ${totalPagado < totalAPagar ? 'text-red-700' : 'text-green-700'}`}>
                  {totalPagado < totalAPagar ? 'Saldo Pendiente' : 'Completamente Pagado'}
                </p>
                <p className={`text-xl font-bold mt-2 ${totalPagado < totalAPagar ? 'text-red-800' : 'text-green-800'}`}>
                  {totalPagado < totalAPagar ? formatMoneda(totalAPagar - totalPagado) : formatMoneda(0)}
                </p>
              </div>
            </div>
            
            {pagosExistentes.length > 0 ? (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-700 mb-3 flex items-center">
                  <FaMoneyBill className="mr-2 text-teal-600" />
                  Pagos registrados:
                </h3>
                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gradient-to-r from-teal-50 to-teal-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Método</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Canal</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pagosExistentes.map((pago, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {format(new Date(pago.fecha_creacion), 'dd/MM/yyyy HH:mm', {locale: es})}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {pago.metodo_pago}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {pago.canal_pago}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              pago.estado === 'PROCESADO' ? 'bg-green-100 text-green-800' : 
                              pago.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                              'bg-red-100 text-red-800'
                            }`}>
                              {pago.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-teal-700">
                            {formatMoneda(pago.monto)}
                          </td>
                        </tr>
                      ))}
                      <tr className="bg-teal-50">
                        <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total pagado:</td>
                        <td className="px-6 py-3 text-sm font-bold text-teal-700">{formatMoneda(totalPagado)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mb-6 bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
                <FaExclamationTriangle className="mr-2" />
                <p>No se han registrado pagos para esta reserva.</p>
              </div>
            )}
            
            {/* Registrar pago adicional */}
            <div className="mt-6">
              <div className="mb-4">
                <label className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500 transition-all"
                    checked={registrarPago}
                    onChange={(e) => setRegistrarPago(e.target.checked)}
                  />
                  <span className="ml-2 text-gray-700 font-medium">Registrar pago adicional</span>
                </label>
              </div>
              
              {registrarPago && (
                <div className="space-y-4 p-6 bg-blue-50 border border-blue-200 rounded-lg animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Método de Pago
                      </label>
                      <select
                        className="shadow-sm border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={metodoPago}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      >
                        {METODOS_PAGO.map(metodo => (
                          <option key={metodo} value={metodo}>{metodo}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Monto a Pagar
                      </label>
                      <input
                        type="number"
                        className="shadow-sm border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        value={montoPagado}
                        onChange={(e) => setMontoPagado(parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-700 text-sm font-semibold mb-2">
                      Número de Comprobante (opcional)
                    </label>
                    <input
                      type="text"
                      className="shadow-sm border-gray-300 rounded-lg w-full py-2 px-3 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                      value={numeroComprobante}
                      onChange={(e) => setNumeroComprobante(e.target.value)}
                      placeholder="Ingrese número de comprobante si aplica"
                    />
                  </div>
                  
                  {totalPagado + montoPagado > totalAPagar && (
                    <div className="text-red-600 flex items-center bg-red-50 p-3 rounded-lg border border-red-200">
                      <FaExclamationTriangle className="mr-2" />
                      El total pagado excederá el monto total de la reserva.
                    </div>
                  )}
                  
                  {montoPagado > 0 && totalPagado + montoPagado < totalAPagar && (
                    <div className="text-amber-600 flex items-center bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <FaExclamationTriangle className="mr-2" />
                      Pago parcial. Saldo pendiente después del pago: {formatMoneda(totalAPagar - totalPagado - montoPagado)}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Botones de acción */}
          <div className="flex justify-end space-x-4 mt-8 sticky bottom-0 p-4 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
            <button
              type="button"
              className="bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-bold py-3 px-6 rounded-lg flex items-center transition-all"
              onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.VER(id || ''))}
            >
              <FaArrowLeft className="mr-2" />
              Cancelar
            </button>
            
            <button
              type="submit"
              className={`${saving || totalPasajeros === 0 
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'
              } text-white font-bold py-3 px-8 rounded-lg flex items-center transition-all shadow-md`}
              disabled={saving || totalPasajeros === 0}
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <FaSave className="mr-2" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReservaForm;