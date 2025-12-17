 /*


import axios from 'axios';
import { store } from '../store';
import { refrescarToken } from '../store/slices/sliceAutenticacion';

// Determinar la URL base según el entorno
const getBaseURL = () => {
  // En producción, usar URL relativa
  if (import.meta.env.PROD) {
    return '/api/v1';
  }
  // En desarrollo, usar URL completa del servidor local
  return import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
};

// Configuración base para las peticiones a la API
const clienteAxios = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  // Habilitar cookies en peticiones
  withCredentials: true
});

// Variable para controlar si estamos en proceso de refrescar el token
let isRefreshing = false;
// Cola de solicitudes en espera mientras se refresca el token
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
  config: any;
}> = [];

// Función para procesar la cola de solicitudes en espera
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(request => {
    if (error) {
      request.reject(error);
    } else {
      // Si se obtuvo un nuevo token, añadirlo a la solicitud
      if (token) {
        request.config.headers['Authorization'] = `Bearer ${token}`;
      }
      request.resolve(clienteAxios(request.config));
    }
  });
  // Limpiar la cola
  failedQueue = [];
};

// Interceptor para añadir el token de autenticación si está disponible
clienteAxios.interceptors.request.use(
  (config) => {
    // No es necesario añadir el token manualmente si usamos cookies
    // Las cookies se envían automáticamente con withCredentials: true
    
    // Log para depuración (puedes eliminar esto en producción)
    if (import.meta.env.DEV) {
      console.log(`🔍 Petición a: ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
clienteAxios.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Si es un error 401 (no autorizado) y no es una solicitud de refresh token
    if (error.response && error.response.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('refresh')) {
      
      if (isRefreshing) {
        // Si ya estamos refrescando el token, poner la solicitud en cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token
        const result = await store.dispatch(refrescarToken(undefined)).unwrap();
        const newToken = result.token;
        
        // Procesar la cola con el nuevo token
        processQueue(null, newToken);
        isRefreshing = false;
        
        // Reintentar la solicitud original
        return clienteAxios(originalRequest);
      } catch (refreshError) {
        // Si no se pudo refrescar el token, procesar la cola con error
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Log de configuración
console.log(`🔧 Cliente API configurado con baseURL: ${getBaseURL()}`);

export { clienteAxios };*/













/*

import axios from 'axios';

// Determinar la URL base según el entorno
const getBaseURL = () => {
  // En producción, usar URL relativa
  if (import.meta.env.PROD) {
    return '/api/v1';
  }
  // En desarrollo, usar URL completa del servidor local
  return import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1';
};

// Configuración base para las peticiones a la API
const clienteAxios = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  // Habilitar cookies en peticiones
  withCredentials: true
});

// Interceptor para peticiones - SIMPLIFICADO para cookies HTTP
clienteAxios.interceptors.request.use(
  (config) => {
    // No es necesario añadir el token manualmente si usamos cookies
    // Las cookies se envían automáticamente con withCredentials: true
    
    // Log para depuración (puedes eliminar esto en producción)
    if (import.meta.env.DEV) {
      console.log(`🔍 Petición autenticada a: ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respuestas - SIMPLIFICADO
clienteAxios.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ Respuesta autenticada de ${response.config.url}:`, response.status);
    }
    return response;
  },
  async (error) => {
    // Si es 401, redirigir al login (las cookies HTTP se manejan automáticamente)
    if (error.response && error.response.status === 401) {
      console.warn('🔒 Sesión expirada, redirigiendo al login');
      // Limpiar el estado de autenticación
      const { store } = await import('../store');
      const { cerrarSesion } = await import('../store/slices/sliceAutenticacion');
      store.dispatch(cerrarSesion());
      // Redirigir al login
      window.location.href = '/ingresar';
    }
    
    return Promise.reject(error);
  }
);

// Log de configuración
console.log(`🔧 Cliente API configurado con baseURL: ${getBaseURL()}`);

export { clienteAxios };*/


import axios from 'axios';

const getBaseURL = () => {
  if (import.meta.env. PROD) {
    return '/api/v1';
  }
  return import.meta.env. VITE_API_URL || 'http://localhost:8080/api/v1';
};

const clienteAxios = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true  // ✅ ESENCIAL para cookies HttpOnly
});

// ✅ CAMBIO:  Simplificar interceptor (no manejar tokens manualmente)
clienteAxios.interceptors.request.use(
  (config) => {
    // ✅ NO agregar tokens manualmente (se envían automáticamente en cookies)
    
    if (import.meta.env.DEV) {
      console.log(`🔍 Petición autenticada a:  ${config.baseURL}${config.url}`);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

clienteAxios.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`✅ Respuesta autenticada de ${response.config.url}:`, response.status);
    }
    return response;
  },
  async (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('🔒 Sesión expirada, redirigiendo al login');
      const { store } = await import('../store');
      const { cerrarSesion } = await import('../store/slices/sliceAutenticacion');
      store.dispatch(cerrarSesion());
      window.location.href = '/ingresar';
    }
    
    return Promise.reject(error);
  }
);

console.log(`🔧 Cliente API configurado con baseURL: ${getBaseURL()}`);

export { clienteAxios };