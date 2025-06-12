/*import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración dinámica de la URL base
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://reservas.angelproyect.com/api/v1';
  }
  // En desarrollo, usar el proxy de Vite
  return '/api/v1';
};

const baseURL = getBaseURL();

// Log de configuración para desarrollo
console.log(`🔧 Axios para paginawebbtour configurado con baseURL: ${baseURL}`);

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Añadido para permitir cookies en peticiones cross-origin
});

// Interceptor para peticiones
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 Enviando petición a: ${fullUrl}`);

    // Opcional: Agregar headers adicionales si es necesario
    if (import.meta.env.DEV) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta de ${response.config.url}:`, response.status);
    return response;
  },
  (error: AxiosError) => {
    if (!error.config) {
      console.error('❌ Error sin configuración:', error.message);
      return Promise.reject(error);
    }

    // Log de errores
    const status = error.response?.status || 'sin status';
    const url = error.config?.url || 'URL desconocida';
    console.error(`❌ Error ${status} en ${url}:`, error.message);

    return Promise.reject(error);
  }
);

// Cliente axios para peticiones públicas que no requieren autenticación
export const clientePublico = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: true, // Añadido para permitir cookies en peticiones cross-origin
});

// Interceptores básicos para el cliente público
clientePublico.interceptors.request.use(
  (config) => {
    console.log(`🔍 Petición pública a: ${config.url}`);
    return config;
  },
  (error) => Promise.reject(error)
);

clientePublico.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta pública de ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error(`❌ Error en petición pública:`, error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;*/


import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Configuración dinámica de la URL base
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://reservas.angelproyect.com/api/v1';
  }
  // En desarrollo, usar el proxy de Vite
  return '/api/v1';
};

const baseURL = getBaseURL();

// Log de configuración para desarrollo
console.log(`🔧 Axios para paginawebbtour configurado con baseURL: ${baseURL}`);

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: true, // Añadido para permitir cookies en peticiones cross-origin
});

// Interceptor para peticiones
axiosClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const fullUrl = `${config.baseURL}${config.url}`;
    console.log(`🚀 Enviando petición a: ${fullUrl}`);

    // Opcional: Agregar headers adicionales si es necesario
    if (import.meta.env.DEV) {
      config.headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    
    // Verificar el cuerpo para peticiones POST/PUT
    if (config.method?.toLowerCase() === 'post' || config.method?.toLowerCase() === 'put') {
      console.log('📦 Cuerpo de la petición:', JSON.stringify(config.data));
    }

    return config;
  },
  (error: AxiosError) => {
    console.error('❌ Error en petición:', error);
    return Promise.reject(error);
  }
);

// Interceptor para respuestas
axiosClient.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta de ${response.config.url}:`, response.status);
    return response;
  },
  (error: AxiosError) => {
    if (!error.config) {
      console.error('❌ Error sin configuración:', error.message);
      return Promise.reject(error);
    }

    // Log de errores
    const status = error.response?.status || 'sin status';
    const url = error.config?.url || 'URL desconocida';
    console.error(`❌ Error ${status} en ${url}:`, error.message);
    
    // Información detallada del error
    if (error.response) {
      console.error('📛 Detalles del error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      console.error('📋 Configuración de la solicitud con error:', {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data
      });
    }

    return Promise.reject(error);
  }
);

// Cliente axios para peticiones públicas que no requieren autenticación
export const clientePublico = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000,
  withCredentials: true, // Añadido para permitir cookies en peticiones cross-origin
});

// Interceptores mejorados para el cliente público
clientePublico.interceptors.request.use(
  (config) => {
    console.log(`🔍 Petición pública a: ${config.url}`);
    
    // Verificación crítica para peticiones POST
    if (config.method?.toLowerCase() === 'post' || config.method?.toLowerCase() === 'put') {
      console.log('📦 Cuerpo de la solicitud:', JSON.stringify(config.data));
      
      // Asegurar que el Content-Type es correcto
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      
      // Advertir si el cuerpo está vacío
      if (!config.data) {
        console.warn('⚠️ ADVERTENCIA: El cuerpo de la solicitud está vacío');
      }
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Error en petición pública:', error);
    return Promise.reject(error);
  }
);

clientePublico.interceptors.response.use(
  (response) => {
    console.log(`✅ Respuesta pública de ${response.config.url}:`, response.status);
    console.log('📋 Configuración enviada:', {
      url: response.config.url,
      method: response.config.method,
      data: response.config.data
    });
    return response;
  },
  (error) => {
    console.error(`❌ Error en petición pública:`, error.message);
    
    // Información detallada del error
    if (error.response) {
      console.error('📛 Detalles del error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
      console.error('📋 Configuración de la solicitud con error:', {
        url: error.config.url,
        method: error.config.method,
        data: error.config.data
      });
    }
    
    return Promise.reject(error);
  }
);

export default axiosClient;