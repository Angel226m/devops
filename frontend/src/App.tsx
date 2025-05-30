 /*
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

// Features
import EmbarcacionList from './infrastructure/ui/features/embarcacion/EmbarcacionList';
import EmbarcacionForm from './infrastructure/ui/features/embarcacion/EmbarcacionForm';
import EmbarcacionDetail from './infrastructure/ui/features/embarcacion/EmbarcacionDetail';
import SedeList from './infrastructure/ui/features/sede/SedeList';
import SedeForm from './infrastructure/ui/features/sede/SedeForm';
import SedeDetail from './infrastructure/ui/features/sede/SedeDetail';

// Pages
import LoginPage from './infrastructure/ui/pages/LoginPage';
import SelectSedePage from './infrastructure/ui/pages/SelectSedePage';
import AdminDashboard from './infrastructure/ui/pages/AdminDashboard';
import NotFoundPage from './infrastructure/ui/pages/NotFoundPage';
import ErrorPage from './infrastructure/ui/pages/ErrorPage';
import UsuariosPage from './infrastructure/ui/pages/UsuariosPage';
import SedesPage from './infrastructure/ui/pages/SedesPage';
import GestionSedesPage from './infrastructure/ui/pages/GestionSedesPage';
import IdiomasPage from './infrastructure/ui/pages/IdiomasPage'; // NUEVO
import IdiomaForm from './infrastructure/ui/features/idioma/IdiomaForm'; // NUEVO

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
        {/* Rutas públicas *//*}
        <Route path={ROUTES.AUTH.LOGIN} element={<LoginPage />} />
        
        {/* Ruta de selección de sede (protegida para admins) *//*}
        <Route path={ROUTES.AUTH.SELECT_SEDE} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <SelectSedePage />
          </ProtectedRoute>
        } />
        
        {/* IMPORTANTE: Rutas especiales ANTES de AdminLayout *//*}
        <Route path={ROUTES.ADMIN.GESTION_SEDES.LIST} element={
          <ProtectedRoute allowedRoles={['ADMIN']} requireSede={false}>
            <GestionSedesPage />
          </ProtectedRoute>
        } />

        {/* NUEVO: Rutas de idiomas FUERA del AdminLayout para evitar conflictos *//*}
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
        
        {/* Rutas de administrador *//*}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          
          {/* Gestión de sedes *//*}
          <Route path="sedes/*" element={<SedesPage />} />
          
          {/* Gestión de usuarios *//*}
          <Route path="usuarios/*" element={<UsuariosPage />} />
          
          {/* Gestión de embarcaciones *//*}
          <Route path="embarcaciones" element={<EmbarcacionList />} />
          <Route path="embarcaciones/nueva" element={<EmbarcacionForm />} />
          <Route path="embarcaciones/editar/:id" element={<EmbarcacionForm />} />
          <Route path="embarcaciones/:id" element={<EmbarcacionDetail />} />
          
          {/* Redirección a dashboard si no se especifica subruta *//*}
          <Route path="" element={<Navigate to={ROUTES.ADMIN.DASHBOARD} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Rutas de vendedor *//*}
        <Route path="/vendedor" element={
          <ProtectedRoute allowedRoles={['VENDEDOR']}>
            <VendedorLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Vendedor</div>} />
          <Route path="" element={<Navigate to={ROUTES.VENDEDOR.DASHBOARD} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Rutas de chofer *//*}
        <Route path="/chofer" element={
          <ProtectedRoute allowedRoles={['CHOFER']}>
            <ChoferLayout />
          </ProtectedRoute>
        }>
          <Route path="dashboard" element={<div>Dashboard de Chofer</div>} />
          <Route path="mis-embarcaciones" element={<EmbarcacionList />} />
          <Route path="mis-embarcaciones/:id" element={<EmbarcacionDetail />} />
          <Route path="" element={<Navigate to={ROUTES.CHOFER.DASHBOARD} replace />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        
        {/* Páginas de error *//*}
        <Route path={ROUTES.COMMON.ERROR} element={<ErrorPage />} />
        <Route path={ROUTES.COMMON.NOT_FOUND} element={<NotFoundPage />} />
        
        {/* Ruta raíz *//*}
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
        
        {/* Página no encontrada *//*}
        <Route path="*" element={<Navigate to={ROUTES.COMMON.NOT_FOUND} replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;*/
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
          
          {/* Gestión de usuarios */}
          <Route path="usuarios/*" element={<UsuariosPage />} />
            <Route path="tipos-tour/*" element={<TiposTourPage />} />

          
          {/* Gestión de embarcaciones */}
          <Route path="embarcaciones" element={<EmbarcacionList />} />
          <Route path="embarcaciones/nueva" element={<EmbarcacionForm />} />
          <Route path="embarcaciones/editar/:id" element={<EmbarcacionForm />} />
          <Route path="embarcaciones/:id" element={<EmbarcacionDetail />} />
          
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