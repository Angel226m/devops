import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { InstanciaTour, FiltrosInstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { RepoInstanciaTourHttp } from "../../repositorios/RepoInstanciaTourHttp";

export interface InstanciaTourState {
  instanciasTour: InstanciaTour[];
  instanciaTourActual: InstanciaTour | null;
  cargando: boolean;
  error: string | null;
}

const initialState: InstanciaTourState = {
  instanciasTour: [],
  instanciaTourActual: null,
  cargando: false,
  error: null
};

const repoInstanciaTour = new RepoInstanciaTourHttp();

export const listarInstanciasTour = createAsyncThunk(
  "instanciaTour/listar",
  async () => {
    return await repoInstanciaTour.listar();
  }
);

export const obtenerInstanciaTourPorId = createAsyncThunk(
  "instanciaTour/obtenerPorId",
  async (id: number) => {
    return await repoInstanciaTour.obtenerPorId(id);
  }
);

export const listarInstanciasTourPorFiltros = createAsyncThunk(
  "instanciaTour/listarPorFiltros",
  async (filtros: FiltrosInstanciaTour) => {
    return await repoInstanciaTour.listarPorFiltros(filtros);
  }
);

export const listarInstanciasTourDisponibles = createAsyncThunk(
  "instanciaTour/listarDisponibles",
  async () => {
    return await repoInstanciaTour.listarDisponibles();
  }
);

export const listarInstanciasTourPorFecha = createAsyncThunk(
  "instanciaTour/listarPorFecha",
  async (fecha: string) => {
    return await repoInstanciaTour.listarPorFecha(fecha);
  }
);

const instanciaTourSlice = createSlice({
  name: "instanciaTour",
  initialState,
  reducers: {
    limpiarInstanciaTourActual: (state) => {
      state.instanciaTourActual = null;
    },
    limpiarError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Listar
      .addCase(listarInstanciasTour.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarInstanciasTour.fulfilled, (state, action) => {
        state.cargando = false;
        state.instanciasTour = action.payload;
      })
      .addCase(listarInstanciasTour.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar instancias de tour";
      })
      
      // Obtener por ID
      .addCase(obtenerInstanciaTourPorId.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(obtenerInstanciaTourPorId.fulfilled, (state, action) => {
        state.cargando = false;
        state.instanciaTourActual = action.payload;
      })
      .addCase(obtenerInstanciaTourPorId.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al obtener instancia de tour";
      })
      
      // Listar por filtros
      .addCase(listarInstanciasTourPorFiltros.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarInstanciasTourPorFiltros.fulfilled, (state, action) => {
        state.cargando = false;
        state.instanciasTour = action.payload;
      })
      .addCase(listarInstanciasTourPorFiltros.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al filtrar instancias de tour";
      })
      
      // Listar disponibles
      .addCase(listarInstanciasTourDisponibles.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarInstanciasTourDisponibles.fulfilled, (state, action) => {
        state.cargando = false;
        state.instanciasTour = action.payload;
      })
      .addCase(listarInstanciasTourDisponibles.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar instancias disponibles";
      })
      
      // Listar por fecha
      .addCase(listarInstanciasTourPorFecha.pending, (state) => {
        state.cargando = true;
        state.error = null;
      })
      .addCase(listarInstanciasTourPorFecha.fulfilled, (state, action) => {
        state.cargando = false;
        state.instanciasTour = action.payload;
      })
      .addCase(listarInstanciasTourPorFecha.rejected, (state, action) => {
        state.cargando = false;
        state.error = action.error.message || "Error al listar instancias por fecha";
      });
  }
});

export const { limpiarInstanciaTourActual, limpiarError } = instanciaTourSlice.actions;
export default instanciaTourSlice.reducer;