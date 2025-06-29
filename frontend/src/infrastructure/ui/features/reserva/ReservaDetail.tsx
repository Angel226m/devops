 /*
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { FaArrowLeft, FaEdit, FaTrash, FaMoneyBill, FaFileInvoice, FaTicketAlt, FaUser, FaCalendarAlt, FaShip, FaClock } from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Interfaces
interface Reserva {
  id_reserva: number;
  id_vendedor: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  fecha_reserva: string;
  total_pagar: number;
  notas?: string;
  estado: string;
  fecha_expiracion?: string;
  eliminado: boolean;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_tour?: string;
  detalles_pasajes?: DetallePasaje[];
  detalles_paquete?: DetallePaquete;
}

interface DetallePasaje {
  id_tipo_pasaje: number;
  nombre_tipo_pasaje: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

interface DetallePaquete {
  id_paquete: number;
  nombre_paquete: string;
  cantidad: number;
  precio_total: number;
}

interface Pago {
  id_pago: number;
  id_reserva: number;
  metodo_pago: string;
  canal_pago: string;
  monto: number;
  fecha_pago: string;
  estado: string;
  comprobante?: string;
}

// Componente principal
const ReservaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPagado, setTotalPagado] = useState(0);
  
  // Cargar datos de la reserva
  useEffect(() => {
    const fetchReserva = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar la reserva
        const response = await axios.get('/vendedor/reservas/' + id);
        
        if (response.data && response.data.data) {
          setReserva(response.data.data);
          
          // Cargar pagos asociados
          const pagosResponse = await axios.get('/vendedor/pagos/reserva/' + id);
          if (pagosResponse.data && pagosResponse.data.data) {
            setPagos(pagosResponse.data.data);
            
            // Calcular total pagado
            let total = 0;
            pagosResponse.data.data.forEach((pago: Pago) => {
              if (pago.estado === 'PROCESADO') {
                total += pago.monto;
              }
            });
            
            setTotalPagado(total);
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
  }, [id]);
  
  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    if (!fecha) return '-';
    
    try {
      const date = new Date(fecha);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      return fecha;
    }
  };
  
  // Obtener color de estado
  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'RESERVADO':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800';
      case 'COMPLETADO':
        return 'bg-purple-100 text-purple-800';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Calcular saldo pendiente
  const saldoPendiente = reserva ? reserva.total_pagar - totalPagado : 0;
  
  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/vendedor/reservas')}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <FaArrowLeft className="mr-2" /> Volver a Reservas
        </button>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Detalles de Reserva #{id}
        </h1>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-medium">{error}</p>
            <button 
              onClick={() => navigate('/vendedor/reservas')}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded"
            >
              Volver a Reservas
            </button>
          </div>
        ) : reserva ? (
          <div className="space-y-6">
            {/* Encabezado con estado y acciones *//*}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Reserva #{reserva.id_reserva}
                </h2>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getEstadoColor(reserva.estado)}`}>
                    {reserva.estado}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">
                    {formatearFecha(reserva.fecha_reserva)}
                  </span>
                </div>
              </div>
              
              <div className="flex gap-2 mt-4 md:mt-0">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-bold py-2 px-4 rounded flex items-center"
                  onClick={() => navigate(`/vendedor/reservas/editar/${reserva.id_reserva}`)}
                >
                  <FaEdit className="mr-2" />
                  Editar
                </button>
                
                {reserva.estado === 'RESERVADO' && (
                  <button
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaMoneyBill className="mr-2" />
                    Registrar Pago
                  </button>
                )}
                
                {(reserva.estado === 'RESERVADO' || reserva.estado === 'CONFIRMADO') && (
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-bold py-2 px-4 rounded flex items-center"
                  >
                    <FaTrash className="mr-2" />
                    Cancelar
                  </button>
                )}
              </div>
            </div>
            
            {/* Información principal *//*}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del tour *//*}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                  <FaShip className="mr-2 text-blue-500" />
                  Información del Tour
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Tour</p>
                    <p className="font-semibold">{reserva.nombre_tour || 'No especificado'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <p className="font-semibold">{reserva.fecha_tour || 'No especificada'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <p className="font-semibold">{reserva.hora_tour || 'No especificada'}</p>
                  </div>
                </div>
              </div>
              
              {/* Información del cliente *//*}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                  <FaUser className="mr-2 text-green-500" />
                  Información del Cliente
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold">{reserva.nombre_cliente || 'No especificado'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Documento</p>
                    <p className="font-semibold">{reserva.documento_cliente || 'No especificado'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Detalles de pasajes *//*}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                <FaTicketAlt className="mr-2 text-purple-500" />
                Detalles de Pasajes
              </h3>
              
              {reserva.detalles_paquete ? (
                <div>
                  <div className="bg-gray-100 p-3 rounded-lg mb-3 grid grid-cols-12 gap-4 font-bold">
                    <div className="col-span-8">Paquete</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  <div className="p-3 grid grid-cols-12 gap-4 border-b border-gray-200">
                    <div className="col-span-8">
                      <p className="font-semibold">{reserva.detalles_paquete.nombre_paquete}</p>
                    </div>
                    
                    <div className="col-span-2 text-center">{reserva.detalles_paquete.cantidad}</div>
                    
                    <div className="col-span-2 text-right font-bold">
                      S/ {reserva.detalles_paquete.precio_total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ) : reserva.detalles_pasajes && reserva.detalles_pasajes.length > 0 ? (
                <div>
                  <div className="bg-gray-100 p-3 rounded-lg mb-3 grid grid-cols-12 gap-4 font-bold">
                    <div className="col-span-8">Tipo de Pasaje</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  {reserva.detalles_pasajes.map((detalle, index) => (
                    <div key={index} className="p-3 grid grid-cols-12 gap-4 border-b border-gray-200">
                      <div className="col-span-8">
                        <p className="font-semibold">{detalle.nombre_tipo_pasaje}</p>
                      </div>
                      
                      <div className="col-span-2 text-center">{detalle.cantidad}</div>
                      
                      <div className="col-span-2 text-right font-bold">
                        S/ {detalle.subtotal.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                  <p>No hay detalles de pasajes disponibles.</p>
                </div>
              )}
              
              {reserva.notas && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <p className="font-medium text-gray-700">Notas:</p>
                  <p className="text-gray-600">{reserva.notas}</p>
                </div>
              )}
            </div>
            
            {/* Información de pagos *//*}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                <FaMoneyBill className="mr-2 text-yellow-500" />
                Información de Pagos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-blue-700">Total de Reserva</p>
                  <p className="text-2xl font-bold text-blue-800">S/ {reserva.total_pagar.toFixed(2)}</p>
                </div>
                
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-700">Total Pagado</p>
                  <p className="text-2xl font-bold text-green-800">S/ {totalPagado.toFixed(2)}</p>
                </div>
                
                <div className={`rounded-lg p-4 ${saldoPendiente > 0 ? 'bg-red-50' : 'bg-green-50'}`}>
                  <p className={`text-sm ${saldoPendiente > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {saldoPendiente > 0 ? 'Saldo Pendiente' : 'Completamente Pagado'}
                  </p>
                  <p className={`text-2xl font-bold ${saldoPendiente > 0 ? 'text-red-800' : 'text-green-800'}`}>
                    {saldoPendiente > 0 ? `S/ ${saldoPendiente.toFixed(2)}` : 'S/ 0.00'}
                  </p>
                </div>
              </div>
              
              {pagos.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-gray-700 mb-3">Historial de Pagos:</h4>
                  <div className="bg-gray-100 p-3 rounded-lg mb-3 grid grid-cols-12 gap-4 font-bold">
                    <div className="col-span-3">Fecha</div>
                    <div className="col-span-3">Método</div>
                    <div className="col-span-2">Canal</div>
                    <div className="col-span-2">Estado</div>
                    <div className="col-span-2 text-right">Monto</div>
                  </div>
                  
                  {pagos.map((pago) => (
                    <div key={pago.id_pago} className="p-3 grid grid-cols-12 gap-4 border-b border-gray-200">
                      <div className="col-span-3">
                        {formatearFecha(pago.fecha_pago)}
                      </div>
                      
                      <div className="col-span-3">
                        {pago.metodo_pago}
                      </div>
                      
                      <div className="col-span-2">
                        {pago.canal_pago}
                      </div>
                      
                      <div className="col-span-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pago.estado === 'PROCESADO' ? 'bg-green-100 text-green-800' : 
                          pago.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {pago.estado}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-right font-bold">
                        S/ {pago.monto.toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg">
                  <p>No hay pagos registrados para esta reserva.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg">
            <p>No se encontró información para esta reserva.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservaDetail;*/

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import axios from '../../../api/axiosClient';
import { endpoints } from '../../../api/endpoints';
import { 
  FaArrowLeft, FaEdit, FaTrash, FaMoneyBill, FaFileInvoice, FaTicketAlt, 
  FaUser, FaCalendarAlt, FaShip, FaClock, FaClipboardCheck, FaExclamationTriangle,
  FaCheckCircle, FaDownload, FaMoneyBillWave, FaPhone, FaEnvelope
} from 'react-icons/fa';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import ROUTES from '../../../../shared/constants/appRoutes';

// Interfaces
interface Reserva {
  id_reserva: number;
  id_vendedor: number;
  id_cliente: number;
  id_instancia: number;
  id_paquete?: number;
  fecha_reserva: string;
  total_pagar: number;
  notas?: string;
  estado: string;
  fecha_expiracion?: string;
  eliminado: boolean;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_tour?: string;
  detalles_pasajes?: DetallePasaje[];
  detalles_paquete?: DetallePaquete;
}

interface DetallePasaje {
  id_tipo_pasaje: number;
  nombre_tipo_pasaje: string;
  cantidad: number;
  costo_unitario: number;
  subtotal: number;
}

interface DetallePaquete {
  id_paquete: number;
  nombre_paquete: string;
  cantidad: number;
  precio_total: number;
}

interface Pago {
  id_pago: number;
  id_reserva: number;
  metodo_pago: string;
  canal_pago: string;
  monto: number;
  fecha_pago: string;
  estado: string;
  comprobante?: string;
}

// Componente principal
const ReservaDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [reserva, setReserva] = useState<Reserva | null>(null);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPagado, setTotalPagado] = useState(0);
  
  // Cargar datos de la reserva
  useEffect(() => {
    const fetchReserva = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        // Cargar la reserva
        const response = await axios.get(endpoints.reserva.vendedorGetById(parseInt(id)));
        
        if (response.data && response.data.data) {
          setReserva(response.data.data);
          
          // Cargar pagos asociados
          const pagosResponse = await axios.get(endpoints.pago.vendedorListByReserva(parseInt(id)));
          if (pagosResponse.data && pagosResponse.data.data) {
            setPagos(pagosResponse.data.data);
            
            // Calcular total pagado
            let total = 0;
            pagosResponse.data.data.forEach((pago: Pago) => {
              if (pago.estado === 'PROCESADO') {
                total += pago.monto;
              }
            });
            
            setTotalPagado(total);
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
  }, [id]);
  
  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    if (!fecha) return '-';
    
    try {
      const date = new Date(fecha);
      return format(date, 'dd/MM/yyyy HH:mm', { locale: es });
    } catch (error) {
      return fecha;
    }
  };
  
  // Formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  };
  
  // Obtener color de estado
  const getEstadoColor = (estado: string): string => {
    switch (estado) {
      case 'RESERVADO':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CONFIRMADO':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'COMPLETADO':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'CANCELADO':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };
  
  // Calcular saldo pendiente
  const saldoPendiente = reserva ? reserva.total_pagar - totalPagado : 0;
  
  const handleEdit = () => {
    navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(id || ''));
  };
  
  return (
    <div className="py-8 px-4 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.LIST)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 bg-white px-4 py-2 rounded-lg shadow-sm transition-all hover:shadow"
        >
          <FaArrowLeft className="mr-2" /> Volver a Reservas
        </button>
        
        {loading ? (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando información de la reserva...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-medium flex items-center">
              <FaExclamationTriangle className="mr-2" />
              {error}
            </p>
            <button 
              onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.LIST)}
              className="mt-4 bg-red-100 hover:bg-red-200 text-red-800 font-bold py-2 px-4 rounded"
            >
              Volver a Reservas
            </button>
          </div>
        ) : reserva ? (
          <div className="space-y-6">
            {/* Encabezado con estado y acciones */}
            <div className="bg-white rounded-xl shadow-lg p-6 flex flex-col md:flex-row justify-between items-start md:items-center">
              <div>
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FaClipboardCheck className="text-blue-500 mr-2" />
                  Reserva #{reserva.id_reserva}
                </h2>
                <div className="flex items-center mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getEstadoColor(reserva.estado)}`}>
                    {reserva.estado}
                  </span>
                  <span className="mx-2 text-gray-400">•</span>
                  <span className="text-gray-600">
                    {formatearFecha(reserva.fecha_reserva)}
                  </span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
                <button
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                  onClick={handleEdit}
                >
                  <FaEdit className="mr-2" />
                  Editar
                </button>
                
                {saldoPendiente > 0 && (
                  <button
                    className="bg-green-100 hover:bg-green-200 text-green-700 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                    onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(id || ''))} 
                  >
                    <FaMoneyBillWave className="mr-2" />
                    Registrar Pago
                  </button>
                )}
                
                {(reserva.estado === 'RESERVADO' || reserva.estado === 'CONFIRMADO') && (
                  <button
                    className="bg-red-100 hover:bg-red-200 text-red-700 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                  >
                    <FaTrash className="mr-2" />
                    Cancelar
                  </button>
                )}
                
                <button
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 font-semibold py-2 px-4 rounded-lg flex items-center transition-colors"
                >
                  <FaDownload className="mr-2" />
                  Voucher
                </button>
              </div>
            </div>
            
            {/* Información principal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Información del cliente */}
              <div className="md:col-span-1 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-700 p-2 rounded-md text-white mr-3">
                    <FaUser className="text-lg" />
                  </div>
                  Información del Cliente
                </h3>
                
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-semibold text-lg">{reserva.nombre_cliente || 'No especificado'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Documento</p>
                    <p className="font-medium">{reserva.documento_cliente || 'No especificado'}</p>
                  </div>
                  
                  <div className="flex space-x-2 mt-4">
                    <button className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-3 py-1 rounded-lg text-sm flex items-center transition-colors">
                      <FaPhone className="mr-2" /> Llamar
                    </button>
                    <button className="bg-green-50 hover:bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm flex items-center transition-colors">
                      <FaEnvelope className="mr-2" /> Email
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Información del tour */}
              <div className="md:col-span-2 bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                  <div className="bg-gradient-to-br from-green-500 to-green-700 p-2 rounded-md text-white mr-3">
                    <FaShip className="text-lg" />
                  </div>
                  Información del Tour
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-500">Tour</p>
                    <p className="font-semibold text-lg">{reserva.nombre_tour || 'No especificado'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Fecha</p>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-green-600 mr-2" />
                      <p className="font-medium">{reserva.fecha_tour || 'No especificada'}</p>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Hora</p>
                    <div className="flex items-center">
                      <FaClock className="text-green-600 mr-2" />
                      <p className="font-medium">{reserva.hora_tour || 'No especificada'}</p>
                    </div>
                  </div>
                </div>
                
                {reserva.notas && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="font-medium text-gray-700 mb-1">Notas:</p>
                    <p className="text-gray-600">{reserva.notas}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Detalles de pasajes */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 p-2 rounded-md text-white mr-3">
                  <FaTicketAlt className="text-lg" />
                </div>
                Detalles de Pasajes
              </h3>
              
              {reserva.detalles_paquete ? (
                <div>
                  <div className="bg-purple-50 p-3 rounded-t-lg grid grid-cols-12 gap-4 font-bold border border-b-0 border-purple-200">
                    <div className="col-span-8">Paquete</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  <div className="p-4 grid grid-cols-12 gap-4 border border-gray-200 rounded-b-lg mb-4">
                    <div className="col-span-8">
                      <p className="font-semibold text-purple-800">{reserva.detalles_paquete.nombre_paquete}</p>
                    </div>
                    
                    <div className="col-span-2 text-center">
                      <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                        {reserva.detalles_paquete.cantidad}
                      </span>
                    </div>
                    
                    <div className="col-span-2 text-right font-bold text-purple-800">
                      {formatMoneda(reserva.detalles_paquete.precio_total)}
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-bold">
                      Total: {formatMoneda(reserva.detalles_paquete.precio_total)}
                    </div>
                  </div>
                </div>
              ) : reserva.detalles_pasajes && reserva.detalles_pasajes.length > 0 ? (
                <div>
                  <div className="bg-purple-50 p-3 rounded-t-lg grid grid-cols-12 gap-4 font-bold border border-b-0 border-purple-200">
                    <div className="col-span-8">Tipo de Pasaje</div>
                    <div className="col-span-2 text-center">Cantidad</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  {reserva.detalles_pasajes.map((detalle, index) => (
                    <div key={index} className={`p-4 grid grid-cols-12 gap-4 border-l border-r border-gray-200 ${
                      index === reserva.detalles_pasajes!.length - 1 ? 'border-b rounded-b-lg' : 'border-b'
                    }`}>
                      <div className="col-span-8">
                        <p className="font-semibold text-gray-800">{detalle.nombre_tipo_pasaje}</p>
                        <p className="text-sm text-gray-500">
                          {formatMoneda(detalle.costo_unitario)} por pasaje
                        </p>
                      </div>
                      
                      <div className="col-span-2 text-center">
                        <span className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {detalle.cantidad}
                        </span>
                      </div>
                      
                      <div className="col-span-2 text-right font-bold text-purple-800">
                        {formatMoneda(detalle.subtotal)}
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex justify-end mt-4">
                    <div className="bg-purple-100 text-purple-800 px-4 py-2 rounded-lg font-bold flex items-center">
                      <FaTicketAlt className="mr-2" />
                      Total: {formatMoneda(reserva.total_pagar)}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  <p>No hay detalles de pasajes disponibles.</p>
                </div>
              )}
            </div>
            
            {/* Información de pagos */}
            <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
              <h3 className="font-bold text-xl text-gray-800 mb-4 flex items-center">
                <div className="bg-gradient-to-br from-yellow-500 to-amber-700 p-2 rounded-md text-white mr-3">
                  <FaMoneyBill className="text-lg" />
                </div>
                Información de Pagos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-blue-50 rounded-lg p-5 border border-blue-200 flex flex-col justify-between">
                  <p className="text-sm text-blue-700 flex items-center">
                    <FaFileInvoice className="mr-2" />
                    Total de Reserva
                  </p>
                  <p className="text-2xl font-bold text-blue-800 mt-2">{formatMoneda(reserva.total_pagar)}</p>
                </div>
                           <div className="bg-green-50 rounded-lg p-5 border border-green-200 flex flex-col justify-between">
                  <p className="text-sm text-green-700 flex items-center">
                    <FaCheckCircle className="mr-2" />
                    Total Pagado
                  </p>
                  <p className="text-2xl font-bold text-green-800 mt-2">{formatMoneda(totalPagado)}</p>
                </div>
                
                <div className={`rounded-lg p-5 border flex flex-col justify-between ${
                  saldoPendiente > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                }`}>
                  <p className={`text-sm flex items-center ${saldoPendiente > 0 ? 'text-red-700' : 'text-green-700'}`}>
                    {saldoPendiente > 0 ? (
                      <>
                        <FaExclamationTriangle className="mr-2" />
                        Saldo Pendiente
                      </>
                    ) : (
                      <>
                        <FaCheckCircle className="mr-2" />
                        Completamente Pagado
                      </>
                    )}
                  </p>
                  <p className={`text-2xl font-bold mt-2 ${saldoPendiente > 0 ? 'text-red-800' : 'text-green-800'}`}>
                    {saldoPendiente > 0 ? formatMoneda(saldoPendiente) : formatMoneda(0)}
                  </p>
                </div>
              </div>
              
              {pagos.length > 0 ? (
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <div className="bg-gradient-to-r from-amber-400 to-amber-500 p-1 rounded text-white mr-2">
                      <FaMoneyBillWave className="text-sm" />
                    </div>
                    Historial de Pagos:
                  </h4>
                  
                  <div className="overflow-x-auto border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gradient-to-r from-amber-50 to-amber-100">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Fecha</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Método</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Canal</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Estado</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-600 uppercase tracking-wider">Monto</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {pagos.map((pago, index) => (
                          <tr key={pago.id_pago} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {formatearFecha(pago.fecha_pago)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                              {pago.metodo_pago}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                              {pago.canal_pago}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                pago.estado === 'PROCESADO' ? 'bg-green-100 text-green-800 border border-green-200' : 
                                pago.estado === 'PENDIENTE' ? 'bg-yellow-100 text-yellow-800 border border-yellow-200' : 
                                'bg-red-100 text-red-800 border border-red-200'
                              }`}>
                                {pago.estado}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-right text-amber-700">
                              {formatMoneda(pago.monto)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot className="bg-amber-50">
                        <tr>
                          <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-gray-700">Total pagado:</td>
                          <td className="px-6 py-3 text-sm font-bold text-right text-amber-700">{formatMoneda(totalPagado)}</td>
                        </tr>
                        {saldoPendiente > 0 && (
                          <tr>
                            <td colSpan={4} className="px-6 py-3 text-right text-sm font-medium text-red-600">Saldo pendiente:</td>
                            <td className="px-6 py-3 text-sm font-bold text-right text-red-600">{formatMoneda(saldoPendiente)}</td>
                          </tr>
                        )}
                      </tfoot>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg flex items-center">
                  <FaExclamationTriangle className="mr-2" />
                  <p>No hay pagos registrados para esta reserva.</p>
                </div>
              )}
              
              {/* Acciones de pago */}
              {saldoPendiente > 0 && (
                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.EDITAR(id || ''))}
                    className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold py-2 px-6 rounded-lg flex items-center transition-all shadow-md"
                  >
                    <FaMoneyBillWave className="mr-2" />
                    Registrar pago
                  </button>
                </div>
              )}
            </div>
            
            {/* Botones de acción principales */}
            <div className="flex flex-wrap justify-end space-x-0 space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
              <button
                onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.LIST)}
                className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 border border-gray-300 text-gray-800 font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all"
              >
                <FaArrowLeft className="mr-2" />
                Volver a Reservas
              </button>
              
              <button
                onClick={handleEdit}
                className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all shadow-md"
              >
                <FaEdit className="mr-2" />
                Editar Reserva
              </button>
              
              <button
                className="w-full sm:w-auto bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-2 px-6 rounded-lg flex items-center justify-center transition-all shadow-md"
              >
                <FaDownload className="mr-2" />
                Descargar Voucher
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-4 rounded-lg flex items-center">
            <FaExclamationTriangle className="mr-2 text-2xl" />
            <div>
              <p className="font-medium">No se encontró información para esta reserva.</p>
              <button 
                onClick={() => navigate(ROUTES.VENDEDOR.RESERVA.LIST)}
                className="mt-3 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-1 px-4 rounded transition-colors"
              >
                Volver a Reservas
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReservaDetail;