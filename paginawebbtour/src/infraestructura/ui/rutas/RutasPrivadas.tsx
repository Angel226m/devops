 
/*import { Navigate, Outlet, useLocation } from 'react-router-dom';
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

// ui/rutas/EnrutadorApp.tsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RutasPrivadas from './RutasPrivadas';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import PaginaInicio from '../paginas/publicas/PaginaInicio';
import PaginaIngreso from '../paginas/publicas/PaginaIngreso';
import PaginaRegistro from '../paginas/publicas/PaginaRegistro';
import PaginaPerfil from '../paginas/privadas/PaginaPerfil';
import PaginaReservasUsuario from '../paginas/privadas/PaginaReservasUsuario';
 import PaginaNoEncontrada from '../paginas/publicas/PaginaNoEncontrada';

const EnrutadorApp = () => {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<LayoutPrincipal />}>
          <Route index element={<PaginaInicio />} />
          <Route path="inicio" element={<PaginaInicio />} />
          <Route path="ingresar" element={<PaginaIngreso />} />
          <Route path="registrarse" element={<PaginaRegistro />} />
          
          {/* Rutas privadas */}
          <Route element={<RutasPrivadas />}>
            <Route path="perfil" element={<PaginaPerfil />} />
            <Route path="mis-reservas" element={<PaginaReservasUsuario />} />
           </Route>
          
          {/* Ruta 404 */}
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default EnrutadorApp;