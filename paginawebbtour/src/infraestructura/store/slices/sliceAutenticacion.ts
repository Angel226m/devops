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
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  autenticado: boolean;
}

const initialState: EstadoAutenticacion = {
  usuario: null,
  cargando: false,
  error: null,
  token: null,
  refreshToken: null,
  autenticado: false
};

const repoCliente = new RepoClienteHttp();

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
    }
  },
  extraReducers: (builder) => {
    builder
      // Registrar cliente
      .addCase(registrarCliente.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(registrarCliente.fulfilled, (state, action) => {
        state.cargando = false;
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
        state.error = action.error.message || "Error al registrar cliente";
      })
      
      // Iniciar sesión
      .addCase(iniciarSesion.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(iniciarSesion.fulfilled, (state, action) => {
        state.cargando = false;
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(iniciarSesion.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al iniciar sesión";
      })
      
      // Cerrar sesión
      .addCase(cerrarSesion.pending, (state) => {
        state.cargando = true;
      })
      .addCase(cerrarSesion.fulfilled, (state) => {
        state.cargando = false;
        state.usuario = null;
        state.token = null;
        state.refreshToken = null;
        state.autenticado = false;
      })
      .addCase(cerrarSesion.rejected, (state) => {
        // Incluso si hay error, cerramos sesión en el frontend
        state.cargando = false;
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
        state.usuario = action.payload.usuario;
        state.token = action.payload.token || null;
        state.refreshToken = action.payload.refresh_token || null;
        state.autenticado = true;
      })
      .addCase(refrescarToken.rejected, (state) => {
        // Si falla el refresh, cerramos sesión
        state.cargando = false;
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

export const { establecerUsuario, establecerToken, establecerRefreshToken, limpiarError } = autenticacionSlice.actions;
export default autenticacionSlice.reducer;