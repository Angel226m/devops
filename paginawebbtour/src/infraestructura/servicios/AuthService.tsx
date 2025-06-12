import { clienteAxios } from "../api/clienteAxios";
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

export const authService = new AuthService();