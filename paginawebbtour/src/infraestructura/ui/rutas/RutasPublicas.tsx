 /*

import { Routes, Route } from 'react-router-dom';
import { lazy } from 'react';
import RutasPrivadas from './RutasPrivadas';
const PaginaConservacion = lazy(() => import('../paginas/publicas/PaginaConservacion'));
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
// Importaciones para páginas legales
const PaginaTerminosCondiciones = lazy(() => import('../paginas/publicas/TerminosCondiciones'));
const PaginaPoliticaPrivacidad = lazy(() => import('../paginas/publicas/PoliticaPrivacidad'));
const PaginaPoliticaCookies = lazy(() => import('../paginas/publicas/PoliticaCookies'));


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
       <Route path="/conservacion" element={<PaginaConservacion />} />

      <Route path="ingresar" element={<PaginaIngreso />} />
      <Route path="registrarse" element={<PaginaRegistro />} />
      <Route path="recuperar-contrasena" element={<PaginaRecuperacion />} />
      <Route path="cambiar-contrasena" element={<PaginaCambioContrasena />} /> {/* Añadida esta ruta *//*}
      
       {/* Rutas para páginas legales *//*}
      <Route path="terminos" element={<PaginaTerminosCondiciones />} />
      <Route path="privacidad" element={<PaginaPoliticaPrivacidad />} />
      <Route path="cookies" element={<PaginaPoliticaCookies />} />
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
import RutasPrivadas from './RutasPrivadas';

// 🎯 IMPORTACIONES DIRECTAS TEMPORALES (sin lazy)
import PaginaConservacion from '../paginas/publicas/PaginaConservacion';
import PaginaInicio from '../paginas/publicas/PaginaInicio';
import PaginaTours from '../paginas/publicas/PaginaTours';
import PaginaDetalleTour from '../paginas/publicas/PaginaDetalleTour';
import PaginaSedes from '../paginas/publicas/PaginaSedes';
import PaginaSobreNosotros from '../paginas/publicas/PaginaSobreNosotros';
import PaginaContacto from '../paginas/publicas/PaginaContacto';
import PaginaPreguntas from '../paginas/publicas/PaginaPreguntas';
import PaginaIngreso from '../paginas/publicas/PaginaIngreso';
import PaginaRegistro from '../paginas/publicas/PaginaRegistro';
import PaginaRecuperacion from '../paginas/publicas/PaginaRecuperacion';
import PaginaCambioContrasena from '../paginas/publicas/PaginaCambioContrasena';
import PaginaNoEncontrada from '../paginas/publicas/PaginaNoEncontrada';

// Importaciones para páginas legales
import PaginaTerminosCondiciones from '../paginas/publicas/TerminosCondiciones';
import PaginaPoliticaPrivacidad from '../paginas/publicas/PoliticaPrivacidad';
import PaginaPoliticaCookies from '../paginas/publicas/PoliticaCookies';

// ⭐ IMPORTACIONES DIRECTAS PARA PÁGINAS PRIVADAS
import PaginaProcesoPago from '../paginas/privadas/PaginaProcesoPago';
import PaginaPerfil from '../paginas/privadas/PaginaPerfil';
import PaginaReservasUsuario from '../paginas/privadas/PaginaReservasUsuario';
import PaginaDetalleReserva from '../paginas/privadas/PaginaDetalleReserva';

// Importaciones para las páginas de resultado de pago
import PaginaReservaExitosa from '../paginas/privadas/PaginaReservaExitosa';
import PaginaPagoFallido from '../paginas/privadas/PaginaPagoFallido';

const RutasPublicas = () => {
  console.log("🔧 RutasPublicas: Renderizando rutas...");
  
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
      <Route path="conservacion" element={<PaginaConservacion />} />

      {/* Rutas de autenticación */}
      <Route path="ingresar" element={<PaginaIngreso />} />
      <Route path="registrarse" element={<PaginaRegistro />} />
      <Route path="recuperar-contrasena" element={<PaginaRecuperacion />} />
      <Route path="cambiar-contrasena" element={<PaginaCambioContrasena />} />
      
      {/* Rutas para páginas legales */}
      <Route path="terminos" element={<PaginaTerminosCondiciones />} />
      <Route path="privacidad" element={<PaginaPoliticaPrivacidad />} />
      <Route path="cookies" element={<PaginaPoliticaCookies />} />

      {/* Rutas privadas protegidas por autenticación */}
      <Route element={<RutasPrivadas />}>
        <Route path="proceso-pago" element={<PaginaProcesoPago />} />
        <Route path="perfil" element={<PaginaPerfil />} />
        <Route path="mis-reservas" element={
          <div>
            <h1 style={{padding: '20px', color: 'red', fontSize: '24px'}}>
              🔧 DEBUG: Renderizando PaginaReservasUsuario
            </h1>
            <PaginaReservasUsuario />
          </div>
        } />
        <Route path="reservas/:id" element={<PaginaDetalleReserva />} />
        
        {/* Rutas para los resultados de pago */}
        <Route path="reserva-exitosa" element={<PaginaReservaExitosa />} />
        <Route path="pago-fallido" element={<PaginaPagoFallido />} />
      </Route>
       
      {/* Ruta de fallback para rutas no encontradas */}
      <Route path="*" element={<PaginaNoEncontrada />} />
    </Routes>
  );
};

export default RutasPublicas;