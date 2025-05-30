import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TipoTour, TipoTourCreacion, TipoTourActualizacion } from '../../../domain/entities/TipoTour';
import { TipoTourRepoHttp } from '../../repositories/TipoTourRepoHttp';
import axios, { AxiosError } from 'axios';

const tipoTourRepo = new TipoTourRepoHttp();

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
export const fetchTiposTour = createAsyncThunk(
  'tiposTour/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await tipoTourRepo.listar();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTiposTourPorSede = createAsyncThunk(
  'tiposTour/fetchBySede',
  async (idSede: number, { rejectWithValue }) => {
    try {
      return await tipoTourRepo.listarPorSede(idSede);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTiposTourPorIdioma = createAsyncThunk(
  'tiposTour/fetchByIdioma',
  async (idIdioma: number, { rejectWithValue }) => {
    try {
      return await tipoTourRepo.listarPorIdioma(idIdioma);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTipoTourPorId = createAsyncThunk(
  'tiposTour/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const tipoTour = await tipoTourRepo.obtenerPorId(id);
      if (!tipoTour) {
        return rejectWithValue('Tipo de tour no encontrado');
      }
      return tipoTour;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createTipoTour = createAsyncThunk(
  'tiposTour/create',
  async (tipoTour: TipoTourCreacion, { rejectWithValue }) => {
    try {
      return await tipoTourRepo.crear(tipoTour);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateTipoTour = createAsyncThunk(
  'tiposTour/update',
  async ({ id, tipoTour }: { id: number; tipoTour: TipoTourActualizacion }, { rejectWithValue }) => {
    try {
      return await tipoTourRepo.actualizar(id, tipoTour);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteTipoTour = createAsyncThunk(
  'tiposTour/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await tipoTourRepo.eliminar(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Definición del estado
export interface TipoTourState {
  tiposTour: TipoTour[];
  tipoTourSeleccionado: TipoTour | null;
  loading: boolean;
  error: string | null;
}

const initialState: TipoTourState = {
  tiposTour: [],
  tipoTourSeleccionado: null,
  loading: false,
  error: null,
};

const tipoTourSlice = createSlice({
  name: 'tipoTour',
  initialState,
  reducers: {
    resetTipoTourSeleccionado: (state) => {
      state.tipoTourSeleccionado = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchTiposTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposTour.fulfilled, (state, action: PayloadAction<TipoTour[]>) => {
        state.tiposTour = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchTiposTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by Sede
      .addCase(fetchTiposTourPorSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposTourPorSede.fulfilled, (state, action: PayloadAction<TipoTour[]>) => {
        state.tiposTour = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchTiposTourPorSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by Idioma
      .addCase(fetchTiposTourPorIdioma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposTourPorIdioma.fulfilled, (state, action: PayloadAction<TipoTour[]>) => {
        state.tiposTour = action.payload || [];
        state.loading = false;
      })
      .addCase(fetchTiposTourPorIdioma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by ID
      .addCase(fetchTipoTourPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipoTourPorId.fulfilled, (state, action: PayloadAction<TipoTour>) => {
        state.tipoTourSeleccionado = action.payload;
        state.loading = false;
      })
      .addCase(fetchTipoTourPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Create
      .addCase(createTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTipoTour.fulfilled, (state, action: PayloadAction<TipoTour>) => {
        if (action.payload) {
          // Asegurarse de que tiposTour sea un array antes de usar push
          if (!Array.isArray(state.tiposTour)) {
            state.tiposTour = [];
          }
          state.tiposTour = [...state.tiposTour, action.payload];
        }
        state.loading = false;
      })
      .addCase(createTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Update
      .addCase(updateTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTipoTour.fulfilled, (state, action: PayloadAction<TipoTour>) => {
        if (action.payload && action.payload.id_tipo_tour !== undefined) {
          // Asegurarse de que tiposTour sea un array antes de buscar y modificar
          if (Array.isArray(state.tiposTour)) {
            const index = state.tiposTour.findIndex(t => 
              t && t.id_tipo_tour !== undefined && t.id_tipo_tour === action.payload.id_tipo_tour
            );
            
            if (index !== -1) {
              state.tiposTour[index] = action.payload;
            }
          }
          state.tipoTourSeleccionado = action.payload;
        }
        state.loading = false;
      })
      .addCase(updateTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Delete
      .addCase(deleteTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTipoTour.fulfilled, (state, action: PayloadAction<number>) => {
        if (action.payload !== undefined) {
          // Asegurarse de que tiposTour sea un array antes de filtrar
          if (Array.isArray(state.tiposTour)) {
            state.tiposTour = state.tiposTour.filter(t => 
              t && t.id_tipo_tour !== undefined && t.id_tipo_tour !== action.payload
            );
          }
          
          if (state.tipoTourSeleccionado && 
              state.tipoTourSeleccionado.id_tipo_tour !== undefined && 
              state.tipoTourSeleccionado.id_tipo_tour === action.payload) {
            state.tipoTourSeleccionado = null;
          }
        }
        state.loading = false;
      })
      .addCase(deleteTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

export const { resetTipoTourSeleccionado, clearError } = tipoTourSlice.actions;
export default tipoTourSlice.reducer;