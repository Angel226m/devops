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
import { format, subDays, subMonths } from 'date-fns';
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
          Mes
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
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A259FF'];

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
  
  // Simulación de carga de datos según el período
  const fetchData = () => {
    setLoading(true);
    
    // Simulamos tiempo de carga
    setTimeout(() => {
      // Generamos datos de ventas según el período
      let ventasData: VentaData[] = [];
      let ocupacionData: OcupacionData[] = [];
      let fechaInicio;
      
      if (period === 'day') {
        // Datos por horas para el día actual
        ventasData = Array.from({ length: 12 }, (_, i) => ({
          name: `${i + 8}:00`,
          ventas: Math.floor(Math.random() * 2000) + 500,
        }));
        
        ocupacionData = [
          { name: 'Tour Islas', ocupacion: 85 },
          { name: 'Tour Bahía', ocupacion: 65 },
          { name: 'Tour Avistamiento', ocupacion: 92 },
          { name: 'Tour Atardecer', ocupacion: 78 },
          { name: 'Tour Snorkel', ocupacion: 70 }
        ];
        
        fechaInicio = 'Hoy';
        
        // Estadísticas para el día
        setStats({
          toursHoy: 8,
          reservasHoy: 42,
          embarcacionesActivas: 6,
          ventasHoy: 12450,
          toursProximos: [
            { id: 1, tipo: 'Tour Islas', embarcacion: 'Velero 01', hora: '10:00 AM', estado: 'Programado', reservas: '12/20' },
            { id: 2, tipo: 'Tour Bahía', embarcacion: 'Lancha 03', hora: '11:30 AM', estado: 'Pendiente', reservas: '8/15' },
            { id: 3, tipo: 'Tour Avistamiento', embarcacion: 'Catamarán 02', hora: '2:00 PM', estado: 'Confirmado', reservas: '25/30' },
            { id: 4, tipo: 'Tour Atardecer', embarcacion: 'Lancha 05', hora: '4:30 PM', estado: 'Programado', reservas: '18/25' },
          ]
        });
      } else if (period === 'week') {
        // Datos por día para la semana actual
        ventasData = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), 6 - i);
          return {
            name: format(date, 'EEE', { locale: es }),
            ventas: Math.floor(Math.random() * 6000) + 2000,
          };
        });
        
        ocupacionData = [
          { name: 'Tour Islas', ocupacion: 75 },
          { name: 'Tour Bahía', ocupacion: 55 },
          { name: 'Tour Avistamiento', ocupacion: 90 },
          { name: 'Tour Atardecer', ocupacion: 60 },
          { name: 'Tour Snorkel', ocupacion: 65 }
        ];
        
        fechaInicio = 'Esta semana';
        
        // Estadísticas para la semana
        setStats({
          toursHoy: 5,
          reservasHoy: 28,
          embarcacionesActivas: 8,
          ventasHoy: 7890,
          toursProximos: [
            { id: 1, tipo: 'Tour Islas', embarcacion: 'Velero 01', hora: '10:00 AM', estado: 'Programado', reservas: '12/20' },
            { id: 2, tipo: 'Tour Bahía', embarcacion: 'Lancha 03', hora: '11:30 AM', estado: 'Pendiente', reservas: '8/15' },
            { id: 3, tipo: 'Tour Avistamiento', embarcacion: 'Catamarán 02', hora: '2:00 PM', estado: 'Confirmado', reservas: '25/30' },
          ]
        });
      } else {
        // Datos por semana para el mes actual
        ventasData = Array.from({ length: 4 }, (_, i) => ({
          name: `Semana ${i + 1}`,
          ventas: Math.floor(Math.random() * 25000) + 15000,
        }));
        
        ocupacionData = [
          { name: 'Tour Islas', ocupacion: 72 },
          { name: 'Tour Bahía', ocupacion: 58 },
          { name: 'Tour Avistamiento', ocupacion: 85 },
          { name: 'Tour Atardecer', ocupacion: 63 },
          { name: 'Tour Snorkel', ocupacion: 70 }
        ];
        
        fechaInicio = 'Este mes';
        
        // Estadísticas para el mes
        setStats({
          toursHoy: 5,
          reservasHoy: 28,
          embarcacionesActivas: 10,
          ventasHoy: 7890,
          toursProximos: [
            { id: 1, tipo: 'Tour Islas', embarcacion: 'Velero 01', hora: '10:00 AM', estado: 'Programado', reservas: '12/20' },
            { id: 2, tipo: 'Tour Bahía', embarcacion: 'Lancha 03', hora: '11:30 AM', estado: 'Pendiente', reservas: '8/15' },
            { id: 3, tipo: 'Tour Avistamiento', embarcacion: 'Catamarán 02', hora: '2:00 PM', estado: 'Confirmado', reservas: '25/30' },
            { id: 4, tipo: 'Tour Atardecer', embarcacion: 'Velero 02', hora: '4:30 PM', estado: 'Programado', reservas: '15/25' },
            { id: 5, tipo: 'Tour Snorkel', embarcacion: 'Lancha 01', hora: '9:00 AM', estado: 'Confirmado', reservas: '12/15' },
          ]
        });
      }
      
      // Datos de rendimiento para el gráfico de área
      const rendimientoData: RendimientoData[] = Array.from({ length: 12 }, (_, i) => {
        const date = subMonths(new Date(), 11 - i);
        return {
          name: format(date, 'MMM', { locale: es }),
          ingresos: Math.floor(Math.random() * 50000) + 30000,
          egresos: Math.floor(Math.random() * 30000) + 10000,
        };
      });
      
      // Datos para el gráfico de distribución (donut chart)
      const distribucionData: DistribucionData[] = [
        { name: 'Tour Islas', value: 35 },
        { name: 'Tour Bahía', value: 25 },
        { name: 'Tour Avistamiento', value: 20 },
        { name: 'Tour Atardecer', value: 15 },
        { name: 'Tour Snorkel', value: 5 },
      ];
      
      setChartData({
        ventas: ventasData,
        ocupacion: ocupacionData,
        rendimiento: rendimientoData,
        distribucion: distribucionData
      });
      
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
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-sm text-gray-500">Bienvenido, {user?.nombres || 'Usuario'}. Este es el resumen de la operación.</p>
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
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjeta de Tours Hoy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Tours {period === 'day' ? 'Hoy' : period === 'week' ? 'Esta Semana' : 'Este Mes'}</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">{stats.toursHoy * (period === 'day' ? 1 : period === 'week' ? 7 : 30)}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <FiArrowUp size={14} className="mr-1" /> 
                <span>12% respecto a {period === 'day' ? 'ayer' : period === 'week' ? 'la semana pasada' : 'el mes pasado'}</span>
              </div>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiCalendar className="h-7 w-7 text-blue-600" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta de Reservas Hoy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Reservas {period === 'day' ? 'Hoy' : period === 'week' ? 'Esta Semana' : 'Este Mes'}</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">{stats.reservasHoy * (period === 'day' ? 1 : period === 'week' ? 7 : 30)}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <FiArrowUp size={14} className="mr-1" /> 
                <span>8% respecto a {period === 'day' ? 'ayer' : period === 'week' ? 'la semana pasada' : 'el mes pasado'}</span>
              </div>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiUsers className="h-7 w-7 text-green-600" />
            </div>
          </div>
        </div>
        
        {/* Tarjeta de Embarcaciones Activas */}
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
        
        {/* Tarjeta de Ventas */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ventas {period === 'day' ? 'Hoy' : period === 'week' ? 'Esta Semana' : 'Este Mes'}</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">S/. {(stats.ventasHoy * (period === 'day' ? 1 : period === 'week' ? 7 : 30)).toLocaleString('es-PE')}</p>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <FiArrowDown size={14} className="mr-1" /> 
                <span>3% respecto a {period === 'day' ? 'ayer' : period === 'week' ? 'la semana pasada' : 'el mes pasado'}</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiDollarSign className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Ventas {period === 'day' ? 'de Hoy' : period === 'week' ? 'de la Semana' : 'del Mes'}</h2>
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
      
      {/* Gráficos adicionales */}
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
      
      {/* Sección de Tours Próximos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800">Tours Próximos</h2>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <FiClock size={14} />
                <span>Últimos 7 días</span>
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
                    Tipo
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
        
        {/* Tarjeta de exportación */}
        <ExportCard />
      </div>
      
      {/* Sección de Actividad Reciente */}
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
                <p className="text-sm font-medium text-gray-900">Nueva reserva para Tour Islas</p>
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
                <p className="text-sm font-medium text-gray-900">Tour finalizado: Tour Bahía</p>
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
                <p className="text-sm font-medium text-gray-900">Se agregó nuevo tipo de tour: Tour Nocturno</p>
                <p className="text-sm text-gray-500">Hace 2 horas</p>
                <div className="mt-1 flex items-center">
                  <div className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded flex items-center">
                    <FiTrendingUp size={12} className="mr-1" /> Catálogo
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

export default AdminDashboard;