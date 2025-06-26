/*import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout, checkAuthStatus } from '../../../infrastructure/store/slices/authSlice';
import { ROUTES } from '../../../shared/constants/appRoutes';
import { 
  FaChartLine, 
  FaCalendarAlt, 
  FaShip, 
  FaUsers, 
  FaCreditCard, 
  FaSignOutAlt, 
  FaLifeRing
} from 'react-icons/fa';

const VendedorLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { user, selectedSede, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Fecha y hora actuales en formato UTC
  const currentDateTime = "2025-06-11 06:58:56";
  const currentUser = "Angel226m";
  
  // Verificar el estado de autenticación cuando el componente se monta
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        console.log('Verificando estado de autenticación en VendedorLayout');
        await dispatch(checkAuthStatus());
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch]);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate(ROUTES.AUTH.LOGIN);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  // Si estamos verificando la autenticación, mostrar un loader
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-green-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }
  
  // Si no hay usuario autenticado, redireccionar al login
  if (!isAuthenticated || !user) {
    navigate(ROUTES.AUTH.LOGIN);
    return null;
  }
  
  // Definir menuItems con las rutas correctas como strings
  const menuItems = [
    { path: ROUTES.VENDEDOR.DASHBOARD, name: 'Dashboard', icon: <FaChartLine size={16} /> },
    { path: ROUTES.VENDEDOR.RESERVAS, name: 'Reservas', icon: <FaCalendarAlt size={16} /> },
    { path: ROUTES.VENDEDOR.TOURS, name: 'Tours Disponibles', icon: <FaShip size={16} /> },
  { path: "/vendedor/clientes", name: 'Clientes', icon: <FaUsers size={16} /> },
    { path: ROUTES.VENDEDOR.PAGOS, name: 'Pagos', icon: <FaCreditCard size={16} /> },
    { path: ROUTES.VENDEDOR.SOPORTE, name: 'Soporte', icon: <FaLifeRing size={16} /> },
  ];
  
  const handleNavigation = (path: string) => {
    console.log("Navegando a:", path);
    navigate(path);
  };
  
  return (
    <div className="flex h-screen">
      {/* Sidebar *//*}
      <div className="w-64 bg-green-800 text-white shadow-lg">
        <div className="p-4 border-b border-green-700 flex items-center space-x-2">
          <FaShip className="text-white text-xl" />
          <div>
            <h2 className="text-lg font-bold">Ocean Tours</h2>
            <p className="text-xs text-green-200">Panel de Ventas</p>
          </div>
        </div>
        
        {/* Información de usuario y sede *//*}
        <div className="p-4 border-b border-green-700">
          <div className="flex items-center mb-2">
            <div className="w-8 h-8 rounded-full bg-green-200 text-green-800 flex items-center justify-center font-bold text-sm mr-2">
              {user?.nombres?.charAt(0) || ''}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.nombres} {user?.apellidos}</p>
              <p className="text-xs text-green-200">{user?.rol}</p>
            </div>
          </div>
          
          {selectedSede && (
            <div className="mt-2 p-2 bg-green-900 rounded text-sm">
              <p className="font-medium">Sede: {selectedSede.nombre}</p>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación - Usando botones en lugar de Link *//*}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button 
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center p-2 rounded text-sm w-full text-left ${
                    isActive(item.path) 
                      ? 'bg-green-700 text-white' 
                      : 'hover:bg-green-700/50 text-green-100'
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión *//*}
        <div className="absolute bottom-0 w-64 p-4 border-t border-green-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded flex items-center justify-center text-sm"
          >
            <FaSignOutAlt className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal con el gradiente específico *//*}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-b from-blue-50 via-sky-50 to-cyan-50">
        {/* Header *//*}
        <header className="bg-white border-b border-gray-200 p-3">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 flex items-center">
              <FaShip className="text-green-700 mr-2" />
              {selectedSede ? `Ventas - ${selectedSede.nombre}` : 'Ventas'}
            </h1>
            <div className="text-sm text-gray-500">
              {currentDateTime} • Usuario: {currentUser}
            </div>
          </div>
        </header>
        
        {/* Contenido principal (renderizado por las rutas) *//*}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendedorLayout;*/


import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout, checkAuthStatus } from '../../../infrastructure/store/slices/authSlice';
import { ROUTES } from '../../../shared/constants/appRoutes';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  FiHome, 
  FiCalendar, 
  FiAnchor, 
  FiUsers, 
  FiCreditCard, 
  FiLogOut, 
  FiLifeBuoy,
  FiMenu,
  FiX
} from 'react-icons/fi';

const VendedorLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const { user, selectedSede, isAuthenticated, isLoading } = useSelector((state: RootState) => state.auth);
  
  // Fecha y hora actuales en formato español
  const formattedDateTime = format(new Date(), "d 'de' MMMM 'de' yyyy, HH:mm", { locale: es });
  const currentUser = user?.nombres || "Angel226m";
  
  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        await dispatch(checkAuthStatus());
      }
    };

    checkAuth();
  }, [isAuthenticated, dispatch]);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate(ROUTES.AUTH.LOGIN);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-blue-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !user) {
    navigate(ROUTES.AUTH.LOGIN);
    return null;
  }
  
  const menuItems = [
    { path: ROUTES.VENDEDOR.DASHBOARD, name: 'Dashboard', icon: <FiHome size={18} /> },
    { path: ROUTES.VENDEDOR.RESERVAS, name: 'Reservas', icon: <FiCalendar size={18} /> },
    { path: ROUTES.VENDEDOR.TOURS, name: 'Tours Disponibles', icon: <FiAnchor size={18} /> },
    { path: "/vendedor/clientes", name: 'Clientes', icon: <FiUsers size={18} /> },
    { path: ROUTES.VENDEDOR.PAGOS, name: 'Pagos', icon: <FiCreditCard size={18} /> },
    { path: ROUTES.VENDEDOR.SOPORTE, name: 'Soporte', icon: <FiLifeBuoy size={18} /> },
  ];
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };
  
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-0 left-0 z-50 p-4">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-md bg-blue-600 text-white"
        >
          {isMobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar - responsive */}
      <div className={`${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out fixed md:relative z-40 w-64 h-full bg-gradient-to-b from-blue-800 to-cyan-800 text-white shadow-lg`}>
        <div className="p-4 border-b border-blue-700 flex items-center space-x-2">
          <FiAnchor className="text-white text-xl" />
          <div>
            <h2 className="text-lg font-bold">Ocean Tours</h2>
            <p className="text-xs text-blue-200">Panel de Ventas</p>
          </div>
        </div>
        
        {/* Información de usuario y sede */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center mb-2">
            <div className="w-10 h-10 rounded-full bg-cyan-200 text-cyan-800 flex items-center justify-center font-bold text-sm mr-2">
              {user?.nombres?.charAt(0) || 'U'}
            </div>
            <div>
              <p className="font-medium text-sm">{user?.nombres} {user?.apellidos}</p>
              <p className="text-xs text-blue-200">{user?.rol}</p>
            </div>
          </div>
          
          {selectedSede && (
            <div className="mt-2 p-2 bg-blue-900/50 rounded-lg text-sm">
              <p className="font-medium">Sede: {selectedSede.nombre}</p>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación */}
        <nav className="p-3">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <button 
                  onClick={() => handleNavigation(item.path)}
                  className={`flex items-center p-3 rounded-lg text-sm w-full text-left transition-all ${
                    isActive(item.path) 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-md' 
                      : 'hover:bg-blue-700/50 text-blue-100'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {item.name}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión */}
        <div className="absolute bottom-0 w-64 p-4 border-t border-blue-700">
          <button 
            onClick={handleLogout}
            className="w-full p-2 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center text-sm transition-colors"
          >
            <FiLogOut className="mr-2" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-3 shadow-sm">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-semibold text-gray-800 flex items-center">
              <FiAnchor className="text-blue-700 mr-2" />
              {selectedSede ? `Ventas - ${selectedSede.nombre}` : 'Ventas'}
            </h1>
            <div className="text-sm text-gray-500">
              {formattedDateTime} • {currentUser}
            </div>
          </div>
        </header>
        
        {/* Contenido principal (renderizado por las rutas) */}
        <main className="flex-1 overflow-y-auto p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default VendedorLayout;