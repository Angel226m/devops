 import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { store } from '../store';
import { refreshToken } from '../store/slices/authSlice';

// Configuración más clara de la URL base
const getBaseURL = () => {
  if (import.meta.env.PROD) {
    return 'https://admin.angelproyect.com/api/v1';
  }
  // En desarrollo, usar el proxy de Nginx o Vite
  return '/api/v1';
};

const baseURL = getBaseURL();

interface QueueItem {
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

const processQueue = (error: Error | null = null): void => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

export const axiosClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

// Log de configuración inicial
console.log(`🔧 Axios configurado con baseURL: ${baseURL}`);

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
  async (error: AxiosError) => {
    if (!error.config) {
      console.error('❌ Error sin configuración:', error.message);
      return Promise.reject(error);
    }

    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Manejo específico para errores 401 (no autorizado)
    if (error.response?.status === 401 &&
        !originalRequest._retry &&
        !originalRequest.url?.includes('/auth/refresh')) {

      const hasRefreshToken = document.cookie.includes('refresh_token=');

      if (hasRefreshToken) {
        // Si ya estamos refrescando, poner en cola
        if (isRefreshing) {
          return new Promise<unknown>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then(() => axiosClient(originalRequest))
            .catch(err => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          console.log('🔄 Token expirado, refrescando...');
          await store.dispatch(refreshToken());

          processQueue();
          isRefreshing = false;

          console.log('✅ Token refrescado, reintentando petición original');
          return axiosClient(originalRequest);
        } catch (refreshError) {
          console.error('❌ Error al refrescar token:', refreshError);
          processQueue(refreshError instanceof Error ? refreshError : new Error('Error al refrescar token'));
          isRefreshing = false;

          // Redirigir solo si no estamos en login
          if (!window.location.pathname.includes('/login')) {
            console.log('🔄 Redirigiendo a login...');
            window.location.href = '/login';
          }

          return Promise.reject(refreshError);
        }
      } else {
        // No hay refresh token disponible
        console.log('❌ No hay refresh token, redirigiendo a login');
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }

    // Log de otros errores
    const status = error.response?.status || 'sin status';
    const url = originalRequest?.url || 'URL desconocida';
    ;


    return Promise.reject(error);
  }
);

export default axiosClient;