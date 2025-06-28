 
// infrastructure/store/slices/pagoSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PagoRepoHttp } from '../../repositories/PagoRepoHttp';
import { 
  Pago, 
  NuevoPagoRequest, 
  ActualizarPagoRequest, 
  CambiarEstadoPagoRequest 
} from '../../../domain/entities/Pago';
import axiosClient from '../../api/axiosClient';
import { RootState } from '..';

const pagoRepo = new PagoRepoHttp(axiosClient);

// Async thunks
export const fetchPagos = createAsyncThunk<
  Pago[],
  void,
  { rejectValue: string }
>(
  'pago/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await pagoRepo.findAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos');
    }
  }
);

export const fetchPagoPorId = createAsyncThunk<
  Pago,
  number,
  { rejectValue: string }
>(
  'pago/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await pagoRepo.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pago');
    }
  }
);

export const fetchPagosPorReserva = createAsyncThunk<
  Pago[],
  number,
  { rejectValue: string }
>(
  'pago/fetchByReserva',
  async (idReserva, { rejectWithValue }) => {
    try {
      return await pagoRepo.findByReserva(idReserva);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos de la reserva');
    }
  }
);

export const fetchTotalPagadoPorReserva = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'pago/fetchTotalByReserva',
  async (idReserva, { rejectWithValue }) => {
    try {
      return await pagoRepo.getTotalPagadoByReserva(idReserva);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar total pagado');
    }
  }
);

export const fetchPagosPorFecha = createAsyncThunk<
  Pago[],
  string,
  { rejectValue: string }
>(
  'pago/fetchByFecha',
  async (fecha, { rejectWithValue }) => {
    try {
      return await pagoRepo.findByFecha(fecha);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos por fecha');
    }
  }
);

export const fetchPagosPorEstado = createAsyncThunk<
  Pago[],
  string,
  { rejectValue: string }
>(
  'pago/fetchByEstado',
  async (estado, { rejectWithValue }) => {
    try {
      return await pagoRepo.findByEstado(estado);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos por estado');
    }
  }
);

export const fetchPagosPorCliente = createAsyncThunk<
  Pago[],
  number,
  { rejectValue: string }
>(
  'pago/fetchByCliente',
  async (idCliente, { rejectWithValue }) => {
    try {
      return await pagoRepo.findByCliente(idCliente);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos por cliente');
    }
  }
);

export const fetchPagosPorSede = createAsyncThunk<
  Pago[],
  number,
  { rejectValue: string }
>(
  'pago/fetchBySede',
  async (idSede, { rejectWithValue }) => {
    try {
      return await pagoRepo.findBySede(idSede);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar pagos por sede');
    }
  }
);

export const crearPago = createAsyncThunk<
  number,
  NuevoPagoRequest,
  { rejectValue: string, state: RootState }
>(
  'pago/create',
  async (pago, { rejectWithValue, getState }) => {
    try {
      // Obtener datos del estado
      const state = getState();
      const selectedSede = state.auth.selectedSede;
      
      // Si el usuario es vendedor y tiene sede asignada, usar esa sede
      // y el canal de pago LOCAL
      const pagoModificado = {
        ...pago,
        canal_pago: pago.canal_pago || 'LOCAL',
        id_sede: pago.id_sede || (selectedSede ? selectedSede.id_sede : null)
      };
      
      return await pagoRepo.create(pagoModificado);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear pago');
    }
  }
);

export const actualizarPago = createAsyncThunk<
  void,
  { id: number, pago: ActualizarPagoRequest },
  { rejectValue: string }
>(
  'pago/update',
  async ({ id, pago }, { rejectWithValue }) => {
    try {
      await pagoRepo.update(id, pago);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar pago');
    }
  }
);

export const cambiarEstadoPago = createAsyncThunk<
  void,
  { id: number, cambioEstado: CambiarEstadoPagoRequest },
  { rejectValue: string }
>(
  'pago/changeStatus',
  async ({ id, cambioEstado }, { rejectWithValue }) => {
    try {
      await pagoRepo.updateEstado(id, cambioEstado);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado del pago');
    }
  }
);

export const eliminarPago = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'pago/delete',
  async (id, { rejectWithValue }) => {
    try {
      await pagoRepo.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar pago');
    }
  }
);

// Define el estado de la slice
export interface PagoState {
  pagos: Pago[];
  pagoActual: Pago | null;
  loading: boolean;
  error: string | null;
  success: boolean;
  totalPagado: number;
}

// Estado inicial
const initialState: PagoState = {
  pagos: [],
  pagoActual: null,
  loading: false,
  error: null,
  success: false,
  totalPagado: 0
};

// Crear slice
export const pagoSlice = createSlice({
  name: 'pago',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    resetPagoActual: (state) => {
      state.pagoActual = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchPagos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagos.fulfilled, (state, action) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by ID
      .addCase(fetchPagoPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagoPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.pagoActual = action.payload;
      })
      .addCase(fetchPagoPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Reserva
      .addCase(fetchPagosPorReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosPorReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagosPorReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch total by Reserva
      .addCase(fetchTotalPagadoPorReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTotalPagadoPorReserva.fulfilled, (state, action) => {
        state.loading = false;
        state.totalPagado = action.payload;
      })
      .addCase(fetchTotalPagadoPorReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Fecha
      .addCase(fetchPagosPorFecha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosPorFecha.fulfilled, (state, action) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagosPorFecha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Estado
      .addCase(fetchPagosPorEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosPorEstado.fulfilled, (state, action) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagosPorEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Cliente
      .addCase(fetchPagosPorCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosPorCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagosPorCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Sede
      .addCase(fetchPagosPorSede.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPagosPorSede.fulfilled, (state, action) => {
        state.loading = false;
        state.pagos = action.payload;
      })
      .addCase(fetchPagosPorSede.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create
      .addCase(crearPago.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearPago.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(crearPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update
      .addCase(actualizarPago.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarPago.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Change Status
      .addCase(cambiarEstadoPago.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cambiarEstadoPago.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(cambiarEstadoPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Delete
      .addCase(eliminarPago.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(eliminarPago.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.pagos = state.pagos.filter(
          pago => pago.id_pago !== action.payload
        );
      })
      .addCase(eliminarPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearErrors, resetPagoActual } = pagoSlice.actions;
export default pagoSlice.reducer;