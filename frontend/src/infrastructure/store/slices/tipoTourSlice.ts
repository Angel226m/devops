import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TipoTourRepoHttp } from '../../repositories/TipoTourRepoHttp';
import { 
  TipoTour, 
  NuevoTipoTourRequest, 
  ActualizarTipoTourRequest 
} from '../../../domain/entities/TipoTour';

// Exportar la definición del estado
export interface TipoTourState {
  tiposTour: TipoTour[];
  tipoTourActual: TipoTour | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: TipoTourState = {
  tiposTour: [],
  tipoTourActual: null,
  loading: false,
  error: null,
  success: false,
};

const repository = new TipoTourRepoHttp();

// Thunks
export const fetchTiposTour = createAsyncThunk(
  'tipoTour/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await repository.findAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tipos de tour');
    }
  }
);

export const fetchTipoTourPorId = createAsyncThunk(
  'tipoTour/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await repository.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el tipo de tour');
    }
  }
);

export const fetchTiposTourPorSede = createAsyncThunk(
  'tipoTour/fetchBySede',
  async (idSede: number, { rejectWithValue }) => {
    try {
      return await repository.findBySede(idSede);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tipos de tour por sede');
    }
  }
);

export const fetchTiposTourPorIdioma = createAsyncThunk(
  'tipoTour/fetchByIdioma',
  async (idIdioma: number, { rejectWithValue }) => {
    try {
      return await repository.findByIdioma(idIdioma);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tipos de tour por idioma');
    }
  }
);

export const crearTipoTour = createAsyncThunk(
  'tipoTour/create',
  async (tipoTour: NuevoTipoTourRequest, { rejectWithValue }) => {
    try {
      const id = await repository.create(tipoTour);
      const nuevoTipoTour = await repository.findById(id);
      return nuevoTipoTour;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear el tipo de tour');
    }
  }
);

export const actualizarTipoTour = createAsyncThunk(
  'tipoTour/update',
  async ({ id, tipoTour }: { id: number, tipoTour: ActualizarTipoTourRequest }, { rejectWithValue }) => {
    try {
      await repository.update(id, tipoTour);
      const tipoTourActualizado = await repository.findById(id);
      return tipoTourActualizado;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el tipo de tour');
    }
  }
);

export const eliminarTipoTour = createAsyncThunk(
  'tipoTour/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await repository.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar el tipo de tour');
    }
  }
);

const tipoTourSlice = createSlice({
  name: 'tipoTour',
  initialState,
  reducers: {
    clearTipoTourActual: (state) => {
      state.tipoTourActual = null;
    },
    clearErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    setTipoTourActual: (state, action: PayloadAction<TipoTour>) => {
      state.tipoTourActual = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTiposTour
      .addCase(fetchTiposTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposTour = action.payload;
      })
      .addCase(fetchTiposTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchTipoTourPorId
      .addCase(fetchTipoTourPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTipoTourPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.tipoTourActual = action.payload;
      })
      .addCase(fetchTipoTourPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchTiposTourPorSede
      .addCase(fetchTiposTourPorSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposTourPorSede.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposTour = action.payload;
      })
      .addCase(fetchTiposTourPorSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchTiposTourPorIdioma
      .addCase(fetchTiposTourPorIdioma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTiposTourPorIdioma.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposTour = action.payload;
      })
      .addCase(fetchTiposTourPorIdioma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // crearTipoTour
      .addCase(crearTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearTipoTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposTour.push(action.payload);
        state.tipoTourActual = action.payload;
        state.success = true;
      })
      .addCase(crearTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // actualizarTipoTour
      .addCase(actualizarTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarTipoTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposTour = state.tiposTour.map(tour => 
          tour.id_tipo_tour === action.payload.id_tipo_tour ? action.payload : tour
        );
        state.tipoTourActual = action.payload;
        state.success = true;
      })
      .addCase(actualizarTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // eliminarTipoTour
      .addCase(eliminarTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(eliminarTipoTour.fulfilled, (state, action) => {
        state.loading = false;
        state.tiposTour = state.tiposTour.filter(tour => tour.id_tipo_tour !== action.payload);
        if (state.tipoTourActual && state.tipoTourActual.id_tipo_tour === action.payload) {
          state.tipoTourActual = null;
        }
        state.success = true;
      })
      .addCase(eliminarTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  }
});

export const { clearTipoTourActual, clearErrors, setTipoTourActual } = tipoTourSlice.actions;

export default tipoTourSlice.reducer;