import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { DashboardRepoHttp } from '../../repositories/DashboardRepoHttp';
import { 
  DashboardMetricas, 
  ResumenGeneral, 
  VentasMensuales, 
  EstadisticasSede 
} from '../../../domain/entities/Dashboard';

const dashboardRepo = new DashboardRepoHttp();

// Async thunks
export const fetchMetricasCompletas = createAsyncThunk(
  'dashboard/fetchMetricasCompletas',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardRepo.getMetricasCompletas();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar métricas del dashboard');
    }
  }
);

export const fetchResumenGeneral = createAsyncThunk(
  'dashboard/fetchResumenGeneral',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardRepo.getResumenGeneral();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar resumen general');
    }
  }
);

export const fetchVentasPorMes = createAsyncThunk(
  'dashboard/fetchVentasPorMes',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardRepo.getVentasPorMes();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar ventas por mes');
    }
  }
);

export const fetchEstadisticasSedes = createAsyncThunk(
  'dashboard/fetchEstadisticasSedes',
  async (_, { rejectWithValue }) => {
    try {
      return await dashboardRepo.getEstadisticasSedes();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar estadísticas de sedes');
    }
  }
);

export interface DashboardState {
  metricas: DashboardMetricas | null;
  resumenGeneral: ResumenGeneral | null;
  ventasPorMes: VentasMensuales[];
  estadisticasSedes: EstadisticasSede[];
  loading: boolean;
  loadingResumen: boolean;
  loadingVentas: boolean;
  loadingSedes: boolean;
  error: string | null;
  success: boolean;
}

const initialState: DashboardState = {
  metricas: null,
  resumenGeneral: null,
  ventasPorMes: [],
  estadisticasSedes: [],
  loading: false,
  loadingResumen: false,
  loadingVentas: false,
  loadingSedes: false,
  error: null,
  success: false
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    resetDashboard: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch métricas completas
      .addCase(fetchMetricasCompletas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMetricasCompletas.fulfilled, (state, action) => {
        state.loading = false;
        state.metricas = action.payload;
        state.resumenGeneral = action.payload.resumen_general;
        state.ventasPorMes = action.payload.ventas_por_mes;
        if (action.payload.estadisticas_sedes) {
          state.estadisticasSedes = action.payload.estadisticas_sedes;
        }
        state.success = true;
      })
      .addCase(fetchMetricasCompletas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch resumen general
      .addCase(fetchResumenGeneral.pending, (state) => {
        state.loadingResumen = true;
        state.error = null;
      })
      .addCase(fetchResumenGeneral.fulfilled, (state, action) => {
        state.loadingResumen = false;
        state.resumenGeneral = action.payload;
        state.success = true;
      })
      .addCase(fetchResumenGeneral.rejected, (state, action) => {
        state.loadingResumen = false;
        state.error = action.payload as string;
      })
      
      // Fetch ventas por mes
      .addCase(fetchVentasPorMes.pending, (state) => {
        state.loadingVentas = true;
        state.error = null;
      })
      .addCase(fetchVentasPorMes.fulfilled, (state, action) => {
        state.loadingVentas = false;
        state.ventasPorMes = action.payload;
        state.success = true;
      })
      .addCase(fetchVentasPorMes.rejected, (state, action) => {
        state.loadingVentas = false;
        state.error = action.payload as string;
      })
      
      // Fetch estadísticas de sedes
      .addCase(fetchEstadisticasSedes.pending, (state) => {
        state.loadingSedes = true;
        state.error = null;
      })
      .addCase(fetchEstadisticasSedes.fulfilled, (state, action) => {
        state.loadingSedes = false;
        state.estadisticasSedes = action.payload;
        state.success = true;
      })
      .addCase(fetchEstadisticasSedes.rejected, (state, action) => {
        state.loadingSedes = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearErrors, resetDashboard } = dashboardSlice.actions;
export default dashboardSlice.reducer;