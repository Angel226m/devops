import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TipoTour } from "../../../dominio/entidades/TipoTour";
import { RepoTipoTourHttp } from "../../repositorios/RepoTipoTourHttp";

// Exportamos la interface para que pueda ser usada en otros archivos
export interface TipoTourState {
  tiposTour: TipoTour[];
  tipoTourActual: TipoTour | null;
  cargando: boolean;
  error: string | null;
}

const initialState: TipoTourState = {
  tiposTour: [],
  tipoTourActual: null,
  cargando: false,
  error: null
};

const repoTipoTour = new RepoTipoTourHttp();

export const listarTiposTour = createAsyncThunk(
  "tipoTour/listar",
  async () => {
    return await repoTipoTour.listar();
  }
);

export const obtenerTipoTourPorId = createAsyncThunk(
  "tipoTour/obtenerPorId",
  async (id: number) => {
    return await repoTipoTour.obtenerPorId(id);
  }
);

export const listarTiposTourPorSede = createAsyncThunk(
  "tipoTour/listarPorSede",
  async (idSede: number) => {
    return await repoTipoTour.listarPorSede(idSede);
  }
);

const tipoTourSlice = createSlice({
  name: "tipoTour",
  initialState,
  reducers: {
    limpiarTipoTourActual: (state) => {
      state.tipoTourActual = null;
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(listarTiposTour.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarTiposTour.fulfilled, (state, action) => {
        state.cargando = false;
        state.tiposTour = action.payload;
      })
      .addCase(listarTiposTour.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tipos de tour";
      })
      
      // Obtener por ID
      .addCase(obtenerTipoTourPorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerTipoTourPorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.tipoTourActual = action.payload;
      })
      .addCase(obtenerTipoTourPorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al obtener tipo de tour";
      })
      
      // Listar por sede
      .addCase(listarTiposTourPorSede.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarTiposTourPorSede.fulfilled, (state, action) => {
        state.cargando = false;
        state.tiposTour = action.payload;
      })
      .addCase(listarTiposTourPorSede.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tipos de tour por sede";
      });
  }
});

export const { limpiarTipoTourActual, limpiarError } = tipoTourSlice.actions;
export default tipoTourSlice.reducer;