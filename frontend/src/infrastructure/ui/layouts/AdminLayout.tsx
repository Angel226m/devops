 

import React, { useState } from 'react';
import { Outlet, Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout } from '../../../infrastructure/store/slices/authSlice';
// Importaciones de react-icons
import { 
  FiHome, FiUsers, FiAnchor, FiMap, FiCalendar, FiClock, 
  FiNavigation, FiLogOut, FiMenu, FiX, FiChevronDown, 
  FiBell, FiSettings, FiTag
} from 'react-icons/fi';

const AdminLayout: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsCount, setNotificationsCount] = useState(3); // Simulación de notificaciones
  
  const { user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/login');
  };
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar móvil */}
      <div 
        className={`lg:hidden fixed inset-0 z-20 bg-gray-900 bg-opacity-50 transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      
      {/* Sidebar */}
      <div 
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-blue-800 text-white transition-all duration-300 transform lg:translate-x-0 lg:static lg:inset-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-blue-700">
          <div className="flex items-center">
            <FiAnchor className="h-8 w-8 mr-2" />
            <div>
              <h2 className="text-xl font-bold">NAYARAKTOURS</h2>
              <p className="text-xs text-blue-300">Panel de Administración</p>
            </div>
          </div>
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 rounded-md text-blue-300 hover:text-white hover:bg-blue-700"
          >
            <FiX size={20} />
          </button>
        </div>
        
        {/* Información de usuario y sede */}
        <div className="p-4 border-b border-blue-700">
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold">
              {user?.nombres?.charAt(0) || 'U'}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.nombres} {user?.apellidos}</p>
              <p className="text-sm text-blue-300">{user?.rol}</p>
            </div>
          </div>
          
          {selectedSede && (
            <div className="mt-3 p-2 bg-blue-900 rounded-md">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-blue-300">Sede actual:</p>
                  <p className="text-sm font-medium">{selectedSede.nombre}</p>
                </div>
                <Link 
                  to="/seleccionar-sede"
                  className="text-xs text-blue-300 hover:text-white p-1 hover:bg-blue-700 rounded"
                >
                  Cambiar
                </Link>
              </div>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            <li>
              <NavLink 
                to="/admin/dashboard" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiHome className="h-4 w-4 mr-3" />
                Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/usuarios" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiUsers className="h-4 w-4 mr-3" />
                Usuarios
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/embarcaciones" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiAnchor className="h-4 w-4 mr-3" />
                Embarcaciones
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/tipos-tour" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiMap className="h-4 w-4 mr-3" />
                Tipos de Tour
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/horarios" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiClock className="h-4 w-4 mr-3" />
                Horarios
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/pasajes" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiTag className="h-4 w-4 mr-3" />
                Pasajes
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/tours" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiNavigation className="h-4 w-4 mr-3" />
                Tours Programados
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/admin/reservas" 
                className={({isActive}) => 
                  `flex items-center px-3 py-2 text-sm rounded-md hover:bg-blue-700 hover:text-white ${
                    isActive ? 'bg-blue-700 text-white' : 'text-white'
                  }`
                }
              >
                <FiCalendar className="h-4 w-4 mr-3" />
                Reservas
              </NavLink>
            </li>
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión */}
        <div className="mt-auto p-4 border-t border-blue-700">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm bg-red-600 hover:bg-red-700 rounded-md transition-colors"
          >
            <FiLogOut className="h-4 w-4 mr-3" />
            Cerrar Sesión
          </button>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between h-16 px-4 lg:px-8">
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              >
                <FiMenu size={20} />
              </button>
              <h1 className="ml-2 lg:ml-0 text-xl font-semibold text-gray-800">
                {selectedSede ? `Administración - ${selectedSede.nombre}` : 'Administración'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notificaciones */}
              <div className="relative">
                <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                  <FiBell size={20} />
                  {notificationsCount > 0 && (
                    <span className="absolute top-0 right-0 h-5 w-5 rounded-full bg-red-600 text-white text-xs flex items-center justify-center">
                      {notificationsCount}
                    </span>
                  )}
                </button>
              </div>
              
              {/* Configuración */}
              <button className="p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100">
                <FiSettings size={20} />
              </button>
              
              {/* Perfil de usuario */}
              <div className="relative">
                <button className="flex items-center text-sm text-gray-700 focus:outline-none">
                  <div className="h-8 w-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                    {user?.nombres?.charAt(0) || 'U'}
                  </div>
                  <span className="ml-2 hidden md:block">{user?.nombres}</span>
                  <FiChevronDown size={16} className="ml-1 hidden md:block" />
                </button>
              </div>
            </div>
          </div>
        </header>
        
        {/* Contenido principal */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;