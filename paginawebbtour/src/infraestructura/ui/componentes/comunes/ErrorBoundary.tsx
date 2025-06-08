import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    // Actualiza el estado para que el siguiente renderizado muestre la UI alternativa
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Puedes registrar el error en un servicio de reporte de errores
    console.error("Error capturado por ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Puedes renderizar cualquier UI alternativa
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-50">
          <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-red-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
              Ha ocurrido un error
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Lo sentimos, ha ocurrido un error al cargar esta página.
            </p>
            <div className="flex flex-col space-y-2">
              <Link to="/" className="w-full px-4 py-2 text-white bg-primary-500 rounded-md hover:bg-primary-600 text-center">
                Volver al inicio
              </Link>
              <button 
                onClick={() => window.location.reload()}
                className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 text-center"
              >
                Recargar la página
              </button>
            </div>
            
            {this.state.error && (
              <details className="mt-6 text-sm text-gray-600">
                <summary className="cursor-pointer font-medium">Detalles técnicos</summary>
                <pre className="mt-2 p-2 bg-gray-100 rounded-md overflow-auto text-xs">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;