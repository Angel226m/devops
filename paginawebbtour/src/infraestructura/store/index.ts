/*import { configureStore } from '@reduxjs/toolkit';
// Importa tus slices existentes y sus tipos
import tipoTourReducer, { TipoTourState } from './slices/sliceTipoTour';
import galeriaTourReducer, { GaleriaTourState } from './slices/sliceGaleriaTour';
// Importa los demás reducers que ya tengas en tu aplicación
import tipoPasajeReducer, { TipoPasajeState } from "./slices/sliceTipoPasaje";
import paquetePasajesReducer, { PaquetePasajesState } from "./slices/slicePaquetePasajes";
import instanciaTourReducer, { InstanciaTourState } from "./slices/sliceInstanciaTour";
import tourProgramadoReducer, { TourProgramadoState } from "./slices/sliceTourProgramado";
import autenticacionReducer, { EstadoAutenticacion } from "./slices/sliceAutenticacion";

// Define la estructura del estado completo de la aplicación
export interface AppState {
  // Otros estados que ya tengas en tu aplicación
  tipoTour: TipoTourState;
  galeriaTour: GaleriaTourState;
  tipoPasaje: TipoPasajeState;
  paquetePasajes: PaquetePasajesState;
  instanciaTour: InstanciaTourState;
  tourProgramado: TourProgramadoState;
    autenticacion: EstadoAutenticacion;

}

export const store = configureStore({
  reducer: {
    // Tus reducers existentes
    tipoTour: tipoTourReducer,
    galeriaTour: galeriaTourReducer,
  tipoPasaje: tipoPasajeReducer,
    paquetePasajes: paquetePasajesReducer,
    instanciaTour: instanciaTourReducer,
    tourProgramado: tourProgramadoReducer,
        autenticacion: autenticacionReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


*/

import { configureStore } from '@reduxjs/toolkit';
// Importa tus slices existentes y sus tipos
import tipoTourReducer, { TipoTourState } from './slices/sliceTipoTour';
import galeriaTourReducer, { GaleriaTourState } from './slices/sliceGaleriaTour';
// Importa los demás reducers que ya tengas en tu aplicación
import tipoPasajeReducer, { TipoPasajeState } from "./slices/sliceTipoPasaje";
import paquetePasajesReducer, { PaquetePasajesState } from "./slices/slicePaquetePasajes";
import instanciaTourReducer, { InstanciaTourState } from "./slices/sliceInstanciaTour";
import tourProgramadoReducer, { TourProgramadoState } from "./slices/sliceTourProgramado";
import autenticacionReducer, { EstadoAutenticacion } from "./slices/sliceAutenticacion";
import reservaReducer, { ReservaState } from './slices/sliceReserva';
import carritoReducer, { CarritoState } from './slices/sliceCarrito';

// Define la estructura del estado completo de la aplicación
export interface AppState {
  // Otros estados que ya tengas en tu aplicación
  tipoTour: TipoTourState;
  galeriaTour: GaleriaTourState;
  tipoPasaje: TipoPasajeState;
  paquetePasajes: PaquetePasajesState;
  instanciaTour: InstanciaTourState;
  tourProgramado: TourProgramadoState;
    autenticacion: EstadoAutenticacion;
  reserva: ReservaState;
  carrito: CarritoState;

}

export const store = configureStore({
  reducer: {
    // Tus reducers existentes
    tipoTour: tipoTourReducer,
    galeriaTour: galeriaTourReducer,
  tipoPasaje: tipoPasajeReducer,
    paquetePasajes: paquetePasajesReducer,
    instanciaTour: instanciaTourReducer,
    tourProgramado: tourProgramadoReducer,
        autenticacion: autenticacionReducer,
    reserva: reservaReducer,
    carrito: carritoReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;