 import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Embarcacion, EmbarcacionCreacion, EmbarcacionActualizacion } from '../../../domain/entities/Embarcacion';
import { EmbarcacionRepoHttp } from '../../repositories/EmbarcacionRepoHttp';
import axios, { AxiosError } from 'axios';

const embarcacionRepo = new EmbarcacionRepoHttp();

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

// Thunks
export const fetchEmbarcaciones = createAsyncThunk(
  'embarcaciones/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await embarcacionRepo.listar();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchEmbarcacionesPorSede = createAsyncThunk(
  'embarcaciones/fetchBySede',
  async (idSede: number, { rejectWithValue }) => {
    try {
      return await embarcacionRepo.listarPorSede(idSede);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchEmbarcacionPorId = createAsyncThunk(
  'embarcaciones/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const embarcacion = await embarcacionRepo.obtenerPorId(id);
      if (!embarcacion) {
        return rejectWithValue('Embarcación no encontrada');
      }
      return embarcacion;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createEmbarcacion = createAsyncThunk(
  'embarcaciones/create',
  async (embarcacion: EmbarcacionCreacion, { rejectWithValue }) => {
    try {
      return await embarcacionRepo.crear(embarcacion);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateEmbarcacion = createAsyncThunk(
  'embarcaciones/update',
  async ({ id, embarcacion }: { id: number; embarcacion: EmbarcacionActualizacion }, { rejectWithValue }) => {
    try {
      return await embarcacionRepo.actualizar(id, embarcacion);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteEmbarcacion = createAsyncThunk(
  'embarcaciones/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await embarcacionRepo.eliminar(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Definición del estado
export interface EmbarcacionState {
  embarcaciones: Embarcacion[];
  embarcacionSeleccionada: Embarcacion | null;
  loading: boolean;
  error: string | null;
}

const initialState: EmbarcacionState = {
  embarcaciones: [],
  embarcacionSeleccionada: null,
  loading: false,
  error: null,
};

const embarcacionSlice = createSlice({
  name: 'embarcacion',
  initialState,
  reducers: {
    resetEmbarcacionSeleccionada: (state) => {
      state.embarcacionSeleccionada = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchEmbarcaciones.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmbarcaciones.fulfilled, (state, action: PayloadAction<Embarcacion[]>) => {
        state.embarcaciones = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchEmbarcaciones.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by Sede
      .addCase(fetchEmbarcacionesPorSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmbarcacionesPorSede.fulfilled, (state, action: PayloadAction<Embarcacion[]>) => {
        state.embarcaciones = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchEmbarcacionesPorSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by ID
      .addCase(fetchEmbarcacionPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEmbarcacionPorId.fulfilled, (state, action: PayloadAction<Embarcacion>) => {
        state.embarcacionSeleccionada = action.payload;
        state.loading = false;
      })
      .addCase(fetchEmbarcacionPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Create
      .addCase(createEmbarcacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmbarcacion.fulfilled, (state, action: PayloadAction<Embarcacion>) => {
        if (action.payload) {
          state.embarcaciones.push(action.payload);
        }
        state.loading = false;
      })
      .addCase(createEmbarcacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Update - Corregido para evitar el error de propiedades indefinidas
      .addCase(updateEmbarcacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmbarcacion.fulfilled, (state, action: PayloadAction<Embarcacion>) => {
        if (action.payload && action.payload.id_embarcacion !== undefined) {
          const index = state.embarcaciones.findIndex(e => 
            e && e.id_embarcacion !== undefined && e.id_embarcacion === action.payload.id_embarcacion
          );
          
          if (index !== -1) {
            state.embarcaciones[index] = action.payload;
          }
          state.embarcacionSeleccionada = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateEmbarcacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Delete - Corregido para evitar el error de propiedades indefinidas
      .addCase(deleteEmbarcacion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteEmbarcacion.fulfilled, (state, action: PayloadAction<number>) => {
        if (action.payload !== undefined) {
          state.embarcaciones = state.embarcaciones.filter(e => 
            e && e.id_embarcacion !== undefined && e.id_embarcacion !== action.payload
          );
          
          if (state.embarcacionSeleccionada && 
              state.embarcacionSeleccionada.id_embarcacion !== undefined && 
              state.embarcacionSeleccionada.id_embarcacion === action.payload) {
            state.embarcacionSeleccionada = null;
          }
        }
        state.loading = false;
      })
      .addCase(deleteEmbarcacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

export const { resetEmbarcacionSeleccionada, clearError } = embarcacionSlice.actions;
export default embarcacionSlice.reducer;