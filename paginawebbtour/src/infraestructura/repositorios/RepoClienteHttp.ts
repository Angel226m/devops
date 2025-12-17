/*
import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  Cliente, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../aplicacion/puertos/salida/RepositorioCliente";
import { clienteAxios } from "../api/clienteAxios";
import { clientePublico } from "../api/clientePublico";
import { endpoints } from "../api/endpoints";
import axios from "axios";

export class RepoClienteHttp implements RepositorioCliente {
  async registrar(cliente: NuevoClienteRequest): Promise<number> {
    try {
      console.log("Intentando registrar cliente con datos:", JSON.stringify(cliente, null, 2));
      
      // Verificar formato de DNI para DNI peruano (8 dígitos)
      if (cliente.tipo_documento === 'DNI' && !/^\d{8}$/.test(cliente.numero_documento)) {
        throw new Error("El DNI debe tener 8 dígitos numéricos");
      }
      
      // Verificar formato de celular peruano (9 dígitos)
      if (!/^\d{9}$/.test(cliente.numero_celular)) {
        throw new Error("El número de celular debe tener 9 dígitos");
      }
      
      // Verificar correo electrónico
      if (!/\S+@\S+\.\S+/.test(cliente.correo)) {
        throw new Error("El formato del correo electrónico es inválido");
      }
      
      // Verificar longitud mínima de contraseña
      if (cliente.contrasena.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
      
      const response = await clientePublico.post(endpoints.cliente.registro, cliente);
      console.log("Respuesta de registro:", response.data);
      
      if (response.data && response.data.success) {
        console.log("Registro exitoso, id:", response.data.data.id);
        return response.data.data.id;
      }
      
      throw new Error(response.data.message || "Error al registrar cliente");
    } catch (error: any) {
      console.error("Error al registrar cliente:", error);
      
      // Manejo detallado de errores para depuración
      if (axios.isAxiosError(error)) {
        if (error.response) {
          // El servidor respondió con un código de error
          console.error("Datos del error de respuesta:", {
            status: error.response.status,
            statusText: error.response.statusText,
            data: error.response.data,
            headers: error.response.headers
          });
          
          // Intentar extraer mensajes de error específicos del backend
          let mensajeError = "Error al crear cliente";
          
          if (error.response.data) {
            if (typeof error.response.data === 'string') {
              mensajeError = error.response.data;
            } else if (error.response.data.message) {
              mensajeError = error.response.data.message;
            } else if (error.response.data.error) {
              mensajeError = error.response.data.error;
            }
          }
          
          // Verificar si el error es de duplicación (usuario ya existe)
          if (error.response.status === 400 || error.response.status === 409) {
            if (mensajeError.toLowerCase().includes("correo") || mensajeError.toLowerCase().includes("email")) {
              throw new Error("El correo electrónico ya está registrado");
            }
            if (mensajeError.toLowerCase().includes("documento")) {
              throw new Error("El número de documento ya está registrado");
            }
          }
          
          throw new Error(mensajeError);
        } else if (error.request) {
          // La solicitud se realizó pero no se recibió respuesta
          throw new Error("No se recibió respuesta del servidor. Verifique su conexión a Internet.");
        } else {
          // Ocurrió un error durante la configuración de la solicitud
          throw new Error(`Error en la solicitud: ${error.message}`);
        }
      }
      
      // Si es un error lanzado por nuestras validaciones
      if (error instanceof Error) {
        throw error;
      }
      
      // Error genérico
      throw new Error("Error al registrar cliente");
    }
  }

  async obtenerPorId(id: number): Promise<Cliente | null> {
    try {
      const response = await clienteAxios.get(endpoints.cliente.obtenerPorId(id));
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("Error al obtener cliente por ID:", error);
      return null;
    }
  }

  async actualizar(id: number, datos: ActualizarClienteRequest): Promise<void> {
    try {
      const response = await clienteAxios.put(endpoints.cliente.actualizar(id), datos);
      if (response.data && response.data.success) {
        return;
      }
      throw new Error(response.data.message || "Error al actualizar cliente");
    } catch (error: any) {
      console.error("Error al actualizar cliente:", error);
      throw error;
    }
  }

  async autenticar(credenciales: LoginClienteRequest): Promise<RespuestaAutenticacion> {
    try {
      const response = await clientePublico.post(
        `${endpoints.cliente.login}?remember_me=${credenciales.recordarme || false}`, 
        {
          correo: credenciales.correo,
          contrasena: credenciales.contrasena
        }
      );
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Error de autenticación");
    } catch (error: any) {
      console.error("Error de autenticación:", error);
      throw error;
    }
  }

// En tu función refrescarToken:

async refrescarToken(refreshToken?: string): Promise<RespuestaAutenticacion> {
  try {
    console.log("Intentando refrescar token...");
    
    // Si se proporciona un refresh token explícitamente, lo enviamos en el cuerpo
    // Si no, el servidor usará la cookie refresh_token
    const requestData = refreshToken ? { refresh_token: refreshToken } : {};
    
    const response = await clientePublico.post(
      endpoints.cliente.refrescarToken, 
      requestData
    );
    
    if (response.data && response.data.success) {
      console.log("Token refrescado exitosamente");
      return response.data.data;
    }
    
    throw new Error(response.data.message || "Error al refrescar token");
  } catch (error: any) {
    console.error("Error al refrescar token:", error);
    throw error;
  }
}

  async cerrarSesion(): Promise<void> {
    try {
      const response = await clienteAxios.post(endpoints.cliente.cerrarSesion);
      if (response.data && response.data.success) {
        return;
      }
      throw new Error(response.data.message || "Error al cerrar sesión");
    } catch (error: any) {
      console.error("Error al cerrar sesión:", error);
      // Incluso si hay error, consideramos que la sesión está cerrada en el frontend
    }
  }

  async cambiarContrasena(id: number, datos: CambiarContrasenaRequest): Promise<void> {
    try {
      const response = await clienteAxios.post(
        endpoints.cliente.cambiarContrasena(id), 
        {
          current_password: datos.contrasena_actual,
          new_password: datos.nueva_contrasena
        }
      );
      
      if (response.data && response.data.success) {
        return;
      }
      throw new Error(response.data.message || "Error al cambiar contraseña");
    } catch (error: any) {
      console.error("Error al cambiar contraseña:", error);
      throw error;
    }
  }
}*/

import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  Cliente, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../dominio/entidades/Cliente";
import { RepositorioCliente } from "../../aplicacion/puertos/salida/RepositorioCliente";
import { clienteAxios } from "../api/clienteAxios";
import { clientePublico } from "../api/clientePublico";
import { endpoints } from "../api/endpoints";
import axios from "axios";

export class RepoClienteHttp implements RepositorioCliente {
  async registrar(cliente: NuevoClienteRequest): Promise<number> {
    try {
      console.log("📡 RepoClienteHttp: Registrando cliente...");
      
      // Validaciones del frontend
      if (cliente.tipo_documento === 'DNI' && !/^\d{8}$/.test(cliente.numero_documento)) {
        throw new Error("El DNI debe tener 8 dígitos numéricos");
      }
      
      if (!/^\d{9}$/.test(cliente.numero_celular)) {
        throw new Error("El número de celular debe tener 9 dígitos");
      }
      
      if (!/\S+@\S+\.\S+/.test(cliente.correo)) {
        throw new Error("El formato del correo electrónico es inválido");
      }
      
      if (cliente.contrasena.length < 6) {
        throw new Error("La contraseña debe tener al menos 6 caracteres");
      }
      
      const response = await clientePublico.post(endpoints.cliente.registro, cliente);
      console.log("✅ RepoClienteHttp: Cliente registrado exitosamente");
      
      if (response.data && response.data.success) {
        return response.data.data.id;
      }
      
      throw new Error(response.data.message || "Error al registrar cliente");
    } catch (error: any) {
      console.error("❌ RepoClienteHttp: Error al registrar cliente:", error);
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          let mensajeError = "Error al crear cliente";
          
          if (error.response.data) {
            if (typeof error.response.data === 'string') {
              mensajeError = error.response.data;
            } else if (error.response.data.message) {
              mensajeError = error.response.data.message;
            } else if (error.response.data.error) {
              mensajeError = error.response.data.error;
            }
          }
          
          if (error.response.status === 400 || error.response.status === 409) {
            if (mensajeError.toLowerCase().includes("correo") || mensajeError.toLowerCase().includes("email")) {
              throw new Error("El correo electrónico ya está registrado");
            }
            if (mensajeError.toLowerCase().includes("documento")) {
              throw new Error("El número de documento ya está registrado");
            }
          }
          
          throw new Error(mensajeError);
        } else if (error.request) {
          throw new Error("No se recibió respuesta del servidor. Verifique su conexión a Internet.");
        } else {
          throw new Error(`Error en la solicitud: ${error.message}`);
        }
      }
      
      if (error instanceof Error) {
        throw error;
      }
      
      throw new Error("Error al registrar cliente");
    }
  }

 async obtenerPorId(id: number): Promise<Cliente | null> {
    try {
      console.log("📡 RepoClienteHttp: Obteniendo cliente por ID:", id);
      
      // ⭐ USAR EL ENDPOINT CORRECTO SIN ID
      const response = await clienteAxios.get('/cliente/mi-perfil');
      
      console.log("📡 RepoClienteHttp: Respuesta obtenida:", response.data);
      
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error("❌ RepoClienteHttp: Error al obtener cliente por ID:", error);
      return null;
    }
  }


  // ⭐ CORREGIDO: Actualizar cliente
  async actualizar(id: number, datos: ActualizarClienteRequest): Promise<void> {
    try {
      console.log("📡 RepoClienteHttp: Actualizando cliente", { id, datos });
      
      // ⭐ USAR EL ENDPOINT CORRECTO SIN ID
      const response = await clienteAxios.put('/cliente/mi-perfil', datos);
      
      console.log("📡 RepoClienteHttp: Respuesta de actualización:", response.data);
      
      if (response.data && response.data.success) {
        console.log("✅ RepoClienteHttp: Cliente actualizado exitosamente");
        return;
      }
      
      throw new Error(response.data.message || "Error al actualizar cliente");
    } catch (error: any) {
      console.error("❌ RepoClienteHttp: Error al actualizar cliente:", error);
      
      // Extraer mensaje de error más específico
      if (error.response && error.response.data) {
        const errorMsg = error.response.data.message || error.response.data.error || "Error al actualizar cliente";
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  }


  async autenticar(credenciales: LoginClienteRequest): Promise<RespuestaAutenticacion> {
    try {
      console.log("📡 RepoClienteHttp: Autenticando cliente...");
      
      const response = await clientePublico.post(
        `${endpoints.cliente.login}?remember_me=${credenciales.recordarme || false}`, 
        {
          correo: credenciales.correo,
          contrasena: credenciales.contrasena
        }
      );
      
      if (response.data && response.data.success) {
        console.log("✅ RepoClienteHttp: Autenticación exitosa");
        return response.data.data;
      }
      throw new Error(response.data.message || "Error de autenticación");
    } catch (error: any) {
      console.error("❌ RepoClienteHttp: Error de autenticación:", error);
      throw error;
    }
  }

  async refrescarToken(refreshToken?: string): Promise<RespuestaAutenticacion> {
    try {
      console.log("📡 RepoClienteHttp: Refrescando token...");
      
      const requestData = refreshToken ? { refresh_token: refreshToken } : {};
      
      const response = await clientePublico.post(
        endpoints.cliente.refrescarToken, 
        requestData
      );
      
      if (response.data && response.data.success) {
        console.log("✅ RepoClienteHttp: Token refrescado exitosamente");
        return response.data.data;
      }
      
      throw new Error(response.data.message || "Error al refrescar token");
    } catch (error: any) {
      console.error("❌ RepoClienteHttp: Error al refrescar token:", error);
      throw error;
    }
  }

 /* async cerrarSesion(): Promise<void> {
    try {
      console.log("📡 RepoClienteHttp: Cerrando sesión...");
         document.cookie = "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    document.cookie = "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=None; Secure";
    
      const response = await clienteAxios.post('/cliente/logout');
      
      if (response.data && response.data.success) {
        console.log("✅ RepoClienteHttp: Sesión cerrada exitosamente");
        return;
      }
      
      throw new Error(response.data.message || "Error al cerrar sesión");
    } catch (error: any) {
      console.error("❌ RepoClienteHttp: Error al cerrar sesión:", error);
      // Incluso si hay error, consideramos que la sesión está cerrada en el frontend
    }
  }*/

async cerrarSesion(): Promise<void> {
  try {
    console.log("📡 RepoClienteHttp: Cerrando sesión...");
    
    // ⭐ NO INTENTAR ELIMINAR COOKIES CON JAVASCRIPT
    // Las cookies HttpOnly solo pueden ser eliminadas por el backend
    
    // Llamar al endpoint de logout del backend
    const response = await clienteAxios.post('/cliente/logout');
    
    if (response.data && response.data.success) {
      console.log("✅ RepoClienteHttp: Sesión cerrada en backend");
      return;
    }
    
    throw new Error(response.data.message || "Error al cerrar sesión");
  } catch (error: any) {
    console.error("❌ RepoClienteHttp: Error al cerrar sesión:", error);
    // Incluso si hay error, consideramos sesión cerrada en frontend
  }
}
  // ⭐ CORREGIDO: Cambiar contraseña
   // ⭐ CORREGIDO: Cambiar contraseña
  async cambiarContrasena(id: number, datos: CambiarContrasenaRequest): Promise<void> {
    try {
      console.log("📡 RepoClienteHttp: Cambiando contraseña para cliente ID:", id);
      
      // ⭐ USAR EL ENDPOINT CORRECTO
      const response = await clienteAxios.post(
        '/cliente/change-password', 
        {
          current_password: datos.contrasena_actual,
          new_password: datos.nueva_contrasena
        }
      );
      
      console.log("📡 RepoClienteHttp: Respuesta de cambio de contraseña:", response.data);
      
      if (response.data && response.data.success) {
        console.log("✅ RepoClienteHttp: Contraseña cambiada exitosamente");
        return;
      }
      
      throw new Error(response.data.message || "Error al cambiar contraseña");
    } catch (error: any) {
      console.error("❌ RepoClienteHttp: Error al cambiar contraseña:", error);
      
      // Extraer mensaje de error más específico
      if (error.response && error.response.data) {
        const errorMsg = error.response.data.message || error.response.data.error || "Error al cambiar contraseña";
        throw new Error(errorMsg);
      }
      
      throw error;
    }
  }
}