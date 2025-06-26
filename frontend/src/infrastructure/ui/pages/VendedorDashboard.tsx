/*import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store';
import Card from '../components/Card';
import { FaShip, FaUserFriends, FaMoneyBillWave, FaCalendarCheck } from 'react-icons/fa';

const VendedorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedSede } = useSelector((state: RootState) => state.auth);
  const [loading, setLoading] = useState(true);
  
  // Datos de ejemplo para el dashboard (en producción estos vendrían de APIs)
  const [stats, setStats] = useState({
    toursHoy: 0,
    reservasActivas: 0,
    clientesAtendidos: 0,
    ventasMes: 0
  });
  
  useEffect(() => {
    // Aquí cargarías los datos reales desde tus APIs
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        
        // Simulación de carga de datos
        setTimeout(() => {
          setStats({
            toursHoy: 12,
            reservasActivas: 28,
            clientesAtendidos: 45,
            ventasMes: 8500
          });
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, [dispatch, selectedSede]);
  
  // Tarjetas principales del dashboard
  const statCards = [
    {
      title: 'Tours de Hoy',
      value: stats.toursHoy,
      icon: <FaShip className="text-blue-500" size={24} />,
      color: 'bg-blue-100 border-blue-300'
    },
    {
      title: 'Reservas Activas',
      value: stats.reservasActivas,
      icon: <FaCalendarCheck className="text-green-500" size={24} />,
      color: 'bg-green-100 border-green-300'
    },
    {
      title: 'Clientes Atendidos',
      value: stats.clientesAtendidos,
      icon: <FaUserFriends className="text-purple-500" size={24} />,
      color: 'bg-purple-100 border-purple-300'
    },
    {
      title: 'Ventas del Mes',
      value: `S/ ${stats.ventasMes.toLocaleString()}`,
      icon: <FaMoneyBillWave className="text-yellow-500" size={24} />,
      color: 'bg-yellow-100 border-yellow-300'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard de Ventas</h1>
        <p className="text-sm text-gray-500">
          {new Date().toLocaleDateString('es-PE', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>
      
      {/* Tarjetas de estadísticas *//*}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => (
          <Card key={index} className={`${card.color} border p-4`}>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                <p className="text-2xl font-bold mt-1 text-gray-800">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <div className="p-3 rounded-full bg-white shadow-sm">
                {card.icon}
              </div>
            </div>
          </Card>
        ))}
      </div>
      
      {/* Próximos tours y reservas del día *//*}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaShip className="mr-2 text-green-600" />
            Tours Próximos
          </h2>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Cargando tours...</p>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3].map((tour) => (
                <div key={tour} className="p-3 border rounded-lg hover:bg-blue-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">Tour Islas Ballestas</h3>
                      <p className="text-sm text-gray-500">10:30 AM - 1:00 PM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">12 asientos disp.</p>
                      <p className="text-xs text-gray-500">Embarcación: Nautilus I</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card className="border p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4 flex items-center">
            <FaCalendarCheck className="mr-2 text-green-600" />
            Reservas de Hoy
          </h2>
          {loading ? (
            <p className="text-center py-8 text-gray-500">Cargando reservas...</p>
          ) : (
            <div className="space-y-3">
              {[1, 2, 3].map((reserva) => (
                <div key={reserva} className="p-3 border rounded-lg hover:bg-green-50 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium">José Mendoza</h3>
                      <p className="text-sm text-gray-500">Tour Islas Ballestas - 10:30 AM</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">4 pasajeros</p>
                      <p className="text-xs text-gray-500">Pago: Completo</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default VendedorDashboard;*/
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { format, subDays, parseISO, isToday, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import {
  FiUsers, 
  FiCalendar, 
  FiDollarSign, 
  FiClock, 
  FiShield, 
  FiAlertCircle,
  FiTrendingUp,
  FiChevronRight,
  FiAnchor,
  FiCheckCircle,
  FiCreditCard,
  FiPhone
} from 'react-icons/fi';

// Importación de acciones (simular para ejemplo)
// import { fetchReservasVendedor } from '../../../infrastructure/store/slices/reservaSlice';
// import { fetchToursProgramados } from '../../../infrastructure/store/slices/tourProgramadoSlice';
// import { fetchPagos } from '../../../infrastructure/store/slices/pagoSlice';

// Tipo para representar las estadísticas diarias
interface DailyStats {
  fecha: string;
  reservas: number;
  ventas: number;
  pasajeros: number;
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

// Datos de ejemplo para las gráficas y estadísticas
const ventasPorDia: DailyStats[] = [
  { fecha: format(subDays(new Date(), 6), 'dd/MM', { locale: es }), reservas: 4, ventas: 450, pasajeros: 12 },
  { fecha: format(subDays(new Date(), 5), 'dd/MM', { locale: es }), reservas: 6, ventas: 680, pasajeros: 18 },
  { fecha: format(subDays(new Date(), 4), 'dd/MM', { locale: es }), reservas: 3, ventas: 320, pasajeros: 8 },
  { fecha: format(subDays(new Date(), 3), 'dd/MM', { locale: es }), reservas: 5, ventas: 550, pasajeros: 15 },
  { fecha: format(subDays(new Date(), 2), 'dd/MM', { locale: es }), reservas: 7, ventas: 790, pasajeros: 21 },
  { fecha: format(subDays(new Date(), 1), 'dd/MM', { locale: es }), reservas: 4, ventas: 420, pasajeros: 10 },
  { fecha: format(new Date(), 'dd/MM', { locale: es }), reservas: 3, ventas: 350, pasajeros: 9 },
];

// Datos de distribución de ventas por tipo de tour
const ventasPorTour = [
  { nombre: 'Tour Isla', valor: 35 },
  { nombre: 'Tour Bahía', valor: 25 },
  { nombre: 'Tour Buceo', valor: 20 },
  { nombre: 'Tour Pesca', valor: 15 },
  { nombre: 'Tour Privado', valor: 5 },
];

// Colores para la gráfica de pie
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

// Ventas del día
const ventasHoy: VentaResumen[] = [
  { id: 1, tour: 'Tour Isla', horario: '09:00', cliente: 'Juan Pérez', monto: 120, metodoPago: 'Efectivo', estado: 'completado' },
  { id: 2, tour: 'Tour Bahía', horario: '10:30', cliente: 'María López', monto: 85, metodoPago: 'Tarjeta', estado: 'completado' },
  { id: 3, tour: 'Tour Buceo', horario: '13:00', cliente: 'Carlos Rodríguez', monto: 150, metodoPago: 'Transferencia', estado: 'pendiente' },
  { id: 4, tour: 'Tour Isla', horario: '15:00', cliente: 'Ana Gómez', monto: 120, metodoPago: 'Efectivo', estado: 'pendiente' },
];

// Próximas salidas
const proximasSalidas: ProximaSalida[] = [
  { id: 1, tour: 'Tour Isla', fecha: '2025-06-26', hora: '09:00', lugarSalida: 'Muelle Principal', cuposDisponibles: 8, cuposTotal: 15, estado: 'programado' },
  { id: 2, tour: 'Tour Bahía', fecha: '2025-06-26', hora: '10:30', lugarSalida: 'Muelle Principal', cuposDisponibles: 3, cuposTotal: 12, estado: 'programado' },
  { id: 3, tour: 'Tour Buceo', fecha: '2025-06-27', hora: '08:00', lugarSalida: 'Muelle Secundario', cuposDisponibles: 6, cuposTotal: 10, estado: 'programado' },
  { id: 4, tour: 'Tour Pesca', fecha: '2025-06-27', hora: '14:00', lugarSalida: 'Muelle Principal', cuposDisponibles: 2, cuposTotal: 8, estado: 'programado' },
];

const VendedorDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  const [isLoading, setIsLoading] = useState(true);
  const [period, setPeriod] = useState<'semana' | 'mes'>('semana');
  
  // Estadísticas de resumen
  const totalVentasHoy = ventasHoy.reduce((sum, venta) => sum + venta.monto, 0);
  const totalReservasHoy = ventasHoy.length;
  const reservasPendientesHoy = ventasHoy.filter(v => v.estado === 'pendiente').length;
  
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
        // Aquí irían las llamadas reales a tu API
        // await dispatch(fetchReservasVendedor());
        // await dispatch(fetchToursProgramados());
        // await dispatch(fetchPagos());
        
        // Simulamos un retardo
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadDashboardData();
  }, [dispatch]);
  
  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Bienvenida */}
      <div className="bg-white rounded-lg shadow-md p-4 border-l-4 border-blue-500">
        <h1 className="text-2xl font-semibold text-gray-800">
          Bienvenido, {user?.nombres || 'Vendedor'}
        </h1>
        <p className="text-gray-600">
          Dashboard de ventas para {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })} - {selectedSede?.nombre || 'Sede principal'}
        </p>
      </div>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Ventas de hoy</p>
              <p className="text-2xl font-bold text-gray-800">${totalVentasHoy}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <FiDollarSign className="text-blue-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-500 font-medium flex items-center">
              <FiTrendingUp className="mr-1" /> 12% más que ayer
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Reservas hoy</p>
              <p className="text-2xl font-bold text-gray-800">{totalReservasHoy}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <FiCalendar className="text-green-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="text-green-500 font-medium">{reservasPendientesHoy} pendientes por confirmar</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-amber-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Pasajeros hoy</p>
              <p className="text-2xl font-bold text-gray-800">24</p>
            </div>
            <div className="bg-amber-100 p-3 rounded-full">
              <FiUsers className="text-amber-500 text-xl" />
            </div>
          </div>
          <div className="mt-2 text-xs text-gray-500">
            <span className="font-medium">6 pendientes por llegar</span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-4 border-t-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 text-sm">Próximas salidas</p>
              <p className="text-2xl font-bold text-gray-800">{salidasHoy.length}</p>
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
      
      {/* Gráficas */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfica de ventas por día */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">Ventas de la {period}</h2>
            <div className="flex space-x-2">
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
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart
              data={ventasPorDia}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
              <YAxis yAxisId="left" orientation="left" stroke="#0088FE" />
              <YAxis yAxisId="right" orientation="right" stroke="#00C49F" />
              <Tooltip 
                formatter={(value, name) => {
                  if (name === 'ventas') return [`$${value}`, 'Ventas'];
                  if (name === 'reservas') return [value, 'Reservas'];
                  return [value, name];
                }}
              />
              <Legend />
              <Bar yAxisId="left" dataKey="ventas" name="Ventas ($)" fill="#0088FE" radius={[4, 4, 0, 0]} />
              <Bar yAxisId="right" dataKey="reservas" name="Reservas" fill="#00C49F" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Gráfica de distribución de ventas */}
        <div className="bg-white rounded-lg shadow-md p-4">
          <h2 className="font-semibold text-gray-700 mb-4">Distribución por Tour</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ventasPorTour}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="valor"
                nameKey="nombre"
                label={({ nombre, percent }) => `${nombre}: ${(percent * 100).toFixed(0)}%`}
              >
                {ventasPorTour.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value}%`, 'Porcentaje']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Ventas de hoy y Próximas salidas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ventas de hoy */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-4 py-3">
            <h2 className="font-semibold text-white flex items-center">
              <FiCreditCard className="mr-2" /> Ventas de hoy
            </h2>
          </div>
          <div className="p-4">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tour</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
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
                      <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900">${venta.monto}</td>
                      <td className="px-3 py-2 whitespace-nowrap text-sm">
                        <span className={`px-2 py-1 text-xs rounded-full ${
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
        
        {/* Próximas salidas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-indigo-500 px-4 py-3">
            <h2 className="font-semibold text-white flex items-center">
              <FiAnchor className="mr-2" /> Próximas salidas
            </h2>
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
      
      {/* Acciones rápidas */}
      <div className="bg-white rounded-lg shadow-md p-4">
        <h2 className="font-semibold text-gray-700 mb-3">Acciones rápidas</h2>
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
    </div>
  );
};

export default VendedorDashboard;