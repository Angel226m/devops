import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ChoferHorarioRepoHttp } from '../../repositories/ChoferHorarioRepoHttp';
import { 
  ChoferHorario, 
  NuevoChoferHorarioRequest, 
  ActualizarChoferHorarioRequest 
} from '../../../domain/entities/ChoferHorario';

const choferHorarioRepo = new ChoferHorarioRepoHttp();

// Async thunks
export const fetchHorariosChofer = createAsyncThunk(
  'choferHorario/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await choferHorarioRepo.findAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios de chofer');
    }
  }
);

export const fetchChoferHorarioPorId = createAsyncThunk(
  'choferHorario/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await choferHorarioRepo.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horario de chofer');
    }
  }
);

export const fetchHorariosChoferPorChofer = createAsyncThunk(
  'choferHorario/fetchByChofer',
  async (idChofer: number, { rejectWithValue }) => {
    try {
      return await choferHorarioRepo.findByChofer(idChofer);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios por chofer');
    }
  }
);

export const fetchHorariosChoferActivosPorChofer = createAsyncThunk(
  'choferHorario/fetchActiveByChofer',
  async (idChofer: number, { rejectWithValue }) => {
    try {
      return await choferHorarioRepo.findActiveByChofer(idChofer);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios activos por chofer');
    }
  }
);

export const fetchHorariosChoferPorDia = createAsyncThunk(
  'choferHorario/fetchByDia',
  async (dia: string, { rejectWithValue }) => {
    try {
      return await choferHorarioRepo.findByDia(dia);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar horarios por día');
    }
  }
);

export const crearChoferHorario = createAsyncThunk(
  'choferHorario/create',
  async (choferHorario: NuevoChoferHorarioRequest, { rejectWithValue }) => {
    try {
      return await choferHorarioRepo.create(choferHorario);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear horario de chofer');
    }
  }
);

export const actualizarChoferHorario = createAsyncThunk(
  'choferHorario/update',
  async ({ id, choferHorario }: { id: number, choferHorario: ActualizarChoferHorarioRequest }, { rejectWithValue }) => {
    try {
      await choferHorarioRepo.update(id, choferHorario);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar horario de chofer');
    }
  }
);

export const eliminarChoferHorario = createAsyncThunk(
  'choferHorario/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await choferHorarioRepo.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar horario de chofer');
    }
  }
);

export interface ChoferHorarioState {
  horariosChofer: ChoferHorario[];
  horarioChoferActual: ChoferHorario | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ChoferHorarioState = {
  horariosChofer: [],
  horarioChoferActual: null,
  loading: false,
  error: null,
  success: false
};

export const choferHorarioSlice = createSlice({
  name: 'choferHorario',
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
      .addCase(fetchHorariosChofer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosChofer.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosChofer = action.payload;
      })
      .addCase(fetchHorariosChofer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by ID
      .addCase(fetchChoferHorarioPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChoferHorarioPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.horarioChoferActual = action.payload;
      })
      .addCase(fetchChoferHorarioPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Chofer
      .addCase(fetchHorariosChoferPorChofer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosChoferPorChofer.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosChofer = action.payload;
      })
      .addCase(fetchHorariosChoferPorChofer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch active by Chofer
      .addCase(fetchHorariosChoferActivosPorChofer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosChoferActivosPorChofer.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosChofer = action.payload;
      })
      .addCase(fetchHorariosChoferActivosPorChofer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Día
      .addCase(fetchHorariosChoferPorDia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHorariosChoferPorDia.fulfilled, (state, action) => {
        state.loading = false;
        state.horariosChofer = action.payload;
      })
      .addCase(fetchHorariosChoferPorDia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create
      .addCase(crearChoferHorario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearChoferHorario.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(crearChoferHorario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update
      .addCase(actualizarChoferHorario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarChoferHorario.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarChoferHorario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Delete
      .addCase(eliminarChoferHorario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(eliminarChoferHorario.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.horariosChofer = state.horariosChofer.filter(
          horario => horario.id_horario_chofer !== action.payload
        );
      })
      .addCase(eliminarChoferHorario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearErrors } = choferHorarioSlice.actions;
export default choferHorarioSlice.reducer;