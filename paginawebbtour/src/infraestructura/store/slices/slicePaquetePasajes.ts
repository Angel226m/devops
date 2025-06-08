 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";
import { RepoPaquetePasajesHttp } from "../../repositorios/RepoPaquetePasajesHttp";

export interface PaquetePasajesState {
  paquetesPasajes: PaquetePasajes[];
  paquetePasajesActual: PaquetePasajes | null;
  cargando: boolean;
  error: string | null;
}

const initialState: PaquetePasajesState = {
  paquetesPasajes: [],
  paquetePasajesActual: null,
  cargando: false,
  error: null
};

const repoPaquetePasajes = new RepoPaquetePasajesHttp();

export const listarPaquetesPasajes = createAsyncThunk(
  "paquetePasajes/listar",
  async () => {
    return await repoPaquetePasajes.listar();
  }
);

export const obtenerPaquetePasajesPorId = createAsyncThunk(
  "paquetePasajes/obtenerPorId",
  async (id: number) => {
    return await repoPaquetePasajes.obtenerPorId(id);
  }
);

export const listarPaquetesPasajesPorSede = createAsyncThunk(
  "paquetePasajes/listarPorSede",
  async (idSede: number) => {
    return await repoPaquetePasajes.listarPorSede(idSede);
  }
);

export const listarPaquetesPasajesPorTipoTour = createAsyncThunk(
  "paquetePasajes/listarPorTipoTour",
  async (idTipoTour: number) => {
    return await repoPaquetePasajes.listarPorTipoTour(idTipoTour);
  }
);

const paquetePasajesSlice = createSlice({
  name: "paquetePasajes",
  initialState,
  reducers: {
    limpiarPaquetePasajesActual: (state) => {
      state.paquetePasajesActual = null;
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(listarPaquetesPasajes.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarPaquetesPasajes.fulfilled, (state, action) => {
        state.cargando = false;
        state.paquetesPasajes = action.payload;
      })
      .addCase(listarPaquetesPasajes.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar paquetes de pasajes";
      })
      
      // Obtener por ID
      .addCase(obtenerPaquetePasajesPorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerPaquetePasajesPorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.paquetePasajesActual = action.payload;
      })
      .addCase(obtenerPaquetePasajesPorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al obtener paquete de pasajes";
      })
      
      // Listar por sede
      .addCase(listarPaquetesPasajesPorSede.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarPaquetesPasajesPorSede.fulfilled, (state, action) => {
        state.cargando = false;
        state.paquetesPasajes = action.payload;
      })
      .addCase(listarPaquetesPasajesPorSede.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar paquetes de pasajes por sede";
      })
      
      // Listar por tipo tour
      .addCase(listarPaquetesPasajesPorTipoTour.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarPaquetesPasajesPorTipoTour.fulfilled, (state, action) => {
        state.cargando = false;
        state.paquetesPasajes = action.payload;
      })
      .addCase(listarPaquetesPasajesPorTipoTour.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar paquetes de pasajes por tipo de tour";
      });
  }
});

export const { limpiarPaquetePasajesActual, limpiarError } = paquetePasajesSlice.actions;
export default paquetePasajesSlice.reducer;