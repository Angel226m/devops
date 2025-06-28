 
// infrastructure/store/slices/reservaSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ReservaRepoHttp } from '../../repositories/ReservaRepoHttp';
import { 
  Reserva, 
  NuevaReservaRequest, 
  ActualizarReservaRequest, 
  CambiarEstadoReservaRequest,
  ConfirmarPagoRequest,
  FiltrosReserva 
} from '../../../domain/entities/Reserva';
import axiosClient from '../../api/axiosClient';

const reservaRepo = new ReservaRepoHttp(axiosClient);

// Async thunks
export const fetchReservas = createAsyncThunk<
  Reserva[],
  void,
  { rejectValue: string }
>(
  'reserva/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await reservaRepo.findAll();
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reservas');
    }
  }
);

export const fetchReservaPorId = createAsyncThunk<
  Reserva,
  number,
  { rejectValue: string }
>(
  'reserva/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await reservaRepo.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reserva');
    }
  }
);

export const fetchReservasPorCliente = createAsyncThunk<
  Reserva[],
  number,
  { rejectValue: string }
>(
  'reserva/fetchByCliente',
  async (idCliente, { rejectWithValue }) => {
    try {
      return await reservaRepo.findByCliente(idCliente);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reservas del cliente');
    }
  }
);

export const fetchReservasPorInstancia = createAsyncThunk<
  Reserva[],
  number,
  { rejectValue: string }
>(
  'reserva/fetchByInstancia',
  async (idInstancia, { rejectWithValue }) => {
    try {
      return await reservaRepo.findByInstancia(idInstancia);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reservas de la instancia');
    }
  }
);

export const fetchReservasPorFecha = createAsyncThunk<
  Reserva[],
  string,
  { rejectValue: string }
>(
  'reserva/fetchByFecha',
  async (fecha, { rejectWithValue }) => {
    try {
      return await reservaRepo.findByFecha(fecha);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reservas por fecha');
    }
  }
);

export const fetchReservasPorEstado = createAsyncThunk<
  Reserva[],
  string,
  { rejectValue: string }
>(
  'reserva/fetchByEstado',
  async (estado, { rejectWithValue }) => {
    try {
      return await reservaRepo.findByEstado(estado);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar reservas por estado');
    }
  }
);

export const filtrarReservas = createAsyncThunk<
  Reserva[],
  FiltrosReserva,
  { rejectValue: string }
>(
  'reserva/filter',
  async (filtros, { rejectWithValue }) => {
    try {
      return await reservaRepo.filter(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al filtrar reservas');
    }
  }
);

export const crearReserva = createAsyncThunk<
  number,
  NuevaReservaRequest,
  { rejectValue: string }
>(
  'reserva/create',
  async (reserva, { rejectWithValue }) => {
    try {
      return await reservaRepo.create(reserva);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear reserva');
    }
  }
);

export const actualizarReserva = createAsyncThunk<
  void,
  { id: number, reserva: ActualizarReservaRequest },
  { rejectValue: string }
>(
  'reserva/update',
  async ({ id, reserva }, { rejectWithValue }) => {
    try {
      await reservaRepo.update(id, reserva);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar reserva');
    }
  }
);

export const cambiarEstadoReserva = createAsyncThunk<
  void,
  { id: number, cambioEstado: CambiarEstadoReservaRequest },
  { rejectValue: string }
>(
  'reserva/changeStatus',
  async ({ id, cambioEstado }, { rejectWithValue }) => {
    try {
      await reservaRepo.changeStatus(id, cambioEstado);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar estado de reserva');
    }
  }
);

export const confirmarPago = createAsyncThunk<
  void,
  ConfirmarPagoRequest,
  { rejectValue: string }
>(
  'reserva/confirmPayment',
  async (confirmarPago, { rejectWithValue }) => {
    try {
      await reservaRepo.confirmPayment(confirmarPago);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al confirmar pago');
    }
  }
);

// Define el estado de la slice
export interface ReservaState {
  reservas: Reserva[];
  reservaActual: Reserva | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

// Estado inicial
const initialState: ReservaState = {
  reservas: [],
  reservaActual: null,
  loading: false,
  error: null,
  success: false
};

// Crear slice
export const reservaSlice = createSlice({
  name: 'reserva',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    resetReservaActual: (state) => {
      state.reservaActual = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchReservas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservas.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(fetchReservas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by ID
      .addCase(fetchReservaPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservaPorId.fulfilled, (state, action) => {
        state.loading = false;
        state.reservaActual = action.payload;
      })
      .addCase(fetchReservaPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Cliente
      .addCase(fetchReservasPorCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservasPorCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(fetchReservasPorCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Instancia
      .addCase(fetchReservasPorInstancia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservasPorInstancia.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(fetchReservasPorInstancia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Fecha
      .addCase(fetchReservasPorFecha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservasPorFecha.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(fetchReservasPorFecha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Estado
      .addCase(fetchReservasPorEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReservasPorEstado.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(fetchReservasPorEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Filter
      .addCase(filtrarReservas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(filtrarReservas.fulfilled, (state, action) => {
        state.loading = false;
        state.reservas = action.payload;
      })
      .addCase(filtrarReservas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create
      .addCase(crearReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearReserva.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(crearReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update
      .addCase(actualizarReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarReserva.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Change Status
      .addCase(cambiarEstadoReserva.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(cambiarEstadoReserva.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(cambiarEstadoReserva.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Confirm Payment
      .addCase(confirmarPago.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(confirmarPago.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(confirmarPago.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearErrors, resetReservaActual } = reservaSlice.actions;
export default reservaSlice.reducer;