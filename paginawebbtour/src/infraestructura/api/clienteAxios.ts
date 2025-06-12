/*import axios from 'axios';

import { store } from '../store';
import { refrescarToken } from '../store/slices/sliceAutenticacion';

// Configuración base para las peticiones a la API
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
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

export { clienteAxios };

 */


import axios from 'axios';
import { store } from '../store';
import { refrescarToken } from '../store/slices/sliceAutenticacion';

// Configuración base para las peticiones a la API
const clienteAxios = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api/v1',
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

// Interceptor mejorado para peticiones
clienteAxios.interceptors.request.use(
  (config) => {
    // Log para todas las peticiones
    console.log(`🚀 Enviando petición autenticada a: ${config.url}`);
    
    // Verificación para peticiones POST/PUT
    if (config.method?.toLowerCase() === 'post' || config.method?.toLowerCase() === 'put') {
      console.log('📦 Cuerpo de la petición autenticada:', JSON.stringify(config.data));
      
      // Asegurar Content-Type
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en petición autenticada:', error);
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
clienteAxios.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta autenticada de ${response.config.url}:`, response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Loguear detalles del error
    if (error.response) {
      console.error(`❌ Error ${error.response.status} en ${originalRequest.url}:`, error.message);
      console.error('📛 Detalles del error:', {
        status: error.response.status,
        data: error.response.data
      });
    }

    // Si es un error 401 (no autorizado) y no es una solicitud de refresh token
    if (error.response && error.response.status === 401 && 
        !originalRequest._retry && 
        !originalRequest.url.includes('refresh')) {
      
      console.log('🔄 Intentando refrescar token para retry automático...');
      
      if (isRefreshing) {
        console.log('🔄 Ya hay un proceso de refresh en curso, añadiendo solicitud a la cola');
        // Si ya estamos refrescando el token, poner la solicitud en cola
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject, config: originalRequest });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Intentar refrescar el token
        console.log('🔄 Despachando acción de refrescar token...');
        const result = await store.dispatch(refrescarToken(undefined)).unwrap();
        const newToken = result.token;
        
        console.log('✅ Token refrescado exitosamente, procesando cola de solicitudes');
        // Procesar la cola con el nuevo token
        processQueue(null, newToken);
        isRefreshing = false;
        
        // Reintentar la solicitud original
        console.log('🔄 Reintentando solicitud original con nuevo token');
        return clienteAxios(originalRequest);
      } catch (refreshError) {
        console.error('❌ Error al refrescar token:', refreshError);
        // Si no se pudo refrescar el token, procesar la cola con error
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { clienteAxios };