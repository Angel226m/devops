 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { RepoTipoPasajeHttp } from "../../repositorios/RepoTipoPasajeHttp";

export interface TipoPasajeState {
  tiposPasaje: TipoPasaje[];
  tipoPasajeActual: TipoPasaje | null;
  cargando: boolean;
  error: string | null;
}

const initialState: TipoPasajeState = {
  tiposPasaje: [],
  tipoPasajeActual: null,
  cargando: false,
  error: null
};

const repoTipoPasaje = new RepoTipoPasajeHttp();

export const listarTiposPasaje = createAsyncThunk(
  "tipoPasaje/listar",
  async () => {
    return await repoTipoPasaje.listar();
  }
);

export const obtenerTipoPasajePorId = createAsyncThunk(
  "tipoPasaje/obtenerPorId",
  async (id: number) => {
    return await repoTipoPasaje.obtenerPorId(id);
  }
);

export const listarTiposPasajePorSede = createAsyncThunk(
  "tipoPasaje/listarPorSede",
  async (idSede: number) => {
    return await repoTipoPasaje.listarPorSede(idSede);
  }
);

export const listarTiposPasajePorTipoTour = createAsyncThunk(
  "tipoPasaje/listarPorTipoTour",
  async (idTipoTour: number) => {
    return await repoTipoPasaje.listarPorTipoTour(idTipoTour);
  }
);

const tipoPasajeSlice = createSlice({
  name: "tipoPasaje",
  initialState,
  reducers: {
    limpiarTipoPasajeActual: (state) => {
      state.tipoPasajeActual = null;
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(listarTiposPasaje.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarTiposPasaje.fulfilled, (state, action) => {
        state.cargando = false;
        state.tiposPasaje = action.payload;
      })
      .addCase(listarTiposPasaje.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tipos de pasaje";
      })
      
      // Obtener por ID
      .addCase(obtenerTipoPasajePorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerTipoPasajePorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.tipoPasajeActual = action.payload;
      })
      .addCase(obtenerTipoPasajePorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al obtener tipo de pasaje";
      })
      
      // Listar por sede
      .addCase(listarTiposPasajePorSede.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarTiposPasajePorSede.fulfilled, (state, action) => {
        state.cargando = false;
        state.tiposPasaje = action.payload;
      })
      .addCase(listarTiposPasajePorSede.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tipos de pasaje por sede";
      })
      
      // Listar por tipo tour
      .addCase(listarTiposPasajePorTipoTour.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarTiposPasajePorTipoTour.fulfilled, (state, action) => {
        state.cargando = false;
        state.tiposPasaje = action.payload;
      })
      .addCase(listarTiposPasajePorTipoTour.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tipos de pasaje por tipo de tour";
      });
  }
});

export const { limpiarTipoPasajeActual, limpiarError } = tipoPasajeSlice.actions;
export default tipoPasajeSlice.reducer;