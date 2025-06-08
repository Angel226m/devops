import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  TourProgramado, 
  NuevoTourProgramadoRequest, 
  ActualizarTourProgramadoRequest, 
  FiltrosTourProgramado,
  DisponibilidadHorario,
  AsignarChoferRequest
} from '../../../domain/entities/TourProgramado';
import { TourProgramadoRepoHttp } from '../../repositories/TourProgramadoRepoHttp';

export interface TourProgramadoState {
  tours: TourProgramado[];
  currentTour: TourProgramado | null;
  loading: boolean;
  error: string | null;
  createdTourId: number | null;
  createdTourIds: number[] | null;
  disponibilidadHorario: DisponibilidadHorario | null;
}

const initialState: TourProgramadoState = {
  tours: [],
  currentTour: null,
  loading: false,
  error: null,
  createdTourId: null,
  createdTourIds: null,
  disponibilidadHorario: null
};

const tourProgramadoRepo = new TourProgramadoRepoHttp();

// Thunks
export const fetchToursProgramados = createAsyncThunk(
  'tourProgramado/fetchTours',
  async (filtros: FiltrosTourProgramado | undefined = {}, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.listar(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours programados');
    }
  }
);

export const fetchTourProgramadoById = createAsyncThunk(
  'tourProgramado/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.obtenerPorId(id);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener el tour programado');
    }
  }
);

export const createTourProgramado = createAsyncThunk(
  'tourProgramado/create',
  async (tourProgramado: NuevoTourProgramadoRequest, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.crear(tourProgramado);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al crear el tour programado');
    }
  }
);

export const updateTourProgramado = createAsyncThunk(
  'tourProgramado/update',
  async ({ id, tourProgramado }: { id: number; tourProgramado: ActualizarTourProgramadoRequest }, { rejectWithValue }) => {
    try {
      await tourProgramadoRepo.actualizar(id, tourProgramado);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al actualizar el tour programado');
    }
  }
);

export const deleteTourProgramado = createAsyncThunk(
  'tourProgramado/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      await tourProgramadoRepo.eliminar(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al eliminar el tour programado');
    }
  }
);

export const asignarChofer = createAsyncThunk(
  'tourProgramado/asignarChofer',
  async ({ id, request }: { id: number; request: AsignarChoferRequest }, { rejectWithValue }) => {
    try {
      await tourProgramadoRepo.asignarChofer(id, request.id_chofer);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al asignar chofer al tour programado');
    }
  }
);

export const cambiarEstado = createAsyncThunk(
  'tourProgramado/cambiarEstado',
  async ({ id, estado }: { id: number; estado: string }, { rejectWithValue }) => {
    try {
      await tourProgramadoRepo.cambiarEstado(id, estado);
      return { id, estado };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al cambiar el estado del tour programado');
    }
  }
);

export const fetchToursByFecha = createAsyncThunk(
  'tourProgramado/fetchByFecha',
  async (fecha: string, { rejectWithValue }) => {
    try {
      const filtros: FiltrosTourProgramado = {
        fecha_inicio: fecha,
        fecha_fin: fecha
      };
      return await tourProgramadoRepo.listar(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours por fecha');
    }
  }
);

export const fetchToursByRangoFechas = createAsyncThunk(
  'tourProgramado/fetchByRangoFechas',
  async ({ fechaInicio, fechaFin }: { fechaInicio: string; fechaFin: string }, { rejectWithValue }) => {
    try {
      const filtros: FiltrosTourProgramado = {
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin
      };
      return await tourProgramadoRepo.listar(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours por rango de fechas');
    }
  }
);

export const fetchToursByEstado = createAsyncThunk(
  'tourProgramado/fetchByEstado',
  async (estado: string, { rejectWithValue }) => {
    try {
      const filtros: FiltrosTourProgramado = {
        estado: estado
      };
      return await tourProgramadoRepo.listar(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours por estado');
    }
  }
);

export const fetchToursDisponibles = createAsyncThunk(
  'tourProgramado/fetchDisponibles',
  async ({ fechaInicio, fechaFin, idSede }: { fechaInicio?: string; fechaFin?: string; idSede?: number } = {}, { rejectWithValue }) => {
    try {
      // Si no se proporcionan fechas, usar fecha actual para inicio y +30 días para fin
      const hoy = new Date();
      const fechaInicioDefault = fechaInicio || hoy.toISOString().split('T')[0];
      
      let fechaFinDefault = fechaFin;
      if (!fechaFinDefault) {
        const fechaFin = new Date();
        fechaFin.setDate(hoy.getDate() + 30);
        fechaFinDefault = fechaFin.toISOString().split('T')[0];
      }
      
      return await tourProgramadoRepo.obtenerToursDisponiblesEnRangoFechas(fechaInicioDefault, fechaFinDefault, idSede);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours disponibles');
    }
  }
);

export const fetchDisponibilidadDia = createAsyncThunk(
  'tourProgramado/fetchDisponibilidadDia',
  async ({ fecha, idSede }: { fecha: string; idSede?: number }, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.obtenerToursDisponiblesEnFecha(fecha, idSede);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener la disponibilidad para el día');
    }
  }
);

export const fetchProgramacionSemanal = createAsyncThunk(
  'tourProgramado/fetchProgramacionSemanal',
  async ({ fechaInicio, idSede }: { fechaInicio: string; idSede?: number }, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.obtenerProgramacionSemanal(fechaInicio, idSede);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener la programación semanal');
    }
  }
);

export const programarToursSemanal = createAsyncThunk(
  'tourProgramado/programarSemanal',
  async ({ fechaInicio, tourBase, cantidadDias = 7 }: { fechaInicio: string; tourBase: NuevoTourProgramadoRequest; cantidadDias?: number }, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.programarTourSemanal(fechaInicio, tourBase, cantidadDias);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al programar tours semanales');
    }
  }
);

export const forcedDeleteTourProgramado = createAsyncThunk(
  'tourProgramado/forcedDelete',
  async (id: number, { rejectWithValue }) => {
    try {
      // Usar el mismo método eliminar, ya que no existe "forceDelete" en el repositorio
      await tourProgramadoRepo.eliminar(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al forzar la eliminación del tour programado');
    }
  }
);

// Nuevos thunks para vigencia y disponibilidad
export const fetchToursByVigencia = createAsyncThunk(
  'tourProgramado/fetchByVigencia',
  async ({ vigenciaDesdeIni, vigenciaHastaIni }: { vigenciaDesdeIni: string; vigenciaHastaIni: string }, { rejectWithValue }) => {
    try {
      const filtros: FiltrosTourProgramado = {
        vigencia_desde_ini: vigenciaDesdeIni,
        vigencia_hasta_ini: vigenciaHastaIni
      };
      return await tourProgramadoRepo.listar(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours por vigencia');
    }
  }
);

export const fetchToursVigentes = createAsyncThunk(
  'tourProgramado/fetchVigentes',
  async (_, { rejectWithValue }) => {
    try {
      // Para obtener tours vigentes, usamos la fecha actual para filtrar
      const fechaActual = new Date().toISOString().split('T')[0];
      const filtros: FiltrosTourProgramado = {
        vigencia_desde_ini: fechaActual,
        vigencia_hasta_ini: fechaActual
      };
      return await tourProgramadoRepo.listar(filtros);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al obtener los tours vigentes');
    }
  }
);

export const verificarDisponibilidadHorario = createAsyncThunk(
  'tourProgramado/verificarDisponibilidad',
  async ({ idHorario, fecha }: { idHorario: number; fecha: string }, { rejectWithValue }) => {
    try {
      return await tourProgramadoRepo.verificarDisponibilidadHorario(idHorario, fecha);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error al verificar disponibilidad de horario');
    }
  }
);

const tourProgramadoSlice = createSlice({
  name: 'tourProgramado',
  initialState,
  reducers: {
    clearCurrentTour: (state) => {
      state.currentTour = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearCreatedId: (state) => {
      state.createdTourId = null;
    },
    clearCreatedIds: (state) => {
      state.createdTourIds = null;
    },
    clearDisponibilidadHorario: (state) => {
      state.disponibilidadHorario = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchToursProgramados
      .addCase(fetchToursProgramados.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursProgramados.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursProgramados.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // fetchTourProgramadoById
      .addCase(fetchTourProgramadoById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTourProgramadoById.fulfilled, (state, action: PayloadAction<TourProgramado>) => {
        state.loading = false;
        state.currentTour = action.payload;
      })
      .addCase(fetchTourProgramadoById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // createTourProgramado
      .addCase(createTourProgramado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTourProgramado.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.createdTourId = action.payload;
      })
      .addCase(createTourProgramado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // updateTourProgramado
      .addCase(updateTourProgramado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTourProgramado.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateTourProgramado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // deleteTourProgramado
      .addCase(deleteTourProgramado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTourProgramado.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.tours = state.tours.filter(tour => tour.id_tour_programado !== action.payload);
      })
      .addCase(deleteTourProgramado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Resto de acciones
      .addCase(asignarChofer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(asignarChofer.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(asignarChofer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(cambiarEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(cambiarEstado.fulfilled, (state, action: PayloadAction<{ id: number; estado: string }>) => {
        state.loading = false;
        const { id, estado } = action.payload;
        
        // Actualizar el estado en la lista
        const index = state.tours.findIndex(tour => tour.id_tour_programado === id);
        if (index !== -1) {
          state.tours[index].estado = estado as any;
        }
        
        // Actualizar el estado en el tour actual
        if (state.currentTour && state.currentTour.id_tour_programado === id) {
          state.currentTour.estado = estado as any;
        }
      })
      .addCase(cambiarEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Otras acciones
      .addCase(fetchToursByFecha.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursByFecha.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursByFecha.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchToursByRangoFechas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursByRangoFechas.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursByRangoFechas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchToursByEstado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursByEstado.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursByEstado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchToursDisponibles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursDisponibles.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursDisponibles.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchDisponibilidadDia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDisponibilidadDia.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchDisponibilidadDia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchProgramacionSemanal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProgramacionSemanal.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchProgramacionSemanal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(programarToursSemanal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(programarToursSemanal.fulfilled, (state, action: PayloadAction<number[]>) => {
        state.loading = false;
        state.createdTourIds = action.payload;
      })
      .addCase(programarToursSemanal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(forcedDeleteTourProgramado.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forcedDeleteTourProgramado.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.tours = state.tours.filter(tour => tour.id_tour_programado !== action.payload);
      })
      .addCase(forcedDeleteTourProgramado.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Nuevos casos para los thunks de vigencia
      .addCase(fetchToursByVigencia.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursByVigencia.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursByVigencia.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(fetchToursVigentes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToursVigentes.fulfilled, (state, action: PayloadAction<TourProgramado[]>) => {
        state.loading = false;
        state.tours = action.payload;
      })
      .addCase(fetchToursVigentes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      
      .addCase(verificarDisponibilidadHorario.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.disponibilidadHorario = null;
      })
      .addCase(verificarDisponibilidadHorario.fulfilled, (state, action: PayloadAction<DisponibilidadHorario>) => {
        state.loading = false;
        state.disponibilidadHorario = action.payload;
      })
      .addCase(verificarDisponibilidadHorario.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.disponibilidadHorario = { disponible: false };
      });
  }
});

export const { clearCurrentTour, clearError, clearCreatedId, clearCreatedIds, clearDisponibilidadHorario } = tourProgramadoSlice.actions;
export default tourProgramadoSlice.reducer;