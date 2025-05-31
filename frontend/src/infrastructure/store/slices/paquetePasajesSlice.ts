import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { PaquetePasajes, NuevoPaquetePasajesRequest, ActualizarPaquetePasajesRequest } from '../../../domain/entities/PaquetePasajes';
import { PaquetePasajesRepoHttp } from '../../repositories/PaquetePasajesRepoHttp';
import { ListarPaquetesPasajes } from '../../../application/use-cases/paquetePasajes/ListarPaquetesPasajes';
import { ObtenerPaquetePasajesPorId } from '../../../application/use-cases/paquetePasajes/ObtenerPaquetePasajesPorId';
import { CrearPaquetePasajes } from '../../../application/use-cases/paquetePasajes/CrearPaquetePasajes';
import { ActualizarPaquetePasajes } from '../../../application/use-cases/paquetePasajes/ActualizarPaquetePasajes';
import { EliminarPaquetePasajes } from '../../../application/use-cases/paquetePasajes/EliminarPaquetePasajes';
import axios, { AxiosError } from 'axios';

const repository = new PaquetePasajesRepoHttp();
const listarPaquetesPasajes = new ListarPaquetesPasajes(repository);
const obtenerPaquetePasajesPorId = new ObtenerPaquetePasajesPorId(repository);
const crearPaquetePasajes = new CrearPaquetePasajes(repository);
const actualizarPaquetePasajes = new ActualizarPaquetePasajes(repository);
const eliminarPaquetePasajes = new EliminarPaquetePasajes(repository);

// Función auxiliar para extraer el mensaje de error
const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
  }
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
};

// Exportar la interfaz de estado
export interface PaquetePasajesState {
  paquetesPasajes: PaquetePasajes[];
  paquetePasajesActual: PaquetePasajes | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaquetePasajesState = {
  paquetesPasajes: [],
  paquetePasajesActual: null,
  loading: false,
  error: null
};

export const fetchPaquetesPasajes = createAsyncThunk(
  'paquetePasajes/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const result = await listarPaquetesPasajes.execute();
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPaquetesPasajesBySede = createAsyncThunk(
  'paquetePasajes/fetchBySede',
  async (idSede: number, { rejectWithValue }) => {
    try {
      const result = await listarPaquetesPasajes.executeBySede(idSede);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPaquetesPasajesByTipoTour = createAsyncThunk(
  'paquetePasajes/fetchByTipoTour',
  async (idTipoTour: number, { rejectWithValue }) => {
    try {
      const result = await listarPaquetesPasajes.executeByTipoTour(idTipoTour);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchPaquetePasajesById = createAsyncThunk(
  'paquetePasajes/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const paquetePasajes = await obtenerPaquetePasajesPorId.execute(id);
      if (!paquetePasajes) {
        return rejectWithValue('Paquete de pasajes no encontrado');
      }
      return paquetePasajes;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createPaquetePasajes = createAsyncThunk(
  'paquetePasajes/create',
  async (paquetePasajes: NuevoPaquetePasajesRequest, { rejectWithValue }) => {
    try {
      return await crearPaquetePasajes.execute(paquetePasajes);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updatePaquetePasajes = createAsyncThunk(
  'paquetePasajes/update',
  async ({ id, paquetePasajes }: { id: number; paquetePasajes: ActualizarPaquetePasajesRequest }, { rejectWithValue }) => {
    try {
      await actualizarPaquetePasajes.execute(id, paquetePasajes);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deletePaquetePasajes = createAsyncThunk(
  'paquetePasajes/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await eliminarPaquetePasajes.execute(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const paquetePasajesSlice = createSlice({
  name: 'paquetePasajes',
  initialState,
  reducers: {
    clearPaquetePasajesActual: (state) => {
      state.paquetePasajesActual = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    ensurePaquetesPasajesArray: (state) => {
      if (!Array.isArray(state.paquetesPasajes)) {
        state.paquetesPasajes = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchPaquetesPasajes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaquetesPasajes.fulfilled, (state, action: PayloadAction<PaquetePasajes[]>) => {
        state.loading = false;
        state.paquetesPasajes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPaquetesPasajes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar paquetes de pasajes';
        state.paquetesPasajes = [];
      })
      
      // Fetch By Sede
      .addCase(fetchPaquetesPasajesBySede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaquetesPasajesBySede.fulfilled, (state, action: PayloadAction<PaquetePasajes[]>) => {
        state.loading = false;
        state.paquetesPasajes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPaquetesPasajesBySede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar paquetes de pasajes por sede';
        state.paquetesPasajes = [];
      })
      
      // Fetch By Tipo Tour
      .addCase(fetchPaquetesPasajesByTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaquetesPasajesByTipoTour.fulfilled, (state, action: PayloadAction<PaquetePasajes[]>) => {
        state.loading = false;
        state.paquetesPasajes = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchPaquetesPasajesByTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar paquetes de pasajes por tipo de tour';
        state.paquetesPasajes = [];
      })
      
      // Fetch By Id
      .addCase(fetchPaquetePasajesById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPaquetePasajesById.fulfilled, (state, action: PayloadAction<PaquetePasajes>) => {
        state.loading = false;
        state.paquetePasajesActual = action.payload;
      })
      .addCase(fetchPaquetePasajesById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar paquete de pasajes';
      })
      
      // Create
      .addCase(createPaquetePasajes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaquetePasajes.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'object') {
          if (Array.isArray(state.paquetesPasajes)) {
            state.paquetesPasajes.push(action.payload as PaquetePasajes);
          } else {
            state.paquetesPasajes = [action.payload as PaquetePasajes];
          }
        }
      })
      .addCase(createPaquetePasajes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al crear paquete de pasajes';
      })
      
      // Update
      .addCase(updatePaquetePasajes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePaquetePasajes.fulfilled, (state, action) => {
        state.loading = false;
        // Necesitaríamos obtener el objeto actualizado para actualizar correctamente el estado
      })
      .addCase(updatePaquetePasajes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al actualizar paquete de pasajes';
      })
      
      // Delete
      .addCase(deletePaquetePasajes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePaquetePasajes.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        if (Array.isArray(state.paquetesPasajes)) {
          state.paquetesPasajes = state.paquetesPasajes.filter(
            (paquetePasajes) => paquetePasajes.id_paquete !== action.payload
          );
        }
        if (state.paquetePasajesActual?.id_paquete === action.payload) {
          state.paquetePasajesActual = null;
        }
      })
      .addCase(deletePaquetePasajes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al eliminar paquete de pasajes';
      });
  }
});

export const { clearPaquetePasajesActual, clearError, ensurePaquetesPasajesArray } = paquetePasajesSlice.actions;
export default paquetePasajesSlice.reducer;