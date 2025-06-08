 
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Interfaces
interface Tour {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  duracion: number;
  calificacion: number;
  imagen: string;
  ubicacion: string;
  sede: string;
  tipo: string;
  capacidad: number;
}

interface TourState {
  tours: Tour[];
  tourActual: Tour | null;
  toursRelacionados: Tour[];
  cargando: boolean;
  error: string | null;
  filtros: {
    sede: string;
    tipo: string;
    precioMin: number;
    precioMax: number;
    duracionMin: number;
    duracionMax: number;
    busqueda: string;
  };
}

// Estado inicial
const initialState: TourState = {
  tours: [],
  tourActual: null,
  toursRelacionados: [],
  cargando: false,
  error: null,
  filtros: {
    sede: '',
    tipo: '',
    precioMin: 0,
    precioMax: 500,
    duracionMin: 0,
    duracionMax: 480, // 8 horas en minutos
    busqueda: ''
  }
};

// Thunks
export const obtenerTours = createAsyncThunk(
  'tour/obtenerTours',
  async (_, { rejectWithValue }) => {
    try {
      // En un caso real, aquí se haría la petición a la API
      // Por ahora, simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return [
        {
          id: 1,
          nombre: 'Tour Islas Ballestas',
          descripcion: 'Explora la biodiversidad marina de las Islas Ballestas en un recorrido fascinante.',
          precio: 85,
          duracion: 120, // en minutos
          calificacion: 4.8,
          imagen: 'https://images.unsplash.com/photo-1558551649-e6b9c8301187',
          ubicacion: 'Pisco, Perú',
          sede: 'Pisco',
          tipo: 'Marítimo',
          capacidad: 20
        },
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural.',
          precio: 120,
          duracion: 180, // en minutos
          calificacion: 4.9,
          imagen: 'https://images.unsplash.com/photo-1564550974352-c7d93c939f53',
          ubicacion: 'Pisco, Perú',
          sede: 'Pisco',
          tipo: 'Marítimo',
          capacidad: 15
        },
        {
          id: 3,
          nombre: 'Sunset Cruise',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular atardecer.',
          precio: 95,
          duracion: 150, // en minutos
          calificacion: 4.7,
          imagen: 'https://images.unsplash.com/photo-1506016476100-de644588c7d0',
          ubicacion: 'Paracas, Perú',
          sede: 'Paracas',
          tipo: 'Relajación',
          capacidad: 25
        },
        {
          id: 4,
          nombre: 'Tour Reserva Nacional de Paracas',
          descripcion: 'Recorre la impresionante Reserva Nacional de Paracas y descubre su belleza natural.',
          precio: 75,
          duracion: 240, // en minutos
          calificacion: 4.6,
          imagen: 'https://images.unsplash.com/photo-1584551882459-38fb1a138e89',
          ubicacion: 'Paracas, Perú',
          sede: 'Paracas',
          tipo: 'Ecoturismo',
          capacidad: 30
        },
        {
          id: 5,
          nombre: 'Paseo en Lancha por la Bahía',
          descripcion: 'Un relajante paseo por la bahía ideal para familias y grupos.',
          precio: 50,
          duracion: 90, // en minutos
          calificacion: 4.5,
          imagen: 'https://images.unsplash.com/photo-1596702876070-82cb3cf8cf19',
          ubicacion: 'Pisco, Perú',
          sede: 'Pisco',
          tipo: 'Familiar',
          capacidad: 35
        },
        {
          id: 6,
          nombre: 'Avistamiento de Aves Marinas',
          descripcion: 'Tour especializado para observar las diversas especies de aves que habitan en la región.',
          precio: 65,
          duracion: 150, // en minutos
          calificacion: 4.7,
          imagen: 'https://images.unsplash.com/photo-1621635574570-41dd5d4c19a9',
          ubicacion: 'Paracas, Perú',
          sede: 'Paracas',
          tipo: 'Ecoturismo',
          capacidad: 12
        }
      ];
    } catch (error) {
      return rejectWithValue('Error al obtener los tours');
    }
  }
);

export const obtenerTourPorId = createAsyncThunk(
  'tour/obtenerTourPorId',
  async (id: number, { rejectWithValue }) => {
    try {
      // En un caso real, aquí se haría la petición a la API
      // Por ahora, simulamos una respuesta
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const tours = [
        {
          id: 1,
          nombre: 'Tour Islas Ballestas',
          descripcion: 'Explora la biodiversidad marina de las Islas Ballestas en un recorrido fascinante.',
          precio: 85,
          duracion: 120, // en minutos
          calificacion: 4.8,
          imagen: 'https://images.unsplash.com/photo-1558551649-e6b9c8301187',
          ubicacion: 'Pisco, Perú',
          sede: 'Pisco',
          tipo: 'Marítimo',
          capacidad: 20
        },
        {
          id: 2,
          nombre: 'Avistamiento de Delfines',
          descripcion: 'Disfruta de la experiencia única de nadar con delfines en su hábitat natural.',
          precio: 120,
          duracion: 180, // en minutos
          calificacion: 4.9,
          imagen: 'https://images.unsplash.com/photo-1564550974352-c7d93c939f53',
          ubicacion: 'Pisco, Perú',
          sede: 'Pisco',
          tipo: 'Marítimo',
          capacidad: 15
        },
        {
          id: 3,
          nombre: 'Sunset Cruise',
          descripcion: 'Navega por las aguas de Paracas mientras disfrutas de un espectacular atardecer.',
          precio: 95,
          duracion: 150, // en minutos
          calificacion: 4.7,
          imagen: 'https://images.unsplash.com/photo-1506016476100-de644588c7d0',
          ubicacion: 'Paracas, Perú',
          sede: 'Paracas',
          tipo: 'Relajación',
          capacidad: 25
        },
        {
          id: 4,
          nombre: 'Tour Reserva Nacional de Paracas',
          descripcion: 'Recorre la impresionante Reserva Nacional de Paracas y descubre su belleza natural.',
          precio: 75,
          duracion: 240, // en minutos
          calificacion: 4.6,
          imagen: 'https://images.unsplash.com/photo-1584551882459-38fb1a138e89',
          ubicacion: 'Paracas, Perú',
          sede: 'Paracas',
          tipo: 'Ecoturismo',
          capacidad: 30
        },
        {
          id: 5,
          nombre: 'Paseo en Lancha por la Bahía',
          descripcion: 'Un relajante paseo por la bahía ideal para familias y grupos.',
          precio: 50,
          duracion: 90, // en minutos
          calificacion: 4.5,
          imagen: 'https://images.unsplash.com/photo-1596702876070-82cb3cf8cf19',
          ubicacion: 'Pisco, Perú',
          sede: 'Pisco',
          tipo: 'Familiar',
          capacidad: 35
        },
        {
          id: 6,
          nombre: 'Avistamiento de Aves Marinas',
          descripcion: 'Tour especializado para observar las diversas especies de aves que habitan en la región.',
          precio: 65,
          duracion: 150, // en minutos
          calificacion: 4.7,
          imagen: 'https://images.unsplash.com/photo-1621635574570-41dd5d4c19a9',
          ubicacion: 'Paracas, Perú',
          sede: 'Paracas',
          tipo: 'Ecoturismo',
          capacidad: 12
        }
      ];
      
      const tour = tours.find(tour => tour.id === id);
      
      if (!tour) {
        throw new Error('Tour no encontrado');
      }
      
      return tour;
    } catch (error) {
      return rejectWithValue('Error al obtener el tour');
    }
  }
);

// Slice
const tourSlice = createSlice({
  name: 'tour',
  initialState,
  reducers: {
    actualizarFiltros: (state, action: PayloadAction<Partial<TourState['filtros']>>) => {
      state.filtros = {
        ...state.filtros,
        ...action.payload
      };
    },
    limpiarFiltros: (state) => {
      state.filtros = initialState.filtros;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(obtenerTours.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerTours.fulfilled, (state, action) => {
        state.cargando = false;
        state.tours = action.payload;
      })
      .addCase(obtenerTours.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string;
      })
      .addCase(obtenerTourPorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerTourPorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.tourActual = action.payload;
        
        // Encontrar tours relacionados (del mismo tipo o sede)
        if (state.tours.length > 0) {
          state.toursRelacionados = state.tours
            .filter(tour => 
              tour.id !== action.payload.id && 
              (tour.tipo === action.payload.tipo || tour.sede === action.payload.sede)
            )
            .slice(0, 3);
        }
      })
      .addCase(obtenerTourPorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.payload as string;
      });
  }
});

export const { actualizarFiltros, limpiarFiltros } = tourSlice.actions;
export default tourSlice.reducer;