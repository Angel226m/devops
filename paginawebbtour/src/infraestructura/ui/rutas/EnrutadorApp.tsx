 /*import { Routes, Route, Navigate } from 'react-router-dom';
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
import Cargador from '../componentes/comunes/Cargador';

// Lazy loading para las páginas
const PaginaInicio = lazy(() => import('../paginas/publicas/PaginaInicio'));
const PaginaIngreso = lazy(() => import('../paginas/publicas/PaginaIngreso'));
const PaginaRegistro = lazy(() => import('../paginas/publicas/PaginaRegistro'));
const PaginaPerfil = lazy(() => import('../paginas/privadas/PaginaPerfil'));
const PaginaReservasUsuario = lazy(() => import('../paginas/privadas/PaginaReservasUsuario'));
const PaginaNoEncontrada = lazy(() => import('../paginas/publicas/PaginaNoEncontrada'));

const EnrutadorApp = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen"><Cargador tamanio="lg" color="text-blue-600" /></div>}>
      <Routes>
        <Route path="/" element={<LayoutPrincipal />}>
          {/* Redirigir la ruta raíz a /inicio */}
          <Route index element={<Navigate to="/inicio" replace />} />
          
          {/* Rutas públicas */}
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
    </Suspense>
  );
};

export default EnrutadorApp;