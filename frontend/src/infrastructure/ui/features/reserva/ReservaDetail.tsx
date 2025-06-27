 
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
            {/* Encabezado con estado y acciones */}
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
            
            {/* Información principal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Información del tour */}
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
              
              {/* Información del cliente */}
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
            
            {/* Detalles de pasajes */}
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
            
            {/* Información de pagos */}
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

export default ReservaDetail;