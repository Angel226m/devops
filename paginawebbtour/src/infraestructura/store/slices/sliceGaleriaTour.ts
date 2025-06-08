import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { GaleriaTour } from "../../../dominio/entidades/GaleriaTour";
import { RepoGaleriaTourHttp } from "../../repositorios/RepoGaleriaTourHttp";

// Exportamos la interface para que pueda ser usada en otros archivos
export interface GaleriaTourState {
  galeriasTour: GaleriaTour[];
  galeriaTourActual: GaleriaTour | null;
  cargando: boolean;
  error: string | null;
}

const initialState: GaleriaTourState = {
  galeriasTour: [],
  galeriaTourActual: null,
  cargando: false,
  error: null
};

const repoGaleriaTour = new RepoGaleriaTourHttp();

export const listarGaleriasTour = createAsyncThunk(
  "galeriaTour/listar",
  async () => {
    return await repoGaleriaTour.listar();
  }
);

export const obtenerGaleriaTourPorId = createAsyncThunk(
  "galeriaTour/obtenerPorId",
  async (id: number) => {
    return await repoGaleriaTour.obtenerPorId(id);
  }
);

export const listarGaleriasTourPorTipoTour = createAsyncThunk(
  "galeriaTour/listarPorTipoTour",
  async (idTipoTour: number) => {
    return await repoGaleriaTour.listarPorTipoTour(idTipoTour);
  }
);

const galeriaTourSlice = createSlice({
  name: "galeriaTour",
  initialState,
  reducers: {
    limpiarGaleriaTourActual: (state) => {
      state.galeriaTourActual = null;
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(listarGaleriasTour.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarGaleriasTour.fulfilled, (state, action) => {
        state.cargando = false;
        state.galeriasTour = action.payload;
      })
      .addCase(listarGaleriasTour.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar galerías de tour";
      })
      
      // Obtener por ID
      .addCase(obtenerGaleriaTourPorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerGaleriaTourPorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.galeriaTourActual = action.payload;
      })
      .addCase(obtenerGaleriaTourPorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al obtener galería de tour";
      })
      
      // Listar por tipo tour
      .addCase(listarGaleriasTourPorTipoTour.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarGaleriasTourPorTipoTour.fulfilled, (state, action) => {
        state.cargando = false;
        state.galeriasTour = action.payload;
      })
      .addCase(listarGaleriasTourPorTipoTour.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar galerías por tipo de tour";
      });
  }
});

export const { limpiarGaleriaTourActual, limpiarError } = galeriaTourSlice.actions;
export default galeriaTourSlice.reducer;