 /*
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  ClienteAutenticado, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../../dominio/entidades/Cliente";
import { RepoClienteHttp } from "../../repositorios/RepoClienteHttp";

// Exportamos la interfaz del estado
export interface EstadoAutenticacion {
  usuario: ClienteAutenticado | null;
  cargando: boolean;
  cargandoAutenticacion: boolean; // ⭐ NUEVO: Estado para verificación inicial de sesión
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  autenticado: boolean;
}

const initialState: EstadoAutenticacion = {
  usuario: null,
  cargando: false,
  cargandoAutenticacion: true, // ⭐ Inicialmente true para evitar redirecciones prematuras
  error: null,
  token: null,
  refreshToken: null,
  autenticado: false
};

const repoCliente = new RepoClienteHttp();

// ⭐ NUEVA acción para verificar sesión
// ⭐ NUEVO: Acción para verificar sesión con mejor manejo de errores
export const verificarSesion = createAsyncThunk(
  "autenticacion/verificarSesion",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Iniciando verificación de sesión...");
      
      // Importamos el AuthService dentro de la función para evitar dependencias circulares
      const { authService } = await import("../../servicios/AuthService");
      const sesionActiva = await authService.verificarSesion();
      
      console.log("📊 Redux: Resultado de verificación de sesión:", sesionActiva);
      
      // Siempre retornamos el resultado, sin rechazar
      return { sesionActiva };
    } catch (error: any) {
      console.error("❌ Redux: Error en verificación de sesión:", error);
      // En lugar de rechazar, retornamos que no hay sesión activa
      return { sesionActiva: false };
    }
  }
);

// Creamos un tipo para el resultado del registro, que puede ser un ID o una respuesta de autenticación
type ResultadoRegistro = {
  id?: number;
  respuestaLogin?: RespuestaAutenticacion;
  exitoso: boolean;
};

// Acción asíncrona para registrar un cliente y luego iniciar sesión automáticamente
export const registrarCliente = createAsyncThunk(
  "autenticacion/registrar",
  async (cliente: NuevoClienteRequest, { dispatch }): Promise<ResultadoRegistro> => {
    try {
      // Registramos el cliente
      const idCliente = await repoCliente.registrar(cliente);
      
      // Si el registro es exitoso, iniciamos sesión automáticamente
      if (idCliente) {
        try {
          // Preparar credenciales con los datos del formulario de registro
          const credenciales: LoginClienteRequest = {
            correo: cliente.correo,
            contrasena: cliente.contrasena,
            recordarme: false
          };
          
          // Iniciar sesión
          const respuestaLogin = await repoCliente.autenticar(credenciales);
          return { 
            id: idCliente, 
            respuestaLogin, 
            exitoso: true 
          };
        } catch (error) {
          console.error("Registro exitoso pero error al iniciar sesión automáticamente:", error);
          return { 
            id: idCliente, 
            exitoso: true 
          };
        }
      }
      
      return { exitoso: false };
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error;
    }
  }
);

// Acción asíncrona para iniciar sesión
export const iniciarSesion = createAsyncThunk(
  "autenticacion/iniciarSesion",
  async (credenciales: LoginClienteRequest) => {
    return await repoCliente.autenticar(credenciales);
  }
);

// Acción asíncrona para cerrar sesión
export const cerrarSesion = createAsyncThunk(
  "autenticacion/cerrarSesion",
  async () => {
    await repoCliente.cerrarSesion();
  }
);

// Acción asíncrona para refrescar el token
export const refrescarToken = createAsyncThunk(
  "autenticacion/refrescarToken",
  async (refreshToken: string | undefined) => {
    return await repoCliente.refrescarToken(refreshToken);
  }
);

// Acción asíncrona para actualizar datos del cliente
export const actualizarCliente = createAsyncThunk(
  "autenticacion/actualizarCliente",
  async ({ id, datos }: { id: number; datos: ActualizarClienteRequest }) => {
    await repoCliente.actualizar(id, datos);
    // Si la actualización es exitosa, obtenemos los datos actualizados
    return await repoCliente.obtenerPorId(id);
  }
);

// Acción asíncrona para cambiar la contraseña
export const cambiarContrasena = createAsyncThunk(
  "autenticacion/cambiarContrasena",
  async ({ id, datos }: { id: number; datos: CambiarContrasenaRequest }) => {
    await repoCliente.cambiarContrasena(id, datos);
  }
);

const autenticacionSlice = createSlice({
  name: "autenticacion",
  initialState,
  reducers: {
    establecerUsuario: (state, action: PayloadAction<ClienteAutenticado | null>) => {
      state.usuario = action.payload;
      state.autenticado = !!action.payload;
    },
    establecerToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    establecerRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
    // ⭐ NUEVO: Reducer para finalizar la carga de autenticación
    finalizarCargaAutenticacion: (state) => {
      state.cargandoAutenticacion = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // ⭐ NUEVO: Verificar sesión
      .addCase(verificarSesion.pending, (state) => {
  console.log("⏳ Redux: Verificando sesión...");
  state.cargandoAutenticacion = true;
})
.addCase(verificarSesion.fulfilled, (state, action) => {
  console.log("✅ Redux: Verificación de sesión completada:", action.payload);
  state.cargandoAutenticacion = false;
  // El AuthService ya maneja la actualización del estado de autenticación
})
.addCase(verificarSesion.rejected, (state, action) => {
  console.log("❌ Redux: Verificación de sesión falló:", action.error);
  state.cargandoAutenticacion = false;
  // No hay sesión activa, pero no es un error crítico
})
      
      // Registrar cliente
      .addCase(registrarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(registrarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        // Si la respuesta contiene datos de autenticación, los establecemos
        if (action.payload.respuestaLogin) {
          state.usuario = action.payload.respuestaLogin.usuario;
          state.token = action.payload.respuestaLogin.token || null;
          state.refreshToken = action.payload.respuestaLogin.refresh_token || null;
          state.autenticado = true;
        }
      })
      .addCase(registrarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        state.error = action.error.message || "Error al registrar cliente";
      })
      
      // Iniciar sesión
      .addCase(iniciarSesion.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false; // Finalizar carga
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        state.error = action.error.message || "Error al iniciar sesión";
      })
      
      // Cerrar sesión
      .addCase(cerrarSesion.pending, (state) => {
        state.cargando = true;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      .addCase(cerrarSesion.rejected, (state) => {
        // Incluso si hay error, cerramos sesión en el frontend
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      
      // Refrescar token
      .addCase(refrescarToken.pending, (state) => {
        state.cargando = true;
      })
      .addCase(refrescarToken.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(refrescarToken.rejected, (state) => {
        // Si falla el refresh, cerramos sesión
        state.cargando = false;
        state.cargandoAutenticacion = false; //  Finalizar carga
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      
      // Actualizar cliente
      .addCase(actualizarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(actualizarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        if (action.payload) {
          state.usuario = {
            ...state.usuario!,
            ...action.payload,
            nombre_completo: `${action.payload.nombres} ${action.payload.apellidos}`
          };
        }
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al actualizar datos del cliente";
      })
      
      // Cambiar contraseña
      .addCase(cambiarContrasena.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cambiarContrasena.fulfilled, (state) => {
        state.cargando = false;
      })
      .addCase(cambiarContrasena.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al cambiar contraseña";
      });
  }
});

export const { 
  establecerUsuario, 
  establecerToken, 
  establecerRefreshToken, 
  limpiarError,
  finalizarCargaAutenticacion // ⭐ Exportar nueva acción
} = autenticacionSlice.actions;

export default autenticacionSlice.reducer;*/



























/*
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  ClienteAutenticado, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../../dominio/entidades/Cliente";
import { RepoClienteHttp } from "../../repositorios/RepoClienteHttp";

export interface EstadoAutenticacion {
  usuario: ClienteAutenticado | null;
  cargando: boolean;
  cargandoAutenticacion: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  autenticado: boolean;
}

const initialState: EstadoAutenticacion = {
  usuario: null,
  cargando: false,
  cargandoAutenticacion: true,
  error: null,
  token: null,
  refreshToken: null,
  autenticado: false
};

const repoCliente = new RepoClienteHttp();

export const verificarSesion = createAsyncThunk(
  "autenticacion/verificarSesion",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Iniciando verificación de sesión...");
      const { authService } = await import("../../servicios/AuthService");
      const sesionActiva = await authService.verificarSesion();
      console.log("📊 Redux: Resultado de verificación de sesión:", sesionActiva);
      return { sesionActiva };
    } catch (error: any) {
      console.error("❌ Redux: Error en verificación de sesión:", error);
      return { sesionActiva: false };
    }
  }
);

type ResultadoRegistro = {
  id?: number;
  respuestaLogin?: RespuestaAutenticacion;
  exitoso: boolean;
};

export const registrarCliente = createAsyncThunk(
  "autenticacion/registrar",
  async (cliente: NuevoClienteRequest, { dispatch }): Promise<ResultadoRegistro> => {
    try {
      const idCliente = await repoCliente.registrar(cliente);
      
      if (idCliente) {
        try {
          const credenciales: LoginClienteRequest = {
            correo: cliente.correo,
            contrasena: cliente.contrasena,
            recordarme: false
          };
          
          const respuestaLogin = await repoCliente.autenticar(credenciales);
          return { 
            id: idCliente, 
            respuestaLogin, 
            exitoso: true 
          };
        } catch (error) {
          console.error("Registro exitoso pero error al iniciar sesión automáticamente:", error);
          return { 
            id: idCliente, 
            exitoso: true 
          };
        }
      }
      
      return { exitoso: false };
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error;
    }
  }
);

export const iniciarSesion = createAsyncThunk(
  "autenticacion/iniciarSesion",
  async (credenciales: LoginClienteRequest) => {
    return await repoCliente.autenticar(credenciales);
  }
);

export const cerrarSesion = createAsyncThunk(
  "autenticacion/cerrarSesion",
  async () => {
    await repoCliente.cerrarSesion();
  }
);

export const refrescarToken = createAsyncThunk(
  "autenticacion/refrescarToken",
  async (refreshToken: string | undefined) => {
    return await repoCliente.refrescarToken(refreshToken);
  }
);

// ⭐ CORREGIDO: Actualizar datos del cliente
export const actualizarCliente = createAsyncThunk(
  "autenticacion/actualizarCliente",
  async ({ id, datos }: { id: number; datos: ActualizarClienteRequest }, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Actualizando cliente", { id, datos });
      
      // Primero actualizar los datos
      await repoCliente.actualizar(id, datos);
      
      // Luego obtener los datos actualizados
      const clienteActualizado = await repoCliente.obtenerPorId(id);
      
      console.log("✅ Redux: Cliente actualizado exitosamente", clienteActualizado);
      return clienteActualizado;
    } catch (error: any) {
      console.error("❌ Redux: Error al actualizar cliente:", error);
      return rejectWithValue(error.message || "Error al actualizar datos del cliente");
    }
  }
);

// ⭐ CORREGIDO: Cambiar contraseña
export const cambiarContrasena = createAsyncThunk(
  "autenticacion/cambiarContrasena",
  async ({ id, datos }: { id: number; datos: CambiarContrasenaRequest }, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Cambiando contraseña para cliente ID:", id);
      
      await repoCliente.cambiarContrasena(id, datos);
      
      console.log("✅ Redux: Contraseña cambiada exitosamente");
      return true;
    } catch (error: any) {
      console.error("❌ Redux: Error al cambiar contraseña:", error);
      return rejectWithValue(error.message || "Error al cambiar contraseña");
    }
  }
);

const autenticacionSlice = createSlice({
  name: "autenticacion",
  initialState,
  reducers: {
    establecerUsuario: (state, action: PayloadAction<ClienteAutenticado | null>) => {
      state.usuario = action.payload;
      state.autenticado = !!action.payload;
    },
    establecerToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    establecerRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
    finalizarCargaAutenticacion: (state) => {
      state.cargandoAutenticacion = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Verificar sesión
      .addCase(verificarSesion.pending, (state) => {
        console.log("⏳ Redux: Verificando sesión...");
        state.cargandoAutenticacion = true;
      })
      .addCase(verificarSesion.fulfilled, (state, action) => {
        console.log("✅ Redux: Verificación de sesión completada:", action.payload);
        state.cargandoAutenticacion = false;
      })
      .addCase(verificarSesion.rejected, (state, action) => {
        console.log("❌ Redux: Verificación de sesión falló:", action.error);
        state.cargandoAutenticacion = false;
      })
      
      // Registrar cliente
      .addCase(registrarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(registrarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        if (action.payload.respuestaLogin) {
          state.usuario = action.payload.respuestaLogin.usuario;
          state.token = action.payload.respuestaLogin.token || null;
          state.refreshToken = action.payload.respuestaLogin.refresh_token || null;
          state.autenticado = true;
        }
      })
      .addCase(registrarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.error = action.error.message || "Error al registrar cliente";
      })
      
      // Iniciar sesión
      .addCase(iniciarSesion.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.error = action.error.message || "Error al iniciar sesión";
      })
      
      // Cerrar sesión
      .addCase(cerrarSesion.pending, (state) => {
        state.cargando = true;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      .addCase(cerrarSesion.rejected, (state) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      
      // Refrescar token
      .addCase(refrescarToken.pending, (state) => {
        state.cargando = true;
      })
      .addCase(refrescarToken.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(refrescarToken.rejected, (state) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      
      // ⭐ CORREGIDO: Actualizar cliente
      .addCase(actualizarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(actualizarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        if (action.payload) {
          // Actualizar el usuario en el estado con los datos devueltos
          const clienteActualizado = action.payload;
          state.usuario = {
            ...state.usuario!,
            ...clienteActualizado,
            nombre_completo: `${clienteActualizado.nombres} ${clienteActualizado.apellidos}`
          };
        }
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string || "Error al actualizar datos del cliente";
      })
      
      // ⭐ CORREGIDO: Cambiar contraseña
      .addCase(cambiarContrasena.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cambiarContrasena.fulfilled, (state) => {
        state.cargando = false;
        // No necesitamos actualizar el estado del usuario para cambio de contraseña
      })
      .addCase(cambiarContrasena.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string || "Error al cambiar contraseña";
      });
  }
});

export const { 
  establecerUsuario, 
  establecerToken, 
  establecerRefreshToken, 
  limpiarError,
  finalizarCargaAutenticacion
} = autenticacionSlice.actions;

export default autenticacionSlice.reducer;*/
















/*

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  ClienteAutenticado, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../../dominio/entidades/Cliente";
import { RepoClienteHttp } from "../../repositorios/RepoClienteHttp";
import { authService } from "../../servicios/AuthService";

export interface EstadoAutenticacion {
  usuario: ClienteAutenticado | null;
  cargando: boolean;
  cargandoAutenticacion: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  autenticado: boolean;
}

const initialState: EstadoAutenticacion = {
  usuario: null,
  cargando: false,
  cargandoAutenticacion: true,
  error: null,
  token: null,
  refreshToken: null,
  autenticado: false
};

const repoCliente = new RepoClienteHttp();

export const verificarSesion = createAsyncThunk(
  "autenticacion/verificarSesion",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Iniciando verificación de sesión...");
      const sesionActiva = await authService.verificarSesion();
      console.log("📊 Redux: Resultado de verificación de sesión:", sesionActiva);
      return { sesionActiva };
    } catch (error: any) {
      console.error("❌ Redux: Error en verificación de sesión:", error);
      return { sesionActiva: false };
    }
  }
);

type ResultadoRegistro = {
  id?: number;
  respuestaLogin?: RespuestaAutenticacion;
  exitoso: boolean;
};

export const registrarCliente = createAsyncThunk(
  "autenticacion/registrar",
  async (cliente: NuevoClienteRequest, { dispatch }): Promise<ResultadoRegistro> => {
    try {
      const idCliente = await repoCliente.registrar(cliente);
      
      if (idCliente) {
        try {
          const credenciales: LoginClienteRequest = {
            correo: cliente.correo,
            contrasena: cliente.contrasena,
            recordarme: false
          };
          
          const respuestaLogin = await repoCliente.autenticar(credenciales);
          
          // ⭐ NUEVO: Configurar renovación automática después del registro
          authService.configurarRenovacionToken();
          
          return { 
            id: idCliente, 
            respuestaLogin, 
            exitoso: true 
          };
        } catch (error) {
          console.error("Registro exitoso pero error al iniciar sesión automáticamente:", error);
          return { 
            id: idCliente, 
            exitoso: true 
          };
        }
      }
      
      return { exitoso: false };
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error;
    }
  }
);

export const iniciarSesion = createAsyncThunk(
  "autenticacion/iniciarSesion",
  async (credenciales: LoginClienteRequest) => {
    const respuesta = await repoCliente.autenticar(credenciales);
    
    // ⭐ NUEVO: Configurar renovación automática después del login
    authService.configurarRenovacionToken();
    
    return respuesta;
  }
);

export const cerrarSesion = createAsyncThunk(
  "autenticacion/cerrarSesion",
  async () => {
    // ⭐ NUEVO: Detener renovación automática ANTES de cerrar sesión
    authService.detenerRenovacionToken();
    
    await repoCliente.cerrarSesion();
  }
);

export const refrescarToken = createAsyncThunk(
  "autenticacion/refrescarToken",
  async (refreshToken: string | undefined) => {
    return await repoCliente.refrescarToken(refreshToken);
  }
);

export const actualizarCliente = createAsyncThunk(
  "autenticacion/actualizarCliente",
  async ({ id, datos }: { id: number; datos: ActualizarClienteRequest }, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Actualizando cliente", { id, datos });
      
      await repoCliente.actualizar(id, datos);
      const clienteActualizado = await repoCliente.obtenerPorId(id);
      
      console.log("✅ Redux: Cliente actualizado exitosamente", clienteActualizado);
      return clienteActualizado;
    } catch (error: any) {
      console.error("❌ Redux: Error al actualizar cliente:", error);
      return rejectWithValue(error.message || "Error al actualizar datos del cliente");
    }
  }
);

export const cambiarContrasena = createAsyncThunk(
  "autenticacion/cambiarContrasena",
  async ({ id, datos }: { id: number; datos: CambiarContrasenaRequest }, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Cambiando contraseña para cliente ID:", id);
      
      await repoCliente.cambiarContrasena(id, datos);
      
      console.log("✅ Redux: Contraseña cambiada exitosamente");
      return true;
    } catch (error: any) {
      console.error("❌ Redux: Error al cambiar contraseña:", error);
      return rejectWithValue(error.message || "Error al cambiar contraseña");
    }
  }
);

const autenticacionSlice = createSlice({
  name: "autenticacion",
  initialState,
  reducers: {
    establecerUsuario: (state, action: PayloadAction<ClienteAutenticado | null>) => {
      state.usuario = action.payload;
      state.autenticado = !!action.payload;
    },
    establecerToken: (state, action: PayloadAction<string | null>) => {
      state.token = action.payload;
    },
    establecerRefreshToken: (state, action: PayloadAction<string | null>) => {
      state.refreshToken = action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
    finalizarCargaAutenticacion: (state) => {
      state.cargandoAutenticacion = false;
    },
    // ⭐ NUEVO: Action para limpiar completamente el estado
    limpiarEstadoAutenticacion: (state) => {
      console.log("🧹 Redux: Limpiando estado de autenticación");
      state.usuario = null;
      state.token = null;
      state.refreshToken = null;
      state.autenticado = false;
      state.error = null;
      state.cargando = false;
      state.cargandoAutenticacion = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Verificar sesión
      .addCase(verificarSesion.pending, (state) => {
        console.log("⏳ Redux: Verificando sesión...");
        state.cargandoAutenticacion = true;
      })
      .addCase(verificarSesion.fulfilled, (state, action) => {
        console.log("✅ Redux: Verificación de sesión completada:", action.payload);
        state.cargandoAutenticacion = false;
      })
      .addCase(verificarSesion.rejected, (state, action) => {
        console.log("❌ Redux: Verificación de sesión falló:", action.error);
        state.cargandoAutenticacion = false;
      })
      
      // Registrar cliente
      .addCase(registrarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(registrarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        if (action.payload.respuestaLogin) {
          state.usuario = action.payload.respuestaLogin.usuario;
          state.token = action.payload.respuestaLogin.token || null;
          state.refreshToken = action.payload.respuestaLogin.refresh_token || null;
          state.autenticado = true;
        }
      })
      .addCase(registrarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.error = action.error.message || "Error al registrar cliente";
      })
      
      // Iniciar sesión
      .addCase(iniciarSesion.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.error = action.error.message || "Error al iniciar sesión";
      })
      
      // ⭐ CORREGIDO: Cerrar sesión
      .addCase(cerrarSesion.pending, (state) => {
        console.log("⏳ Redux: Cerrando sesión...");
        state.cargando = true;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        console.log("✅ Redux: Sesión cerrada exitosamente - Limpiando estado");
        
        // Limpiar estado completamente
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
        state.error = null;
      })
      .addCase(cerrarSesion.rejected, (state) => {
        console.log("⚠️ Redux: Error al cerrar sesión - Limpiando estado de todas formas");
        
        // Incluso si falla, limpiar estado completamente
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      
      // Refrescar token
      .addCase(refrescarToken.pending, (state) => {
        state.cargando = true;
      })
      .addCase(refrescarToken.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(refrescarToken.rejected, (state) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      
      // Actualizar cliente
      .addCase(actualizarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(actualizarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        if (action.payload) {
          const clienteActualizado = action.payload;
          state.usuario = {
            ...state.usuario!,
            ...clienteActualizado,
            nombre_completo: `${clienteActualizado.nombres} ${clienteActualizado.apellidos}`
          };
        }
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string || "Error al actualizar datos del cliente";
      })
      
      // Cambiar contraseña
      .addCase(cambiarContrasena.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cambiarContrasena.fulfilled, (state) => {
        state.cargando = false;
      })
      .addCase(cambiarContrasena.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string || "Error al cambiar contraseña";
      });
  }
});

export const { 
  establecerUsuario, 
  establecerToken, 
  establecerRefreshToken, 
  limpiarError,
  finalizarCargaAutenticacion,
  limpiarEstadoAutenticacion
} = autenticacionSlice.actions;

export default autenticacionSlice.reducer;*/

import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { 
  ActualizarClienteRequest, 
  CambiarContrasenaRequest, 
  ClienteAutenticado, 
  LoginClienteRequest, 
  NuevoClienteRequest, 
  RespuestaAutenticacion 
} from "../../../dominio/entidades/Cliente";
import { RepoClienteHttp } from "../../repositorios/RepoClienteHttp";
import { authService } from "../../servicios/AuthService";

export interface EstadoAutenticacion {
  usuario: ClienteAutenticado | null;
  cargando: boolean;
  cargandoAutenticacion: boolean;
  error: string | null;
  autenticado: boolean;
}

const initialState: EstadoAutenticacion = {
  usuario: null,
  cargando: false,
  cargandoAutenticacion: true,
  error: null,
  autenticado: false
};

const repoCliente = new RepoClienteHttp();

export const verificarSesion = createAsyncThunk(
  "autenticacion/verificarSesion",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Iniciando verificación de sesión...");
      const sesionActiva = await authService.verificarSesion();
      console.log("📊 Redux: Resultado de verificación de sesión:", sesionActiva);
      return { sesionActiva };
    } catch (error: any) {
      console.error("❌ Redux: Error en verificación de sesión:", error);
      return { sesionActiva: false };
    }
  }
);

type ResultadoRegistro = {
  id?: number;
  respuestaLogin?: RespuestaAutenticacion;
  exitoso: boolean;
};

export const registrarCliente = createAsyncThunk(
  "autenticacion/registrar",
  async (cliente: NuevoClienteRequest, { dispatch }): Promise<ResultadoRegistro> => {
    try {
      const idCliente = await repoCliente.registrar(cliente);
      
      if (idCliente) {
        try {
          const credenciales: LoginClienteRequest = {
            correo: cliente.correo,
            contrasena: cliente.contrasena,
            recordarme: false
          };
          
          const respuestaLogin = await repoCliente.autenticar(credenciales);
          
          // ⭐ NUEVO: Configurar renovación automática después del registro
          authService.configurarRenovacionToken();
          
          return { 
            id: idCliente, 
            respuestaLogin, 
            exitoso: true 
          };
        } catch (error) {
          console.error("Registro exitoso pero error al iniciar sesión automáticamente:", error);
          return { 
            id: idCliente, 
            exitoso: true 
          };
        }
      }
      
      return { exitoso: false };
    } catch (error) {
      console.error("Error durante el registro:", error);
      throw error;
    }
  }
);

export const iniciarSesion = createAsyncThunk(
  "autenticacion/iniciarSesion",
  async (credenciales: LoginClienteRequest) => {
    const respuesta = await repoCliente.autenticar(credenciales);
    
    // ⭐ NUEVO: Configurar renovación automática después del login
    authService.configurarRenovacionToken();
    
    return respuesta;
  }
);

export const cerrarSesion = createAsyncThunk(
  "autenticacion/cerrarSesion",
  async () => {
    // ⭐ NUEVO: Detener renovación automática ANTES de cerrar sesión
    authService.detenerRenovacionToken();
    
    await repoCliente.cerrarSesion();
  }
);

// Ya no necesitamos refrescarToken manual porque se hace automáticamente con cookies HttpOnly
// export const refrescarToken = ...

export const actualizarCliente = createAsyncThunk(
  "autenticacion/actualizarCliente",
  async ({ id, datos }: { id: number; datos: ActualizarClienteRequest }, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Actualizando cliente", { id, datos });
      
      await repoCliente.actualizar(id, datos);
      const clienteActualizado = await repoCliente.obtenerPorId(id);
      
      console.log("✅ Redux: Cliente actualizado exitosamente", clienteActualizado);
      return clienteActualizado;
    } catch (error: any) {
      console.error("❌ Redux: Error al actualizar cliente:", error);
      return rejectWithValue(error.message || "Error al actualizar datos del cliente");
    }
  }
);

export const cambiarContrasena = createAsyncThunk(
  "autenticacion/cambiarContrasena",
  async ({ id, datos }: { id: number; datos: CambiarContrasenaRequest }, { rejectWithValue }) => {
    try {
      console.log("🔄 Redux: Cambiando contraseña para cliente ID:", id);
      
      await repoCliente.cambiarContrasena(id, datos);
      
      console.log("✅ Redux: Contraseña cambiada exitosamente");
      return true;
    } catch (error: any) {
      console.error("❌ Redux: Error al cambiar contraseña:", error);
      return rejectWithValue(error.message || "Error al cambiar contraseña");
    }
  }
);

const autenticacionSlice = createSlice({
  name: "autenticacion",
  initialState,
  reducers: {
    establecerUsuario: (state, action: PayloadAction<ClienteAutenticado | null>) => {
      state.usuario = action.payload;
      state.autenticado = !!action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
    finalizarCargaAutenticacion: (state) => {
      state.cargandoAutenticacion = false;
    },
    // ⭐ NUEVO: Action para limpiar completamente el estado
    limpiarEstadoAutenticacion: (state) => {
      console.log("🧹 Redux: Limpiando estado de autenticación");
      state.usuario = null;
      state.autenticado = false;
      state.error = null;
      state.cargando = false;
      state.cargandoAutenticacion = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Verificar sesión
      .addCase(verificarSesion.pending, (state) => {
        console.log("⏳ Redux: Verificando sesión...");
        state.cargandoAutenticacion = true;
      })
      .addCase(verificarSesion.fulfilled, (state, action) => {
        console.log("✅ Redux: Verificación de sesión completada:", action.payload);
        state.cargandoAutenticacion = false;
      })
      .addCase(verificarSesion.rejected, (state, action) => {
        console.log("❌ Redux: Verificación de sesión falló:", action.error);
        state.cargandoAutenticacion = false;
      })
      
      // Registrar cliente
      .addCase(registrarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(registrarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        if (action.payload.respuestaLogin?.usuario) {
          state.usuario = action.payload.respuestaLogin.usuario;
          state.autenticado = true;
        }
      })
      .addCase(registrarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.error = action.error.message || "Error al registrar cliente";
      })
      
      // Iniciar sesión
      .addCase(iniciarSesion.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = action.payload.usuario;
        state.autenticado = true;
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.error = action.error.message || "Error al iniciar sesión";
      })
      
      // ⭐ CORREGIDO: Cerrar sesión
      .addCase(cerrarSesion.pending, (state) => {
        console.log("⏳ Redux: Cerrando sesión...");
        state.cargando = true;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        console.log("✅ Redux: Sesión cerrada exitosamente - Limpiando estado");
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.autenticado = false;
        state.error = null;
      })
      .addCase(cerrarSesion.rejected, (state) => {
        console.log("⚠️ Redux: Error al cerrar sesión - Limpiando estado de todas formas");
        state.cargando = false;
        state.cargandoAutenticacion = false;
        state.usuario = null;
        state.autenticado = false;
      })
      
      // Actualizar cliente
      .addCase(actualizarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(actualizarCliente.fulfilled, (state, action) => {
        state.cargando = false;
        if (action.payload && state.usuario) {
          const clienteActualizado = action.payload;
          state.usuario = {
            ...state.usuario,
            ...clienteActualizado,
            nombre_completo: `${clienteActualizado.nombres || ''} ${clienteActualizado.apellidos || ''}`.trim()
          };
        }
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string || "Error al actualizar datos del cliente";
      })
      
      // Cambiar contraseña
      .addCase(cambiarContrasena.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(cambiarContrasena.fulfilled, (state) => {
        state.cargando = false;
      })
      .addCase(cambiarContrasena.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string || "Error al cambiar contraseña";
      });
  }
});

export const { 
  establecerUsuario, 
  limpiarError,
  finalizarCargaAutenticacion,
  limpiarEstadoAutenticacion
} = autenticacionSlice.actions;

export default autenticacionSlice.reducer;