 /*
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rutasApp } from '../../../compartidos/constantes/rutasApp';

const RutasPrivadas = () => {
  const { autenticado } = useSelector((state: any) => state.autenticacion);
  const location = useLocation();

  // Si el usuario no está autenticado, redirigir a la página de ingreso
  if (!autenticado) {
    // Guardar la ubicación actual para redirigir después del inicio de sesión
    return <Navigate to={rutasApp.INGRESO} state={{ from: location }} replace />;
  }

  // Si está autenticado, permitir acceso a la ruta protegida
  return <Outlet />;
};

export default RutasPrivadas;*/
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { rutasApp } from '../../../compartidos/constantes/rutasApp';
import Cargador from '../componentes/comunes/Cargador';

const RutasPrivadas = () => {
  const { autenticado, cargandoAutenticacion } = useSelector((state: any) => state.autenticacion);
  const location = useLocation();

  // Mostrar cargador mientras se verifica la autenticación
  if (cargandoAutenticacion) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Cargador texto="Verificando sesión..." />
      </div>
    );
  }

  // Si el usuario no está autenticado, redirigir a la página de ingreso
  if (!autenticado) {
    // Guardar la ubicación actual para redirigir después del inicio de sesión
    return <Navigate to={rutasApp.INGRESO} state={{ from: location }} replace />;
  }

  // Si está autenticado, permitir acceso a la ruta protegida
  return <Outlet />;
};

export default RutasPrivadas;