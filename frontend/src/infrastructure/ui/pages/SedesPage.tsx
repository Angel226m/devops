import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SedesPage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  
  // Verificar si el usuario es ADMIN
  const isAdmin = user?.rol === 'ADMIN';
  
  if (!isAdmin) {
    return <Navigate to="/login" />;
  }
  
  // Usar Outlet para renderizar las rutas hijas
  return <Outlet />;
};

export default SedesPage;