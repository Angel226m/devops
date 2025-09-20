 /*


import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../infrastructure/store/index';
import { 
  FiCalendar, FiUsers, FiDollarSign, FiAnchor, FiArrowUp, FiArrowDown, 
  FiChevronRight, FiActivity, FiBarChart2, FiTrendingUp, FiDownload,
  FiPrinter, FiFilter, FiClock, FiRefreshCw
} from 'react-icons/fi';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  Legend, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { format, subDays, subMonths, eachDayOfInterval, addDays } from 'date-fns';
import { es } from 'date-fns/locale';

// Definición de tipos para los datos de gráficos
interface VentaData {
  name: string;
  ventas: number;
}

interface OcupacionData {
  name: string;
  ocupacion: number;
}

interface RendimientoData {
  name: string;
  ingresos: number;
  egresos: number;
}

interface DistribucionData {
  name: string;
  value: number;
}

interface ChartData {
  ventas: VentaData[];
  ocupacion: OcupacionData[];
  rendimiento: RendimientoData[];
  distribucion: DistribucionData[];
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

// Fechas de referencia para el período seleccionado
const fechaActual = new Date('2025-07-03');
const fechaInicioPeriodo = new Date('2025-06-20');
const fechaFinPeriodo = new Date('2025-07-03');

// Componente de selector de período
const PeriodSelector = ({ 
  period, 
  setPeriod, 
  onRefresh 
}: { 
  period: string; 
  setPeriod: (period: string) => void;
  onRefresh: () => void;
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 flex">
        <button 
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${period === 'day' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setPeriod('day')}
        >
          Hoy
        </button>
        <button 
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${period === 'week' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setPeriod('week')}
        >
          Semana
        </button>
        <button 
          className={`px-3 py-1.5 text-sm rounded-md transition-colors ${period === 'month' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
          onClick={() => setPeriod('month')}
        >
          Todo
        </button>
      </div>
      <button 
        onClick={onRefresh}
        className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        title="Actualizar datos"
      >
        <FiRefreshCw size={16} />
      </button>
    </div>
  );
};

// Componente para la tarjeta de exportación
const ExportCard = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Exportar Informes</h3>
      <div className="space-y-3">
        <button 
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => alert('Exportando a Excel...')}
        >
          <span className="text-sm text-gray-700">Reporte de Ventas</span>
          <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full flex items-center">
            <FiDownload className="mr-1" size={12} /> Excel
          </span>
        </button>
        <button 
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => alert('Exportando a PDF...')}
        >
          <span className="text-sm text-gray-700">Reporte de Ocupación</span>
          <span className="text-xs px-2 py-1 bg-red-100 text-red-700 rounded-full flex items-center">
            <FiDownload className="mr-1" size={12} /> PDF
          </span>
        </button>
        <button 
          className="w-full flex items-center justify-between p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
          onClick={() => alert('Imprimiendo...')}
        >
          <span className="text-sm text-gray-700">Programación Semanal</span>
          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full flex items-center">
            <FiPrinter className="mr-1" size={12} /> Imprimir
          </span>
        </button>
      </div>
    </div>
  );
};

// Definición de tipos para evitar errores
interface TourProximo {
  id: number;
  tipo: string;
  embarcacion: string;
  hora: string;
  estado: string;
  reservas: string;
}

interface Stats {
  toursHoy: number;
  reservasHoy: number;
  embarcacionesActivas: number;
  ventasHoy: number;
  toursProximos: TourProximo[];
}

// Datos para el gráfico de donut
const COLORS = ['#0088FE', '#00C49F', '#FFBB28'];

const AdminDashboard: React.FC = () => {
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  const [stats, setStats] = useState<Stats>({
    toursHoy: 0,
    reservasHoy: 0,
    embarcacionesActivas: 0,
    ventasHoy: 0,
    toursProximos: []
  });
  
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('week');
  
  // Datos para diferentes períodos
  const [chartData, setChartData] = useState<ChartData>({
    ventas: [],
    ocupacion: [],
    rendimiento: [],
    distribucion: []
  });
  
  // Generar datos de ventas por día para el período
  const generarDatosVentas = () => {
    if (period === 'day') {
      // Datos por horas para el día actual
      return Array.from({ length: 12 }, (_, i) => ({
        name: `${i + 8}:00`,
        ventas: Math.floor(Math.random() * 2000) + 500,
      }));
    } else if (period === 'week') {
      // Datos de la última semana
      const finSemana = new Date(fechaActual);
      const inicioSemana = new Date(fechaActual);
      inicioSemana.setDate(finSemana.getDate() - 6);
      
      const diasSemana = eachDayOfInterval({
        start: inicioSemana,
        end: finSemana
      });
      
      return diasSemana.map(dia => ({
        name: format(dia, 'EEE dd', { locale: es }),
        ventas: Math.floor(Math.random() * 6000) + 2000,
      }));
    } else {
      // Datos para todo el período (20 de junio al 3 de julio)
      const diasPeriodo = eachDayOfInterval({
        start: fechaInicioPeriodo,
        end: fechaFinPeriodo
      });
      
      return diasPeriodo.map(dia => {
        // Generar datos con más ventas durante fines de semana
        const esFinDeSemana = dia.getDay() === 0 || dia.getDay() === 6;
        const factorMultiplicador = esFinDeSemana ? 1.5 : 1;
        
        return {
          name: format(dia, 'dd/MM', { locale: es }),
          ventas: Math.floor(Math.random() * 5000 * factorMultiplicador) + 2000,
        };
      });
    }
  };
  
  // Simulación de carga de datos según el período
  const fetchData = () => {
    setLoading(true);
    
    // Simulamos tiempo de carga
    setTimeout(() => {
      // Generar datos de ventas según el período
      const ventasData = generarDatosVentas();
      
      // Datos de ocupación para los tours específicos
      const ocupacionData: OcupacionData[] = [
        { name: 'Tour de Ballenas', ocupacion: 85 },
        { name: 'Tour a las Islas Ballenas', ocupacion: 68 },
        { name: 'Tour a las Islas Blancas', ocupacion: 75 },
      ];
      
      // Datos de rendimiento para el gráfico de área
      const rendimientoData: RendimientoData[] = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(fechaActual, 11 - i);
        return {
          name: format(date, 'MMM', { locale: es }),
          ingresos: Math.floor(Math.random() * 50000) + 30000,
          egresos: Math.floor(Math.random() * 30000) + 10000,
        };
      });
      
      // Datos para el gráfico de distribución (donut chart)
      const distribucionData: DistribucionData[] = [
        { name: 'Tour de Ballenas', value: 45 },
        { name: 'Tour a las Islas Ballenas', value: 30 },
        { name: 'Tour a las Islas Blancas', value: 25 },
      ];
      
      setChartData({
        ventas: ventasData,
        ocupacion: ocupacionData,
        rendimiento: rendimientoData,
        distribucion: distribucionData
      });
      
      // Establecer estadísticas según el período
      if (period === 'day') {
        setStats({
          toursHoy: 8,
          reservasHoy: 42,
          embarcacionesActivas: 6,
          ventasHoy: 12450,
          toursProximos: [
            { id: 1, tipo: 'Tour de Ballenas', embarcacion: 'Embarcación 01', hora: '10:00 AM', estado: 'Programado', reservas: '38/50' },
            { id: 2, tipo: 'Tour a las Islas Ballenas', embarcacion: 'Embarcación 03', hora: '11:30 AM', estado: 'Pendiente', reservas: '28/40' },
            { id: 3, tipo: 'Tour a las Islas Blancas', embarcacion: 'Embarcación 02', hora: '14:00 PM', estado: 'Confirmado', reservas: '32/40' },
            { id: 4, tipo: 'Tour de Ballenas', embarcacion: 'Embarcación 05', hora: '16:30 PM', estado: 'Programado', reservas: '25/50' },
          ]
        });
      } else if (period === 'week') {
        setStats({
          toursHoy: 6,
          reservasHoy: 32,
          embarcacionesActivas: 8,
          ventasHoy: 9850,
          toursProximos: [
            { id: 1, tipo: 'Tour de Ballenas', embarcacion: 'Embarcación 01', hora: '10:00 AM', estado: 'Programado', reservas: '42/50' },
            { id: 2, tipo: 'Tour a las Islas Ballenas', embarcacion: 'Embarcación 03', hora: '11:30 AM', estado: 'Pendiente', reservas: '32/40' },
            { id: 3, tipo: 'Tour a las Islas Blancas', embarcacion: 'Embarcación 02', hora: '14:00 PM', estado: 'Confirmado', reservas: '35/40' },
          ]
        });
      } else {
        // Para todo el período
        setStats({
          toursHoy: 5,
          reservasHoy: 28,
          embarcacionesActivas: 10,
          ventasHoy: 8750,
          toursProximos: [
            { id: 1, tipo: 'Tour de Ballenas', embarcacion: 'Embarcación 01', hora: '10:00 AM', estado: 'Programado', reservas: '45/50' },
            { id: 2, tipo: 'Tour a las Islas Ballenas', embarcacion: 'Embarcación 03', hora: '11:30 AM', estado: 'Pendiente', reservas: '36/40' },
            { id: 3, tipo: 'Tour a las Islas Blancas', embarcacion: 'Embarcación 02', hora: '14:00 PM', estado: 'Confirmado', reservas: '38/40' },
            { id: 4, tipo: 'Tour de Ballenas', embarcacion: 'Embarcación 04', hora: '15:30 PM', estado: 'Programado', reservas: '40/50' },
            { id: 5, tipo: 'Tour a las Islas Blancas', embarcacion: 'Embarcación 06', hora: '09:00 AM', estado: 'Confirmado', reservas: '32/40' },
          ]
        });
      }
      
      setLoading(false);
    }, 800);
  };
  
  // Efecto para cargar datos cuando cambia el período
  useEffect(() => {
    fetchData();
  }, [period, selectedSede]);
  
  // Función para exportar a Excel
  const exportToExcel = () => {
    alert('Exportando datos a Excel...');
    // Implementación real: usar una librería como xlsx o file-saver
  };
  
  // Función para exportar a PDF
  const exportToPDF = () => {
    alert('Exportando datos a PDF...');
    // Implementación real: usar una librería como jspdf o react-pdf
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Administrativo</h1>
          <p className="text-sm text-gray-500">
            Bienvenido, {user?.nombres || 'Administrador'}. 
            Período: {format(fechaInicioPeriodo, "dd MMM", { locale: es })} - {format(fechaFinPeriodo, "dd MMM yyyy", { locale: es })}
          </p>
        </div>
        <div className="mt-4 md:mt-0 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
          <PeriodSelector 
            period={period} 
            setPeriod={setPeriod}
            onRefresh={fetchData}
          />
          <div className="flex space-x-2">
            <button 
              onClick={exportToExcel}
              className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-md flex items-center transition-colors"
            >
              <FiDownload size={16} className="mr-2" /> Excel
            </button>
            <button 
              onClick={exportToPDF}
              className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-md flex items-center transition-colors"
            >
              <FiDownload size={16} className="mr-2" /> PDF
            </button>
          </div>
        </div>
      </div>
      
      {/* Tarjetas de estadísticas *//*}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjeta de Tours Hoy *//*}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Tours {period === 'day' ? 'Hoy' : period === 'week' ? 'Esta Semana' : 'Total'}
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-800">
                {stats.toursHoy * (period === 'day' ? 1 : period === 'week' ? 7 : 14)}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <FiArrowUp size={14} className="mr-1" /> 
                <span>12% respecto al período anterior</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiCalendar className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta de Reservas Hoy *//*}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Reservas {period === 'day' ? 'Hoy' : period === 'week' ? 'Esta Semana' : 'Total'}
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-800">
                {stats.reservasHoy * (period === 'day' ? 1 : period === 'week' ? 7 : 14)}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <FiArrowUp size={14} className="mr-1" /> 
                <span>8% respecto al período anterior</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiUsers className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta de Embarcaciones Activas *//*}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Embarcaciones Activas</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">{stats.embarcacionesActivas}</p>
              <div className="flex items-center mt-2 text-sm text-gray-500">
                <span>Total de {stats.embarcacionesActivas} en servicio</span>
              </div>
            </div>
            <div className="bg-orange-100 p-3 rounded-full">
              <FiAnchor className="h-7 w-7 text-orange-600" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta de Ventas *//*}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">
                Ventas {period === 'day' ? 'Hoy' : period === 'week' ? 'Esta Semana' : 'Total'}
              </p>
              <p className="text-3xl font-bold mt-1 text-gray-800">
                S/. {(stats.ventasHoy * (period === 'day' ? 1 : period === 'week' ? 7 : 14)).toLocaleString('es-PE')}
              </p>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <FiArrowDown size={14} className="mr-1" /> 
                <span>3% respecto al período anterior</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiDollarSign className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos principales *//*}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Ventas {period === 'day' ? 'de Hoy' : period === 'week' ? 'de la Semana' : 'del Período'}
            </h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Ver detalle <FiChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData.ventas}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => `S/.${value.toLocaleString('es-PE')}`}
                />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip 
                  formatter={(value: any) => [`S/.${value.toLocaleString('es-PE')}`, 'Ventas']}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorVentas)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Ocupación por Tipo de Tour</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Ver detalle <FiChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData.ocupacion}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `${value}%`} />
                <Tooltip formatter={(value) => [`${value}%`, 'Ocupación']} />
                <Bar dataKey="ocupacion" name="Ocupación">
                  {chartData.ocupacion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Gráficos adicionales *//*}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Rendimiento Anual</h2>
            <div className="flex space-x-2">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                <span className="text-xs text-gray-600">Ingresos</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-1"></span>
                <span className="text-xs text-gray-600">Egresos</span>
              </div>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData.rendimiento}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="colorEgresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis tickFormatter={(value) => `S/.${(value/1000).toFixed(0)}k`} />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value: any) => [`S/.${value.toLocaleString('es-PE')}`, '']} />
                <Area 
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="#3b82f6" 
                  fillOpacity={1} 
                  fill="url(#colorIngresos)" 
                  stackId="1"
                  name="Ingresos"
                />
                <Area 
                  type="monotone" 
                  dataKey="egresos" 
                  stroke="#ef4444" 
                  fillOpacity={1} 
                  fill="url(#colorEgresos)" 
                  stackId="2"
                  name="Egresos"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Distribución de Tours</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Filtrar <FiFilter size={16} className="ml-1" />
            </button>
          </div>
          <div className="h-80 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData.distribucion}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.distribucion.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value}%`, 'Proporción']} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-2">
            {chartData.distribucion.map((entry, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center">
                  <span 
                    className="h-3 w-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  ></span>
                  <span className="text-gray-700">{entry.name}</span>
                </div>
                <span className="font-medium">{entry.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Sección de Tours Próximos *//*}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Tours Próximos</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <FiClock size={14} />
                <span>{period === 'day' ? 'Hoy' : period === 'week' ? '7 días' : '20 Jun - 3 Jul'}</span>
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                Ver todos <FiChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo de Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Embarcación
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Hora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reservas
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {stats.toursProximos.map((tour) => (
                  <tr key={tour.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                      {tour.tipo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tour.embarcacion}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tour.hora}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${tour.estado === 'Programado' ? 'bg-green-100 text-green-800' : 
                          tour.estado === 'Pendiente' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-blue-100 text-blue-800'}`}>
                        {tour.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {tour.reservas}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button className="text-blue-600 hover:text-blue-900 mr-4">Ver</button>
                      <button className="text-green-600 hover:text-green-900">Editar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Tarjeta de exportación *//*}
        <ExportCard />
      </div>
      
      {/* Sección de Actividad Reciente *//*}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Actividad Reciente</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            Ver todo <FiChevronRight size={16} className="ml-1" />
          </button>
        </div>
        <div className="p-6">
          <div className="space-y-6">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  R
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Nueva reserva para Tour de Ballenas</p>
                <p className="text-sm text-gray-500">Hace 5 minutos</p>
                <div className="mt-1 flex items-center">
                  <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded flex items-center">
                    <FiActivity size={12} className="mr-1" /> Reserva
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                  P
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Pago recibido para reserva #1234</p>
                <p className="text-sm text-gray-500">Hace 15 minutos</p>
                <div className="mt-1 flex items-center">
                  <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded flex items-center">
                    <FiDollarSign size={12} className="mr-1" /> Pago
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center text-white">
                  T
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Tour finalizado: Tour a las Islas Ballenas</p>
                <p className="text-sm text-gray-500">Hace 1 hora</p>
                <div className="mt-1 flex items-center">
                  <div className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded flex items-center">
                    <FiBarChart2 size={12} className="mr-1" /> Tour
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                  V
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-900">Actualización de capacidad: Tour a las Islas Blancas</p>
                <p className="text-sm text-gray-500">Hace 2 horas</p>
                <div className="mt-1 flex items-center">
                  <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex items-center">
                    <FiTrendingUp size={12} className="mr-1" /> Actualización
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;*/
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useDashboard } from '../../hooks/useDashboard';
import { formatCurrency, formatNumber, formatDate } from '../../../shared/utils/formatters';
import Card from '../components/Card'; // ✅ Correcto - import por defecto
import { ROUTES } from '../../../shared/constants/appRoutes';

// Componente para tarjetas de métricas
const MetricCard: React.FC<{
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}> = ({ title, value, icon, color, trend }) => (
  <Card className={`p-6 border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {trend && (
          <p className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}% vs mes anterior
          </p>
        )}
      </div>
      <div className="text-3xl">{icon}</div>
    </div>
  </Card>
);

// Componente para gráfico simple de barras
const SimpleBarChart: React.FC<{ data: Array<{ label: string; value: number }> }> = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value));
  
  return (
    <div className="space-y-3">
      {data.map((item, index) => (
        <div key={index} className="flex items-center space-x-3">
          <div className="w-16 text-sm text-gray-600">{item.label}</div>
          <div className="flex-1 bg-gray-200 rounded-full h-4">
            <div
              className="bg-blue-500 h-4 rounded-full transition-all duration-500"
              style={{ width: `${(item.value / maxValue) * 100}%` }}
            />
          </div>
          <div className="w-20 text-sm font-medium text-right">
            {formatCurrency(item.value)}
          </div>
        </div>
      ))}
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  const {
    metricas,
    resumenGeneral,
    ventasPorMes,
    estadisticasSedes,
    loading,
    loadingVentas,
    loadingSedes,
    error,
    cargarMetricasCompletas,
    cargarEstadisticasSedes,
    limpiarErrores
  } = useDashboard();

  const [activeTab, setActiveTab] = useState<'resumen' | 'ventas' | 'sedes'>('resumen');

  useEffect(() => {
    cargarMetricasCompletas();
    // Si es admin sin sede específica, cargar estadísticas de todas las sedes
    if (!selectedSede) {
      cargarEstadisticasSedes();
    }
  }, [cargarMetricasCompletas, cargarEstadisticasSedes, selectedSede]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        limpiarErrores();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, limpiarErrores]);

  // Auto-refresh cada 5 minutos
  useEffect(() => {
    const interval = setInterval(() => {
      cargarMetricasCompletas();
    }, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [cargarMetricasCompletas]);

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
            <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrativo</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, {user?.nombres} {user?.apellidos} | 
              {selectedSede ? ` Sede: ${selectedSede.nombre}` : ' Vista Global'}
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

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8" aria-label="Tabs">
          {[
            { id: 'resumen', name: 'Resumen General', icon: '📊' },
            { id: 'ventas', name: 'Análisis de Ventas', icon: '💰' },
            ...(estadisticasSedes.length > 0 ? [{ id: 'sedes', name: 'Comparativa Sedes', icon: '🏢' }] : [])
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
            <MetricCard
              title="Total Reservas"
              value={formatNumber(resumenGeneral.total_reservas)}
              icon="📋"
              color="border-blue-500"
            />
            <MetricCard
              title="Reservas Hoy"
              value={formatNumber(resumenGeneral.reservas_hoy)}
              icon="📅"
              color="border-green-500"
            />
            <MetricCard
              title="Ingresos Total"
              value={formatCurrency(resumenGeneral.ingresos_total)}
              icon="💰"
              color="border-yellow-500"
            />
            <MetricCard
              title="Ingresos Hoy"
              value={formatCurrency(resumenGeneral.ingresos_hoy)}
              icon="💵"
              color="border-purple-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <MetricCard
              title="Clientes Activos"
              value={formatNumber(resumenGeneral.clientes_activos)}
              icon="👥"
              color="border-indigo-500"
            />
            <MetricCard
              title="Tours Disponibles"
              value={formatNumber(resumenGeneral.tours_disponibles)}
              icon="🚢"
              color="border-cyan-500"
            />
            <MetricCard
              title="Embarcaciones"
              value={formatNumber(resumenGeneral.total_embarcaciones)}
              icon="⛵"
              color="border-teal-500"
            />
            <MetricCard
              title="Vendedores Activos"
              value={formatNumber(resumenGeneral.vendedores_activos)}
              icon="👤"
              color="border-rose-500"
            />
          </div>

          {/* Próximos tours y estado de reservas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Próximos tours */}
            {metricas?.proximos_tours && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  🚢 Próximos Tours Programados
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
                            Chofer: {tour.nombre_chofer} | {tour.embarcacion}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">
                            {tour.reservados}/{tour.cupo}
                          </p>
                          <p className="text-xs text-gray-500">ocupado</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Estado de reservas */}
            {metricas?.reservas_por_estado && (
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  📊 Estado de Reservas
                </h3>
                <div className="space-y-3">
                  {metricas.reservas_por_estado.map((reserva, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-gray-600">{reserva.estado}</span>
                      <span className="font-medium">{formatNumber(reserva.cantidad)}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {activeTab === 'ventas' && (
        <div className="space-y-6">
          {loadingVentas ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <>
              {/* Gráfico de ventas por mes */}
              {ventasPorMes.length > 0 && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">📈 Ventas por Mes (Últimos 6 meses)</h3>
                  <SimpleBarChart 
                    data={ventasPorMes.map(v => ({ label: v.mes, value: v.ingresos }))}
                  />
                </Card>
              )}

              {/* Tours más vendidos */}
              {metricas?.tours_mas_vendidos && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">🏆 Tours Más Vendidos</h3>
                  <div className="space-y-3">
                    {metricas.tours_mas_vendidos.slice(0, 10).map((tour, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                        <div>
                          <p className="font-medium">{tour.nombre_tour}</p>
                          <p className="text-sm text-gray-600">{tour.cantidad} reservas</p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(tour.ingresos)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Meta de ingresos diarios */}
              {metricas?.ingresos_hoy && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold mb-4">🎯 Meta Diaria</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span>Progreso del día</span>
                    <span className="font-medium">
                      {formatCurrency(metricas.ingresos_hoy.ingresos)} / {formatCurrency(metricas.ingresos_hoy.meta)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                      className="bg-green-500 h-4 rounded-full transition-all duration-500"
                      style={{ 
                        width: `${Math.min((metricas.ingresos_hoy.ingresos / metricas.ingresos_hoy.meta) * 100, 100)}%` 
                      }}
                    />
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {((metricas.ingresos_hoy.ingresos / metricas.ingresos_hoy.meta) * 100).toFixed(1)}% completado
                  </p>
                </Card>
              )}
            </>
          )}
        </div>
      )}

      {activeTab === 'sedes' && estadisticasSedes.length > 0 && (
        <div className="space-y-6">
          {loadingSedes ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">🏢 Comparativa entre Sedes</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sede
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reservas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ingresos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tours Activos
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vendedores
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Embarcaciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {estadisticasSedes.map((sede) => (
                      <tr key={sede.id_sede} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">{sede.nombre_sede}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(sede.total_reservas)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(sede.ingresos_total)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(sede.tours_activos)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(sede.vendedores)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatNumber(sede.embarcaciones)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;