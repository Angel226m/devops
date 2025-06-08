import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';

// Importaciones lazy loading
const PaginaInicio = lazy(() => import('../paginas/publicas/PaginaInicio'));
const PaginaTours = lazy(() => import('../paginas/publicas/PaginaTours'));
const PaginaDetalleTour = lazy(() => import('../paginas/publicas/PaginaDetalleTour'));
const PaginaSedes = lazy(() => import('../paginas/publicas/PaginaSedes'));
const PaginaSobreNosotros = lazy(() => import('../paginas/publicas/PaginaSobreNosotros'));
const PaginaContacto = lazy(() => import('../paginas/publicas/PaginaContacto'));
const PaginaPreguntas = lazy(() => import('../paginas/publicas/PaginaPreguntas'));
const PaginaIngreso = lazy(() => import('../paginas/publicas/PaginaIngreso'));
const PaginaRegistro = lazy(() => import('../paginas/publicas/PaginaRegistro'));
const PaginaRecuperacion = lazy(() => import('../paginas/publicas/PaginaRecuperacion'));
const PaginaNoEncontrada = lazy(() => import('../paginas/publicas/PaginaNoEncontrada'));

const RutasPublicas = () => {
  return (
    <Routes>
      <Route path="inicio" element={<PaginaInicio />} />
      <Route path="tours" element={<PaginaTours />} />
      <Route path="tours/:idTour" element={<PaginaDetalleTour />} />
      <Route path="sedes" element={<PaginaSedes />} />
      <Route path="sobre-nosotros" element={<PaginaSobreNosotros />} />
      <Route path="contacto" element={<PaginaContacto />} />
      <Route path="preguntas-frecuentes" element={<PaginaPreguntas />} />
      <Route path="ingresar" element={<PaginaIngreso />} />
      <Route path="registrarse" element={<PaginaRegistro />} />
      <Route path="recuperar-contrasena" element={<PaginaRecuperacion />} />
      
      {/* Ruta de fallback para rutas no encontradas dentro del ámbito público */}
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
};

export default RutasPublicas;