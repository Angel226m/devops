import { configureStore } from '@reduxjs/toolkit';
// Importa tus slices existentes y sus tipos
import tipoTourReducer, { TipoTourState } from './slices/sliceTipoTour';
import galeriaTourReducer, { GaleriaTourState } from './slices/sliceGaleriaTour';
// Importa los demás reducers que ya tengas en tu aplicación
import tipoPasajeReducer, { TipoPasajeState } from "./slices/sliceTipoPasaje";
import paquetePasajesReducer, { PaquetePasajesState } from "./slices/slicePaquetePasajes";
import instanciaTourReducer, { InstanciaTourState } from "./slices/sliceInstanciaTour";
import tourProgramadoReducer, { TourProgramadoState } from "./slices/sliceTourProgramado";
// Define la estructura del estado completo de la aplicación
export interface AppState {
  // Otros estados que ya tengas en tu aplicación
  tipoTour: TipoTourState;
  galeriaTour: GaleriaTourState;
  tipoPasaje: TipoPasajeState;
  paquetePasajes: PaquetePasajesState;
  instanciaTour: InstanciaTourState;
  tourProgramado: TourProgramadoState;
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
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;


