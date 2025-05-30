 import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

interface ErrorPageProps {
  error?: Error;
  statusCode?: number;
  message?: string;
}

const ErrorPage: React.FC<ErrorPageProps> = ({ 
  error, 
  statusCode = 500, 
  message = "Ocurrió un error inesperado" 
}) => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-red-600 mb-4">{statusCode}</h1>
        <h2 className="text-3xl font-semibold mb-4">Error</h2>
        <p className="text-gray-600 mb-2">{message}</p>
        
        {error && import.meta.env.MODE !== 'production' && (
          <div className="mt-4 mb-8 p-4 bg-red-50 border border-red-200 rounded-md text-left">
            <p className="font-mono text-sm text-red-700">{error.message}</p>
            <p className="font-mono text-xs text-red-500 mt-2">{error.stack}</p>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-6">
          <button
            onClick={goBack}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Volver atrás
          </button>
          
          <Link
            to="/"
            className="inline-block bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-6 rounded-md transition-colors"
          >
            Ir al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;