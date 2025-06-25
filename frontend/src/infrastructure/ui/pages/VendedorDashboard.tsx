import React, { useEffect, useState } from 'react';
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
      
      {/* Tarjetas de estadísticas */}
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
      
      {/* Próximos tours y reservas del día */}
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

export default VendedorDashboard;