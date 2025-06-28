import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../../infrastructure/store';
import Table from '../components/Table';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { FaMoneyBillWave, FaSearch, FaPrint, FaFileInvoice, FaFilter } from 'react-icons/fa';

interface Pago {
  id: number;
  cliente: string;
  tour: string;
  fecha: string;
  metodo: string;
  monto: string;
  estado: string;
  comprobante: string;
}

const PagosVendedorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  
  const [loading, setLoading] = useState(false);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPago, setSelectedPago] = useState<Pago | null>(null);
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setDate(new Date().getDate() - 7)).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  useEffect(() => {
    const fetchPagos = async () => {
      try {
        setLoading(true);
        
        // Datos de ejemplo
        setTimeout(() => {
          setPagos([
            { 
              id: 1, 
              cliente: 'Juan Pérez', 
              tour: 'Islas Ballestas', 
              fecha: '2025-06-09', 
              metodo: 'Efectivo', 
              monto: 'S/ 150.00',
              estado: 'Completado',
              comprobante: 'Boleta'
            },
            { 
              id: 2, 
              cliente: 'María López', 
              tour: 'Reserva de Paracas', 
              fecha: '2025-06-08', 
              metodo: 'Tarjeta', 
              monto: 'S/ 100.00',
              estado: 'Completado',
              comprobante: 'Factura'
            },
            { 
              id: 3, 
              cliente: 'Carlos Rodríguez', 
              tour: 'Islas Ballestas', 
              fecha: '2025-06-07', 
              metodo: 'Transferencia', 
              monto: 'S/ 200.00',
              estado: 'Pendiente',
              comprobante: 'Pendiente'
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
    pago.tour.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Calcular totales para las tarjetas de resumen
  const totales = {
    efectivo: pagos.filter(p => p.metodo === 'Efectivo').reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0),
    tarjeta: pagos.filter(p => p.metodo === 'Tarjeta').reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0),
    transferencia: pagos.filter(p => p.metodo === 'Transferencia').reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0),
    total: pagos.reduce((sum, p) => sum + parseFloat(p.monto.replace('S/ ', '')), 0)
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
            <FaSearch />
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
          <h3 className="text-sm font-medium text-blue-700">Efectivo</h3>
          <p className="text-2xl font-bold text-blue-800 mt-1">S/ {totales.efectivo.toFixed(2)}</p>
        </Card>
        <Card className="bg-purple-50 border border-purple-200 p-4">
          <h3 className="text-sm font-medium text-purple-700">Tarjeta</h3>
          <p className="text-2xl font-bold text-purple-800 mt-1">S/ {totales.tarjeta.toFixed(2)}</p>
        </Card>
        <Card className="bg-green-50 border border-green-200 p-4">
          <h3 className="text-sm font-medium text-green-700">Transferencia</h3>
          <p className="text-2xl font-bold text-green-800 mt-1">S/ {totales.transferencia.toFixed(2)}</p>
        </Card>
        <Card className="bg-gray-50 border border-gray-200 p-4">
          <h3 className="text-sm font-medium text-gray-700">Total</h3>
          <p className="text-2xl font-bold text-gray-800 mt-1">S/ {totales.total.toFixed(2)}</p>
        </Card>
      </div>
      
      {/* Filtros y búsqueda */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
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
      <div className="bg-white rounded-lg shadow-sm">
        {loading ? (
          <div className="p-8 text-center">
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
              <h3 className="font-medium">Información del Pago #{selectedPago.id}</h3>
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
              </div>
              <div className="pt-4 flex justify-end">
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
              {/* Aquí irían los campos del formulario de pago */}
              <p className="text-gray-500">Formulario de pago aquí...</p>
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
                  Registrar Pago
                </Button>
              </div>
            </form>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default PagosVendedorPage;
//angel