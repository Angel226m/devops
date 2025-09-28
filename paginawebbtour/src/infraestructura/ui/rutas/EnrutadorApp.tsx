 import { Routes, Route, Navigate } from 'react-router-dom';
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
        {/* IMPORTANTE: No usar "/*" aquí para evitar duplicaciones */}
        <Route path="/" element={<LayoutPrincipal />}>
          {/* Redirigir la ruta raíz a /inicio */}
          <Route index element={<Navigate to="/inicio" replace />} />
          {/* Usar el componente RutasPublicas para las rutas públicas */}
          <Route path="*" element={<RutasPublicas />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default EnrutadorApp;