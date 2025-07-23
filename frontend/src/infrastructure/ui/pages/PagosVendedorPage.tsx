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
import { useNavigate } from 'react-router-dom';
 import ROUTES from '../../../shared/constants/appRoutes';

interface Pago {
  id_pago: number;
  id_reserva: number;
  metodo_pago: string;
  canal_pago: string;
  monto: number;
  fecha_pago: string;
  estado: string;
  comprobante?: string | null;
  numero_comprobante?: string | null;
  // Campos adicionales que vienen de la API para mostrar en la tabla
  NombreCliente?: string;
  ApellidosCliente?: string;
  DocumentoCliente?: string;
  TourNombre?: string;
  TourFecha?: string;
}

// Convertir datos de la API al formato que necesitamos para mostrar
const adaptarPago = (pago: any): Pago => {
  return {
    id_pago: pago.id || pago.ID || pago.id_pago,
    id_reserva: pago.id_reserva,
    metodo_pago: pago.metodo_pago,
    canal_pago: pago.canal_pago,
    monto: pago.monto,
    fecha_pago: pago.fecha_pago,
    estado: pago.estado,
    comprobante: pago.comprobante,
    numero_comprobante: pago.numero_comprobante,
    // Campos para mostrar en la tabla
    NombreCliente: pago.NombreCliente || pago.nombres,
    ApellidosCliente: pago.ApellidosCliente || pago.apellidos,
    DocumentoCliente: pago.DocumentoCliente || pago.numero_documento,
    TourNombre: pago.TourNombre || pago.nombre,
    TourFecha: pago.TourFecha || pago.fecha_especifica
  };
};

const PagosVendedorPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
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
  
  // Cargar datos de ejemplo cuando hay un error
  const loadSampleData = () => {
    return [
      { 
        id_pago: 1,
        id_reserva: 101,
        NombreCliente: 'Juan',
        ApellidosCliente: 'Pérez', 
        DocumentoCliente: '45678912',
        TourNombre: 'Islas Ballestas',
        TourFecha: '2025-06-09',
        fecha_pago: '2025-06-09', 
        metodo_pago: 'EFECTIVO', 
        canal_pago: 'LOCAL',
        monto: 150.00,
        estado: 'PROCESADO',
        comprobante: 'Boleta',
        numero_comprobante: 'B-001-123'
      },
      { 
        id_pago: 2, 
        id_reserva: 102,
        NombreCliente: 'María',
        ApellidosCliente: 'López',
        DocumentoCliente: '12345678',
        TourNombre: 'Reserva de Paracas',
        TourFecha: '2025-06-08',
        fecha_pago: '2025-06-08', 
        metodo_pago: 'TARJETA', 
        canal_pago: 'WEB',
        monto: 100.00,
        estado: 'PROCESADO',
        comprobante: 'Factura',
        numero_comprobante: 'F-001-456'
      },
      { 
        id_pago: 3, 
        id_reserva: 103,
        NombreCliente: 'Carlos',
        ApellidosCliente: 'Rodríguez',
        DocumentoCliente: '87654321',
        TourNombre: 'Islas Ballestas',
        TourFecha: '2025-06-07',
        fecha_pago: '2025-06-07', 
        metodo_pago: 'TRANSFERENCIA', 
        canal_pago: 'LOCAL',
        monto: 200.00,
        estado: 'PENDIENTE',
        comprobante: 'Pendiente',
        numero_comprobante: null
      }
    ];
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
        
        // Cargar reservas y luego sus pagos
        try {
          // Primero obtenemos todas las reservas
          const reservasResponse = await axios.get(endpoints.reserva.vendedorList);
          
          if (reservasResponse.data && reservasResponse.data.data) {
            const reservas = reservasResponse.data.data;
            
            // Array para almacenar todos los pagos de todas las reservas
            let todosLosPagos: Pago[] = [];
            
            // Para cada reserva, obtener sus pagos
            for (const reserva of reservas) {
              try {
                const pagosResponse = await axios.get(
                  endpoints.pago.vendedorListByReserva(reserva.id_reserva)
                );
                
                if (pagosResponse.data && pagosResponse.data.data) {
                  // Adaptar los datos de los pagos y agregarles la información de la reserva
                  const pagosDeLaReserva = pagosResponse.data.data.map((pago: any) => ({
                    ...pago,
                    NombreCliente: reserva.nombre_cliente || reserva.nombres,
                    ApellidosCliente: reserva.apellidos,
                    DocumentoCliente: reserva.documento_cliente || reserva.numero_documento,
                    TourNombre: reserva.nombre_tour,
                    TourFecha: reserva.fecha_tour
                  }));
                  
                  todosLosPagos = [...todosLosPagos, ...pagosDeLaReserva];
                }
              } catch (error) {
                console.warn(`Error al cargar pagos para reserva ${reserva.id_reserva}:`, error);
                // Continuamos con la siguiente reserva
              }
            }
            
            // Ordenar los pagos por fecha (más recientes primero)
            todosLosPagos.sort((a, b) => 
              new Date(b.fecha_pago).getTime() - new Date(a.fecha_pago).getTime()
            );
            
            // Actualizar estado
            setPagos(todosLosPagos);
            
            if (todosLosPagos.length === 0) {
              setApiError("No se encontraron pagos para ninguna reserva.");
            }
          } else {
            throw new Error("No se encontraron reservas");
          }
        } catch (error: any) {
          console.error('Error al cargar reservas o pagos:', error);
          
          if (error.response && error.response.data && error.response.data.message) {
            setApiError(error.response.data.message);
          } else {
            setApiError("Error al cargar los datos. Se están mostrando datos de ejemplo.");
          }
          
          setPagos(loadSampleData());
        }
        
      } catch (error: any) {
        console.error('Error general:', error);
        setApiError(error.message || 'Error al cargar los pagos');
        
        // Usar datos de ejemplo en caso de error
        setPagos(loadSampleData());
      } finally {
        setLoading(false);
      }
    };
    
    fetchPagos();
  }, [dispatch, selectedSede]);
  
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
  
  const handleVerReserva = (idReserva: number) => {
    navigate(ROUTES.VENDEDOR.RESERVA.VER(idReserva.toString()));
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
  
  // Función para mostrar nombre completo del cliente
  const getNombreCompleto = (pago: Pago) => {
    const nombre = pago.NombreCliente || '';
    const apellidos = pago.ApellidosCliente || '';
    return `${nombre} ${apellidos}`.trim();
  };
  
  const filteredPagos = pagos.filter(pago => {
    const nombreCompleto = getNombreCompleto(pago).toLowerCase();
    const tourNombre = (pago.TourNombre || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return nombreCompleto.includes(searchTermLower) || 
           tourNombre.includes(searchTermLower);
  });
  
  // Calcular totales para las tarjetas de resumen
  const totales = {
    efectivo: pagos.filter(p => p.metodo_pago === 'EFECTIVO').reduce((sum, p) => sum + p.monto, 0),
    tarjeta: pagos.filter(p => p.metodo_pago === 'TARJETA').reduce((sum, p) => sum + p.monto, 0),
    transferencia: pagos.filter(p => p.metodo_pago === 'TRANSFERENCIA').reduce((sum, p) => sum + p.monto, 0),
    total: pagos.reduce((sum, p) => sum + p.monto, 0)
  };
  
  const columns = [
    { 
      header: 'Cliente', 
      accessor: (row: Pago) => getNombreCompleto(row) 
    },
    { 
      header: 'Tour', 
      accessor: 'TourNombre' 
    },
    { 
      header: 'Fecha Tour', 
      accessor: (row: Pago) => formatearFecha(row.TourFecha || '') 
    },
    { 
      header: 'Fecha Pago', 
      accessor: (row: Pago) => formatearFecha(row.fecha_pago) 
    },
    { 
      header: 'Método', 
      accessor: 'metodo_pago' 
    },
    { 
      header: 'Monto', 
      accessor: (row: Pago) => formatMoneda(row.monto) 
    },
    { 
      header: 'Estado', 
      accessor: (row: Pago) => {
        const bgColor = row.estado === 'PROCESADO' 
          ? 'bg-green-100 text-green-800' 
          : 'bg-yellow-100 text-yellow-800';
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>{row.estado}</span>;
      }
    },
    { 
      header: 'Comprobante', 
      accessor: (row: Pago) => (
        <span className="flex items-center">
          {row.comprobante} 
          {row.numero_comprobante && <span className="ml-1 text-xs text-gray-500">({row.numero_comprobante})</span>}
        </span>
      )
    },
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
  
  const handleSubmitPago = async (e: React.FormEvent) => {
    e.preventDefault();
    // Implementar la lógica para enviar el formulario de pago
    // Usar axios.post(endpoints.pago.vendedorCreate, {...datos})
    setIsModalOpen(false);
  };
  
  return (
    <div className="py-6 px-4 space-y-6 bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto">
        {/* Información de fecha y usuario actual */}
         
        
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
          <div className="mt-4 bg-amber-50 border border-amber-200 text-amber-700 px-4 py-3 rounded-lg flex items-start">
            <FaExclamationTriangle className="mt-1 mr-3 flex-shrink-0" />
            <div>
              <p className="font-medium">Aviso</p>
              <p className="mt-1">{apiError}</p>
              {apiError.includes("ejemplo") && (
                <p className="mt-2 text-sm">Se están mostrando datos de ejemplo hasta que se corrija el problema con la API.</p>
              )}
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
                    <p className="font-medium">{getNombreCompleto(selectedPago)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Tour:</p>
                    <p className="font-medium">{selectedPago.TourNombre}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha Tour:</p>
                    <p className="font-medium">{formatearFecha(selectedPago.TourFecha || '')}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Fecha Pago:</p>
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
                    onClick={() => handleVerReserva(selectedPago.id_reserva)}
                    variant="primary"
                    className="flex items-center gap-2"
                  >
                    Ver Reserva
                  </Button>
                  <Button
                    onClick={() => setIsModalOpen(false)}
                    variant="secondary"
                  >
                    Cerrar
                  </Button>
                </div>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmitPago}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reserva</label>
                    <input 
                      type="number" 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="ID de reserva"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
                    <input 
                      type="text" 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Nombre del cliente"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tour</label>
                    <select 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
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
                      required
                    >
                      <option value="">Seleccionar método</option>
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TARJETA">Tarjeta</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                      <option value="YAPE">Yape</option>
                      <option value="PLIN">Plin</option>
                      <option value="DEPOSITO">Depósito</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Canal de Pago</label>
                    <select 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Seleccionar canal</option>
                      <option value="LOCAL">Oficina</option>
                      <option value="WEB">Web</option>
                      <option value="APP">App</option>
                      <option value="TELEFONO">Teléfono</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Monto</label>
                    <input 
                      type="number" 
                      step="0.01" 
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                    <input 
                      type="date" 
                      defaultValue={new Date().toISOString().split('T')[0]}
                      className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comprobante</label>
                  <div className="flex space-x-4">
                    <label className="flex items-center">
                      <input type="radio" name="comprobante" value="Boleta" className="mr-2" required />
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
                    type="button"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    variant="success"
                    className="flex items-center gap-2"
                    type="submit"
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