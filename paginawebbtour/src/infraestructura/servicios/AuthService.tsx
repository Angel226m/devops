/*import { clienteAxios } from "../api/clienteAxios";
import { clientePublico } from "../api/clientePublico";
import { store } from "../store";
import { establecerUsuario, establecerToken, establecerRefreshToken } from "../store/slices/sliceAutenticacion";
import { endpoints } from "../api/endpoints";

class AuthService {
  // Propiedad para almacenar el ID del intervalo
  private _intervalId: NodeJS.Timeout | undefined = undefined;
  
  // Verificar si hay una sesión activa
  async verificarSesion(): Promise<boolean> {
    try {
      console.log("Verificando sesión de usuario...");
      
      // Primero intentamos refrescar el token usando la cookie refresh_token
      console.log("Intentando refrescar token desde cookie...");
      try {
        // Usamos clientePublico para la solicitud de refresh porque no necesita autenticación
        const refreshResponse = await clientePublico.post(endpoints.cliente.refrescarToken);
        
        if (refreshResponse.data && refreshResponse.data.success) {
          console.log("Token refrescado exitosamente desde cookie");
          
          // Obtenemos los datos del usuario y tokens del response
          const { usuario, token, refresh_token } = refreshResponse.data.data;
          
          // Actualizamos el estado de Redux
          store.dispatch(establecerUsuario(usuario));
          
          // Guardamos los tokens en el estado si están disponibles
          if (token) {
            store.dispatch(establecerToken(token));
          }
          
          if (refresh_token) {
            store.dispatch(establecerRefreshToken(refresh_token));
          }
          
          return true;
        }
      } catch (refreshError) {
        console.warn("No se pudo refrescar el token desde cookie:", refreshError);
      }
      
      // Si llegamos aquí, el refresh falló, lo que significa que no hay sesión activa
      console.log("No hay sesión activa (no se pudo refrescar el token)");
      return false;
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      return false;
    }
  }
  
  // Configurar renovación automática del token
  configurarRenovacionToken() {
    // Renovar el token cada 14 minutos (si el token expira a los 15 minutos)
    const INTERVALO_RENOVACION = 14 * 60 * 1000;
    
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    
    this._intervalId = setInterval(async () => {
      try {
        console.log("Renovando token automáticamente...");
        // Intentar renovar el token
        const response = await clientePublico.post(endpoints.cliente.refrescarToken);
        
        if (response.data && response.data.success) {
          console.log("Token renovado automáticamente con éxito");
          
          // Obtenemos los datos del usuario y tokens del response
          const { usuario, token, refresh_token } = response.data.data;
          
          // Actualizamos el estado de Redux
          store.dispatch(establecerUsuario(usuario));
          
          // Guardamos los tokens en el estado si están disponibles
          if (token) {
            store.dispatch(establecerToken(token));
          }
          
          if (refresh_token) {
            store.dispatch(establecerRefreshToken(refresh_token));
          }
        } else {
          console.warn("Respuesta inesperada al renovar token:", response.data);
        }
      } catch (error) {
        console.error("Error al renovar token automáticamente:", error);
        // Si falla la renovación, limpiar el intervalo
        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = undefined;
        }
      }
    }, INTERVALO_RENOVACION);
    
    console.log("Renovación automática de token configurada");
  }
  
  // Detener la renovación automática
  detenerRenovacionToken() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
      console.log("Renovación automática de token detenida");
    }
  }
}

export const authService = new AuthService();*/

















/*
import { clienteAxios } from "../api/clienteAxios";
import { clientePublico } from "../api/clientePublico";
import { store } from "../store";
import { establecerUsuario, establecerToken, establecerRefreshToken, finalizarCargaAutenticacion } from "../store/slices/sliceAutenticacion";
import { endpoints } from "../api/endpoints";

class AuthService {
  // Propiedad para almacenar el ID del intervalo
  private _intervalId: NodeJS.Timeout | undefined = undefined;
  
  // Verificar si hay una sesión activa
  async verificarSesion(): Promise<boolean> {
    try {
      console.log("🔍 AuthService: Iniciando verificación de sesión...");
      
      try {
        console.log("🔄 AuthService: Intentando refrescar token desde cookie...");
        
        // Usamos clientePublico para la solicitud de refresh porque no necesita autenticación
        const refreshResponse = await clientePublico.post(endpoints.cliente.refrescarToken);
        
        console.log("📡 AuthService: Respuesta del servidor:", {
          status: refreshResponse.status,
          data: refreshResponse.data
        });
        
        if (refreshResponse.data && refreshResponse.data.success) {
          console.log("✅ AuthService: Token refrescado exitosamente desde cookie");
          
          // ⭐ CAMBIO IMPORTANTE: Los tokens están en cookies HTTP, no en la respuesta JSON
          // Solo extraemos los datos del usuario de la respuesta
          const responseData = refreshResponse.data.data;
          const usuario = responseData.usuario;
          const sede = responseData.sede;
          
          console.log("👤 AuthService: Datos del usuario obtenidos:", {
            usuarioId: usuario?.id,
            usuarioNombre: usuario?.nombres,
            usuarioCorreo: usuario?.correo,
            sede: sede?.nombre || 'Sin sede'
          });
          
          // Actualizamos el estado de Redux solo con el usuario
          store.dispatch(establecerUsuario(usuario));
          
          // ⭐ NO necesitamos manejar tokens manualmente porque son cookies HTTP
          // El navegador los maneja automáticamente en futuras peticiones
          // Pero podemos limpiar los tokens del estado si existen
          store.dispatch(establecerToken(null));
          store.dispatch(establecerRefreshToken(null));
          
          console.log("✅ AuthService: Estado Redux actualizado correctamente");
          return true;
        } else {
          console.log("❌ AuthService: Respuesta del servidor no exitosa:", refreshResponse.data);
          return false;
        }
      } catch (refreshError: any) {
        console.warn("⚠️ AuthService: Error al refrescar token:", {
          message: refreshError.message,
          status: refreshError.response?.status,
          data: refreshError.response?.data
        });
        return false;
      }
    } catch (error: any) {
      console.error("❌ AuthService: Error general en verificación de sesión:", {
        message: error.message,
        stack: error.stack
      });
      return false;
    } finally {
      // ⭐ IMPORTANTE: Siempre finalizar la carga de autenticación
      console.log("🏁 AuthService: Finalizando carga de autenticación");
      store.dispatch(finalizarCargaAutenticacion());
    }
  }
  
  // Configurar renovación automática del token
  configurarRenovacionToken() {
    // Renovar el token cada 14 minutos (si el token expira a los 15 minutos)
    const INTERVALO_RENOVACION = 14 * 60 * 1000;
    
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    
    this._intervalId = setInterval(async () => {
      try {
        console.log("🔄 AuthService: Renovando token automáticamente...");
        // Intentar renovar el token
        const response = await clientePublico.post(endpoints.cliente.refrescarToken);
        
        if (response.data && response.data.success) {
          console.log("✅ AuthService: Token renovado automáticamente con éxito");
          
          // ⭐ CAMBIO: Solo actualizar datos del usuario, no tokens
          const responseData = response.data.data;
          const usuario = responseData.usuario;
          
          // Actualizamos el estado de Redux solo con el usuario
          store.dispatch(establecerUsuario(usuario));
          
          console.log("👤 AuthService: Usuario actualizado en renovación automática:", {
            usuarioId: usuario?.id,
            usuarioNombre: usuario?.nombres
          });
        } else {
          console.warn("⚠️ AuthService: Respuesta inesperada al renovar token:", response.data);
        }
      } catch (error: any) {
        console.error("❌ AuthService: Error al renovar token automáticamente:", {
          message: error.message,
          status: error.response?.status
        });
        // Si falla la renovación, limpiar el intervalo
        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = undefined;
        }
      }
    }, INTERVALO_RENOVACION);
    
    console.log("⏰ AuthService: Renovación automática de token configurada");
  }
  
  // Detener la renovación automática
  detenerRenovacionToken() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
      console.log("⏹️ AuthService: Renovación automática de token detenida");
    }
  }
}

export const authService = new AuthService();*/










/*

import { clienteAxios } from "../api/clienteAxios";
import { clientePublico } from "../api/clientePublico";
import { store } from "../store";
import { 
  establecerUsuario, 
  establecerToken, 
  establecerRefreshToken, 
  finalizarCargaAutenticacion,
  limpiarEstadoAutenticacion 
} from "../store/slices/sliceAutenticacion";
import { endpoints } from "../api/endpoints";

class AuthService {
  // Propiedad para almacenar el ID del intervalo
  private _intervalId: NodeJS.Timeout | undefined = undefined;
  
  // ⭐ CORREGIDO: Verificar si hay una sesión activa
  async verificarSesion(): Promise<boolean> {
    try {
      console.log("🔍 AuthService: Iniciando verificación de sesión...");
      
      // ⭐ NUEVO: Verificar primero si hay un estado de sesión cerrada
      const estado = store.getState().autenticacion;
      if (!estado.autenticado && !estado.cargandoAutenticacion) {
        console.log("⏹️ AuthService: Sesión previamente cerrada, no verificar");
        return false;
      }
      
      try {
        console.log("🔄 AuthService: Intentando refrescar token desde cookie...");
        
        // Usamos clientePublico para la solicitud de refresh porque no necesita autenticación
        const refreshResponse = await clientePublico.post(endpoints.cliente.refrescarToken);
        
        console.log("📡 AuthService: Respuesta del servidor:", {
          status: refreshResponse.status,
          data: refreshResponse.data
        });
        
        if (refreshResponse.data && refreshResponse.data.success) {
          console.log("✅ AuthService: Token refrescado exitosamente desde cookie");
          
          // Solo extraemos los datos del usuario de la respuesta
          const responseData = refreshResponse.data.data;
          const usuario = responseData.usuario;
          const sede = responseData.sede;
          
          console.log("👤 AuthService: Datos del usuario obtenidos:", {
            usuarioId: usuario?.id,
            usuarioNombre: usuario?.nombres,
            usuarioCorreo: usuario?.correo,
            sede: sede?.nombre || 'Sin sede'
          });
          
          // Actualizamos el estado de Redux solo con el usuario
          store.dispatch(establecerUsuario(usuario));
          
          // Limpiamos los tokens del estado (porque están en cookies HTTP)
          store.dispatch(establecerToken(null));
          store.dispatch(establecerRefreshToken(null));
          
          // ⭐ NUEVO: Iniciar renovación automática solo si la sesión es válida
          this.configurarRenovacionToken();
          
          console.log("✅ AuthService: Estado Redux actualizado correctamente");
          return true;
        } else {
          console.log("❌ AuthService: Respuesta del servidor no exitosa:", refreshResponse.data);
          return false;
        }
      } catch (refreshError: any) {
        console.warn("⚠️ AuthService: Error al refrescar token:", {
          message: refreshError.message,
          status: refreshError.response?.status,
          data: refreshError.response?.data
        });
        
        // ⭐ NUEVO: Si el error es 401, significa que no hay sesión válida
        if (refreshError.response?.status === 401) {
          console.log("🔒 AuthService: No hay sesión válida (401)");
          store.dispatch(limpiarEstadoAutenticacion());
        }
        
        return false;
      }
    } catch (error: any) {
      console.error("❌ AuthService: Error general en verificación de sesión:", {
        message: error.message,
        stack: error.stack
      });
      return false;
    } finally {
      // Siempre finalizar la carga de autenticación
      console.log("🏁 AuthService: Finalizando carga de autenticación");
      store.dispatch(finalizarCargaAutenticacion());
    }
  }
  
  // Configurar renovación automática del token
  configurarRenovacionToken() {
    // Renovar el token cada 14 minutos (si el token expira a los 15 minutos)
    const INTERVALO_RENOVACION = 14 * 60 * 1000;
    
    // ⭐ IMPORTANTE: Limpiar cualquier intervalo previo
    if (this._intervalId) {
      clearInterval(this._intervalId);
    }
    
    this._intervalId = setInterval(async () => {
      try {
        console.log("🔄 AuthService: Renovando token automáticamente...");
        
        // Intentar renovar el token
        const response = await clientePublico.post(endpoints.cliente.refrescarToken);
        
        if (response.data && response.data.success) {
          console.log("✅ AuthService: Token renovado automáticamente con éxito");
          
          // Solo actualizar datos del usuario, no tokens
          const responseData = response.data.data;
          const usuario = responseData.usuario;
          
          // Actualizamos el estado de Redux solo con el usuario
          store.dispatch(establecerUsuario(usuario));
          
          console.log("👤 AuthService: Usuario actualizado en renovación automática:", {
            usuarioId: usuario?.id,
            usuarioNombre: usuario?.nombres
          });
        } else {
          console.warn("⚠️ AuthService: Respuesta inesperada al renovar token:", response.data);
        }
      } catch (error: any) {
        console.error("❌ AuthService: Error al renovar token automáticamente:", {
          message: error.message,
          status: error.response?.status
        });
        
        // ⭐ NUEVO: Si falla la renovación, detener el intervalo y limpiar sesión
        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = undefined;
        }
        
        // Si es error 401, limpiar sesión
        if (error.response?.status === 401) {
          console.log("🔒 AuthService: Sesión expirada durante renovación automática");
          store.dispatch(limpiarEstadoAutenticacion());
        }
      }
    }, INTERVALO_RENOVACION);
    
    console.log("⏰ AuthService: Renovación automática de token configurada");
  }
  
  // Detener la renovación automática
  detenerRenovacionToken() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
      console.log("⏹️ AuthService: Renovación automática de token detenida");
    }
  }
}

export const authService = new AuthService();*/
import { clienteAxios } from "../api/clienteAxios";
import { clientePublico } from "../api/clientePublico";
import { store } from "../store";
import { establecerUsuario, finalizarCargaAutenticacion, limpiarEstadoAutenticacion } from "../store/slices/sliceAutenticacion";
import { endpoints } from "../api/endpoints";

class AuthService {
  private _intervalId: NodeJS.Timeout | undefined = undefined;
  // ⭐ NUEVO: Flag para controlar si acabamos de hacer logout
  private _logoutReciente: boolean = false;

  // ⭐ CORREGIDO: Verificar si hay una sesión activa
  async verificarSesion(): Promise<boolean> {
    try {
      console.log("🔍 AuthService: Iniciando verificación de sesión...");

      // ⭐ NUEVO: Si acabamos de hacer logout, no intentar verificar
      if (this._logoutReciente) {
        console.log("🚫 AuthService: Logout reciente detectado → no verificar sesión");
        store.dispatch(limpiarEstadoAutenticacion());
        store.dispatch(finalizarCargaAutenticacion());
        this._logoutReciente = false; // Resetear flag
        return false;
      }

      const estado = store.getState().autenticacion;

      if (estado.cargandoAutenticacion) {
        console.log("⏳ AuthService: Ya en proceso de verificación → continuando");
      }

      try {
        console.log("🔄 AuthService: Intentando refrescar token desde cookie...");

        const refreshResponse = await clientePublico.post(endpoints.cliente.refrescarToken);

        console.log("📡 AuthService: Respuesta del servidor:", {
          status: refreshResponse.status,
          data: refreshResponse.data
        });

        if (refreshResponse.data && refreshResponse.data.success) {
          console.log("✅ AuthService: Token refrescado exitosamente desde cookie");

          const responseData = refreshResponse.data.data;
          const usuario = responseData.usuario;

          console.log("👤 AuthService: Datos del usuario obtenidos:", {
            usuarioId: usuario?.id_cliente || usuario?.id,
            usuarioNombre: usuario?.nombres || usuario?.razon_social,
            usuarioCorreo: usuario?.correo
          });

          store.dispatch(establecerUsuario(usuario));
          this.configurarRenovacionToken();

          console.log("✅ AuthService: Estado Redux actualizado correctamente");
          return true;
        } else {
          console.log("❌ AuthService: Respuesta del servidor no exitosa:", refreshResponse.data);
          store.dispatch(limpiarEstadoAutenticacion());
          return false;
        }
      } catch (refreshError: any) {
        console.warn("⚠️ AuthService: Error al refrescar token:", {
          message: refreshError.message,
          status: refreshError.response?.status,
          data: refreshError.response?.data
        });

        if (refreshError.response?.status === 401) {
          console.log("🔒 AuthService: No hay sesión válida (401)");
          store.dispatch(limpiarEstadoAutenticacion());
        }

        return false;
      }
    } catch (error: any) {
      console.error("❌ AuthService: Error general en verificación de sesión:", {
        message: error.message,
        stack: error.stack
      });
      store.dispatch(limpiarEstadoAutenticacion());
      return false;
    } finally {
      console.log("🏁 AuthService: Finalizando carga de autenticación");
      store.dispatch(finalizarCargaAutenticacion());
    }
  }

  // Configurar renovación automática del token
  configurarRenovacionToken() {
    const INTERVALO_RENOVACION = 14 * 60 * 1000;

    if (this._intervalId) {
      clearInterval(this._intervalId);
    }

    this._intervalId = setInterval(async () => {
      try {
        console.log("🔄 AuthService: Renovando token automáticamente...");

        const response = await clientePublico.post(endpoints.cliente.refrescarToken);

        if (response.data && response.data.success) {
          console.log("✅ AuthService: Token renovado automáticamente con éxito");

          const usuario = response.data.data.usuario;

          store.dispatch(establecerUsuario(usuario));

          console.log("👤 AuthService: Usuario actualizado en renovación automática:", {
            usuarioId: usuario?.id_cliente || usuario?.id,
            usuarioNombre: usuario?.nombres || usuario?.razon_social
          });
        } else {
          console.warn("⚠️ AuthService: Respuesta inesperada al renovar token:", response.data);
        }
      } catch (error: any) {
        console.error("❌ AuthService: Error al renovar token automáticamente:", {
          message: error.message,
          status: error.response?.status
        });

        if (this._intervalId) {
          clearInterval(this._intervalId);
          this._intervalId = undefined;
        }

        if (error.response?.status === 401) {
          console.log("🔒 AuthService: Sesión expirada durante renovación automática");
          store.dispatch(limpiarEstadoAutenticacion());
        }
      }
    }, INTERVALO_RENOVACION);

    console.log("⏰ AuthService: Renovación automática de token configurada");
  }

  // Detener la renovación automática
  detenerRenovacionToken() {
    if (this._intervalId) {
      clearInterval(this._intervalId);
      this._intervalId = undefined;
      console.log("⏹️ AuthService: Renovación automática de token detenida");
    }
  }

  // ⭐ NUEVO: Marcar que acabamos de hacer logout
  marcarLogout() {
    console.log("🔴 AuthService: Marcando logout reciente");
    this._logoutReciente = true;
    this.detenerRenovacionToken();
    
    // ⭐ CRÍTICO: Eliminar cookies INMEDIATAMENTE del lado del cliente
    this.eliminarCookiesCliente();
    
    // ⭐ Resetear el flag después de 2 segundos para permitir verificaciones futuras
    setTimeout(() => {
      this._logoutReciente = false;
      console.log("✅ AuthService: Flag de logout reseteado");
    }, 2000);
  }

  // ⭐ NUEVO: Función para eliminar cookies del lado del cliente
  private eliminarCookiesCliente() {
    console.log("🧹 AuthService: Eliminando cookies del cliente");
    
    // Eliminar todas las variantes posibles de las cookies
    const cookieNames = ['access_token', 'refresh_token'];
    const paths = ['/', ''];
    const domains = [window.location.hostname, `.${window.location.hostname}`, ''];
    
    cookieNames.forEach(name => {
      paths.forEach(path => {
        domains.forEach(domain => {
          // Eliminar con diferentes combinaciones
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}; SameSite=None; Secure`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}; domain=${domain}`;
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
        });
      });
    });
    
    console.log("✅ AuthService: Cookies eliminadas del cliente");
  }
}

export const authService = new AuthService();