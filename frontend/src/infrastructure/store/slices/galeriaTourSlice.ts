import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { GaleriaTour, GaleriaTourRequest, GaleriaTourUpdateRequest } from '../../../domain/entities/GaleriaTour';
import { CrearGaleriaTour } from '../../../application/use-cases/galeriatour/CrearGaleriaTour';
import { ObtenerGaleriaTourPorId } from '../../../application/use-cases/galeriatour/ObtenerGaleriaTourPorId';
import { ListarGaleriaTourPorTipoTour } from '../../../application/use-cases/galeriatour/ListarGaleriaTourPorTipoTour';
import { ActualizarGaleriaTour } from '../../../application/use-cases/galeriatour/ActualizarGaleriaTour';
import { EliminarGaleriaTour } from '../../../application/use-cases/galeriatour/EliminarGaleriaTour';

export interface GaleriaTourState {
  list: GaleriaTour[];
  selectedGaleria: GaleriaTour | null;
  loading: boolean;
  error: string | null;
}

const initialState: GaleriaTourState = {
  list: [],
  selectedGaleria: null,
  loading: false,
  error: null,
};

// Async thunks
export const createGaleriaTour = createAsyncThunk(
  'galeriaTour/create',
  async (galeria: GaleriaTourRequest, { extra }: any) => {
    const { galeriaTourRepository } = extra;
    const crearGaleriaTour = new CrearGaleriaTour(galeriaTourRepository);
    return await crearGaleriaTour.execute(galeria);
  }
);

export const getGaleriaTourById = createAsyncThunk(
  'galeriaTour/getById',
  async (id: number, { extra }: any) => {
    const { galeriaTourRepository } = extra;
    const obtenerGaleriaTour = new ObtenerGaleriaTourPorId(galeriaTourRepository);
    return await obtenerGaleriaTour.execute(id);
  }
);

export const listGaleriaTourByTipoTour = createAsyncThunk(
  'galeriaTour/listByTipoTour',
  async (idTipoTour: number, { extra }: any) => {
    const { galeriaTourRepository } = extra;
    const listarGaleriaTour = new ListarGaleriaTourPorTipoTour(galeriaTourRepository);
    return await listarGaleriaTour.execute(idTipoTour);
  }
);

export const updateGaleriaTour = createAsyncThunk(
  'galeriaTour/update',
  async ({ id, galeria }: { id: number, galeria: GaleriaTourUpdateRequest }, { extra }: any) => {
    const { galeriaTourRepository } = extra;
    const actualizarGaleriaTour = new ActualizarGaleriaTour(galeriaTourRepository);
    await actualizarGaleriaTour.execute(id, galeria);
    return id;
  }
);

export const deleteGaleriaTour = createAsyncThunk(
  'galeriaTour/delete',
  async (id: number, { extra }: any) => {
    const { galeriaTourRepository } = extra;
    const eliminarGaleriaTour = new EliminarGaleriaTour(galeriaTourRepository);
    await eliminarGaleriaTour.execute(id);
    return id;
  }
);

// Slice
const galeriaTourSlice = createSlice({
  name: 'galeriaTour',
  initialState,
  reducers: {
    resetGaleriaTour: (state) => {
      state.selectedGaleria = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    // Create
    builder.addCase(createGaleriaTour.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createGaleriaTour.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createGaleriaTour.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al crear galería';
    });
    
    // Get by ID
    builder.addCase(getGaleriaTourById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getGaleriaTourById.fulfilled, (state, action: PayloadAction<GaleriaTour>) => {
      state.loading = false;
      state.selectedGaleria = action.payload;
    });
    builder.addCase(getGaleriaTourById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al obtener galería';
    });
    
    // List by tipo tour
    builder.addCase(listGaleriaTourByTipoTour.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(listGaleriaTourByTipoTour.fulfilled, (state, action: PayloadAction<GaleriaTour[]>) => {
      state.loading = false;
      state.list = action.payload;
    });
    builder.addCase(listGaleriaTourByTipoTour.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al listar galerías';
    });
    
    // Update
    builder.addCase(updateGaleriaTour.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateGaleriaTour.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(updateGaleriaTour.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al actualizar galería';
    });
    
    // Delete
    builder.addCase(deleteGaleriaTour.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteGaleriaTour.fulfilled, (state, action: PayloadAction<number>) => {
      state.loading = false;
      state.list = state.list.filter(galeria => galeria.id_galeria !== action.payload);
    });
    builder.addCase(deleteGaleriaTour.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || 'Error al eliminar galería';
    });
  }
});

export const { resetGaleriaTour, clearError } = galeriaTourSlice.actions;
export default galeriaTourSlice.reducer;