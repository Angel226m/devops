/* import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import RutasPublicas from './RutasPublicas';
import Cargador from '../componentes/comunes/Cargador';

// Páginas públicas con lazy loading para mejorar rendimiento
const PaginaNoEncontrada = lazy(() => import('../paginas/publicas/PaginaNoEncontrada'));

const EnrutadorApp = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Cargador texto="Cargando..." /></div>}>
      <Routes>
        {/* IMPORTANTE: No usar "/*" aquí para evitar duplicaciones *//*}
        <Route path="/" element={<LayoutPrincipal />}>
          {/* Redirigir la ruta raíz a /inicio *//*}
          <Route index element={<Navigate to="/inicio" replace />} />
          {/* Usar el componente RutasPublicas para las rutas públicas *//*}
          <Route path="*" element={<RutasPublicas />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default EnrutadorApp;*/
import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import LayoutPrincipal from '../layouts/LayoutPrincipal';
import RutasPrivadas from './RutasPrivadas';
import RutasPublicas from './RutasPublicas';
import Cargador from '../componentes/comunes/Cargador';

// Páginas con lazy loading
const PaginaNoEncontrada = lazy(() => import('../paginas/publicas/PaginaNoEncontrada'));
const PaginaReservasUsuario = lazy(() => import('../paginas/privadas/PaginaReservasUsuario'));
const PaginaPerfilUsuario = lazy(() => import('../paginas/privadas/PaginaPerfil'));

const EnrutadorApp = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Cargador texto="Cargando..." /></div>}>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          {/* Redirigir la raíz a /inicio */}
          <Route index element={<Navigate to="/inicio" replace />} />

          {/* Rutas públicas */}
          <Route path="/ingreso/*" element={<RutasPublicas />} />

          {/* Rutas privadas protegidas por autenticación */}
          <Route element={<RutasPrivadas />}>
            <Route path="/reservas" element={<PaginaReservasUsuario />} />
            <Route path="/perfil" element={<PaginaPerfilUsuario />} />
            <Route path="/inicio" element={<div>Inicio Privado</div>} /> {/* Ejemplo de página privada */}
          </Route>

          {/* Ruta 404 para cualquier otra cosa */}
          <Route path="*" element={<PaginaNoEncontrada />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default EnrutadorApp;