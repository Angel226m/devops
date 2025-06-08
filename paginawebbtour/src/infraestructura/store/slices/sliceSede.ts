 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Interfaces
interface Sede {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  correo: string;
  distrito: string;
  provincia: string;
  pais: string;
  imagen: string;
}

interface SedeState {
  sedes: Sede[];
  sedeActual: Sede | null;
  cargando: boolean;
  error: string | null;
}

// Estado inicial
const initialState: SedeState = {
  sedes: [],
  sedeActual: null,
  cargando: false,
  error: null
};

// Thunks
export const obtenerSedes = createAsyncThunk(
  'sede/obtenerSedes',
  async (_, { rejectWithValue }) => {
    try {
      // En un caso real, aquí se haría la petición a la API
      // Por ahora, simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: 1,
          nombre: 'Sede Pisco',
          direccion: 'Av. San Martín 123, Pisco',
          telefono: '+51 956 789 123',
          correo: 'pisco@oceantours.com',
          distrito: 'Pisco',
          provincia: 'Pisco',
          pais: 'Perú',
          imagen: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223'
        },
        {
          id: 2,
          nombre: 'Sede Paracas',
          direccion: 'Calle Los Libertadores 456, Paracas',
          telefono: '+51 945 678 912',
          correo: 'paracas@oceantours.com',
          distrito: 'Paracas',
          provincia: 'Pisco',
          pais: 'Perú',
          imagen: 'https://images.unsplash.com/photo-1596566639515-31e182d358c6'
        },
        {
          id: 3,
          nombre: 'Sede Lima',
          direccion: 'Av. Larco 345, Miraflores, Lima',
          telefono: '+51 934 567 891',
          correo: 'lima@oceantours.com',
          distrito: 'Miraflores',
          provincia: 'Lima',
          pais: 'Perú',
          imagen: 'https://images.unsplash.com/photo-1591566672480-5aaf93cbf0e0'
        }
      ];
    } catch (error) {
      return rejectWithValue('Error al obtener las sedes');
    }
  }
);

export const obtenerSedePorId = createAsyncThunk(
  'sede/obtenerSedePorId',
  async (id: number, { rejectWithValue }) => {
    try {
      // En un caso real, aquí se haría la petición a la API
      // Por ahora, simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const sedes = [
        {
          id: 1,
          nombre: 'Sede Pisco',
          direccion: 'Av. San Martín 123, Pisco',
          telefono: '+51 956 789 123',
          correo: 'pisco@oceantours.com',
          distrito: 'Pisco',
          provincia: 'Pisco',
          pais: 'Perú',
          imagen: 'https://images.unsplash.com/photo-1578922746465-3a80a228f223'
        },
        {
          id: 2,
          nombre: 'Sede Paracas',
          direccion: 'Calle Los Libertadores 456, Paracas',
          telefono: '+51 945 678 912',
          correo: 'paracas@oceantours.com',
          distrito: 'Paracas',
          provincia: 'Pisco',
          pais: 'Perú',
          imagen: 'https://images.unsplash.com/photo-1596566639515-31e182d358c6'
        },
        {
          id: 3,
          nombre: 'Sede Lima',
          direccion: 'Av. Larco 345, Miraflores, Lima',
          telefono: '+51 934 567 891',
          correo: 'lima@oceantours.com',
          distrito: 'Miraflores',
          provincia: 'Lima',
          pais: 'Perú',
          imagen: 'https://images.unsplash.com/photo-1591566672480-5aaf93cbf0e0'
        }
      ];
      
      const sede = sedes.find(sede => sede.id === id);
      
      if (!sede) {
        throw new Error('Sede no encontrada');
      }
      
      return sede;
    } catch (error) {
      return rejectWithValue('Error al obtener la sede');
    }
  }
);

// Slice
const sedeSlice = createSlice({
  name: 'sede',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(obtenerSedes.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerSedes.fulfilled, (state, action) => {
        state.cargando = false;
        state.sedes = action.payload;
      })
      .addCase(obtenerSedes.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string;
      })
      .addCase(obtenerSedePorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerSedePorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.sedeActual = action.payload;
      })
      .addCase(obtenerSedePorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string;
      });
  }
});

export default sedeSlice.reducer;