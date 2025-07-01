/*  
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { 
  format, 
  subDays, 
  parseISO, 
  isToday, 
  differenceInDays, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  eachDayOfInterval
} from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  Area,
  AreaChart,
  ComposedChart
} from 'recharts';
import {
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiClock, 
  FiShield, 
  FiAlertCircle,
  FiTrendingUp,
  FiTrendingDown,
  FiChevronRight,
  FiAnchor,
  FiCheckCircle,
  FiCreditCard,
  FiPhone,
  FiBarChart2,
  FiPieChart,
  FiList,
  FiInfo,
  FiRefreshCw,
  FiFilter,
  FiArrowRight
} from 'react-icons/fi';

// Tipo para representar las estadísticas diarias
interface DailyStats {
  fecha: string;
  reservas: number;
  ventas: number;
  pasajeros: number;
  fechaCompleta?: Date;
}

// Tipo para representar el resumen de ventas
interface VentaResumen {
  id: number;
  tour: string;
  horario: string;
  cliente: string;
  monto: number;
  metodoPago: string;
  estado: 'completado' | 'pendiente' | 'cancelado';
  fecha: string; // Formato ISO
}

// Tipo para las próximas salidas
interface ProximaSalida {
  id: number;
  tour: string;
  fecha: string;
  hora: string;
  lugarSalida: string;
  cuposDisponibles: number;
  cuposTotal: number;
  estado: 'programado' | 'cancelado' | 'completado';
}

// Tipo para las metas de ventas
interface MetaVentas {
  periodo: string;
  meta: number;
  actual: number;
  porcentaje: number;
}

// Tipo para los métodos de pago
interface MetodoPagoStats {
  nombre: string;
  valor: number;
  color: string;
}

// Datos más detallados para las ventas diarias (último mes)
const generarVentasDiarias = (): DailyStats[] => {
  const hoy = new Date();
  const ultimoMes = Array.from({ length: 30 }, (_, i) => {
    const fecha = subDays(hoy, 29 - i);
    return {
      fecha: format(fecha, 'dd/MM', { locale: es }),
      fechaCompleta: fecha,
      reservas: Math.floor(Math.random() * 10) + 1,
      ventas: Math.floor(Math.random() * 800) + 200,
      pasajeros: Math.floor(Math.random() * 25) + 5,
    };
  });
  return ultimoMes;
};

const ventasPorDia = generarVentasDiarias();

// Datos detallados para las ventas de hoy
const ventasHoy: VentaResumen[] = [
  { 
    id: 1, 
    tour: 'Tour Isla', 
    horario: '09:00', 
    cliente: 'Juan Pérez', 
    monto: 120, 
    metodoPago: 'Efectivo', 
    estado: 'completado',
    fecha: '2025-06-26T09:00:00Z'
  },
  { 
    id: 2, 
    tour: 'Tour Bahía', 
    horario: '10:30', 
    cliente: 'María López', 
    monto: 85, 
    metodoPago: 'Tarjeta', 
    estado: 'completado',
    fecha: '2025-06-26T10:30:00Z'
  },
  { 
    id: 3, 
    tour: 'Tour Buceo', 
    horario: '13:00', 
    cliente: 'Carlos Rodríguez', 
    monto: 150, 
    metodoPago: 'Transferencia', 
    estado: 'pendiente',
    fecha: '2025-06-26T13:00:00Z'
  },
  { 
    id: 4, 
    tour: 'Tour Isla', 
    horario: '15:00', 
    cliente: 'Ana Gómez', 
    monto: 120, 
    metodoPago: 'Efectivo', 
    estado: 'pendiente',
    fecha: '2025-06-26T15:00:00Z'
  },
  { 
    id: 5, 
    tour: 'Tour Pesca', 
    horario: '08:30', 
    cliente: 'Roberto Silva', 
    monto: 200, 
    metodoPago: 'Tarjeta', 
    estado: 'completado',
    fecha: '2025-06-26T08:30:00Z'
  },
  { 
    id: 6, 
    tour: 'Tour Privado', 
    horario: '11:00', 
    cliente: 'Laura Méndez', 
    monto: 350, 
    metodoPago: 'Transferencia', 
    estado: 'completado',
    fecha: '2025-06-26T11:00:00Z'
  }
];

// Datos de distribución de ventas por tipo de tour
const ventasPorTour = [
  { nombre: 'Tour Isla', valor: 35, color: '#0088FE' },
  { nombre: 'Tour Bahía', valor: 25, color: '#00C49F' },
  { nombre: 'Tour Buceo', valor: 20, color: '#FFBB28' },
  { nombre: 'Tour Pesca', valor: 15, color: '#FF8042' },
  { nombre: 'Tour Privado', valor: 5, color: '#8884d8' },
];

// Datos de distribución por método de pago
const ventasPorMetodoPago: MetodoPagoStats[] = [
  { nombre: 'Efectivo', valor: 45, color: '#4CAF50' },
  { nombre: 'Tarjeta', valor: 30, color: '#2196F3' },
  { nombre: 'Transferencia', valor: 15, color: '#9C27B0' },
  { nombre: 'Yape/Plin', valor: 10, color: '#FF5722' },
];

// Próximas salidas
const proximasSalidas: ProximaSalida[] = [
  { id: 1, tour: 'Tour Isla', fecha: '2025-06-26', hora: '09:00', lugarSalida: 'Muelle Principal', cuposDisponibles: 8, cuposTotal: 15, estado: 'programado' },
  { id: 2, tour: 'Tour Bahía', fecha: '2025-06-26', hora: '10:30', lugarSalida: 'Muelle Principal', cuposDisponibles: 3, cuposTotal: 12, estado: 'programado' },
  { id: 3, tour: 'Tour Buceo', fecha: '2025-06-26', hora: '14:00', lugarSalida: 'Muelle Secundario', cuposDisponibles: 6, cuposTotal: 10, estado: 'programado' },
  { id: 4, tour: 'Tour Pesca', fecha: '2025-06-26', hora: '16:00', lugarSalida: 'Muelle Principal', cuposDisponibles: 2, cuposTotal: 8, estado: 'programado' },
];

// Metas de ventas
const metasVentas: MetaVentas[] = [
  { periodo: 'Hoy', meta: 1000, actual: 1025, porcentaje: 102.5 },
  { periodo: 'Semana', meta: 5000, actual: 4200, porcentaje: 84 },
  { periodo: 'Mes', meta: 20000, actual: 16500, porcentaje: 82.5 },
];

const VendedorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [viewMode, setViewMode] = useState<'grafico' | 'tabla'>('grafico');
  const [currentDateTime, setCurrentDateTime] = useState<string>("2025-06-26 01:24:55");
  const [currentUser, setCurrentUser] = useState<string>("Angel226m");
  
  // Calcular estadísticas
  const totalVentasHoy = ventasHoy.reduce((sum, venta) => sum + venta.monto, 0);
  const ventasCompletadasHoy = ventasHoy.filter(v => v.estado === 'completado');
  const totalVentasCompletadasHoy = ventasCompletadasHoy.reduce((sum, venta) => sum + venta.monto, 0);
  const totalReservasHoy = ventasHoy.length;
  const reservasPendientesHoy = ventasHoy.filter(v => v.estado === 'pendiente').length;
  
  // Calcular totales por período
  const calcularTotalPeriodo = (periodo: 'dia' | 'semana' | 'mes'): number => {
    const hoy = new Date();
    let diasPeriodo: DailyStats[] = [];
    
    if (periodo === 'dia') {
      diasPeriodo = ventasPorDia.filter(d => 
        d.fechaCompleta && isToday(d.fechaCompleta)
      );
    } else if (periodo === 'semana') {
      const inicioSemana = startOfWeek(hoy, { locale: es });
      const finSemana = endOfWeek(hoy, { locale: es });
      diasPeriodo = ventasPorDia.filter(d => 
        d.fechaCompleta && 
        d.fechaCompleta >= inicioSemana && 
        d.fechaCompleta <= finSemana
      );
    } else if (periodo === 'mes') {
      const inicioMes = startOfMonth(hoy);
      const finMes = endOfMonth(hoy);
      diasPeriodo = ventasPorDia.filter(d => 
        d.fechaCompleta && 
        d.fechaCompleta >= inicioMes && 
        d.fechaCompleta <= finMes
      );
    }
    
    return diasPeriodo.reduce((sum, dia) => sum + dia.ventas, 0);
  };
  
  const totalVentasDia = calcularTotalPeriodo('dia');
  const totalVentasSemana = calcularTotalPeriodo('semana');
  const totalVentasMes = calcularTotalPeriodo('mes');
  
  // Filtrar datos según el período seleccionado
  const filtrarDatosPorPeriodo = (): DailyStats[] => {
    const hoy = new Date();
    
    if (period === 'dia') {
      return ventasPorDia.filter(d => d.fechaCompleta && isToday(d.fechaCompleta));
    } else if (period === 'semana') {
      const inicioSemana = startOfWeek(hoy, { locale: es });
      const finSemana = endOfWeek(hoy, { locale: es });
      return ventasPorDia.filter(d => 
        d.fechaCompleta && 
        d.fechaCompleta >= inicioSemana && 
        d.fechaCompleta <= finSemana
      );
    } else {
      // Por defecto mostrar datos del último mes (30 días)
      return ventasPorDia.slice(-30);
    }
  };
  
  const datosFiltrados = filtrarDatosPorPeriodo();
  
  // Calcular tendencia (comparación con el día anterior)
  const calcularTendencia = (): { porcentaje: number, esCrecimiento: boolean } => {
    if (ventasPorDia.length < 2) return { porcentaje: 0, esCrecimiento: true };
    
    const ventasHoy = ventasPorDia[ventasPorDia.length - 1].ventas;
    const ventasAyer = ventasPorDia[ventasPorDia.length - 2].ventas;
    
    if (ventasAyer === 0) return { porcentaje: 100, esCrecimiento: true };
    
    const porcentaje = Math.round(((ventasHoy - ventasAyer) / ventasAyer) * 100);
    return {
      porcentaje: Math.abs(porcentaje),
      esCrecimiento: porcentaje >= 0
    };
  };
  
  const tendencia = calcularTendencia();
  
  // Filtrar próximas salidas
  const hoy = format(new Date(), 'yyyy-MM-dd');
  const salidasHoy = proximasSalidas.filter(s => s.fecha === hoy);
  const salidasUrgentes = salidasHoy.filter(s => {
    const [hora, minuto] = s.hora.split(':').map(Number);
    const fechaSalida = new Date();
    fechaSalida.setHours(hora, minuto);
    const ahora = new Date();
    return fechaSalida.getTime() - ahora.getTime() < 2 * 60 * 60 * 1000; // 2 horas
  });
  
  // Simular carga de datos
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulamos un retardo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar fecha y hora actual
        setCurrentDateTime("2025-06-26 01:24:55"); // Este valor vendría de alguna API o del servidor
        setCurrentUser("Angel226m"); // Este valor vendría del estado de autenticación
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bienvenida y resumen *//*}
      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Bienvenido, {user?.nombres || 'Vendedor'}
            </h1>
            <p className="text-gray-600">
              Dashboard de ventas para {format(new Date(currentDateTime), "EEEE d 'de' MMMM, yyyy", { locale: es })} - {selectedSede?.nombre || 'Sede principal'}
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex items-center space-x-2">
            <span className="text-gray-500 text-sm">{currentDateTime}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">{currentUser}</span>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de resumen *//*}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ventas de hoy</p>
              <p className="text-2xl font-bold text-gray-800">S/ {totalVentasHoy.toLocaleString('es-PE')}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">S/ {totalVentasCompletadasHoy.toLocaleString('es-PE')}</span> cobrados
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiDollarSign className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`font-medium flex items-center ${tendencia.esCrecimiento ? 'text-green-500' : 'text-red-500'}`}>
              {tendencia.esCrecimiento ? (
                <FiTrendingUp className="mr-1" />
              ) : (
                <FiTrendingDown className="mr-1" />
              )}
              {tendencia.porcentaje}% {tendencia.esCrecimiento ? 'más' : 'menos'} que ayer
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Reservas hoy</p>
              <p className="text-2xl font-bold text-gray-800">{totalReservasHoy}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{reservasPendientesHoy}</span> por confirmar
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCalendar className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-500 font-medium">
              {ventasCompletadasHoy.length} reservas completadas
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pasajeros hoy</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">6</span> pendientes por llegar
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FiUsers className="text-amber-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">
              18 ya embarcados
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Próximas salidas</p>
              <p className="text-2xl font-bold text-gray-800">{salidasHoy.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{proximasSalidas.reduce((sum, s) => sum + (s.cuposTotal - s.cuposDisponibles), 0)}</span> pasajeros en total
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiAnchor className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`font-medium ${salidasUrgentes.length > 0 ? 'text-red-500' : ''}`}>
              {salidasUrgentes.length > 0 ? `${salidasUrgentes.length} en menos de 2 horas` : 'Todas programadas'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Resumen de ventas por período *//*}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FiBarChart2 className="mr-2 text-blue-500" /> 
              Ventas del Día
            </h2>
            <div className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
              {format(new Date(currentDateTime), "dd MMM", { locale: es })}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              S/ {totalVentasDia.toLocaleString('es-PE')}
            </div>
            <div className="text-sm text-gray-500">
              {metasVentas[0].porcentaje}% de la meta diaria
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  metasVentas[0].porcentaje >= 100 ? 'bg-green-500' : 
                  metasVentas[0].porcentaje >= 75 ? 'bg-blue-500' : 
                  'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(metasVentas[0].porcentaje, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex justify-between w-full">
              <span>Meta: S/ {metasVentas[0].meta.toLocaleString('es-PE')}</span>
              <span>Reservas: {totalReservasHoy}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FiBarChart2 className="mr-2 text-green-500" /> 
              Ventas de la Semana
            </h2>
            <div className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
              Semana actual
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              S/ {totalVentasSemana.toLocaleString('es-PE')}
            </div>
            <div className="text-sm text-gray-500">
              {metasVentas[1].porcentaje}% de la meta semanal
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  metasVentas[1].porcentaje >= 100 ? 'bg-green-500' : 
                  metasVentas[1].porcentaje >= 75 ? 'bg-green-500' : 
                  'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(metasVentas[1].porcentaje, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex justify-between w-full">
              <span>Meta: S/ {metasVentas[1].meta.toLocaleString('es-PE')}</span>
              <span>Falta: S/ {(metasVentas[1].meta - metasVentas[1].actual).toLocaleString('es-PE')}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FiBarChart2 className="mr-2 text-purple-500" /> 
              Ventas del Mes
            </h2>
            <div className="bg-purple-100 text-purple-600 px-2 py-1 text-xs rounded-full">
              {format(new Date(currentDateTime), "MMMM yyyy", { locale: es })}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              S/ {totalVentasMes.toLocaleString('es-PE')}
            </div>
            <div className="text-sm text-gray-500">
              {metasVentas[2].porcentaje}% de la meta mensual
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  metasVentas[2].porcentaje >= 100 ? 'bg-green-500' : 
                  metasVentas[2].porcentaje >= 75 ? 'bg-purple-500' : 
                  'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(metasVentas[2].porcentaje, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex justify-between w-full">
              <span>Meta: S/ {metasVentas[2].meta.toLocaleString('es-PE')}</span>
              <span>Proyección: {Math.round(metasVentas[2].porcentaje)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficas *//*}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de ventas por día *//*}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FiBarChart2 className="mr-2 text-blue-500" />
              Ventas por período
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <button 
                  onClick={() => setPeriod('dia')}
                  className={`px-3 py-1 text-xs rounded-full ${period === 'dia' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Día
                </button>
                <button 
                  onClick={() => setPeriod('semana')}
                  className={`px-3 py-1 text-xs rounded-full ${period === 'semana' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Semana
                </button>
                <button 
                  onClick={() => setPeriod('mes')}
                  className={`px-3 py-1 text-xs rounded-full ${period === 'mes' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Mes
                </button>
              </div>
              
              <div className="flex space-x-1">
                <button 
                  onClick={() => setViewMode('grafico')}
                  className={`p-1 rounded ${viewMode === 'grafico' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  title="Ver gráfico"
                >
                  <FiBarChart2 className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setViewMode('tabla')}
                  className={`p-1 rounded ${viewMode === 'tabla' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  title="Ver tabla"
                >
                  <FiList className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          {viewMode === 'grafico' ? (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart
                data={datosFiltrados}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12 }}
                  interval={period === 'mes' ? 2 : 0}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="#0088FE" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `S/${value}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#00C49F" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'ventas') return [`S/ ${value}`, 'Ventas'];
                    if (name === 'reservas') return [value, 'Reservas'];
                    if (name === 'pasajeros') return [value, 'Pasajeros'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="ventas" 
                  name="Ventas (S/)" 
                  fill="#0088FE" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="reservas" 
                  name="Reservas" 
                  fill="#00C49F" 
                  radius={[4, 4, 0, 0]} 
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pasajeros"
                  name="Pasajeros"
                  stroke="#FF8042"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas (S/)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pasajeros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datosFiltrados.map((dato, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{dato.fecha}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">S/ {dato.ventas.toLocaleString('es-PE')}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">{dato.reservas}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">{dato.pasajeros}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">Total</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-blue-600">
                      S/ {datosFiltrados.reduce((sum, dato) => sum + dato.ventas, 0).toLocaleString('es-PE')}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-green-600">
                      {datosFiltrados.reduce((sum, dato) => sum + dato.reservas, 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-amber-600">
                      {datosFiltrados.reduce((sum, dato) => sum + dato.pasajeros, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        
        {/* Gráficas de distribución *//*}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FiPieChart className="mr-2 text-blue-500" />
              Distribución de Ventas
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Distribución por tour *//*}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Por tipo de tour</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={ventasPorTour}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="nombre"
                    label={({ nombre, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {ventasPorTour.map((entry, index) => (
                      <Cell key={`cell-tour-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Leyenda *//*}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ventasPorTour.map((item, index) => (
                  <div key={`legend-tour-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Distribución por método de pago *//*}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Por método de pago</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={ventasPorMetodoPago}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="nombre"
                    label={({ nombre, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {ventasPorMetodoPago.map((entry, index) => (
                      <Cell key={`cell-pago-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Leyenda *//*}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {ventasPorMetodoPago.map((item, index) => (
                  <div key={`legend-pago-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ventas de hoy y Próximas salidas *//*}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas de hoy *//*}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-white flex items-center">
              <FiCreditCard className="mr-2" /> Ventas de hoy
            </h2>
            <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              Total: S/ {totalVentasHoy.toLocaleString('es-PE')}
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {ventasHoy.map((venta) => (
                    <tr key={venta.id} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-800">{venta.tour}</div>
                        <div className="text-xs text-gray-500">{venta.horario}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{venta.cliente}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900">S/ {venta.monto.toLocaleString('es-PE')}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                        <span className={`px-2 py-1 rounded-full ${
                          venta.estado === 'completado' ? 'bg-green-100 text-green-800' : 
                          venta.estado === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-red-100 text-red-800'
                        }`}>
                          {venta.estado === 'completado' ? 'Completado' : 
                           venta.estado === 'pendiente' ? 'Pendiente' : 'Cancelado'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {ventasHoy.length > 0 ? (
              <div className="mt-3 text-right">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end w-full">
                  Ver todas las ventas <FiChevronRight className="ml-1" />
                </button>
              </div>
            ) : (
              <p className="text-center py-4 text-gray-500">No hay ventas registradas hoy</p>
            )}
          </div>
        </div>
        
        {/* Próximas salidas *//*}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-white flex items-center">
              <FiAnchor className="mr-2" /> Próximas salidas de hoy
            </h2>
            <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              {format(new Date(currentDateTime), "d 'de' MMMM", { locale: es })}
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {salidasHoy.length > 0 ? salidasHoy.map((salida) => {
                const [hora, minuto] = salida.hora.split(':').map(Number);
                const fechaSalida = new Date();
                fechaSalida.setHours(hora, minuto);
                const ahora = new Date();
                const esUrgente = fechaSalida.getTime() - ahora.getTime() < 2 * 60 * 60 * 1000; // 2 horas
                
                const ocupacionPorcentaje = ((salida.cuposTotal - salida.cuposDisponibles) / salida.cuposTotal) * 100;
                
                return (
                  <div key={salida.id} className={`border ${esUrgente ? 'border-red-200 bg-red-50' : 'border-gray-200'} rounded-lg p-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800 flex items-center">
                          {salida.tour}
                          {esUrgente && <FiAlertCircle className="ml-2 text-red-500" />}
                        </h3>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FiClock className="mr-1" /> {salida.hora} - {salida.lugarSalida}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${salida.cuposDisponibles < 3 ? 'text-red-600' : 'text-blue-600'}`}>
                          {salida.cuposDisponibles} cupos disponibles
                        </div>
                        <div className="mt-1 w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              ocupacionPorcentaje > 80 ? 'bg-green-500' : 
                              ocupacionPorcentaje > 50 ? 'bg-blue-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${ocupacionPorcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {esUrgente && (
                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-red-600 flex items-center">
                          <FiAlertCircle className="mr-1" /> Salida próxima
                        </span>
                        <button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded">
                          Contactar pasajeros
                        </button>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <p className="text-center py-4 text-gray-500">No hay salidas programadas para hoy</p>
              )}
            </div>
            
            {proximasSalidas.length > 0 && (
              <div className="mt-3 text-right">
                <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end w-full">
                  Ver todas las salidas <FiChevronRight className="ml-1" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Acciones rápidas *//*}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center">
          <FiRefreshCw className="mr-2 text-blue-500" /> Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <FiCalendar className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-800">Nueva Reserva</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <FiUsers className="text-green-600" />
            </div>
            <span className="text-sm text-gray-800">Nuevo Cliente</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="bg-purple-100 p-3 rounded-full mb-2">
              <FiCreditCard className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-800">Registrar Pago</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
            <div className="bg-amber-100 p-3 rounded-full mb-2">
              <FiPhone className="text-amber-600" />
            </div>
            <span className="text-sm text-gray-800">Contactar Cliente</span>
          </button>
        </div>
      </div>
      
      {/* Resumen del día *//*}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md p-5 text-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="font-bold text-xl mb-1">Resumen del día</h2>
            <p className="text-blue-100">
              {format(new Date(currentDateTime), "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col items-end">
            <div className="text-2xl font-bold">S/ {totalVentasHoy.toLocaleString('es-PE')}</div>
            <div className="text-sm text-blue-100">
              {totalReservasHoy} reservas | {ventasCompletadasHoy.length} completadas
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center">
              <FiCreditCard className="mr-2" />
              <span>Métodos de pago</span>
            </div>
            <div className="mt-2 space-y-1">
              <div className="flex justify-between text-sm">
                <span>Efectivo:</span>
                <span>S/ {(totalVentasHoy * 0.45).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tarjeta:</span>
                <span>S/ {(totalVentasHoy * 0.30).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Transferencia:</span>
                <span>S/ {(totalVentasHoy * 0.15).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Yape/Plin:</span>
                <span>S/ {(totalVentasHoy * 0.10).toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center">
              <FiAnchor className="mr-2" />
              <span>Tours populares</span>
            </div>
            <div className="mt-2 space-y-1">
              {ventasPorTour.slice(0, 4).map((tour, index) => (
                <div key={`popular-${index}`} className="flex justify-between text-sm">
                  <span>{tour.nombre}:</span>
                  <span>{tour.valor}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center">
              <FiInfo className="mr-2" />
              <span>Información útil</span>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div>Próxima salida: {salidasHoy.length > 0 ? `${salidasHoy[0].tour} - ${salidasHoy[0].hora}` : 'No hay salidas hoy'}</div>
              <div>Clientes nuevos hoy: 3</div>
              <div>Reservas para mañana: 12</div>
              <div>Meta de ventas restante: S/ {Math.max(0, metasVentas[0].meta - totalVentasHoy).toLocaleString('es-PE')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;*/   
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../../store';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosClient';
import { endpoints } from '../../api/endpoints';
import { 
  format, 
  subDays, 
  parseISO, 
  isToday,
  isThisWeek,
  isThisMonth
} from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart, 
  Pie, 
  Cell, 
  LineChart, 
  Line,
  ComposedChart
} from 'recharts';
import {
  FaUsers, 
  FaCalendarAlt, 
  FaMoneyBillWave, 
  FaClock, 
  FaShip, 
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaChevronRight,
  FaCheckCircle,
  FaCreditCard,
  FaPhone,
  FaChartBar,
  FaChartPie,
  FaList,
  FaSyncAlt,
  FaFilter,
  FaInfoCircle
} from 'react-icons/fa';
import ROUTES from '../../../shared/constants/appRoutes';

// Interfaces
interface Reserva {
  id_reserva: number;
  id_cliente: number;
  id_instancia: number;
  fecha_reserva: string;
  total_pagar: number;
  notas?: string;
  estado: string;
  eliminado: boolean;
  nombre_cliente?: string;
  documento_cliente?: string;
  nombre_tour?: string;
  fecha_tour?: string;
  hora_inicio_tour?: string;
  hora_fin_tour?: string;
  metodo_pago?: string;
  cantidad_pasajes?: PasajeCantidad[];
}

interface PasajeCantidad {
  id_tipo_pasaje: number;
  nombre_tipo: string;
  cantidad: number;
}

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
}

interface InstanciaTour {
  id_instancia: number;
  fecha_especifica: string;
  hora_inicio: string;
  hora_fin: string;
  cupos_disponibles: number;
  cupos_totales: number;
  estado: string;
  nombre_tour?: string;
  lugar_salida?: string;
}

interface DailyStats {
  fecha: string;
  reservas: number;
  ventas: number;
  pasajeros: number;
  fechaCompleta: Date;
}

interface MetodoPagoStats {
  nombre: string;
  valor: number;
  color: string;
}

interface TourStats {
  nombre: string;
  valor: number;
  color: string;
}

// Colores para gráficas
const METODOS_PAGO_COLORS: Record<string, string> = {
  'EFECTIVO': '#4CAF50',
  'TARJETA': '#2196F3',
  'TRANSFERENCIA': '#9C27B0',
  'YAPE': '#FF5722',
  'PLIN': '#FF9800',
  'MERCADOPAGO': '#E91E63',
  'DEPOSITO': '#607D8B'
};

const TOUR_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', 
  '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'
];

const VendedorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  // Estados para almacenar datos
  const [reservas, setReservas] = useState<Reserva[]>([]);
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [instancias, setInstancias] = useState<InstanciaTour[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<'dia' | 'semana' | 'mes'>('semana');
  const [viewMode, setViewMode] = useState<'grafico' | 'tabla'>('grafico');
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [metodoPagoStats, setMetodoPagoStats] = useState<MetodoPagoStats[]>([]);
  const [tourStats, setTourStats] = useState<TourStats[]>([]);
  
  // Fecha y hora actual
  const [currentDateTime, setCurrentDateTime] = useState<string>(
    format(new Date(), "yyyy-MM-dd HH:mm:ss")
  );

  // Cargar datos del dashboard
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Actualizar fecha y hora actual
        setCurrentDateTime(format(new Date(), "yyyy-MM-dd HH:mm:ss"));
        
        // Obtener datos de los últimos 30 días
        const hoy = new Date();
        const hace30Dias = subDays(hoy, 30);
        const fechaInicio = format(hace30Dias, 'yyyy-MM-dd');
        const fechaFin = format(hoy, 'yyyy-MM-dd');
        
        // Realizar peticiones en paralelo para optimizar carga
        const [reservasResponse, instanciasResponse, pagosResponse] = await Promise.all([
          axios.get(`/api/v1${endpoints.reserva.vendedorList}`),
          axios.get(`/api/v1${endpoints.instanciaTour.vendedorList}`),
          axios.get(`/api/v1${endpoints.pago.vendedorList}`)
        ]);
        
        // Procesar respuestas
        if (reservasResponse.data && reservasResponse.data.data) {
          setReservas(reservasResponse.data.data);
        }
        
        if (instanciasResponse.data && instanciasResponse.data.data) {
          setInstancias(instanciasResponse.data.data);
        }
        
        if (pagosResponse.data && pagosResponse.data.data) {
          setPagos(pagosResponse.data.data);
        }
        
        // Procesar datos para estadísticas
        processDataForStats(
          reservasResponse.data?.data || [], 
          pagosResponse.data?.data || [],
          instanciasResponse.data?.data || []
        );
        
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setError('No se pudieron cargar los datos del dashboard. Por favor, intenta nuevamente.');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, []);
  
  // Procesar datos para estadísticas
  const processDataForStats = (
    reservasData: Reserva[], 
    pagosData: Pago[], 
    instanciasData: InstanciaTour[]
  ) => {
    if (!reservasData || !pagosData) return;
    
    const hoy = new Date();
    
    // Generar estadísticas diarias para los últimos 30 días
    const statsMap = new Map<string, DailyStats>();
    
    // Inicializar el mapa con los últimos 30 días
    for (let i = 29; i >= 0; i--) {
      const fecha = subDays(hoy, i);
      const fechaStr = format(fecha, 'yyyy-MM-dd');
      statsMap.set(fechaStr, {
        fecha: format(fecha, 'dd/MM', { locale: es }),
        fechaCompleta: fecha,
        reservas: 0,
        ventas: 0,
        pasajeros: 0
      });
    }
    
    // Procesar reservas
    reservasData.forEach(reserva => {
      // Extraer solo la fecha (sin hora) de fecha_reserva
      const fechaReserva = reserva.fecha_reserva.split('T')[0];
      if (statsMap.has(fechaReserva)) {
        const stats = statsMap.get(fechaReserva)!;
        stats.reservas += 1;
        
        // Calcular pasajeros reales si hay datos, o estimar
        if (reserva.cantidad_pasajes && Array.isArray(reserva.cantidad_pasajes)) {
          stats.pasajeros += reserva.cantidad_pasajes.reduce(
            (sum, pasaje) => sum + pasaje.cantidad, 0
          );
        } else {
          // Estimar 2 pasajeros por reserva
          stats.pasajeros += 2;
        }
        
        statsMap.set(fechaReserva, stats);
      }
    });
    
    // Procesar pagos
    pagosData.forEach(pago => {
      if (pago.estado === 'PROCESADO') {
        const fechaPago = pago.fecha_pago.split('T')[0];
        if (statsMap.has(fechaPago)) {
          const stats = statsMap.get(fechaPago)!;
          stats.ventas += pago.monto;
          statsMap.set(fechaPago, stats);
        }
      }
    });
    
    // Convertir mapa a array y ordenar por fecha
    const statsArray = Array.from(statsMap.values())
      .sort((a, b) => a.fechaCompleta.getTime() - b.fechaCompleta.getTime());
    
    setDailyStats(statsArray);
    
    // Procesar estadísticas de métodos de pago
    const metodoPagoMap = new Map<string, number>();
    pagosData.forEach(pago => {
      if (pago.estado === 'PROCESADO') {
        const metodoPago = pago.metodo_pago || 'OTRO';
        metodoPagoMap.set(
          metodoPago, 
          (metodoPagoMap.get(metodoPago) || 0) + pago.monto
        );
      }
    });
    
    const totalPagos = pagosData.reduce(
      (sum, p) => p.estado === 'PROCESADO' ? sum + p.monto : sum, 
      0
    );
    
    // Convertir mapa de método de pago a array con colores
    const metodoPagoArray: MetodoPagoStats[] = Array.from(metodoPagoMap.entries())
      .map(([nombre, valor], index) => ({
        nombre,
        valor: Math.round((valor / (totalPagos || 1)) * 100), // Evitar división por cero
        color: METODOS_PAGO_COLORS[nombre] || TOUR_COLORS[index % TOUR_COLORS.length]
      }));
    
    setMetodoPagoStats(metodoPagoArray);
    
    // Procesar estadísticas por tour
    const tourMap = new Map<string, number>();
    reservasData.forEach(reserva => {
      const tourNombre = reserva.nombre_tour || 'Sin especificar';
      tourMap.set(
        tourNombre, 
        (tourMap.get(tourNombre) || 0) + 1
      );
    });
    
    // Convertir mapa de tour a array con colores
    const tourArray: TourStats[] = Array.from(tourMap.entries())
      .map(([nombre, valor], index) => ({
        nombre,
        valor: Math.round((valor / (reservasData.length || 1)) * 100), // Evitar división por cero
        color: TOUR_COLORS[index % TOUR_COLORS.length]
      }))
      // Ordenar de mayor a menor
      .sort((a, b) => b.valor - a.valor);
    
    setTourStats(tourArray);
  };
  
  // Filtrar reservas y pagos de hoy
  const fechaHoy = format(new Date(), 'yyyy-MM-dd');
  const reservasHoy = reservas.filter(r => r.fecha_reserva.startsWith(fechaHoy));
  
  // Obtener instancias de tour para hoy (salidas programadas)
  const salidasHoy = instancias.filter(i => 
    i.fecha_especifica === fechaHoy && i.estado !== 'CANCELADO'
  );
  
  const salidasUrgentes = salidasHoy.filter(s => {
    const [hora, minuto] = s.hora_inicio.split(':').map(Number);
    const fechaSalida = new Date();
    fechaSalida.setHours(hora, minuto);
    const ahora = new Date();
    return fechaSalida.getTime() - ahora.getTime() < 2 * 60 * 60 * 1000; // 2 horas
  });
  
  // Calcular totales
  const totalVentasHoy = pagos
    .filter(p => p.fecha_pago.startsWith(fechaHoy) && p.estado === 'PROCESADO')
    .reduce((sum, p) => sum + p.monto, 0);
  
  const totalReservasHoy = reservasHoy.length;
  const reservasPendientesHoy = reservasHoy.filter(r => 
    r.estado === 'PENDIENTE' || r.estado === 'RESERVADO' || r.estado === 'RESERVADA'
  ).length;
  
  const ventasCompletadasHoy = reservasHoy.filter(r => 
    r.estado === 'COMPLETADO' || r.estado === 'COMPLETADA' || r.estado === 'CONFIRMADO' || r.estado === 'CONFIRMADA'
  );
  
  const totalVentasCompletadasHoy = ventasCompletadasHoy.reduce(
    (sum, r) => sum + r.total_pagar, 
    0
  );
  
  // Calcular total de pasajeros
  const totalPasajerosHoy = reservasHoy.reduce((sum, r) => {
    if (r.cantidad_pasajes && Array.isArray(r.cantidad_pasajes)) {
      return sum + r.cantidad_pasajes.reduce((s, p) => s + p.cantidad, 0);
    }
    return sum + 2; // Estimado de 2 pasajeros por reserva sin detalles
  }, 0);
  
  const pasajerosEmbarcadosHoy = ventasCompletadasHoy.reduce((sum, r) => {
    if (r.cantidad_pasajes && Array.isArray(r.cantidad_pasajes)) {
      return sum + r.cantidad_pasajes.reduce((s, p) => s + p.cantidad, 0);
    }
    return sum + 2; // Estimado de 2 pasajeros por reserva sin detalles
  }, 0);
  
  // Filtrar datos según el período seleccionado
  const filtrarDatosPorPeriodo = (): DailyStats[] => {
    const hoy = new Date();
    
    if (period === 'dia') {
      return dailyStats.filter(d => isToday(d.fechaCompleta));
    } else if (period === 'semana') {
      return dailyStats.filter(d => isThisWeek(d.fechaCompleta, { locale: es }));
    } else {
      // Por defecto mostrar datos del último mes (30 días)
      return dailyStats;
    }
  };
  
  const datosFiltrados = filtrarDatosPorPeriodo();
  
  // Calcular totales por período
  const calcularTotalPeriodo = (periodo: 'dia' | 'semana' | 'mes'): number => {
    const filtrados = filtrarDatosPorPeriodo();
    return filtrados.reduce((sum, dia) => sum + dia.ventas, 0);
  };
  
  const totalVentasDia = calcularTotalPeriodo('dia');
  const totalVentasSemana = calcularTotalPeriodo('semana');
  const totalVentasMes = calcularTotalPeriodo('mes');
  
  // Calcular tendencia (comparación con el día anterior)
  const calcularTendencia = (): { porcentaje: number, esCrecimiento: boolean } => {
    if (dailyStats.length < 2) return { porcentaje: 0, esCrecimiento: true };
    
    const ventasHoy = dailyStats[dailyStats.length - 1].ventas;
    const ventasAyer = dailyStats[dailyStats.length - 2].ventas;
    
    if (ventasAyer === 0) return { porcentaje: 100, esCrecimiento: true };
    
    const porcentaje = Math.round(((ventasHoy - ventasAyer) / ventasAyer) * 100);
    return {
      porcentaje: Math.abs(porcentaje),
      esCrecimiento: porcentaje >= 0
    };
  };
  
  const tendencia = calcularTendencia();
  
  // Datos para metas de ventas (simulados)
  const metasVentas = [
    { periodo: 'Hoy', meta: 1000, actual: totalVentasDia, porcentaje: (totalVentasDia / 1000) * 100 },
    { periodo: 'Semana', meta: 5000, actual: totalVentasSemana, porcentaje: (totalVentasSemana / 5000) * 100 },
    { periodo: 'Mes', meta: 20000, actual: totalVentasMes, porcentaje: (totalVentasMes / 20000) * 100 },
  ];
  
  // Formatear moneda
  const formatMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-PE', {
      style: 'currency',
      currency: 'PEN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <p className="font-medium flex items-center">
          <FaExclamationTriangle className="mr-2" />
          {error}
        </p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 bg-red-100 hover:bg-red-200 text-red-800 py-1 px-3 rounded-md text-sm"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Información de fecha y usuario actual */}
      <div className="text-xs text-gray-500 mb-2 text-right">
        <p>Current Date and Time (UTC - YYYY-MM-DD HH:MM:SS formatted): 2025-07-01 04:34:09</p>
        <p>Current User's Login: angel06220</p>
      </div>
    
      {/* Bienvenida y resumen */}
      <div className="bg-white rounded-lg shadow-md p-5 border-l-4 border-blue-500">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">
              Bienvenido, {user?.nombres || 'Vendedor'}
            </h1>
            <p className="text-gray-600">
              Dashboard de ventas para {format(new Date(currentDateTime), "EEEE d 'de' MMMM, yyyy", { locale: es })} - {selectedSede?.nombre || 'Sede principal'}
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex items-center space-x-2">
            <span className="text-gray-500 text-sm">{format(new Date(), "yyyy-MM-dd HH:mm:ss")}</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-500 text-sm">{user?.nombres || 'angel06220'}</span>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ventas de hoy</p>
              <p className="text-2xl font-bold text-gray-800">{formatMoneda(totalVentasHoy)}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{formatMoneda(totalVentasCompletadasHoy)}</span> cobrados
              </p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FaMoneyBillWave className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`font-medium flex items-center ${tendencia.esCrecimiento ? 'text-green-500' : 'text-red-500'}`}>
              {tendencia.esCrecimiento ? (
                <FaArrowUp className="mr-1" />
              ) : (
                <FaArrowDown className="mr-1" />
              )}
              {tendencia.porcentaje}% {tendencia.esCrecimiento ? 'más' : 'menos'} que ayer
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Reservas hoy</p>
              <p className="text-2xl font-bold text-gray-800">{totalReservasHoy}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{reservasPendientesHoy}</span> por confirmar
              </p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FaCalendarAlt className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-500 font-medium">
              {ventasCompletadasHoy.length} reservas completadas
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pasajeros hoy</p>
              <p className="text-2xl font-bold text-gray-800">{totalPasajerosHoy}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">{totalPasajerosHoy - pasajerosEmbarcadosHoy}</span> pendientes por llegar
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FaUsers className="text-amber-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">
              {pasajerosEmbarcadosHoy} ya embarcados
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5 border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Próximas salidas</p>
              <p className="text-2xl font-bold text-gray-800">{salidasHoy.length}</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">
                  {salidasHoy.reduce((sum, s) => sum + (s.cupos_totales - s.cupos_disponibles), 0)}
                </span> pasajeros en total
              </p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaShip className="text-purple-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className={`font-medium ${salidasUrgentes.length > 0 ? 'text-red-500' : ''}`}>
              {salidasUrgentes.length > 0 ? `${salidasUrgentes.length} en menos de 2 horas` : 'Todas programadas'}
            </span>
          </div>
        </div>
      </div>
      
      {/* Resumen de ventas por período */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FaChartBar className="mr-2 text-blue-500" /> 
              Ventas del Día
            </h2>
            <div className="bg-blue-100 text-blue-600 px-2 py-1 text-xs rounded-full">
              {format(new Date(), "dd MMM", { locale: es })}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-blue-600 mb-1">
              {formatMoneda(totalVentasDia)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(metasVentas[0].porcentaje)}% de la meta diaria
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  metasVentas[0].porcentaje >= 100 ? 'bg-green-500' : 
                  metasVentas[0].porcentaje >= 75 ? 'bg-blue-500' : 
                  'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(metasVentas[0].porcentaje, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex justify-between w-full">
              <span>Meta: {formatMoneda(metasVentas[0].meta)}</span>
              <span>Reservas: {totalReservasHoy}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FaChartBar className="mr-2 text-green-500" /> 
              Ventas de la Semana
            </h2>
            <div className="bg-green-100 text-green-600 px-2 py-1 text-xs rounded-full">
              Semana actual
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-green-600 mb-1">
              {formatMoneda(totalVentasSemana)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(metasVentas[1].porcentaje)}% de la meta semanal
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  metasVentas[1].porcentaje >= 100 ? 'bg-green-500' : 
                  metasVentas[1].porcentaje >= 75 ? 'bg-green-500' : 
                  'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(metasVentas[1].porcentaje, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex justify-between w-full">
              <span>Meta: {formatMoneda(metasVentas[1].meta)}</span>
              <span>Falta: {formatMoneda(Math.max(0, metasVentas[1].meta - metasVentas[1].actual))}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FaChartBar className="mr-2 text-purple-500" /> 
              Ventas del Mes
            </h2>
            <div className="bg-purple-100 text-purple-600 px-2 py-1 text-xs rounded-full">
              {format(new Date(), "MMMM yyyy", { locale: es })}
            </div>
          </div>
          
          <div className="flex flex-col items-center">
            <div className="text-3xl font-bold text-purple-600 mb-1">
              {formatMoneda(totalVentasMes)}
            </div>
            <div className="text-sm text-gray-500">
              {Math.round(metasVentas[2].porcentaje)}% de la meta mensual
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className={`h-2 rounded-full ${
                  metasVentas[2].porcentaje >= 100 ? 'bg-green-500' : 
                  metasVentas[2].porcentaje >= 75 ? 'bg-purple-500' : 
                  'bg-yellow-500'
                }`}
                style={{ width: `${Math.min(metasVentas[2].porcentaje, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-gray-500 mt-2 flex justify-between w-full">
              <span>Meta: {formatMoneda(metasVentas[2].meta)}</span>
              <span>Proyección: {Math.round(metasVentas[2].porcentaje)}%</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de ventas por día */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FaChartBar className="mr-2 text-blue-500" />
              Ventas por período
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex space-x-1">
                <button 
                  onClick={() => setPeriod('dia')}
                  className={`px-3 py-1 text-xs rounded-full ${period === 'dia' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Día
                </button>
                <button 
                  onClick={() => setPeriod('semana')}
                  className={`px-3 py-1 text-xs rounded-full ${period === 'semana' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Semana
                </button>
                <button 
                  onClick={() => setPeriod('mes')}
                  className={`px-3 py-1 text-xs rounded-full ${period === 'mes' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}
                >
                  Mes
                </button>
              </div>
              
              <div className="flex space-x-1">
                <button 
                  onClick={() => setViewMode('grafico')}
                  className={`p-1 rounded ${viewMode === 'grafico' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  title="Ver gráfico"
                >
                  <FaChartBar className="text-gray-600" />
                </button>
                <button 
                  onClick={() => setViewMode('tabla')}
                  className={`p-1 rounded ${viewMode === 'tabla' ? 'bg-gray-200' : 'bg-gray-100'}`}
                  title="Ver tabla"
                >
                  <FaList className="text-gray-600" />
                </button>
              </div>
            </div>
          </div>
          
          {viewMode === 'grafico' ? (
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart
                data={datosFiltrados}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="fecha" 
                  tick={{ fontSize: 12 }}
                  interval={period === 'mes' ? 2 : 0}
                />
                <YAxis 
                  yAxisId="left" 
                  orientation="left" 
                  stroke="#0088FE" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `S/${value}`}
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="#00C49F" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'ventas') return [`S/ ${value}`, 'Ventas'];
                    if (name === 'reservas') return [value, 'Reservas'];
                    if (name === 'pasajeros') return [value, 'Pasajeros'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => `Fecha: ${label}`}
                />
                <Legend />
                <Bar 
                  yAxisId="left" 
                  dataKey="ventas" 
                  name="Ventas (S/)" 
                  fill="#0088FE" 
                  radius={[4, 4, 0, 0]} 
                />
                <Bar 
                  yAxisId="right" 
                  dataKey="reservas" 
                  name="Reservas" 
                  fill="#00C49F" 
                  radius={[4, 4, 0, 0]} 
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="pasajeros"
                  name="Pasajeros"
                  stroke="#FF8042"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ventas (S/)</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Reservas</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pasajeros</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {datosFiltrados.map((dato, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">{dato.fecha}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">S/ {dato.ventas.toLocaleString('es-PE')}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">{dato.reservas}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">{dato.pasajeros}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-800">Total</td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-blue-600">
                      S/ {datosFiltrados.reduce((sum, dato) => sum + dato.ventas, 0).toLocaleString('es-PE')}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-green-600">
                      {datosFiltrados.reduce((sum, dato) => sum + dato.reservas, 0)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-amber-600">
                      {datosFiltrados.reduce((sum, dato) => sum + dato.pasajeros, 0)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </div>
        
        {/* Gráficas de distribución */}
        <div className="bg-white rounded-lg shadow-md p-5">
          <div className="mb-4">
            <h2 className="font-semibold text-gray-700 flex items-center">
              <FaChartPie className="mr-2 text-blue-500" />
              Distribución de Ventas
            </h2>
          </div>
          
          <div className="space-y-6">
            {/* Distribución por tour */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Por tipo de tour</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={tourStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="nombre"
                    label={({ nombre, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {tourStats.map((entry, index) => (
                      <Cell key={`cell-tour-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Leyenda */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {tourStats.slice(0, 6).map((item, index) => (
                  <div key={`legend-tour-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600 truncate">{item.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Distribución por método de pago */}
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Por método de pago</h3>
              <ResponsiveContainer width="100%" height={150}>
                <PieChart>
                  <Pie
                    data={metodoPagoStats}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={60}
                    fill="#8884d8"
                    dataKey="valor"
                    nameKey="nombre"
                    label={({ nombre, percent }) => `${(percent * 100).toFixed(0)}%`}
                  >
                    {metodoPagoStats.map((entry, index) => (
                      <Cell key={`cell-pago-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
                </PieChart>
              </ResponsiveContainer>
              
              {/* Leyenda */}
              <div className="grid grid-cols-2 gap-2 mt-2">
                {metodoPagoStats.slice(0, 6).map((item, index) => (
                  <div key={`legend-pago-${index}`} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-1" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs text-gray-600">{item.nombre}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Ventas de hoy y Próximas salidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas de hoy */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-white flex items-center">
              <FaCreditCard className="mr-2" /> Reservas de hoy
            </h2>
            <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              Total: {formatMoneda(totalVentasHoy)}
            </div>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {reservasHoy.length > 0 ? reservasHoy.slice(0, 5).map((reserva) => (
                    <tr key={reserva.id_reserva} className="hover:bg-gray-50">
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <div className="font-medium text-gray-800">{reserva.nombre_tour || 'Tour sin especificar'}</div>
                        <div className="text-xs text-gray-500">{reserva.hora_inicio_tour || '--:--'}</div>
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-700">{reserva.nombre_cliente || 'Cliente sin registrar'}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-right text-gray-900">S/ {reserva.total_pagar.toLocaleString('es-PE')}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-xs text-center">
                        <span className={`px-2 py-1 rounded-full ${
                          reserva.estado === 'COMPLETADO' || reserva.estado === 'COMPLETADA' ? 'bg-green-100 text-green-800' : 
                          reserva.estado === 'RESERVADO' || reserva.estado === 'RESERVADA' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {reserva.estado || 'PENDIENTE'}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-3 py-4 text-center text-gray-500">No hay reservas registradas hoy</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            {reservasHoy.length > 0 && (
              <div className="mt-3 text-right">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end w-full">
                  Ver todas las reservas <FaChevronRight className="ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
        
        {/* Próximas salidas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-3 flex justify-between items-center">
            <h2 className="font-semibold text-white flex items-center">
              <FaShip className="mr-2" /> Próximas salidas de hoy
            </h2>
            <div className="bg-white/20 text-white text-xs px-2 py-1 rounded-full">
              {format(new Date(), "d 'de' MMMM", { locale: es })}
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {salidasHoy.length > 0 ? salidasHoy.map((salida) => {
                const [hora, minuto] = salida.hora_inicio.split(':').map(Number);
                const fechaSalida = new Date();
                fechaSalida.setHours(hora, minuto);
                const ahora = new Date();
                const esUrgente = fechaSalida.getTime() - ahora.getTime() < 2 * 60 * 60 * 1000; // 2 horas
                
                const ocupacionPorcentaje = ((salida.cupos_totales - salida.cupos_disponibles) / salida.cupos_totales) * 100;
                
                return (
                  <div key={salida.id_instancia} className={`border ${esUrgente ? 'border-red-200 bg-red-50' : 'border-gray-200'} rounded-lg p-3`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800 flex items-center">
                          {salida.nombre_tour || 'Tour sin especificar'}
                          {esUrgente && <FaExclamationTriangle className="ml-2 text-red-500" />}
                        </h3>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <FaClock className="mr-1" /> {salida.hora_inicio} - {salida.lugar_salida || 'Muelle Principal'}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`text-sm font-medium ${salida.cupos_disponibles < 3 ? 'text-red-600' : 'text-blue-600'}`}>
                          {salida.cupos_disponibles} cupos disponibles
                        </div>
                        <div className="mt-1 w-24 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${
                              ocupacionPorcentaje > 80 ? 'bg-green-500' : 
                              ocupacionPorcentaje > 50 ? 'bg-blue-500' : 
                              'bg-yellow-500'
                            }`}
                            style={{ width: `${ocupacionPorcentaje}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                    
                    {esUrgente && (
                      <div className="mt-2 flex justify-between">
                        <span className="text-xs text-red-600 flex items-center">
                          <FaExclamationTriangle className="mr-1" /> Salida próxima
                        </span>
                        <button 
                          onClick={() => navigate(`/vendedor/instancias-tour/${salida.id_instancia}`)}
                          className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-800 px-2 py-1 rounded"
                        >
                          Ver detalles
                        </button>
                      </div>
                    )}
                  </div>
                );
              }) : (
                <p className="text-center py-4 text-gray-500">No hay salidas programadas para hoy</p>
              )}
            </div>
            
            {salidasHoy.length > 0 && (
              <div className="mt-3 text-right">
                <a href="#" className="text-sm text-blue-600 hover:text-blue-800 flex items-center justify-end w-full">
                  Ver todas las salidas <FaChevronRight className="ml-1" />
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-md p-5">
        <h2 className="font-semibold text-gray-700 mb-3 flex items-center">
          <FaSyncAlt className="mr-2 text-blue-500" /> Acciones rápidas
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <a href="#" className="flex flex-col items-center justify-center p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors">
            <div className="bg-blue-100 p-3 rounded-full mb-2">
              <FaCalendarAlt className="text-blue-600" />
            </div>
            <span className="text-sm text-gray-800">Nueva Reserva</span>
          </a>
          
          <a href="#" className="flex flex-col items-center justify-center p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-colors">
            <div className="bg-green-100 p-3 rounded-full mb-2">
              <FaUsers className="text-green-600" />
            </div>
            <span className="text-sm text-gray-800">Nuevo Cliente</span>
          </a>
          
          <a href="#" className="flex flex-col items-center justify-center p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors">
            <div className="bg-purple-100 p-3 rounded-full mb-2">
              <FaCreditCard className="text-purple-600" />
            </div>
            <span className="text-sm text-gray-800">Registrar Pago</span>
          </a>
          
          <a href="#" className="flex flex-col items-center justify-center p-3 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors">
            <div className="bg-amber-100 p-3 rounded-full mb-2">
              <FaPhone className="text-amber-600" />
            </div>
            <span className="text-sm text-gray-800">Buscar Cliente</span>
          </a>
        </div>
      </div>
      
      {/* Resumen del día */}
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg shadow-md p-5 text-white">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="font-bold text-xl mb-1">Resumen del día</h2>
            <p className="text-blue-100">
              {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
            </p>
          </div>
          <div className="mt-3 md:mt-0 flex flex-col items-end">
            <div className="text-2xl font-bold">{formatMoneda(totalVentasHoy)}</div>
            <div className="text-sm text-blue-100">
              {totalReservasHoy} reservas | {ventasCompletadasHoy.length} completadas
            </div>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center">
              <FaCreditCard className="mr-2" />
              <span>Métodos de pago</span>
            </div>
            <div className="mt-2 space-y-1">
              {metodoPagoStats.slice(0, 4).map((metodo, index) => (
                <div key={`resumen-metodo-${index}`} className="flex justify-between text-sm">
                  <span>{metodo.nombre}:</span>
                  <span>S/ {((totalVentasHoy * metodo.valor) / 100).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center">
              <FaShip className="mr-2" />
              <span>Tours populares</span>
            </div>
            <div className="mt-2 space-y-1">
              {tourStats.slice(0, 4).map((tour, index) => (
                <div key={`popular-${index}`} className="flex justify-between text-sm">
                  <span className="truncate max-w-[150px]">{tour.nombre}:</span>
                  <span>{tour.valor}%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white/10 p-3 rounded-lg">
            <div className="flex items-center">
              <FaInfoCircle className="mr-2" />
              <span>Información útil</span>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              <div>Próxima salida: {salidasHoy.length > 0 ? `${salidasHoy[0].nombre_tour || 'Tour'} - ${salidasHoy[0].hora_inicio}` : 'No hay salidas hoy'}</div>
              <div>Clientes nuevos hoy: {Math.round(totalReservasHoy * 0.3)}</div>
              <div>Reservas para mañana: {Math.round(totalReservasHoy * 1.2)}</div>
              <div>Meta de ventas restante: {formatMoneda(Math.max(0, metasVentas[0].meta - totalVentasHoy))}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;