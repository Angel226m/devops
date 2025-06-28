 /*
import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer, { AuthState } from './slices/authSlice';
import usuarioReducer, { UsuarioState } from './slices/usuarioSlice';
import embarcacionReducer, { EmbarcacionState } from './slices/embarcacionSlice';
import sedeReducer, { SedeState } from './slices/sedeSlice';
import idiomaReducer, { IdiomaState } from './slices/idiomaSlice';
import tipoTourReducer, { TipoTourState } from './slices/tipoTourSlice';
import horarioTourReducer, { HorarioTourState } from './slices/horarioTourSlice';
import choferHorarioReducer, { ChoferHorarioState } from './slices/choferHorarioSlice';
import tipoPasajeReducer, { TipoPasajeState } from './slices/tipoPasajeSlice';
import paquetePasajesReducer, { PaquetePasajesState } from './slices/paquetePasajesSlice';
import galeriaTourReducer, { GaleriaTourState } from './slices/galeriaTourSlice';

// Importar el repositorio y axios
import { GaleriaTourRepoHttp } from '../repositories/GaleriaTourRepoHttp';
import axiosClient from '../api/axiosClient';

// Definición explícita de RootState
export interface RootState {
  auth: AuthState;
  usuario: UsuarioState;
  embarcacion: EmbarcacionState;
  sede: SedeState;
  idioma: IdiomaState;
  tipoTour: TipoTourState;
  horarioTour: HorarioTourState;
  choferHorario: ChoferHorarioState;
  tipoPasaje: TipoPasajeState;
  paquetePasajes: PaquetePasajesState;
  galeriaTour: GaleriaTourState;
  // Agrega otros reducers aquí
}

// Crear una instancia del repositorio
const galeriaTourRepository = new GaleriaTourRepoHttp(axiosClient);

// Configura la tienda Redux con todos los reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuario: usuarioReducer,
    embarcacion: embarcacionReducer,
    sede: sedeReducer,
    idioma: idiomaReducer,
    tipoTour: tipoTourReducer,
    horarioTour: horarioTourReducer,
    choferHorario: choferHorarioReducer,
    tipoPasaje: tipoPasajeReducer,
    paquetePasajes: paquetePasajesReducer,
    galeriaTour: galeriaTourReducer
    // Agrega otros reducers según sea necesario
  },
  // Middleware opcional y otras configuraciones
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          galeriaTourRepository // Agrega el repositorio como extraArgument
        }
      },
      serializableCheck: {
        // Ignora ciertas acciones o paths para evitar errores de serializabilidad
        ignoredActions: ['auth/login/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

// Hook opcional para usar dispatch tipado
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;*/



import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer, { AuthState } from './slices/authSlice';
import usuarioReducer, { UsuarioState } from './slices/usuarioSlice';
import embarcacionReducer, { EmbarcacionState } from './slices/embarcacionSlice';
import sedeReducer, { SedeState } from './slices/sedeSlice';
import idiomaReducer, { IdiomaState } from './slices/idiomaSlice';
import tipoTourReducer, { TipoTourState } from './slices/tipoTourSlice';
import horarioTourReducer, { HorarioTourState } from './slices/horarioTourSlice';
import choferHorarioReducer, { ChoferHorarioState } from './slices/choferHorarioSlice';
import tipoPasajeReducer, { TipoPasajeState } from './slices/tipoPasajeSlice';
import paquetePasajesReducer, { PaquetePasajesState } from './slices/paquetePasajesSlice';
import galeriaTourReducer, { GaleriaTourState } from './slices/galeriaTourSlice';
import tourProgramadoReducer, { TourProgramadoState } from './slices/tourProgramadoSlice';
import instanciaTourReducer, { InstanciaTourState } from './slices/instanciaTourSlice';
  import clienteReducer, { ClienteState } from './slices/clienteSlice';

// Importar el repositorio y axios
import { GaleriaTourRepoHttp } from '../repositories/GaleriaTourRepoHttp';
import { TourProgramadoRepoHttp } from '../repositories/TourProgramadoRepoHttp';
import { InstanciaTourRepoHttp } from '../repositories/InstanciaTourRepoHttp';
 
import reservaReducer, { ReservaState } from './slices/reservaSlice';
import pagoReducer, { PagoState } from './slices/pagoSlice';


import axiosClient from '../api/axiosClient';

// Definición explícita de RootState
export interface RootState {
  auth: AuthState;
  usuario: UsuarioState;
  embarcacion: EmbarcacionState;
  sede: SedeState;
  idioma: IdiomaState;
  tipoTour: TipoTourState;
  horarioTour: HorarioTourState;
  choferHorario: ChoferHorarioState;
  tipoPasaje: TipoPasajeState;
  paquetePasajes: PaquetePasajesState;
  galeriaTour: GaleriaTourState;
  tourProgramado: TourProgramadoState;
    instanciaTour: InstanciaTourState;    
      cliente: ClienteState;
  reserva: ReservaState;

  pago: PagoState;

  // Agrega otros reducers aquí
}

// Crear instancias de los repositorios
const galeriaTourRepository = new GaleriaTourRepoHttp(axiosClient);
const tourProgramadoRepository = new TourProgramadoRepoHttp();
const instanciaTourRepository = new InstanciaTourRepoHttp( );

// Configura la tienda Redux con todos los reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuario: usuarioReducer,
    embarcacion: embarcacionReducer,
    sede: sedeReducer,
    idioma: idiomaReducer,
    tipoTour: tipoTourReducer,
    horarioTour: horarioTourReducer,
    choferHorario: choferHorarioReducer,
    tipoPasaje: tipoPasajeReducer,
    paquetePasajes: paquetePasajesReducer,
    galeriaTour: galeriaTourReducer,
    tourProgramado: tourProgramadoReducer,
    instanciaTour: instanciaTourReducer,
            cliente: clienteReducer,
    reserva: reservaReducer,
    pago: pagoReducer,


    // Agrega otros reducers según sea necesario
  },
  // Middleware opcional y otras configuraciones
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: {
          galeriaTourRepository, // Agrega el repositorio como extraArgument
          tourProgramadoRepository,
          instanciaTourRepository
        }
      },
      serializableCheck: {
        // Ignora ciertas acciones o paths para evitar errores de serializabilidad
        ignoredActions: ['auth/login/fulfilled'],
        ignoredPaths: ['auth.user'],
      },
    }),
});

export type AppDispatch = typeof store.dispatch;

// Hook opcional para usar dispatch tipado
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default store;