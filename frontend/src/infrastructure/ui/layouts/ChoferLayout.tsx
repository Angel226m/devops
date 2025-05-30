import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../../infrastructure/store/index';
import { logout } from '../../../infrastructure/store/slices/authSlice';

const ChoferLayout: React.FC = () => {
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
      <div className="w-64 bg-orange-800 text-white">
        <div className="p-4 border-b border-orange-700">
          <h2 className="text-xl font-bold">Tours Náuticos</h2>
          <p className="text-sm text-orange-300">Panel de Chofer</p>
        </div>
        
        {/* Información de usuario y sede */}
        <div className="p-4 border-b border-orange-700">
          <p className="font-medium">{user?.nombres} {user?.apellidos}</p>
          <p className="text-sm text-orange-300">{user?.rol}</p>
          
          {selectedSede && (
            <div className="mt-2 p-2 bg-orange-900 rounded">
              <p className="text-sm font-medium">Sede:</p>
              <p className="text-sm">{selectedSede.nombre}</p>
            </div>
          )}
        </div>
        
        {/* Enlaces de navegación */}
        <nav className="p-4">
          <ul className="space-y-2">
            <li>
              <Link to="/chofer/dashboard" className="block p-2 hover:bg-orange-700 rounded">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/chofer/mis-tours" className="block p-2 hover:bg-orange-700 rounded">
                Mis Tours
              </Link>
            </li>
            <li>
              <Link to="/chofer/horarios" className="block p-2 hover:bg-orange-700 rounded">
                Horarios
              </Link>
            </li>
            <li>
              <Link to="/chofer/pasajeros" className="block p-2 hover:bg-orange-700 rounded">
                Listas de Pasajeros
              </Link>
            </li>
          </ul>
        </nav>
        
        {/* Botón de cierre de sesión */}
        <div className="mt-auto p-4 border-t border-orange-700">
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
              {selectedSede ? `Tours - ${selectedSede.nombre}` : 'Tours'}
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

export default ChoferLayout;