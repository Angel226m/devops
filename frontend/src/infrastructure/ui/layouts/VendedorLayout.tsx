 
import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout } from '../../../infrastructure/store/slices/authSlice';

const VendedorLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-green-800 text-white">
        <div className="p-4 border-b border-green-700">
          <h2 className="text-xl font-bold">Tours Náuticos</h2>
          <p className="text-sm text-green-300">Panel de Ventas</p>
        </div>
        
        {/* Información de usuario y sede */}
        <div className="p-4 border-b border-green-700">
          <p className="font-medium">{user?.nombres} {user?.apellidos}</p>
          <p className="text-sm text-green-300">{user?.rol}</p>
          
          {selectedSede && (
            <div className="mt-2 p-2 bg-green-900 rounded">
              <p className="text-sm font-medium">Sede:</p>
              <p className="text-sm">{selectedSede.nombre}</p>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/vendedor/dashboard" className="block p-2 hover:bg-green-700 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/vendedor/reservas" className="block p-2 hover:bg-green-700 rounded">
                Reservas
              </Link>
            </li>
            <li>
              <Link to="/vendedor/tours" className="block p-2 hover:bg-green-700 rounded">
                Tours Disponibles
              </Link>
            </li>
            <li>
              <Link to="/vendedor/clientes" className="block p-2 hover:bg-green-700 rounded">
                Clientes
              </Link>
            </li>
            <li>
              <Link to="/vendedor/pagos" className="block p-2 hover:bg-green-700 rounded">
                Pagos
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión */}
        <div className="mt-auto p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">
              {selectedSede ? `Ventas - ${selectedSede.nombre}` : 'Ventas'}
            </h1>
          </div>
        </header>
        
        {/* Contenido principal (renderizado por las rutas) */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendedorLayout;