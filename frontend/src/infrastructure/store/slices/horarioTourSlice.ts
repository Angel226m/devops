import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { HorarioTourRepoHttp } from '../../repositories/HorarioTourRepoHttp';
import { 
  HorarioTour, 
  NuevoHorarioTourRequest, 
  ActualizarHorarioTourRequest 
} from '../../../domain/entities/HorarioTour';

const horarioTourRepo = new HorarioTourRepoHttp();

// Async thunks
export const fetchHorariosTour = createAsyncThunk(
  'horarioTour/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await horarioTourRepo.findAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios de tour');
    }
  }
);

export const fetchHorarioTourPorId = createAsyncThunk(
  'horarioTour/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await horarioTourRepo.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horario de tour');
    }
  }
);

export const fetchHorariosTourPorTipoTour = createAsyncThunk(
  'horarioTour/fetchByTipoTour',
  async (idTipoTour: number, { rejectWithValue }) => {
    try {
      return await horarioTourRepo.findByTipoTour(idTipoTour);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios por tipo de tour');
    }
  }
);

export const fetchHorariosTourPorDia = createAsyncThunk(
  'horarioTour/fetchByDia',
  async (dia: string, { rejectWithValue }) => {
    try {
      return await horarioTourRepo.findByDia(dia);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios por día');
    }
  }
);

export const crearHorarioTour = createAsyncThunk(
  'horarioTour/create',
  async (horarioTour: NuevoHorarioTourRequest, { rejectWithValue }) => {
    try {
      return await horarioTourRepo.create(horarioTour);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear horario de tour');
    }
  }
);

export const actualizarHorarioTour = createAsyncThunk(
  'horarioTour/update',
  async ({ id, horarioTour }: { id: number, horarioTour: ActualizarHorarioTourRequest }, { rejectWithValue }) => {
    try {
      await horarioTourRepo.update(id, horarioTour);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar horario de tour');
    }
  }
);

export const eliminarHorarioTour = createAsyncThunk(
  'horarioTour/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await horarioTourRepo.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar horario de tour');
    }
  }
);

export interface HorarioTourState {
  horariosTour: HorarioTour[];
  horarioTourActual: HorarioTour | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: HorarioTourState = {
  horariosTour: [],
  horarioTourActual: null,
  loading: false,
  error: null,
  success: false
};

export const horarioTourSlice = createSlice({
  name: 'horarioTour',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchHorariosTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosTour.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosTour = action.payload;
      })
      .addCase(fetchHorariosTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by ID
      .addCase(fetchHorarioTourPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorarioTourPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.horarioTourActual = action.payload;
      })
      .addCase(fetchHorarioTourPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Tipo Tour
      .addCase(fetchHorariosTourPorTipoTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosTourPorTipoTour.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosTour = action.payload;
      })
      .addCase(fetchHorariosTourPorTipoTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Día
      .addCase(fetchHorariosTourPorDia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosTourPorDia.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosTour = action.payload;
      })
      .addCase(fetchHorariosTourPorDia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create
      .addCase(crearHorarioTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearHorarioTour.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(crearHorarioTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update
      .addCase(actualizarHorarioTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarHorarioTour.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarHorarioTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Delete
      .addCase(eliminarHorarioTour.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(eliminarHorarioTour.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.horariosTour = state.horariosTour.filter(
          horario => horario.id_horario !== action.payload
        );
      })
      .addCase(eliminarHorarioTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearErrors } = horarioTourSlice.actions;
export default horarioTourSlice.reducer;