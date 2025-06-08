import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  InstanciaTour, 
  NuevaInstanciaTourRequest, 
  ActualizarInstanciaTourRequest, 
  FiltrosInstanciaTour 
} from '../../../domain/entities/InstanciaTour';
import { InstanciaTourRepoHttp } from '../../repositories/InstanciaTourRepoHttp';
import axios, { AxiosError } from 'axios';

const instanciaTourRepo = new InstanciaTourRepoHttp();

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

// Función auxiliar para extraer array de instancias de diferentes estructuras de respuesta
const extractInstanciasArray = (response: any): InstanciaTour[] => {
  // Si es un objeto con estructura de respuesta estándar de la API
  if (response && response.data && Array.isArray(response.data)) {
    return response.data;
  }
  
  // Si ya es un array, devolverlo directamente
  if (Array.isArray(response)) {
    return response;
  }
  
  // Si es un objeto, buscar en las propiedades comunes
  if (response && typeof response === 'object') {
    // Buscar en propiedades comunes donde podrían estar los datos
    const possibleKeys = ['data', 'instancias', 'results', 'items', 'content'];
    
    for (const key of possibleKeys) {
      if (response[key] && Array.isArray(response[key])) {
        return response[key];
      }
    }
  }
  
  console.warn('No se pudo extraer array de instancias de la respuesta:', response);
  return [];
};

// Definir el estado
export interface InstanciaTourState {
  instancias: InstanciaTour[];
  instanciaSeleccionada: InstanciaTour | null;
  loading: boolean;
  error: string | null;
  cantidadGenerada: number | null;
}

// Estado inicial
const initialState: InstanciaTourState = {
  instancias: [],
  instanciaSeleccionada: null,
  loading: false,
  error: null,
  cantidadGenerada: null
};

// Thunks
export const fetchInstanciasTour = createAsyncThunk(
  'instanciasTour/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await instanciaTourRepo.getAll();
      console.log('Respuesta cruda de la API:', response);
      return extractInstanciasArray(response);
    } catch (error) {
      console.error('Error al obtener instancias de tour:', error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchInstanciaTourPorId = createAsyncThunk(
  'instanciasTour/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await instanciaTourRepo.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchInstanciasPorTourProgramado = createAsyncThunk(
  'instanciasTour/fetchByTourProgramado',
  async (idTourProgramado: number, { rejectWithValue }) => {
    try {
      const response = await instanciaTourRepo.getByTourProgramado(idTourProgramado);
      return extractInstanciasArray(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchInstanciasPorFiltros = createAsyncThunk(
  'instanciasTour/fetchByFiltros',
  async (filtros: FiltrosInstanciaTour, { rejectWithValue }) => {
    try {
      const response = await instanciaTourRepo.getByFiltros(filtros);
      return extractInstanciasArray(response);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createInstanciaTour = createAsyncThunk(
  'instanciasTour/create',
  async (instancia: NuevaInstanciaTourRequest, { rejectWithValue }) => {
    try {
      const id = await instanciaTourRepo.create(instancia);
      return { id, ...instancia };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateInstanciaTour = createAsyncThunk(
  'instanciasTour/update',
  async ({ id, instancia }: { id: number; instancia: ActualizarInstanciaTourRequest }, { rejectWithValue }) => {
    try {
      await instanciaTourRepo.update(id, instancia);
      // Obtener la instancia actualizada
      return await instanciaTourRepo.getById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteInstanciaTour = createAsyncThunk(
  'instanciasTour/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await instanciaTourRepo.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const asignarChofer = createAsyncThunk(
  'instanciasTour/asignarChofer',
  async ({ id, idChofer }: { id: number; idChofer: number }, { rejectWithValue }) => {
    try {
      await instanciaTourRepo.asignarChofer(id, idChofer);
      return await instanciaTourRepo.getById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const generarInstancias = createAsyncThunk(
  'instanciasTour/generarInstancias',
  async (idTourProgramado: number, { rejectWithValue }) => {
    try {
      const cantidad = await instanciaTourRepo.generarInstancias(idTourProgramado);
      return cantidad;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const instanciaTourSlice = createSlice({
  name: 'instanciaTour',
  initialState,
  reducers: {
    clearInstanciaSeleccionada: (state) => {
      state.instanciaSeleccionada = null;
    },
    clearInstanciaError: (state) => {
      state.error = null;
    },
    clearCantidadGenerada: (state) => {
      state.cantidadGenerada = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchInstanciasTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstanciasTour.fulfilled, (state, action: PayloadAction<InstanciaTour[]>) => {
        state.instancias = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchInstanciasTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar instancias de tour';
      })
      
      // Fetch by ID
      .addCase(fetchInstanciaTourPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstanciaTourPorId.fulfilled, (state, action: PayloadAction<InstanciaTour>) => {
        state.instanciaSeleccionada = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchInstanciaTourPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar instancia de tour';
      })
      
      // Fetch by Tour Programado
      .addCase(fetchInstanciasPorTourProgramado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstanciasPorTourProgramado.fulfilled, (state, action: PayloadAction<InstanciaTour[]>) => {
        state.instancias = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchInstanciasPorTourProgramado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar instancias por tour programado';
      })
      
      // Fetch by Filtros
      .addCase(fetchInstanciasPorFiltros.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstanciasPorFiltros.fulfilled, (state, action: PayloadAction<InstanciaTour[]>) => {
        state.instancias = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchInstanciasPorFiltros.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al filtrar instancias de tour';
      })
      
      // Create
      .addCase(createInstanciaTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createInstanciaTour.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Opcional: refrescar la lista después de crear
        // En este caso es mejor hacer un nuevo fetch
      })
      .addCase(createInstanciaTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al crear instancia de tour';
      })
      
      // Update
      .addCase(updateInstanciaTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateInstanciaTour.fulfilled, (state, action: PayloadAction<InstanciaTour>) => {
        const index = state.instancias.findIndex(i => i.id_instancia === action.payload.id_instancia);
        if (index !== -1) {
          state.instancias[index] = action.payload;
        }
        state.instanciaSeleccionada = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateInstanciaTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al actualizar instancia de tour';
      })
      
      // Delete
      .addCase(deleteInstanciaTour.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteInstanciaTour.fulfilled, (state, action: PayloadAction<number>) => {
        state.instancias = state.instancias.filter(i => i.id_instancia !== action.payload);
        if (state.instanciaSeleccionada?.id_instancia === action.payload) {
          state.instanciaSeleccionada = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteInstanciaTour.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al eliminar instancia de tour';
      })
      
      // Asignar Chofer
      .addCase(asignarChofer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asignarChofer.fulfilled, (state, action: PayloadAction<InstanciaTour>) => {
        const index = state.instancias.findIndex(i => i.id_instancia === action.payload.id_instancia);
        if (index !== -1) {
          state.instancias[index] = action.payload;
        }
        state.instanciaSeleccionada = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(asignarChofer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al asignar chofer a la instancia';
      })
      
      // Generar Instancias
      .addCase(generarInstancias.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.cantidadGenerada = null;
      })
      .addCase(generarInstancias.fulfilled, (state, action: PayloadAction<number>) => {
        state.cantidadGenerada = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(generarInstancias.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al generar instancias de tour';
        state.cantidadGenerada = null;
      });
  },
});

export const { clearInstanciaSeleccionada, clearInstanciaError, clearCantidadGenerada } = instanciaTourSlice.actions;
export default instanciaTourSlice.reducer;