
import { Suspense, lazy, useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './infraestructura/store';
import { I18nextProvider } from 'react-i18next';
import i18n from './infraestructura/i18n/i18n';
import { ContextoIdiomaProvider } from './infraestructura/servicios/idioma/ContextoIdioma';
import ErrorBoundary from './infraestructura/ui/componentes/comunes/ErrorBoundary';
import { authService } from './infraestructura/servicios/AuthService';

// Lazy loading de componentes para mejorar rendimiento
const EnrutadorApp = lazy(() => import('./infraestructura/ui/rutas/EnrutadorApp'));
const Cargador = lazy(() => import('./infraestructura/ui/componentes/comunes/Cargador'));

// Componente de fallback simple para el Suspense inicial
const FallbackInicial = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
  </div>
);

// Toaster para notificaciones*/
import { Toaster } from 'react-hot-toast';

// Estilos globales
import './infraestructura/ui/estilos/index.css';

// Componente para manejar la autenticación
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch();
  const { autenticado } = useSelector((state: any) => state.autenticacion);

  // Verificar sesión al iniciar la aplicación
  useEffect(() => {
    console.log("Verificando autenticación al iniciar la aplicación...");
    authService.verificarSesion().then(sesionActiva => {
      if (sesionActiva) {
        console.log("Sesión encontrada y restaurada");
      } else {
        console.log("No se encontró sesión activa");
      }
    });
  }, [dispatch]);

  // Configurar renovación automática del token cuando el usuario está autenticado
  useEffect(() => {
    if (autenticado) {
      console.log("Usuario autenticado, configurando renovación automática de token");
      authService.configurarRenovacionToken();
    } else {
      authService.detenerRenovacionToken();
    }

    // Limpiar al desmontar
    return () => {
      authService.detenerRenovacionToken();
    };
  }, [autenticado]);

  return <>{children}</>;
};

function App() {
  // Efecto para añadir clases al body
  useEffect(() => {
    document.body.classList.add('bg-gradient-to-b', 'from-blue-50', 'to-teal-50', 'min-h-screen');
    
    // Limpieza al desmontar
    return () => {
      document.body.classList.remove('bg-gradient-to-b', 'from-blue-50', 'to-teal-50', 'min-h-screen');
    };
  }, []);

  return (
    <ErrorBoundary>
      <I18nextProvider i18n={i18n}>
        <ContextoIdiomaProvider>
          <Provider store={store}>
            <Router>
              <AuthProvider>
                <Toaster 
                  position="top-right"
                  toastOptions={{
                    duration: 3000,
                    style: {
                      background: '#363636',
                      color: '#fff',
                    },
                  }}
                />
                <Suspense fallback={<FallbackInicial />}>
                  <Suspense fallback={
                    <div className="flex items-center justify-center h-screen">
                      <Cargador texto="Cargando aplicación..." />
                    </div>
                  }>
                    <EnrutadorApp />
                  </Suspense>
                </Suspense>
              </AuthProvider>
            </Router>
          </Provider>
        </ContextoIdiomaProvider>
      </I18nextProvider>
    </ErrorBoundary>
  );
}

export default App;