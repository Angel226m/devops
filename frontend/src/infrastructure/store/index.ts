 /*


import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer, { AuthState } from './slices/authSlice';
import usuarioReducer, { UsuarioState } from './slices/usuarioSlice';
import embarcacionReducer, { EmbarcacionState } from './slices/embarcacionSlice';
import sedeReducer, { SedeState } from './slices/sedeSlice';
import idiomaReducer, { IdiomaState } from './slices/idiomaSlice';
import tipoTourReducer, { TipoTourState } from './slices/tipoTourSlice';
 

// Definición explícita de RootState
export interface RootState {
  auth: AuthState;
  usuario: UsuarioState;
  embarcacion: EmbarcacionState;
  sede: SedeState;
  idioma: IdiomaState;
  tipoTour: TipoTourState;
 
  // Agrega otros reducers aquí
}

// Configura la tienda Redux con todos los reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    usuario: usuarioReducer,
    embarcacion: embarcacionReducer,
    sede: sedeReducer,
    idioma: idiomaReducer,
    tipoTour: tipoTourReducer,
  
    // Agrega otros reducers según sea necesario
  },
  // Middleware opcional y otras configuraciones
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
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
  // Agrega otros reducers aquí
}

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
    paquetePasajes: paquetePasajesReducer
    // Agrega otros reducers según sea necesario
  },
  // Middleware opcional y otras configuraciones
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
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