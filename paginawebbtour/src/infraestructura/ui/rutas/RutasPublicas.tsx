 /*

import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import RutasPrivadas from './RutasPrivadas';

// Importaciones lazy loading para páginas públicas
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

// Importaciones lazy loading para páginas privadas
const PaginaProcesoPago = lazy(() => import('../paginas/privadas/PaginaProcesoPago'));
const PaginaPerfil = lazy(() => import('../paginas/privadas/PaginaPerfil'));
const PaginaReservasUsuario = lazy(() => import('../paginas/privadas/PaginaReservasUsuario'));

// Importaciones para las nuevas páginas de resultado de pago
const PaginaReservaExitosa = lazy(() => import('../paginas/privadas/PaginaReservaExitosa'));
const PaginaPagoFallido = lazy(() => import('../paginas/privadas/PaginaPagoFallido'));
 
const RutasPublicas = () => {
  return (
    <Routes>
      {/* Rutas públicas *//*}
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
      
      {/* Rutas privadas protegidas por autenticación *//*}
      <Route element={<RutasPrivadas />}>
        <Route path="proceso-pago" element={<PaginaProcesoPago />} />
        <Route path="perfil" element={<PaginaPerfil />} />
        <Route path="mis-reservas" element={<PaginaReservasUsuario />} />
        
        {/* Nuevas rutas para los resultados de pago *//*}
        <Route path="reserva-exitosa" element={<PaginaReservaExitosa />} />
        <Route path="pago-fallido" element={<PaginaPagoFallido />} />
      </Route>
       
      {/* Ruta de fallback para rutas no encontradas *//*}
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
};

export default RutasPublicas;*/


import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import RutasPrivadas from './RutasPrivadas';

// Importaciones lazy loading para páginas públicas
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
const PaginaCambioContrasena = lazy(() => import('../paginas/publicas/PaginaCambioContrasena')); // Añadida esta importación
const PaginaNoEncontrada = lazy(() => import('../paginas/publicas/PaginaNoEncontrada'));

// Importaciones lazy loading para páginas privadas
const PaginaProcesoPago = lazy(() => import('../paginas/privadas/PaginaProcesoPago'));
const PaginaPerfil = lazy(() => import('../paginas/privadas/PaginaPerfil'));
const PaginaReservasUsuario = lazy(() => import('../paginas/privadas/PaginaReservasUsuario'));

// Importaciones para las nuevas páginas de resultado de pago
const PaginaReservaExitosa = lazy(() => import('../paginas/privadas/PaginaReservaExitosa'));
const PaginaPagoFallido = lazy(() => import('../paginas/privadas/PaginaPagoFallido'));
 
const RutasPublicas = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
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
      <Route path="cambiar-contrasena" element={<PaginaCambioContrasena />} /> {/* Añadida esta ruta */}
      
      {/* Rutas privadas protegidas por autenticación */}
      <Route element={<RutasPrivadas />}>
        <Route path="proceso-pago" element={<PaginaProcesoPago />} />
        <Route path="perfil" element={<PaginaPerfil />} />
        <Route path="mis-reservas" element={<PaginaReservasUsuario />} />
        
        {/* Nuevas rutas para los resultados de pago */}
        <Route path="reserva-exitosa" element={<PaginaReservaExitosa />} />
        <Route path="pago-fallido" element={<PaginaPagoFallido />} />
      </Route>
       
      {/* Ruta de fallback para rutas no encontradas */}
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
};

export default RutasPublicas;