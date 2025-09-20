/*import React, { useState, useEffect } from 'react';
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
  eachDayOfInterval,
  addDays
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

// Configuración de tours
const tourConfig = {
  'Tour de Ballenas': {
    capacidad: 50,
    precioBase: 150
  },
  'Tour a las Islas Ballenas': {
    capacidad: 40,
    precioBase: 120
  },
  'Tour a las Islas Blancas': {
    capacidad: 40,
    precioBase: 130
  }
};

// Fechas de referencia
const fechaActual = new Date('2025-07-03');
const fechaInicioPeriodo = new Date('2025-06-20');
const fechaFinPeriodo = new Date('2025-07-03');

// Datos más detallados para las ventas diarias (período del 20 de junio al 3 de julio)
const generarVentasDiarias = (): DailyStats[] => {
  const dias = eachDayOfInterval({
    start: fechaInicioPeriodo,
    end: fechaFinPeriodo
  });
  
  return dias.map(fecha => {
    // Generar datos con más ventas durante fines de semana
    const esFinDeSemana = fecha.getDay() === 0 || fecha.getDay() === 6;
    const factorMultiplicador = esFinDeSemana ? 1.5 : 1;
    
    return {
      fecha: format(fecha, 'dd/MM', { locale: es }),
      fechaCompleta: fecha,
      reservas: Math.floor(Math.random() * 10 * factorMultiplicador) + 1,
      ventas: Math.floor(Math.random() * 800 * factorMultiplicador) + 200,
      pasajeros: Math.floor(Math.random() * 25 * factorMultiplicador) + 5,
    };
  });
};

const ventasPorDia = generarVentasDiarias();

// Datos detallados para las ventas de hoy
const ventasHoy: VentaResumen[] = [
  { 
    id: 1, 
    tour: 'Tour de Ballenas', 
    horario: '09:00', 
    cliente: 'Juan Pérez', 
    monto: 150, 
    metodoPago: 'Efectivo', 
    estado: 'completado',
    fecha: '2025-07-03T09:00:00Z'
  },
  { 
    id: 2, 
    tour: 'Tour a las Islas Ballenas', 
    horario: '10:30', 
    cliente: 'María López', 
    monto: 120, 
    metodoPago: 'Tarjeta', 
    estado: 'completado',
    fecha: '2025-07-03T10:30:00Z'
  },
  { 
    id: 3, 
    tour: 'Tour a las Islas Blancas', 
    horario: '13:00', 
    cliente: 'Carlos Rodríguez', 
    monto: 130, 
    metodoPago: 'Transferencia', 
    estado: 'pendiente',
    fecha: '2025-07-03T13:00:00Z'
  },
  { 
    id: 4, 
    tour: 'Tour de Ballenas', 
    horario: '15:00', 
    cliente: 'Ana Gómez', 
    monto: 150, 
    metodoPago: 'Efectivo', 
    estado: 'pendiente',
    fecha: '2025-07-03T15:00:00Z'
  },
  { 
    id: 5, 
    tour: 'Tour a las Islas Blancas', 
    horario: '08:30', 
    cliente: 'Roberto Silva', 
    monto: 130, 
    metodoPago: 'Tarjeta', 
    estado: 'completado',
    fecha: '2025-07-03T08:30:00Z'
  },
  { 
    id: 6, 
    tour: 'Tour a las Islas Ballenas', 
    horario: '11:00', 
    cliente: 'Laura Méndez', 
    monto: 120, 
    metodoPago: 'Transferencia', 
    estado: 'completado',
    fecha: '2025-07-03T11:00:00Z'
  }
];

// Datos de distribución de ventas por tipo de tour
const ventasPorTour = [
  { nombre: 'Tour de Ballenas', valor: 45, color: '#0088FE' },
  { nombre: 'Tour a las Islas Ballenas', valor: 30, color: '#00C49F' },
  { nombre: 'Tour a las Islas Blancas', valor: 25, color: '#FFBB28' }
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
  { id: 1, tour: 'Tour de Ballenas', fecha: '2025-07-03', hora: '09:00', lugarSalida: 'Muelle Principal', cuposDisponibles: 8, cuposTotal: 50, estado: 'programado' },
  { id: 2, tour: 'Tour a las Islas Ballenas', fecha: '2025-07-03', hora: '10:30', lugarSalida: 'Muelle Principal', cuposDisponibles: 12, cuposTotal: 40, estado: 'programado' },
  { id: 3, tour: 'Tour a las Islas Blancas', fecha: '2025-07-03', hora: '14:00', lugarSalida: 'Muelle Secundario', cuposDisponibles: 15, cuposTotal: 40, estado: 'programado' },
  { id: 4, tour: 'Tour de Ballenas', fecha: '2025-07-03', hora: '16:00', lugarSalida: 'Muelle Principal', cuposDisponibles: 20, cuposTotal: 50, estado: 'programado' },
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
  const [currentDateTime, setCurrentDateTime] = useState<string>("2025-07-03 20:04:16");
  const [currentUser, setCurrentUser] = useState<string>("Angel226m");
  
  // Calcular estadísticas
  const totalVentasHoy = ventasHoy.reduce((sum, venta) => sum + venta.monto, 0);
  const ventasCompletadasHoy = ventasHoy.filter(v => v.estado === 'completado');
  const totalVentasCompletadasHoy = ventasCompletadasHoy.reduce((sum, venta) => sum + venta.monto, 0);
  const totalReservasHoy = ventasHoy.length;
  const reservasPendientesHoy = ventasHoy.filter(v => v.estado === 'pendiente').length;
  
  // Calcular totales por período
  const calcularTotalPeriodo = (periodo: 'dia' | 'semana' | 'mes'): number => {
    const hoy = fechaActual;
    let diasPeriodo: DailyStats[] = [];
    
    if (periodo === 'dia') {
      diasPeriodo = ventasPorDia.filter(d => 
        d.fechaCompleta && format(d.fechaCompleta, 'yyyy-MM-dd') === format(hoy, 'yyyy-MM-dd')
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
    const hoy = fechaActual;
    
    if (period === 'dia') {
      return ventasPorDia.filter(d => 
        d.fechaCompleta && format(d.fechaCompleta, 'yyyy-MM-dd') === format(hoy, 'yyyy-MM-dd')
      );
    } else if (period === 'semana') {
      const inicioSemana = startOfWeek(hoy, { locale: es });
      const finSemana = endOfWeek(hoy, { locale: es });
      return ventasPorDia.filter(d => 
        d.fechaCompleta && 
        d.fechaCompleta >= inicioSemana && 
        d.fechaCompleta <= finSemana
      );
    } else {
      // Mostrar el período completo del 20 de junio al 3 de julio
      return ventasPorDia;
    }
  };
  
  const datosFiltrados = filtrarDatosPorPeriodo();
  
  // Calcular tendencia (comparación con el día anterior)
  const calcularTendencia = (): { porcentaje: number, esCrecimiento: boolean } => {
    // Encontrar el índice del día actual
    const indexHoy = ventasPorDia.findIndex(d => 
      d.fechaCompleta && format(d.fechaCompleta, 'yyyy-MM-dd') === format(fechaActual, 'yyyy-MM-dd')
    );
    
    if (indexHoy <= 0 || indexHoy >= ventasPorDia.length) return { porcentaje: 0, esCrecimiento: true };
    
    const ventasHoy = ventasPorDia[indexHoy].ventas;
    const ventasAyer = ventasPorDia[indexHoy - 1].ventas;
    
    if (ventasAyer === 0) return { porcentaje: 100, esCrecimiento: true };
    
    const porcentaje = Math.round(((ventasHoy - ventasAyer) / ventasAyer) * 100);
    return {
      porcentaje: Math.abs(porcentaje),
      esCrecimiento: porcentaje >= 0
    };
  };
  
  const tendencia = calcularTendencia();
  
  // Filtrar próximas salidas
  const hoy = format(fechaActual, 'yyyy-MM-dd');
  const salidasHoy = proximasSalidas.filter(s => s.fecha === hoy);
  const salidasUrgentes = salidasHoy.filter(s => {
    const [hora, minuto] = s.hora.split(':').map(Number);
    const fechaSalida = new Date(fechaActual);
    fechaSalida.setHours(hora, minuto);
    const diferenciaMilisegundos = fechaSalida.getTime() - fechaActual.getTime();
    return diferenciaMilisegundos > 0 && diferenciaMilisegundos < 2 * 60 * 60 * 1000; // 2 horas
  });
  
  // Simular carga de datos
  useEffect(() => {
    const loadDashboardData = async () => {
      setIsLoading(true);
      try {
        // Simulamos un retardo
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Actualizar fecha y hora actual
        setCurrentDateTime("2025-07-03 20:04:16"); // Este valor vendría de alguna API o del servidor
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
              <p className="text-2xl font-bold text-gray-800">42</p>
              <p className="text-xs text-gray-500 mt-1">
                <span className="font-medium">15</span> pendientes por llegar
              </p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FiUsers className="text-amber-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">
              27 ya embarcados
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
              {format(fechaActual, "dd MMM", { locale: es })}
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
              {format(fechaActual, "MMMM yyyy", { locale: es })}
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
                  Todo
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
              {format(fechaActual, "d 'de' MMMM", { locale: es })}
            </div>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {salidasHoy.length > 0 ? salidasHoy.map((salida) => {
                const [hora, minuto] = salida.hora.split(':').map(Number);
                const fechaSalida = new Date(fechaActual);
                fechaSalida.setHours(hora, minuto);
                const diferenciaMilisegundos = fechaSalida.getTime() - fechaActual.getTime();
                const esUrgente = diferenciaMilisegundos > 0 && diferenciaMilisegundos < 2 * 60 * 60 * 1000; // 2 horas
                
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
              {format(fechaActual, "EEEE d 'de' MMMM, yyyy", { locale: es })}
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
              {ventasPorTour.map((tour, index) => (
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
              <div>Clientes nuevos hoy: 4</div>
              <div>Reservas para mañana: 8</div>
              <div>Meta de ventas restante: S/ {Math.max(0, metasVentas[0].meta - totalVentasHoy).toLocaleString('es-PE')}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VendedorDashboard;*/
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency, formatNumber, formatDate } from '../../../shared/utils/formatters';
import Card from '../components/Card'; // ✅ Correcto - import por defecto
import { ROUTES } from '../../../shared/constants/appRoutes';

// Componente para tarjetas de métricas del vendedor
const VendedorMetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  onClick?: () => void;
}> = ({ title, value, icon, color, onClick }) => (
  <Card 
    className={`p-6 border-l-4 ${color} ${onClick ? 'cursor-pointer hover:shadow-lg transition-shadow' : ''}`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
    {onClick && (
      <div className="mt-2 text-sm text-blue-600">Click para ver detalles →</div>
    )}
  </Card>
);

// Componente para acciones rápidas
const QuickActionCard: React.FC<{
  title: string;
  description: string;
  icon: string;
  color: string;
  onClick: () => void;
}> = ({ title, description, icon, color, onClick }) => (
  <Card 
    className={`p-4 ${color} cursor-pointer hover:shadow-lg transition-all duration-200 transform hover:scale-105`}
    onClick={onClick}
  >
    <div className="flex items-center space-x-3">
      <div className="text-2xl">{icon}</div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  </Card>
);

const VendedorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  const {
    resumenGeneral,
    ventasPorMes,
    metricas,
    loading,
    error,
    cargarMetricasCompletas,
    limpiarErrores
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'resumen' | 'ventas'>('resumen');

  useEffect(() => {
    cargarMetricasCompletas();
  }, [cargarMetricasCompletas]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        limpiarErrores();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, limpiarErrores]);

  // Auto-refresh cada 10 minutos (menos frecuente que admin)
  useEffect(() => {
    const interval = setInterval(() => {
      cargarMetricasCompletas();
    }, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cargarMetricasCompletas]);

  const quickActions = [
    {
      title: 'Nueva Reserva',
      description: 'Crear una nueva reserva para cliente',
      icon: '➕',
      color: 'bg-green-50 border-green-200',
      onClick: () => navigate(ROUTES.VENDEDOR.RESERVAS.NUEVA)
    },
    {
      title: 'Ver Tours',
      description: 'Consultar tours disponibles',
      icon: '🚢',
      color: 'bg-blue-50 border-blue-200',
      onClick: () => navigate(ROUTES.VENDEDOR.TOURS)
    },
    {
      title: 'Gestionar Clientes',
      description: 'Ver y gestionar clientes',
      icon: '👥',
      color: 'bg-purple-50 border-purple-200',
      onClick: () => navigate(ROUTES.VENDEDOR.CLIENTES)
    },
    {
      title: 'Ver Pagos',
      description: 'Consultar pagos y transacciones',
      icon: '💰',
      color: 'bg-yellow-50 border-yellow-200',
      onClick: () => navigate(ROUTES.VENDEDOR.PAGOS)
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Cargando dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center">
            <div className="text-red-400 text-xl mr-3">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">Error al cargar dashboard</h3>
              <p className="text-red-600 text-sm mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 text-red-700 underline text-sm"
              >
                Recargar página
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard de Ventas</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, {user?.nombres} {user?.apellidos}
              {selectedSede && ` | Sede: ${selectedSede.nombre}`}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-500">
              Última actualización: {formatDate(new Date())}
            </div>
            <button
              onClick={cargarMetricasCompletas}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              🔄 Actualizar
            </button>
          </div>
        </div>
      </div>

      {/* Acciones rápidas */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">⚡ Acciones Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <QuickActionCard key={index} {...action} />
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'resumen', name: 'Resumen de Ventas', icon: '📊' },
            { id: 'ventas', name: 'Análisis Mensual', icon: '📈' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Contenido de tabs */}
      {activeTab === 'resumen' && resumenGeneral && (
        <div className="space-y-6">
          {/* Métricas principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <VendedorMetricCard
              title="Mis Reservas Totales"
              value={formatNumber(resumenGeneral.total_reservas)}
              icon="📋"
              color="border-blue-500"
              onClick={() => navigate(ROUTES.VENDEDOR.RESERVAS.LIST)}
            />
            <VendedorMetricCard
              title="Reservas Hoy"
              value={formatNumber(resumenGeneral.reservas_hoy)}
              icon="📅"
              color="border-green-500"
            />
            <VendedorMetricCard
              title="Ingresos Generados"
              value={formatCurrency(resumenGeneral.ingresos_total)}
              icon="💰"
              color="border-yellow-500"
            />
            <VendedorMetricCard
              title="Ventas Hoy"
              value={formatCurrency(resumenGeneral.ingresos_hoy)}
              icon="💵"
              color="border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <VendedorMetricCard
              title="Clientes Atendidos"
              value={formatNumber(resumenGeneral.clientes_activos)}
              icon="👥"
              color="border-indigo-500"
              onClick={() => navigate(ROUTES.VENDEDOR.CLIENTES)}
            />
            <VendedorMetricCard
              title="Tours Disponibles"
              value={formatNumber(resumenGeneral.tours_disponibles)}
              icon="🚢"
              color="border-cyan-500"
              onClick={() => navigate(ROUTES.VENDEDOR.TOURS)}
            />
            <VendedorMetricCard
              title="Embarcaciones"
              value={formatNumber(resumenGeneral.total_embarcaciones)}
              icon="⛵"
              color="border-teal-500"
            />
          </div>

          {/* Meta de ingresos diarios */}
          {metricas?.ingresos_hoy && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🎯 Mi Meta Diaria</h3>
              <div className="flex items-center justify-between mb-4">
                <span>Progreso del día</span>
                <span className="font-medium">
                  {formatCurrency(metricas.ingresos_hoy.ingresos)} / {formatCurrency(metricas.ingresos_hoy.meta)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-6">
                <div
                  className="bg-gradient-to-r from-green-400 to-green-600 h-6 rounded-full transition-all duration-500 flex items-center justify-center"
                  style={{ 
                    width: `${Math.min((metricas.ingresos_hoy.ingresos / metricas.ingresos_hoy.meta) * 100, 100)}%` 
                  }}
                >
                  <span className="text-white text-sm font-medium">
                    {((metricas.ingresos_hoy.ingresos / metricas.ingresos_hoy.meta) * 100).toFixed(0)}%
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {metricas.ingresos_hoy.ingresos >= metricas.ingresos_hoy.meta 
                  ? '¡Felicitaciones! Has superado tu meta diaria 🎉' 
                  : `Te faltan ${formatCurrency(metricas.ingresos_hoy.meta - metricas.ingresos_hoy.ingresos)} para alcanzar tu meta`
                }
              </p>
            </Card>
          )}

          {/* Próximos tours */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {metricas?.proximos_tours && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  🚢 Próximos Tours Disponibles
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {metricas.proximos_tours.slice(0, 5).map((tour, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-3 py-2 bg-blue-50 rounded">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-blue-900">{tour.nombre_tour}</p>
                          <p className="text-sm text-blue-600">
                            {formatDate(tour.fecha)} - {tour.hora_inicio}
                          </p>
                          <p className="text-xs text-blue-500">
                            Chofer: {tour.nombre_chofer}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-green-600">
                            {tour.cupo - tour.reservados} disponibles
                          </p>
                          <button
                            onClick={() => navigate(ROUTES.VENDEDOR.RESERVAS.NUEVA)}
                            className="text-xs bg-blue-600 text-white px-2 py-1 rounded mt-1 hover:bg-blue-700"
                          >
                            Reservar
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate(ROUTES.VENDEDOR.TOURS)}
                  className="w-full mt-3 text-blue-600 text-sm hover:text-blue-800"
                >
                  Ver todos los tours disponibles →
                </button>
              </Card>
            )}

            {/* Estado de reservas */}
            {metricas?.reservas_por_estado && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  📊 Mis Reservas por Estado
                </h3>
                <div className="space-y-3">
                  {metricas.reservas_por_estado.map((reserva, index) => (
                    <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                      <span className="text-gray-700 capitalize">{reserva.estado.toLowerCase()}</span>
                      <span className="font-medium bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {formatNumber(reserva.cantidad)}
                      </span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => navigate(ROUTES.VENDEDOR.RESERVAS.LIST)}
                  className="w-full mt-3 text-blue-600 text-sm hover:text-blue-800"
                >
                  Ver todas mis reservas →
                </button>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ventas' && (
        <div className="space-y-6">
          {/* Análisis de ventas mensuales */}
          {ventasPorMes.length > 0 && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">📈 Mi Rendimiento Mensual</h3>
              <div className="space-y-4">
                {ventasPorMes.map((venta, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{venta.mes}</p>
                      <p className="text-sm text-gray-600">{venta.reservas} reservas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{formatCurrency(venta.ingresos)}</p>
                      <p className="text-sm text-gray-500">ingresos generados</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Tours más vendidos por el vendedor */}
          {metricas?.tours_mas_vendidos && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🏆 Mis Tours Más Vendidos</h3>
              <div className="space-y-3">
                {metricas.tours_mas_vendidos.slice(0, 5).map((tour, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{tour.nombre_tour}</p>
                      <p className="text-sm text-gray-600">{tour.cantidad} reservas realizadas</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{formatCurrency(tour.ingresos)}</p>
                      <p className="text-sm text-gray-500">comisión generada</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}

      {/* Footer con consejos */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">💡 Consejos para mejorar tus ventas:</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Mantén actualizada la información de tus clientes</li>
          <li>• Ofrece tours que se adapten a las preferencias del cliente</li>
          <li>• Utiliza las estadísticas para identificar los tours más populares</li>
          <li>• Programa seguimientos con clientes para futuras reservas</li>
        </ul>
      </div>
    </div>
  );
};

export default VendedorDashboard;