 
import { configureStore } from '@reduxjs/toolkit';
import sliceAutenticacion from './slices/sliceAutenticacion';
import sliceCanalVenta from './slices/sliceCanalVenta';
import sliceCarrito from './slices/sliceCarrito';
import sliceHorarioChofer from './slices/sliceHorarioChofer';
import sliceCliente from './slices/sliceCliente';
import sliceComprobantePago from './slices/sliceComprobantePago';
import sliceEmbarcacion from './slices/sliceEmbarcacion';
import sliceHorarioTour from './slices/sliceHorarioTour';
import sliceIdioma from './slices/sliceIdioma';
import sliceLenguaje from './slices/sliceLenguaje';
import sliceMetodoPago from './slices/sliceMetodoPago';
import slicePago from './slices/slicePago';
import slicePaquetePasajes from './slices/slicePaquetePasajes';
import sliceCantidadPasajes from './slices/sliceCantidadPasajes';
import sliceReserva from './slices/sliceReserva';
import sliceSede from './slices/sliceSede';
import sliceTipoPasaje from './slices/sliceTipoPasaje';
import sliceTipoTour from './slices/sliceTipoTour';
import sliceTourProgramado from './slices/sliceTourProgramado';
import sliceTour from './slices/sliceTour';
import sliceUsuario from './slices/sliceUsuario';

// Crear un slice vacío para cumplir con las importaciones
const createEmptySlice = (name: string) => ({
  name,
  initialState: {},
  reducers: {},
});

// Configurar el store de Redux
export const store = configureStore({
  reducer: {
    autenticacion: sliceAutenticacion,
    canalVenta: sliceCanalVenta,
    carrito: sliceCarrito,
    horarioChofer: sliceHorarioChofer,
    cliente: sliceCliente,
    comprobantePago: sliceComprobantePago,
    embarcacion: sliceEmbarcacion,
    horarioTour: sliceHorarioTour,
    idioma: sliceIdioma,
    lenguaje: sliceLenguaje,
    metodoPago: sliceMetodoPago,
    pago: slicePago,
    paquetePasajes: slicePaquetePasajes,
    cantidadPasajes: sliceCantidadPasajes,
    reserva: sliceReserva,
    sede: sliceSede,
    tipoPasaje: sliceTipoPasaje,
    tipoTour: sliceTipoTour,
    tourProgramado: sliceTourProgramado,
    tour: sliceTour,
    usuario: sliceUsuario,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

// Tipos para TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;