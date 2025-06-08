 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { Idioma, NuevoIdiomaRequest, ActualizarIdiomaRequest } from '../../../domain/entities/Idioma';
import { IdiomaRepoHttp } from '../../repositories/IdiomaRepoHttp';
import axios, { AxiosError } from 'axios';

const idiomaRepo = new IdiomaRepoHttp();

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

// Función auxiliar para extraer array de idiomas de diferentes estructuras de respuesta
const extractIdiomasArray = (response: any): Idioma[] => {
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
    const possibleKeys = ['data', 'idiomas', 'results', 'items', 'content'];
    
    for (const key of possibleKeys) {
      if (response[key] && Array.isArray(response[key])) {
        return response[key];
      }
    }
  }
  
  console.warn('No se pudo extraer array de idiomas de la respuesta:', response);
  return [];
};

// Definir el estado
export interface IdiomaState {
  idiomas: Idioma[];
  idiomaSeleccionado: Idioma | null;
  loading: boolean;
  error: string | null;
}

// Estado inicial
const initialState: IdiomaState = {
  idiomas: [],
  idiomaSeleccionado: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchIdiomas = createAsyncThunk(
  'idiomas/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await idiomaRepo.getAll();
      console.log('Respuesta cruda de la API:', response);
      // Usar la función extractora para manejar diferentes estructuras
      return extractIdiomasArray(response);
    } catch (error) {
      console.error('Error al obtener idiomas:', error);
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchIdiomaPorId = createAsyncThunk(
  'idiomas/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await idiomaRepo.getById(id);
      return response;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const createIdioma = createAsyncThunk(
  'idiomas/create',
  async (idioma: NuevoIdiomaRequest, { rejectWithValue }) => {
    try {
      const id = await idiomaRepo.create(idioma);
      return { id, ...idioma };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateIdioma = createAsyncThunk(
  'idiomas/update',
  async ({ id, idioma }: { id: number; idioma: ActualizarIdiomaRequest }, { rejectWithValue }) => {
    try {
      await idiomaRepo.update(id, idioma);
      // Obtener el idioma actualizado
      return await idiomaRepo.getById(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const deleteIdioma = createAsyncThunk(
  'idiomas/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await idiomaRepo.delete(id);
      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

// Slice
const idiomaSlice = createSlice({
  name: 'idioma',
  initialState,
  reducers: {
    clearIdiomaSeleccionado: (state) => {
      state.idiomaSeleccionado = null;
    },
    clearIdiomaError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchIdiomas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdiomas.fulfilled, (state, action: PayloadAction<Idioma[]>) => {
        state.idiomas = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchIdiomas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar idiomas';
      })
      
      // Fetch by ID
      .addCase(fetchIdiomaPorId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIdiomaPorId.fulfilled, (state, action: PayloadAction<Idioma>) => {
        state.idiomaSeleccionado = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchIdiomaPorId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al cargar idioma';
      })
      
      // Create
      .addCase(createIdioma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createIdioma.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Opcional: refrescar la lista después de crear
        // En este caso es mejor hacer un nuevo fetch
      })
      .addCase(createIdioma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al crear idioma';
      })
      
      // Update
      .addCase(updateIdioma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateIdioma.fulfilled, (state, action: PayloadAction<Idioma>) => {
        const index = state.idiomas.findIndex(i => i.id_idioma === action.payload.id_idioma);
        if (index !== -1) {
          state.idiomas[index] = action.payload;
        }
        state.idiomaSeleccionado = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(updateIdioma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al actualizar idioma';
      })
      
      // Delete
      .addCase(deleteIdioma.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteIdioma.fulfilled, (state, action: PayloadAction<number>) => {
        state.idiomas = state.idiomas.filter(i => i.id_idioma !== action.payload);
        if (state.idiomaSeleccionado?.id_idioma === action.payload) {
          state.idiomaSeleccionado = null;
        }
        state.loading = false;
        state.error = null;
      })
      .addCase(deleteIdioma.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Error al eliminar idioma';
      });
  },
});

export const { clearIdiomaSeleccionado, clearIdiomaError } = idiomaSlice.actions;
export default idiomaSlice.reducer;