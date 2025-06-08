 



import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Configuración de Polyfills y configuraciones globales
import 'regenerator-runtime/runtime';

// Cargar las variables de entorno según el modo de construcción
const isProduction = import.meta.env.PROD;

// Mensaje de consola para el entorno de desarrollo
if (!isProduction) {
  console.log('Ejecutando en modo desarrollo');
}

// Manejar errores no capturados
window.onerror = (message, source, lineno, colno, error) => {
  console.log('Error global: ', { message, error });
  
  // En producción, aquí podrías enviar el error a un servicio de monitoreo
  if (isProduction) {
    // Enviar a servicio de monitoreo
  }
  
  // Evita mostrar el error en la consola nuevamente en desarrollo
  return !isProduction;
};

// Verificar que el elemento root existe
const rootElement = document.getElementById('root');
if (!rootElement) {
  console.error('No se encontró el elemento root en el DOM');
} else {
  // Crear una ÚNICA raíz de React y renderizar la app
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}