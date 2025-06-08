 
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { TourProgramado, FiltrosTourProgramado } from "../../../dominio/entidades/TourProgramado";
import { RepoTourProgramadoHttp } from "../../repositorios/RepoTourProgramadoHttp";

export interface TourProgramadoState {
  toursProgramados: TourProgramado[];
  toursDisponibles: TourProgramado[];
  tourProgramadoActual: TourProgramado | null;
  cargando: boolean;
  error: string | null;
}

const initialState: TourProgramadoState = {
  toursProgramados: [],
  toursDisponibles: [],
  tourProgramadoActual: null,
  cargando: false,
  error: null
};

const repoTourProgramado = new RepoTourProgramadoHttp();

// Thunks
export const listarToursProgramados = createAsyncThunk(
  "tourProgramado/listar",
  async () => {
    return await repoTourProgramado.listar();
  }
);

export const obtenerTourProgramadoPorId = createAsyncThunk(
  "tourProgramado/obtenerPorId",
  async (id: number) => {
    return await repoTourProgramado.obtenerPorId(id);
  }
);

export const listarToursDisponiblesSinDuplicados = createAsyncThunk(
  "tourProgramado/listarDisponiblesSinDuplicados",
  async () => {
    return await repoTourProgramado.listarDisponiblesSinDuplicados();
  }
);

export const listarToursProgramadosPorFiltros = createAsyncThunk(
  "tourProgramado/listarPorFiltros",
  async (filtros: FiltrosTourProgramado) => {
    return await repoTourProgramado.listarPorFiltros(filtros);
  }
);

const tourProgramadoSlice = createSlice({
  name: "tourProgramado",
  initialState,
  reducers: {
    limpiarTourProgramadoActual: (state) => {
      state.tourProgramadoActual = null;
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(listarToursProgramados.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarToursProgramados.fulfilled, (state, action) => {
        state.cargando = false;
        state.toursProgramados = action.payload;
      })
      .addCase(listarToursProgramados.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tours programados";
      })
      
      // Obtener por ID
      .addCase(obtenerTourProgramadoPorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerTourProgramadoPorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.tourProgramadoActual = action.payload;
      })
      .addCase(obtenerTourProgramadoPorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al obtener tour programado";
      })
      
      // Listar disponibles sin duplicados
      .addCase(listarToursDisponiblesSinDuplicados.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarToursDisponiblesSinDuplicados.fulfilled, (state, action) => {
        state.cargando = false;
        state.toursDisponibles = action.payload;
      })
      .addCase(listarToursDisponiblesSinDuplicados.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar tours disponibles";
      })
      
      // Listar por filtros
      .addCase(listarToursProgramadosPorFiltros.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarToursProgramadosPorFiltros.fulfilled, (state, action) => {
        state.cargando = false;
        state.toursProgramados = action.payload;
      })
      .addCase(listarToursProgramadosPorFiltros.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al filtrar tours programados";
      });
  }
});

export const { limpiarTourProgramadoActual, limpiarError } = tourProgramadoSlice.actions;
export default tourProgramadoSlice.reducer;