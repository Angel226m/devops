import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { FaMoneyBillWave, FaSearch, FaPrint, FaFileInvoice, FaFilter, FaEye, FaCalendarAlt, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface Pago {
  id: number;
  cliente: string;
  tour: string;
  fecha: string;
  metodo: string;
  monto: string;
  estado: string;
  comprobante: string;
  id_reserva?: number;
  canal?: string;
}

const PagosVendedorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede, user } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  // Obtener fecha y hora actual en formato UTC
  const getCurrentDateTimeUTC = (): string => {
    const now = new Date();
    return now.toISOString().replace('T', ' ').substring(0, 19);
  };
  
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        
        // Simulación de llamada a API
        // En una implementación real, aquí harías una llamada a tu API
        setTimeout(() => {
          setPagos([
            { 
              id: 1, 
              cliente: 'Juan Pérez', 
              tour: 'Islas Ballestas', 
              fecha: '2025-07-20', 
              metodo: 'Efectivo', 
              monto: 'S/ 150.00',
              estado: 'Completado',
              comprobante: 'Boleta',
              id_reserva: 1245,
              canal: 'Presencial'
            },
            { 
              id: 2, 
              cliente: 'María López', 
              tour: 'Reserva de Paracas', 
              fecha: '2025-07-18', 
              metodo: 'Tarjeta', 
              monto: 'S/ 230.00',
              estado: 'Completado',
              comprobante: 'Factura',
              id_reserva: 1246,
              canal: 'Web'
            },
            { 
              id: 3, 
              cliente: 'Carlos Rodríguez', 
              tour: 'Islas Ballestas', 
              fecha: '2025-07-15', 
              metodo: 'Transferencia', 
              monto: 'S/ 200.00',
              estado: 'Pendiente',
              comprobante: 'Pendiente',
              id_reserva: 1247,
              canal: 'Transferencia bancaria'
            },
            { 
              id: 4, 
              cliente: 'Ana Gutiérrez', 
              tour: 'City Tour Paracas', 
              fecha: '2025-07-12', 
              metodo: 'Yape', 
              monto: 'S/ 175.00',
              estado: 'Completado',
              comprobante: 'Boleta',
              id_reserva: 1248,
              canal: 'Móvil'
            },
            { 
              id: 5, 
              cliente: 'Pedro Mamani', 
              tour: 'Reserva de Paracas', 
              fecha: '2025-07-10', 
              metodo: 'Efectivo', 
              monto: 'S/ 120.00',
              estado: 'Completado',
              comprobante: 'Factura',
              id_reserva: 1249,
              canal: 'Presencial'
            },
            { 
              id: 6, 
              cliente: 'Lucía Paredes', 
              tour: 'Islas Ballestas Premium', 
              fecha: '2025-07-05', 
              metodo: 'Plin', 
              monto: 'S/ 350.00',
              estado: 'Completado',
              comprobante: 'Boleta',
              id_reserva: 1250,
              canal: 'Móvil'
            }
          ]);
          setLoading(false);
        }, 1000);
        
      } catch (error) {
        console.error('Error al cargar pagos:', error);
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
  
  const filteredPagos = pagos.filter(pago => 
    pago.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.tour.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pago.metodo.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular totales para las tarjetas de resumen
  const totales = {
    efectivo: pagos.filter(p => p.metodo === 'Efectivo').reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0),
    tarjeta: pagos.filter(p => p.metodo === 'Tarjeta').reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0),
    transferencia: pagos.filter(p => (p.metodo === 'Transferencia' || p.metodo === 'Yape' || p.metodo === 'Plin')).reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0),
    total: pagos.reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0)
  };
  
  // Formatear moneda
  const formatMoneda = (valor: number): string => {
    return `S/ ${valor.toFixed(2)}`;
  };
  
  const columns = [
    { header: 'Cliente', accessor: 'cliente' },
    { header: 'Tour', accessor: 'tour' },
    { header: 'Fecha', accessor: 'fecha' },
    { header: 'Método', accessor: 'metodo' },
    { header: 'Monto', accessor: 'monto' },
    { 
      header: 'Estado', 
      accessor: (row: Pago) => {
        const bgColor = row.estado === 'Completado' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>{row.estado}</span>;
      }
    },
    { header: 'Comprobante', accessor: 'comprobante' },
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
          {row.estado === 'Completado' && (
            <button 
              onClick={() => handlePrintComprobante(row)}
              className="p-1 text-green-600 hover:text-green-800"
              title="Imprimir comprobante"
            >
              <FaPrint />
            </button>
          )}
          {row.estado === 'Pendiente' && (
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
    <div className="py-6 px-4">
      {/* Información de fecha y usuario actual */}
      <div className="text-xs text-gray-500 mb-2 text-right">
        <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): {getCurrentDateTimeUTC()}</p>
        <p>Current User's Login: {user?.nombres || 'Angel226m'}</p>
      </div>
      
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Pagos</h1>
          <Button 
            onClick={handleRegistrarPago}
            className="flex items-center gap-2"
            variant="success"
          >
            <FaMoneyBillWave /> Registrar Pago
          </Button>
        </div>
        
        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-blue-50 border border-blue-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-blue-700">Efectivo</h3>
                <p className="text-2xl font-bold text-blue-800 mt-1">{formatMoneda(totales.efectivo)}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-blue-500 text-xl" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-purple-50 border border-purple-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-purple-700">Tarjeta</h3>
                <p className="text-2xl font-bold text-purple-800 mt-1">{formatMoneda(totales.tarjeta)}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <FaFileInvoice className="text-purple-500 text-xl" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-green-50 border border-green-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-green-700">Transferencia/Digital</h3>
                <p className="text-2xl font-bold text-green-800 mt-1">{formatMoneda(totales.transferencia)}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <FaMoneyBillWave className="text-green-500 text-xl" />
              </div>
            </div>
          </Card>
          
          <Card className="bg-gray-50 border border-gray-200 p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-sm font-medium text-gray-700">Total</h3>
                <p className="text-2xl font-bold text-gray-800 mt-1">{formatMoneda(totales.total)}</p>
              </div>
              <div className="bg-gray-200 p-3 rounded-full">
                <FaCheckCircle className="text-gray-700 text-xl" />
              </div>
            </div>
          </Card>
        </div>
        
        {/* Filtros y búsqueda */}
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar por cliente, tour o método de pago..."
                  className="pl-10 pr-4 py-2 border rounded-lg w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <FaSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center bg-gray-100 px-3 py-2 rounded-lg">
                <FaCalendarAlt className="text-gray-500 mr-2" />
                <span className="text-gray-700 text-sm mr-2">Periodo:</span>
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
                <span className="text-gray-500 mx-2">hasta</span>
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="border rounded-lg px-3 py-1.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
        
        {/* Tabla de pagos */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 bg-blue-50 border-b border-blue-100">
            <h2 className="font-semibold text-blue-800 flex items-center">
              <FaMoneyBillWave className="mr-2" /> Listado de Pagos
            </h2>
          </div>
          
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Cargando pagos...</p>
            </div>
          ) : filteredPagos.length === 0 ? (
            <div className="p-8 text-center">
              <div className="mx-auto flex items-center justify-center bg-yellow-100 rounded-full w-16 h-16 mb-4">
                <FaExclamationTriangle className="text-yellow-500 text-xl" />
              </div>
              <p className="text-gray-500">No se encontraron pagos con los criterios seleccionados</p>
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
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <h3 className="font-medium text-blue-800 mb-3">Información del Pago #{selectedPago.id}</h3>
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
                      <p className="font-medium">{selectedPago.fecha}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Monto:</p>
                      <p className="font-medium">{selectedPago.monto}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Método:</p>
                      <p className="font-medium">{selectedPago.metodo}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Estado:</p>
                      <p className="font-medium">{selectedPago.estado}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Comprobante:</p>
                      <p className="font-medium">{selectedPago.comprobante}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">ID Reserva:</p>
                      <p className="font-medium">{selectedPago.id_reserva || 'No disponible'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Canal:</p>
                      <p className="font-medium">{selectedPago.canal || 'No especificado'}</p>
                    </div>
                  </div>
                </div>
                <div className="pt-4 flex justify-end">
                  {selectedPago.estado === 'Pendiente' && (
                    <Button
                      onClick={() => console.log('Procesar pago', selectedPago)}
                      variant="success"
                      className="mr-2"
                    >
                      <FaCheckCircle className="mr-2" /> Marcar como completado
                    </Button>
                  )}
                  
                  {selectedPago.estado === 'Completado' && (
                    <Button
                      onClick={() => handlePrintComprobante(selectedPago)}
                      variant="primary"
                      className="mr-2"
                    >
                      <FaPrint className="mr-2" /> Imprimir comprobante
                    </Button>
                  )}
                  
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="secondary"
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
                    <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Seleccione un tour</option>
                      <option value="1">Islas Ballestas</option>
                      <option value="2">Reserva de Paracas</option>
                      <option value="3">City Tour Paracas</option>
                      <option value="4">Islas Ballestas Premium</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de pago</label>
                    <input 
                      type="date"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      defaultValue={new Date().toISOString().split('T')[0]}
                    />
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Método de pago</label>
                    <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Seleccione un método</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="Transferencia">Transferencia</option>
                      <option value="Yape">Yape</option>
                      <option value="Plin">Plin</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canal</label>
                    <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Seleccione un canal</option>
                      <option value="Presencial">Presencial</option>
                      <option value="Web">Web</option>
                      <option value="Móvil">Móvil</option>
                      <option value="Transferencia bancaria">Transferencia bancaria</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de comprobante</label>
                    <select className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option value="">Seleccione tipo</option>
                      <option value="Boleta">Boleta</option>
                      <option value="Factura">Factura</option>
                      <option value="Ninguno">Ninguno</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">ID de Reserva (opcional)</label>
                    <input 
                      type="number"
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ID de reserva relacionada"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    placeholder="Información adicional del pago..."
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
                  >
                    <FaMoneyBillWave className="mr-2" /> Registrar Pago
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