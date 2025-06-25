 
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { ClienteRepoHttp } from '../../repositories/ClienteRepoHttp';
import { 
  Cliente, 
  NuevoClienteRequest, 
  ActualizarClienteRequest,
  ActualizarDatosEmpresaRequest,
  ActualizarDatosFacturacionRequest,
  BusquedaClienteParams
} from '../../../domain/entities/Cliente';
import axiosClient from '../../api/axiosClient';

const clienteRepo = new ClienteRepoHttp(axiosClient);

// Async thunks
export const fetchClientes = createAsyncThunk<
  Cliente[],                          // Return type
  BusquedaClienteParams | undefined,  // First argument type
  { rejectValue: string }             // ThunkAPI configuration
>(
  'cliente/fetchAll',
  async (params, { rejectWithValue }) => {
    try {
      return await clienteRepo.findAll(params);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar clientes');
    }
  }
);

export const fetchClientePorId = createAsyncThunk<
  Cliente,
  number,
  { rejectValue: string }
>(
  'cliente/fetchById',
  async (id, { rejectWithValue }) => {
    try {
      return await clienteRepo.findById(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cargar cliente');
    }
  }
);

export const fetchClientePorDocumento = createAsyncThunk<
  Cliente,
  string,
  { rejectValue: string }
>(
  'cliente/fetchByDocumento',
  async (documento, { rejectWithValue }) => {
    try {
      return await clienteRepo.findByDocumento(documento);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al buscar cliente por documento');
    }
  }
);

export const crearCliente = createAsyncThunk<
  number,
  NuevoClienteRequest,
  { rejectValue: string }
>(
  'cliente/create',
  async (cliente, { rejectWithValue }) => {
    try {
      return await clienteRepo.create(cliente);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear cliente');
    }
  }
);

export const actualizarCliente = createAsyncThunk<
  number,
  { id: number, cliente: ActualizarClienteRequest },
  { rejectValue: string }
>(
  'cliente/update',
  async ({ id, cliente }, { rejectWithValue }) => {
    try {
      await clienteRepo.update(id, cliente);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar cliente');
    }
  }
);

export const actualizarDatosEmpresa = createAsyncThunk<
  number,
  { id: number, datos: ActualizarDatosEmpresaRequest },
  { rejectValue: string }
>(
  'cliente/updateDatosEmpresa',
  async ({ id, datos }, { rejectWithValue }) => {
    try {
      await clienteRepo.updateDatosEmpresa(id, datos);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar datos de empresa');
    }
  }
);

// Mantener para compatibilidad con código existente
export const actualizarDatosFacturacion = createAsyncThunk<
  number,
  { id: number, datos: ActualizarDatosFacturacionRequest },
  { rejectValue: string }
>(
  'cliente/updateDatosFacturacion',
  async ({ id, datos }, { rejectWithValue }) => {
    try {
      await clienteRepo.updateDatosFacturacion(id, datos);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar datos de facturación');
    }
  }
);

export const eliminarCliente = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  'cliente/delete',
  async (id, { rejectWithValue }) => {
    try {
      await clienteRepo.delete(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar cliente');
    }
  }
);

export interface ClienteState {
  clientes: Cliente[];
  clienteActual: Cliente | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ClienteState = {
  clientes: [],
  clienteActual: null,
  loading: false,
  error: null,
  success: false
};

export const clienteSlice = createSlice({
  name: 'cliente',
  initialState,
  reducers: {
    clearErrors: (state) => {
      state.error = null;
      state.success = false;
    },
    resetClienteActual: (state) => {
      state.clienteActual = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by ID
      .addCase(fetchClientePorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientePorId.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteActual = action.payload;
      })
      .addCase(fetchClientePorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Fetch by Documento
      .addCase(fetchClientePorDocumento.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientePorDocumento.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteActual = action.payload;
      })
      .addCase(fetchClientePorDocumento.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Create
      .addCase(crearCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(crearCliente.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(crearCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update
      .addCase(actualizarCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarCliente.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update Datos Empresa
      .addCase(actualizarDatosEmpresa.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarDatosEmpresa.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarDatosEmpresa.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Update Datos Facturación (compatibilidad)
      .addCase(actualizarDatosFacturacion.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(actualizarDatosFacturacion.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(actualizarDatosFacturacion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      
      // Delete
      .addCase(eliminarCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(eliminarCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.clientes = state.clientes.filter(
          cliente => cliente.id_cliente !== action.payload
        );
      })
      .addCase(eliminarCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearErrors, resetClienteActual } = clienteSlice.actions;
export default clienteSlice.reducer;