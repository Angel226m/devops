import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TipoPasaje, NuevoTipoPasajeRequest, ActualizarTipoPasajeRequest } from '../../../domain/entities/TipoPasaje';
import { TipoPasajeRepoHttp } from '../../repositories/TipoPasajeRepoHttp';
import { ListarTiposPasaje } from '../../../application/use-cases/tipoPasaje/ListarTiposPasaje';
import { ObtenerTipoPasajePorId } from '../../../application/use-cases/tipoPasaje/ObtenerTipoPasajePorId';
import { CrearTipoPasaje } from '../../../application/use-cases/tipoPasaje/CrearTipoPasaje';
import { ActualizarTipoPasaje } from '../../../application/use-cases/tipoPasaje/ActualizarTipoPasaje';
import { EliminarTipoPasaje } from '../../../application/use-cases/tipoPasaje/EliminarTipoPasaje';
import axios, { AxiosError } from 'axios';

const repository = new TipoPasajeRepoHttp();
const listarTiposPasaje = new ListarTiposPasaje(repository);
const obtenerTipoPasajePorId = new ObtenerTipoPasajePorId(repository);
const crearTipoPasaje = new CrearTipoPasaje(repository);
const actualizarTipoPasaje = new ActualizarTipoPasaje(repository);
const eliminarTipoPasaje = new EliminarTipoPasaje(repository);

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
export interface TipoPasajeState {
  tiposPasaje: TipoPasaje[];
  tipoPasajeActual: TipoPasaje | null;
  loading: boolean;
  error: string | null;
}

const initialState: TipoPasajeState = {
  tiposPasaje: [],
  tipoPasajeActual: null,
  loading: false,
  error: null
};

export const fetchTiposPasaje = createAsyncThunk(
  'tipoPasaje/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const result = await listarTiposPasaje.execute();
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTiposPasajeBySede = createAsyncThunk(
  'tipoPasaje/fetchBySede',
  async (idSede: number, { rejectWithValue }) => {
    try {
      const result = await listarTiposPasaje.executeBySede(idSede);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTiposPasajeByTipoTour = createAsyncThunk(
  'tipoPasaje/fetchByTipoTour',
  async (idTipoTour: number, { rejectWithValue }) => {
    try {
      const result = await listarTiposPasaje.executeByTipoTour(idTipoTour);
      return Array.isArray(result) ? result : [];
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchTipoPasajeById = createAsyncThunk(
  'tipoPasaje/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const tipoPasaje = await obtenerTipoPasajePorId.execute(id);
      if (!tipoPasaje) {
        return rejectWithValue('Tipo de pasaje no encontrado');
      }
      return tipoPasaje;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createTipoPasaje = createAsyncThunk(
  'tipoPasaje/create',
  async (tipoPasaje: NuevoTipoPasajeRequest, { rejectWithValue }) => {
    try {
      return await crearTipoPasaje.execute(tipoPasaje);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateTipoPasaje = createAsyncThunk(
  'tipoPasaje/update',
  async ({ id, tipoPasaje }: { id: number; tipoPasaje: ActualizarTipoPasajeRequest }, { rejectWithValue }) => {
    try {
      await actualizarTipoPasaje.execute(id, tipoPasaje);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteTipoPasaje = createAsyncThunk(
  'tipoPasaje/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await eliminarTipoPasaje.execute(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const tipoPasajeSlice = createSlice({
  name: 'tipoPasaje',
  initialState,
  reducers: {
    clearTipoPasajeActual: (state) => {
      state.tipoPasajeActual = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    ensureTiposPasajeArray: (state) => {
      if (!Array.isArray(state.tiposPasaje)) {
        state.tiposPasaje = [];
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchTiposPasaje.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposPasaje.fulfilled, (state, action: PayloadAction<TipoPasaje[]>) => {
        state.loading = false;
        state.tiposPasaje = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTiposPasaje.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar tipos de pasaje';
        state.tiposPasaje = [];
      })
      
      // Fetch By Sede
      .addCase(fetchTiposPasajeBySede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposPasajeBySede.fulfilled, (state, action: PayloadAction<TipoPasaje[]>) => {
        state.loading = false;
        state.tiposPasaje = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTiposPasajeBySede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar tipos de pasaje por sede';
        state.tiposPasaje = [];
      })
      
      // Fetch By Tipo Tour
      .addCase(fetchTiposPasajeByTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposPasajeByTipoTour.fulfilled, (state, action: PayloadAction<TipoPasaje[]>) => {
        state.loading = false;
        state.tiposPasaje = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchTiposPasajeByTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar tipos de pasaje por tipo de tour';
        state.tiposPasaje = [];
      })
      
      // Fetch By Id
      .addCase(fetchTipoPasajeById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipoPasajeById.fulfilled, (state, action: PayloadAction<TipoPasaje>) => {
        state.loading = false;
        state.tipoPasajeActual = action.payload;
      })
      .addCase(fetchTipoPasajeById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar tipo de pasaje';
      })
      
      // Create
      .addCase(createTipoPasaje.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTipoPasaje.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'object') {
          if (Array.isArray(state.tiposPasaje)) {
            state.tiposPasaje.push(action.payload as TipoPasaje);
          } else {
            state.tiposPasaje = [action.payload as TipoPasaje];
          }
        }
      })
      .addCase(createTipoPasaje.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al crear tipo de pasaje';
      })
      
      // Update
      .addCase(updateTipoPasaje.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTipoPasaje.fulfilled, (state, action) => {
        state.loading = false;
        // Necesitaríamos obtener el objeto actualizado para actualizar correctamente el estado
      })
      .addCase(updateTipoPasaje.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al actualizar tipo de pasaje';
      })
      
      // Delete
      .addCase(deleteTipoPasaje.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTipoPasaje.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        if (Array.isArray(state.tiposPasaje)) {
          state.tiposPasaje = state.tiposPasaje.filter(
            (tipoPasaje) => tipoPasaje.id_tipo_pasaje !== action.payload
          );
        }
        if (state.tipoPasajeActual?.id_tipo_pasaje === action.payload) {
          state.tipoPasajeActual = null;
        }
      })
      .addCase(deleteTipoPasaje.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al eliminar tipo de pasaje';
      });
  }
});

export const { clearTipoPasajeActual, clearError, ensureTiposPasajeArray } = tipoPasajeSlice.actions;
export default tipoPasajeSlice.reducer;