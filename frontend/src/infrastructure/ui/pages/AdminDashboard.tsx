 
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../infrastructure/store/index';
import { 
  FiCalendar, FiUsers, FiDollarSign, FiAnchor, FiArrowUp, FiArrowDown, 
  FiChevronRight, FiActivity, FiBarChart2, FiTrendingUp
} from 'react-icons/fi';
import { Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

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
  
  // Datos para gráficos
  const ventas = {
    labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
    datasets: [
      {
        label: 'Ventas Diarias',
        backgroundColor: 'rgba(37, 99, 235, 0.2)',
        borderColor: 'rgba(37, 99, 235, 1)',
        borderWidth: 2,
        data: [3200, 4500, 2800, 6700, 5400, 8900, 7200],
      },
    ],
  };
  
  const ocupacion = {
    labels: ['Tour Islas', 'Tour Bahía', 'Tour Avistamiento', 'Tour Atardecer', 'Tour Snorkel'],
    datasets: [
      {
        label: 'Ocupación (%)',
        backgroundColor: [
          'rgba(59, 130, 246, 0.6)',
          'rgba(16, 185, 129, 0.6)',
          'rgba(245, 158, 11, 0.6)',
          'rgba(239, 68, 68, 0.6)',
          'rgba(139, 92, 246, 0.6)',
        ],
        borderColor: [
          'rgba(59, 130, 246, 1)',
          'rgba(16, 185, 129, 1)',
          'rgba(245, 158, 11, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(139, 92, 246, 1)',
        ],
        borderWidth: 1,
        data: [75, 55, 90, 60, 65],
      },
    ],
  };
  
  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: (value: any) => `${value}%`
        }
      }
    },
    plugins: {
      legend: {
        display: false,
      }
    },
    maintainAspectRatio: false,
  };
  
  const lineOptions = {
    plugins: {
      legend: {
        display: false,
      }
    },
    scales: {
      y: {
        ticks: {
          callback: (value: any) => `S/. ${value}`
        }
      }
    },
    maintainAspectRatio: false,
  };

  // Simulación de carga de estadísticas
  useEffect(() => {
    const fetchStats = async () => {
      // Aquí normalmente harías una llamada a la API para obtener estadísticas reales
      // Simulando retraso de red
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Datos simulados
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
      
      setLoading(false);
    };

    fetchStats();
  }, [selectedSede]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm text-gray-500">Bienvenido, {user?.nombres || 'Usuario'}. Este es el resumen de la operación.</p>
      </div>
      
      {/* Tarjetas de estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Tarjeta de Tours Hoy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Tours Hoy</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">{stats.toursHoy}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <FiArrowUp size={14} className="mr-1" /> 
                <span>12% respecto a ayer</span>
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
              <p className="text-sm text-gray-500 font-medium">Reservas Hoy</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">{stats.reservasHoy}</p>
              <div className="flex items-center mt-2 text-sm text-green-600">
                <FiArrowUp size={14} className="mr-1" /> 
                <span>8% respecto a ayer</span>
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
        
        {/* Tarjeta de Ventas Hoy */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ventas Hoy</p>
              <p className="text-3xl font-bold mt-1 text-gray-800">S/. {stats.ventasHoy.toLocaleString('es-PE')}</p>
              <div className="flex items-center mt-2 text-sm text-red-600">
                <FiArrowDown size={14} className="mr-1" /> 
                <span>3% respecto a ayer</span>
              </div>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FiDollarSign className="h-7 w-7 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Ventas de la Semana</h2>
            <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
              Ver detalle <FiChevronRight size={16} className="ml-1" />
            </button>
          </div>
          <div className="h-80">
            <Line data={ventas} options={lineOptions} />
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
            <Bar data={ocupacion} options={barOptions} />
          </div>
        </div>
      </div>
      
      {/* Sección de Tours Próximos */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 mb-6">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">Tours Próximos</h2>
          <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
            Ver todos <FiChevronRight size={16} className="ml-1" />
          </button>
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