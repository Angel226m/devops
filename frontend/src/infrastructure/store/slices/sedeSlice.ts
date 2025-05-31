 

import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Sede, SedeCreacion, SedeActualizacion } from '../../../domain/entities/Sede';
import { SedeRepoHttp } from '../../repositories/SedeRepoHttp';
import axios, { AxiosError } from 'axios';

// Instancia del repositorio
const sedeRepo = new SedeRepoHttp();

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
export interface SedeState {
  sedes: Sede[];
  sedeSeleccionada: Sede | null;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: SedeState = {
  sedes: [],
  sedeSeleccionada: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchSedes = createAsyncThunk(
  'sede/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const result = await sedeRepo.listar();
      // ✅ Asegurar que siempre retornemos un array
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchSedePorId = createAsyncThunk(
  'sede/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const sede = await sedeRepo.obtenerPorId(id);
      if (!sede) {
        return rejectWithValue('Sede no encontrada');
      }
      return sede;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchSedesPorCiudad = createAsyncThunk(
  'sede/fetchByCiudad',
  async (ciudad: string, { rejectWithValue }) => {
    try {
      const result = await sedeRepo.obtenerPorCiudad(ciudad);
      // ✅ Asegurar que siempre retornemos un array
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createSede = createAsyncThunk(
  'sede/create',
  async (sede: SedeCreacion, { rejectWithValue }) => {
    try {
      return await sedeRepo.crear(sede);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateSede = createAsyncThunk(
  'sede/update',
  async ({ id, sede }: { id: number; sede: SedeActualizacion }, { rejectWithValue }) => {
    try {
      return await sedeRepo.actualizar(id, sede);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteSede = createAsyncThunk(
  'sede/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await sedeRepo.eliminar(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const sedeSlice = createSlice({
  name: 'sede',
  initialState,
  reducers: {
    resetSedeSeleccionada: (state) => {
      state.sedeSeleccionada = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // ✅ Mantener el reducer para asegurar array (por si lo necesitas)
    ensureSedesArray: (state) => {
      if (!Array.isArray(state.sedes)) {
        state.sedes = [];
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchSedes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSedes.fulfilled, (state, action: PayloadAction<Sede[]>) => {
        // ✅ Validación defensiva - asegurar que sea array
        state.sedes = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchSedes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
        // ✅ Mantener array vacío en caso de error
        state.sedes = [];
      })
      
      // Fetch by ID
      .addCase(fetchSedePorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSedePorId.fulfilled, (state, action: PayloadAction<Sede>) => {
        state.sedeSeleccionada = action.payload;
        state.loading = false;
      })
      .addCase(fetchSedePorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Fetch by Ciudad
      .addCase(fetchSedesPorCiudad.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSedesPorCiudad.fulfilled, (state, action: PayloadAction<Sede[]>) => {
        // ✅ Validación defensiva - asegurar que sea array
        state.sedes = Array.isArray(action.payload) ? action.payload : [];
        state.loading = false;
      })
      .addCase(fetchSedesPorCiudad.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
        // ✅ Mantener array vacío en caso de error
        state.sedes = [];
      })
      
      // Create
      .addCase(createSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSede.fulfilled, (state, action: PayloadAction<Sede>) => {
        // ✅ Verificar que sedes sea array antes de push
        if (Array.isArray(state.sedes)) {
          state.sedes.push(action.payload);
        } else {
          state.sedes = [action.payload];
        }
        state.loading = false;
      })
      .addCase(createSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Update
      .addCase(updateSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateSede.fulfilled, (state, action: PayloadAction<Sede>) => {
        // ✅ Verificar que sedes sea array antes de buscar
        if (Array.isArray(state.sedes)) {
          const index = state.sedes.findIndex(s => s.id_sede === action.payload.id_sede);
          if (index !== -1) {
            state.sedes[index] = action.payload;
          }
        }
        state.sedeSeleccionada = action.payload;
        state.loading = false;
      })
      .addCase(updateSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      })
      
      // Delete
      .addCase(deleteSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSede.fulfilled, (state, action: PayloadAction<number>) => {
        // ✅ Verificar que sedes sea array antes de filtrar
        if (Array.isArray(state.sedes)) {
          state.sedes = state.sedes.filter(s => s.id_sede !== action.payload);
        }
        if (state.sedeSeleccionada?.id_sede === action.payload) {
          state.sedeSeleccionada = null;
        }
        state.loading = false;
      })
      .addCase(deleteSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error desconocido';
      });
  },
});

// ✅ Exportar el nuevo reducer también
export const { resetSedeSeleccionada, clearError, ensureSedesArray } = sedeSlice.actions;
export default sedeSlice.reducer;