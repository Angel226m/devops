

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from './infrastructure/store/slices/authSlice';
import { RootState, AppDispatch } from './infrastructure/store/index';
import { ROUTES } from './shared/constants/appRoutes';

// Layouts
import AdminLayout from './infrastructure/ui/layouts/AdminLayout';
import VendedorLayout from './infrastructure/ui/layouts/VendedorLayout';
import ChoferLayout from './infrastructure/ui/layouts/ChoferLayout';

// Features - Tipos de Tour
import TipoTourList from './infrastructure/ui/features/tipoTour/TipoTourList';
import TipoTourForm from './infrastructure/ui/features/tipoTour/TipoTourForm';
import TipoTourDetail from './infrastructure/ui/features/tipoTour/TipoTourDetail';

// Features - Embarcaciones
import EmbarcacionList from './infrastructure/ui/features/embarcacion/EmbarcacionList';
import EmbarcacionForm from './infrastructure/ui/features/embarcacion/EmbarcacionForm';
import EmbarcacionDetail from './infrastructure/ui/features/embarcacion/EmbarcacionDetail';

// Features - Sedes
import SedeList from './infrastructure/ui/features/sede/SedeList';
import SedeForm from './infrastructure/ui/features/sede/SedeForm';
import SedeDetail from './infrastructure/ui/features/sede/SedeDetail';

// Features - Idiomas
import IdiomaForm from './infrastructure/ui/features/idioma/IdiomaForm';

// Features - Horarios de Tour
import HorarioTourList from './infrastructure/ui/features/horarioTour/HorarioTourList';
import HorarioTourForm from './infrastructure/ui/features/horarioTour/HorarioTourForm';
import HorarioTourDetail from './infrastructure/ui/features/horarioTour/HorarioTourDetail';

// Features - Horarios de Chofer
import ChoferHorarioList from './infrastructure/ui/features/choferHorario/ChoferHorarioList';
import ChoferHorarioForm from './infrastructure/ui/features/choferHorario/ChoferHorarioForm';
import ChoferHorarioDetail from './infrastructure/ui/features/choferHorario/ChoferHorarioDetail';

// Pages
import LoginPage from './infrastructure/ui/pages/LoginPage';
import SelectSedePage from './infrastructure/ui/pages/SelectSedePage';
import AdminDashboard from './infrastructure/ui/pages/AdminDashboard';
import NotFoundPage from './infrastructure/ui/pages/NotFoundPage';
import ErrorPage from './infrastructure/ui/pages/ErrorPage';
import UsuariosPage from './infrastructure/ui/pages/UsuariosPage';
import SedesPage from './infrastructure/ui/pages/SedesPage';
import GestionSedesPage from './infrastructure/ui/pages/GestionSedesPage';
import IdiomasPage from './infrastructure/ui/pages/IdiomasPage';
import EmbarcacionesPage from './infrastructure/ui/pages/EmbarcacionesPage';
import TiposTourPage from './infrastructure/ui/pages/TiposTourPage';
import Horario from './infrastructure/ui/pages/Horario';
import HorariosTourPage from './infrastructure/ui/pages/HorariosTourPage';
import ChoferesHorarioPage from './infrastructure/ui/pages/ChoferesHorarioPage';




import Pasajes from './infrastructure/ui/pages/Pasajes';
import TipoPasajeList from './infrastructure/ui/features/tipoPasaje/TipoPasajeList';
import TipoPasajeForm from './infrastructure/ui/features/tipoPasaje/TipoPasajeForm';
import TipoPasajeDetail from './infrastructure/ui/features/tipoPasaje/TipoPasajeDetail';
import PaquetePasajesList from './infrastructure/ui/features/paquetePasajes/PaquetePasajesList';
import PaquetePasajesForm from './infrastructure/ui/features/paquetePasajes/PaquetePasajesForm';
import PaquetePasajesDetail from './infrastructure/ui/features/paquetePasajes/PaquetePasajesDetail';

import ToursProgramadosPage from './infrastructure/ui/pages/ToursProgramadosPage';
import TourProgramadoList from './infrastructure/ui/features/tourProgramado/TourProgramadoList';
import TourProgramadoForm from './infrastructure/ui/features/tourProgramado/TourProgramadoForm';
import TourProgramadoDetail from './infrastructure/ui/features/tourProgramado/TourProgramadoDetail';

// Resto del código se mantiene igual...

// Componente para rutas protegidas
const ProtectedRoute: React.FC<{ 
  children: React.ReactElement, 
  allowedRoles?: string[], 
  requireSede?: boolean 
}> = ({ 
  children, 
  allowedRoles = [], 
  requireSede = true 
}) => {
  const { isAuthenticated, user, selectedSede } = useSelector((state: RootState) => state.auth);
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }
  
  if (!user) {
    return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
  }
  
  if (requireSede && !selectedSede && user.rol === 'ADMIN') {
    return <Navigate to={ROUTES.AUTH.SELECT_SEDE} replace />;
  }
  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.rol)) {
    switch(user.rol) {
      case 'ADMIN':
        return <Navigate to={ROUTES.ADMIN.DASHBOARD} replace />;
      case 'VENDEDOR':
        return <Navigate to={ROUTES.VENDEDOR.DASHBOARD} replace />;
      case 'CHOFER':
        return <Navigate to={ROUTES.CHOFER.DASHBOARD} replace />;
      default:
        return <Navigate to={ROUTES.AUTH.LOGIN} replace />;
    }
  }
  
  return children;
};

const App: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);
  
  const [authCheckAttempts, setAuthCheckAttempts] = useState(0);
  
  useEffect(() => {
    if (authCheckAttempts > 2) {
      console.warn("Múltiples intentos fallidos de verificación de autenticación. Deteniendo el ciclo.");
      return;
    }
    
    if (!auth.isAuthenticated && !auth.isLoading) {
      console.log("Verificando estado de autenticación...");
      dispatch(checkAuthStatus());
      setAuthCheckAttempts(prev => prev + 1);
    } else if (auth.isAuthenticated) {
      setAuthCheckAttempts(0);
    }
  }, [auth.isAuthenticated, auth.isLoading, authCheckAttempts, dispatch]);
  
  if (auth.isLoading && authCheckAttempts === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas públicas */}
        <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
        
        {/* Ruta de selección de sede (protegida para admins) */}
        <Route path={ROUTES.AUTH.SELECT_SEDE} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SelectSedePage />
          </ProtectedRoute>
        } />
        
        {/* RUTAS ESPECIALES FUERA DE LAYOUTS - Para evitar conflictos */}
        <Route path={ROUTES.ADMIN.GESTION_SEDES.LIST} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <GestionSedesPage />
          </ProtectedRoute>
        } />

        <Route path={ROUTES.ADMIN.GESTION_SEDES.NEW} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SedeForm />
          </ProtectedRoute>
        } />

        <Route path="/admin/gestion-sedes/editar/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SedeForm />
          </ProtectedRoute>
        } />

        <Route path="/admin/gestion-sedes/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SedeDetail />
          </ProtectedRoute>
        } />

        {/* Rutas de idiomas FUERA del AdminLayout */}
        <Route path={ROUTES.ADMIN.IDIOMAS.LIST} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <IdiomasPage />
          </ProtectedRoute>
        } />
        
        <Route path={ROUTES.ADMIN.IDIOMAS.NEW} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <IdiomaForm />
          </ProtectedRoute>
        } />
        
        <Route path="/admin/idiomas/editar/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <IdiomaForm />
          </ProtectedRoute>
        } />
        
        {/* RUTAS DE ADMINISTRADOR DENTRO DE AdminLayout */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Gestión de sedes (dentro de la sede seleccionada) */}
          <Route path="sedes/*" element={<SedesPage />} />
          <Route path="tours" element={<ToursProgramadosPage />} />
<Route path="tours/lista/:tipoId" element={<TourProgramadoList />} />
          {/* Gestión de usuarios */}
          <Route path="usuarios/*" element={<UsuariosPage />} />
          
          {/* Gestión de tipos de tour - rutas principales */}
          <Route path="tipos-tour" element={<TipoTourList />} />
          <Route path="tipos-tour/nuevo" element={<TipoTourForm />} />
          <Route path="tipos-tour/editar/:id" element={<TipoTourForm isEditing={true} />} />
          <Route path="tipos-tour/:id" element={<TipoTourDetail />} />
          
        
          {/* Gestión de embarcaciones */}
          <Route path="embarcaciones" element={<EmbarcacionList />} />
          <Route path="embarcaciones/nueva" element={<EmbarcacionForm />} />
          <Route path="embarcaciones/editar/:id" element={<EmbarcacionForm />} />
          <Route path="embarcaciones/:id" element={<EmbarcacionDetail />} />


          <Route path="horarios" element={<Horario />} />
<Route path="horarios-tour" element={<HorariosTourPage />} />
<Route path="horarios-tour/nuevo" element={<HorarioTourForm />} />
<Route path="horarios-tour/editar/:id" element={<HorarioTourForm isEditing={true} />} />
<Route path="horarios-tour/:id" element={<HorarioTourDetail />} />

<Route path="horarios-chofer" element={<ChoferesHorarioPage />} />
<Route path="horarios-chofer/nuevo" element={<ChoferHorarioForm />} />
<Route path="horarios-chofer/editar/:id" element={<ChoferHorarioForm isEditing={true} />} />
<Route path="horarios-chofer/:id" element={<ChoferHorarioDetail />} />
          {/* Gestión de pasajes */}
<Route path="pasajes" element={<Pasajes />} />

{/* Tipos de pasaje */}
<Route path="tipos-pasaje" element={<TipoPasajeList />} />
<Route path="tipos-pasaje/nuevo" element={<TipoPasajeForm />} />
<Route path="tipos-pasaje/editar/:id" element={<TipoPasajeForm isEditing={true} />} />
<Route path="tipos-pasaje/:id" element={<TipoPasajeDetail />} />

{/* Paquetes de pasajes */}
<Route path="paquetes-pasajes" element={<PaquetePasajesList />} />
<Route path="paquetes-pasajes/nuevo" element={<PaquetePasajesForm />} />
<Route path="paquetes-pasajes/editar/:id" element={<PaquetePasajesForm isEditing={true} />} />
<Route path="paquetes-pasajes/:id" element={<PaquetePasajesDetail />} />



<Route path="tours/*" element={<ToursProgramadosPage />} />
<Route path="tours/lista/:tipoId" element={<TourProgramadoList />} />
<Route path="tours/nuevo" element={<TourProgramadoForm />} />
<Route path="tours/editar/:id" element={<TourProgramadoForm isEditing={true} />} />
<Route path="tours/:id" element={<TourProgramadoDetail />} />
          {/* Redirección a dashboard si no se especifica subruta */}
          <Route path="" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
        {/* RUTAS DE VENDEDOR */}
        <Route path="/vendedor" element={
          <ProtectedRoute allowedRoles={['VENDEDOR']}>
            <VendedorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Vendedor</div>} />
          
          {/* Vendedores también pueden ver embarcaciones de su sede */}
          <Route path="embarcaciones" element={<EmbarcacionList />} />
          <Route path="embarcaciones/:id" element={<EmbarcacionDetail />} />
          
          {/* Vendedores pueden ver tipos de tour (solo lectura) */}
          <Route path="tipos-tour" element={<TipoTourList />} />
          <Route path="tipos-tour/:id" element={<TipoTourDetail />} />
          
          <Route path="" element={<Navigate to={ROUTES.VENDEDOR.DASHBOARD} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
       
       
       
       
       
       
       
       
       
       
       
       
       
       
        {/* RUTAS DE CHOFER */}
        <Route path="/chofer" element={
          <ProtectedRoute allowedRoles={['CHOFER']}>
            <ChoferLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Chofer</div>} />
          
          {/* Choferes pueden ver sus embarcaciones asignadas */}
          <Route path="mis-embarcaciones" element={<EmbarcacionList />} />
          <Route path="mis-embarcaciones/:id" element={<EmbarcacionDetail />} />
          
          {/* Choferes pueden ver tipos de tour (solo lectura) */}
          <Route path="tipos-tour" element={<TipoTourList />} />
          <Route path="tipos-tour/:id" element={<TipoTourDetail />} />
          
          {/* Alias para mantener compatibilidad */}
          <Route path="embarcaciones" element={<Navigate to={ROUTES.CHOFER.MIS_EMBARCACIONES} replace />} />
          <Route path="embarcaciones/:id" element={<EmbarcacionDetail />} />
          
          <Route path="" element={<Navigate to={ROUTES.CHOFER.DASHBOARD} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* PÁGINAS DE ERROR */}
        <Route path={ROUTES.COMMON.ERROR} element={<ErrorPage />} />
        <Route path={ROUTES.COMMON.NOT_FOUND} element={<NotFoundPage />} />
        
        {/* RUTA RAÍZ - Redirección según rol */}
        <Route path="/" element={
          auth.isAuthenticated && auth.user ? (
            auth.user.rol === 'ADMIN' ? 
              auth.selectedSede ? 
                <Navigate to={ROUTES.ADMIN.DASHBOARD} replace /> :
                <Navigate to={ROUTES.AUTH.SELECT_SEDE} replace />
              : 
            auth.user.rol === 'VENDEDOR' ?
              <Navigate to={ROUTES.VENDEDOR.DASHBOARD} replace /> :
            auth.user.rol === 'CHOFER' ?
              <Navigate to={ROUTES.CHOFER.DASHBOARD} replace /> :
              <Navigate to={ROUTES.AUTH.LOGIN} replace />
          ) : (
            <Navigate to={ROUTES.AUTH.LOGIN} replace />
          )
        } />
        
        {/* PÁGINA NO ENCONTRADA - Debe ir al final */}
        <Route path="*" element={<Navigate to={ROUTES.COMMON.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;