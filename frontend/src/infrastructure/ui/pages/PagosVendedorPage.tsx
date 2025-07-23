import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import axios from '../../api/axiosClient';
import { endpoints } from '../../api/endpoints';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { FaMoneyBillWave, FaSearch, FaPrint, FaFileInvoice, FaFilter, FaEye, FaPlus, FaExclamationTriangle } from 'react-icons/fa';

interface Pago {
  id_pago: number;
  id_reserva: number;
  cliente: string;
  tour: string;
  fecha_pago: string;
  metodo_pago: string;
  canal_pago: string;
  monto: number;
  estado: string;
  comprobante?: string | null;
  numero_comprobante?: string | null;
}

const PagosVendedorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Fecha UTC formateada
  const getCurrentDateTimeUTC = (): string => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };
  
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        setApiError(null);
        
        // Verificar si hay sede seleccionada
        if (!selectedSede) {
          throw new Error("Usuario no tiene sede asignada");
        }
        
        // Extraer solo el ID de la sede si es un objeto
        const sedeId = typeof selectedSede === 'object' ? selectedSede.id_sede : selectedSede;
        
        // Intentar cargar pagos por sede primero
        let response;
        try {
          response = await axios.get(endpoints.pago.vendedorListBySede(sedeId), {
            params: {
              fecha_inicio: dateRange.startDate,
              fecha_fin: dateRange.endDate
            }
          });
        } catch (error) {
          // Si falla, intentar con el endpoint general
          response = await axios.get(endpoints.pago.vendedorList, {
            params: {
              id_sede: sedeId,
              fecha_inicio: dateRange.startDate,
              fecha_fin: dateRange.endDate
            }
          });
        }
        
        if (response.data && response.data.data) {
          setPagos(response.data.data);
        } else {
          setPagos([]);
        }
        
      } catch (error: any) {
        console.error('Error al cargar pagos:', error);
        setApiError(error.response?.data?.message || error.message || 'Error al cargar los pagos');
        
        // Usar datos de ejemplo en caso de error
        setPagos([
          { 
            id_pago: 1,
            id_reserva: 101,
            cliente: 'Juan Pérez', 
            tour: 'Islas Ballestas', 
            fecha_pago: '2025-06-09', 
            metodo_pago: 'Efectivo', 
            canal_pago: 'Oficina',
            monto: 150.00,
            estado: 'PROCESADO',
            comprobante: 'Boleta',
            numero_comprobante: 'B-001-123'
          },
          { 
            id_pago: 2, 
            id_reserva: 102,
            cliente: 'María López', 
            tour: 'Reserva de Paracas', 
            fecha_pago: '2025-06-08', 
            metodo_pago: 'Tarjeta', 
            canal_pago: 'Web',
            monto: 100.00,
            estado: 'PROCESADO',
            comprobante: 'Factura',
            numero_comprobante: 'F-001-456'
          },
          { 
            id_pago: 3, 
            id_reserva: 103,
            cliente: 'Carlos Rodríguez', 
            tour: 'Islas Ballestas', 
            fecha_pago: '2025-06-07', 
            metodo_pago: 'Transferencia', 
            canal_pago: 'Banco',
            monto: 200.00,
            estado: 'PENDIENTE',
            comprobante: 'Pendiente',
            numero_comprobante: null
          }
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPagos();
  }, [dispatch, selectedSede, dateRange]);
  
  const handleRegistrarPago = () => {
    setSelectedPago(null);
    setIsModalOpen(true);
  };
  
  const handleViewPago = (pago: Pago) => {
    setSelectedPago(pago);
    setIsModalOpen(true);
  };
  
  const handlePrintComprobante = (pago: Pago) => {
    console.log('Imprimir comprobante para pago:', pago);
  };
  
  const handleGenerarComprobante = (pago: Pago) => {
    console.log('Generar comprobante para pago:', pago);
  };
  
  // Formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN'
    }).format(valor);
  };
  
  // Formatear fecha
  const formatearFecha = (fecha: string): string => {
    if (!fecha) return 'No especificada';
    
    // Si ya viene en formato DD/MM/YYYY
    if (fecha.includes('/')) {
      return fecha;
    }
    
    try {
      const date = new Date(fecha);
      if (isNaN(date.getTime())) {
        return fecha; // Devolver el string original si no es una fecha válida
      }
      return date.toLocaleDateString('es-PE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      return fecha;
    }
  };
  
  const filteredPagos = pagos.filter(pago => 
    pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.tour.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular totales para las tarjetas de resumen
  const totales = {
    efectivo: pagos.filter(p => p.metodo_pago === 'Efectivo').reduce((sum, p) => sum + p.monto, 0),
    tarjeta: pagos.filter(p => p.metodo_pago === 'Tarjeta').reduce((sum, p) => sum + p.monto, 0),
    transferencia: pagos.filter(p => p.metodo_pago === 'Transferencia').reduce((sum, p) => sum + p.monto, 0),
    total: pagos.reduce((sum, p) => sum + p.monto, 0)
  };
  
  const columns = [
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Tour', accessor: 'tour' },
    { header: 'Fecha', accessor: (row: Pago) => formatearFecha(row.fecha_pago) },
    { header: 'Método', accessor: 'metodo_pago' },
    { header: 'Canal', accessor: 'canal_pago' },
    { header: 'Monto', accessor: (row: Pago) => formatMoneda(row.monto) },
    { 
      header: 'Estado', 
      accessor: (row: Pago) => {
        const bgColor = row.estado === 'PROCESADO' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>{row.estado}</span>;
      }
    },
    { header: 'Comprobante', accessor: (row: Pago) => (
      <span className="flex items-center">
        {row.comprobante} 
        {row.numero_comprobante && <span className="ml-1 text-xs text-gray-500">({row.numero_comprobante})</span>}
      </span>
    )},
    {
      header: 'Acciones',
      accessor: (row: Pago) => (
        <div className="flex space-x-2">
          <button 
            onClick={() => handleViewPago(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title="Ver detalles"
          >
            <FaEye />
          </button>
          {row.estado === 'PROCESADO' && (
            <button 
              onClick={() => handlePrintComprobante(row)}
              className="p-1 text-green-600 hover:text-green-800"
              title="Imprimir comprobante"
            >
              <FaPrint />
            </button>
          )}
          {row.estado === 'PENDIENTE' && (
            <button 
              onClick={() => handleGenerarComprobante(row)}
              className="p-1 text-yellow-600 hover:text-yellow-800"
              title="Generar comprobante"
            >
              <FaFileInvoice />
            </button>
          )}
        </div>
      )
    }
  ];
  
  return (
    <div className="py-6 px-4 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Información de fecha y usuario actual */}
        <div className="text-xs text-gray-500 mb-2 text-right">
          <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {getCurrentDateTimeUTC()}</p>
          <p>Current User's Login: {user?.nombres || 'Angel226m'}</p>
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
          <Button 
            onClick={handleRegistrarPago}
            className="flex items-center gap-2"
            variant="success"
          >
            <FaPlus /> Registrar Pago
          </Button>
        </div>
        
        {/* Mensaje de error de API */}
        {apiError && (
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start">
            <FaExclamationTriangle className="mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Error al cargar los pagos</p>
              <p className="mt-1">{apiError}</p>
              <p className="mt-2 text-sm">Se están mostrando datos de ejemplo. Por favor, asegúrate de tener una sede asignada y contacta al administrador si el problema persiste.</p>
            </div>
          </div>
        )}
        
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
          <Card className="bg-blue-50 border border-blue-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-blue-700">Efectivo</h3>
            <p className="text-2xl font-bold text-blue-800 mt-1">{formatMoneda(totales.efectivo)}</p>
          </Card>
          <Card className="bg-purple-50 border border-purple-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-purple-700">Tarjeta</h3>
            <p className="text-2xl font-bold text-purple-800 mt-1">{formatMoneda(totales.tarjeta)}</p>
          </Card>
          <Card className="bg-green-50 border border-green-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-green-700">Transferencia</h3>
            <p className="text-2xl font-bold text-green-800 mt-1">{formatMoneda(totales.transferencia)}</p>
          </Card>
          <Card className="bg-gray-50 border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-sm font-medium text-gray-700">Total</h3>
            <p className="text-2xl font-bold text-gray-800 mt-1">{formatMoneda(totales.total)}</p>
          </Card>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow-sm mt-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por cliente o tour..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <FaFilter className="text-gray-500" />
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <span className="text-gray-500">hasta</span>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                className="border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        {/* Tabla de pagos */}
        <div className="bg-white rounded-lg shadow-sm mt-6">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando pagos...</p>
            </div>
          ) : filteredPagos.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No se encontraron pagos</p>
            </div>
          ) : (
            <Table 
              columns={columns}
              data={filteredPagos}
            />
          )}
        </div>
        
        {/* Modal para ver/registrar pago */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedPago ? "Detalles del Pago" : "Registrar Pago"}
        >
          <div className="p-4">
            {selectedPago ? (
              <div className="space-y-4">
                <h3 className="font-medium">Información del Pago #{selectedPago.id_pago}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Cliente:</p>
                    <p className="font-medium">{selectedPago.cliente}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tour:</p>
                    <p className="font-medium">{selectedPago.tour}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha:</p>
                    <p className="font-medium">{formatearFecha(selectedPago.fecha_pago)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Monto:</p>
                    <p className="font-medium">{formatMoneda(selectedPago.monto)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Método:</p>
                    <p className="font-medium">{selectedPago.metodo_pago}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Canal:</p>
                    <p className="font-medium">{selectedPago.canal_pago}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Estado:</p>
                    <p className="font-medium">{selectedPago.estado}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Comprobante:</p>
                    <p className="font-medium">{selectedPago.comprobante || 'No emitido'}</p>
                  </div>
                  {selectedPago.numero_comprobante && (
                    <div className="col-span-2">
                      <p className="text-gray-500">Número de comprobante:</p>
                      <p className="font-medium">{selectedPago.numero_comprobante}</p>
                    </div>
                  )}
                </div>
                <div className="pt-4 flex justify-end space-x-3">
                  {selectedPago.estado === 'PROCESADO' && (
                    <Button
                      onClick={() => handlePrintComprobante(selectedPago)}
                      variant="secondary"
                      className="flex items-center gap-2"
                    >
                      <FaPrint /> Imprimir
                    </Button>
                  )}
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="primary"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre del cliente"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour</label>
                    <select 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar tour</option>
                      <option value="Islas Ballestas">Islas Ballestas</option>
                      <option value="Reserva de Paracas">Reserva de Paracas</option>
                      <option value="City Tour">City Tour</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de Pago</label>
                    <select 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar método</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canal de Pago</label>
                    <select 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Seleccionar canal</option>
                      <option value="Oficina">Oficina</option>
                      <option value="Web">Web</option>
                      <option value="Banco">Banco</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comprobante</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="comprobante" value="Boleta" className="mr-2" />
                      Boleta
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="comprobante" value="Factura" className="mr-2" />
                      Factura
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="comprobante" value="Ninguno" className="mr-2" />
                      Ninguno
                    </label>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea 
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Observaciones adicionales"
                  ></textarea>
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    onClick={() => setIsModalOpen(false)}
                    variant="secondary"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="success"
                    className="flex items-center gap-2"
                  >
                    <FaMoneyBillWave /> Registrar Pago
                  </Button>
                </div>
              </form>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default PagosVendedorPage;