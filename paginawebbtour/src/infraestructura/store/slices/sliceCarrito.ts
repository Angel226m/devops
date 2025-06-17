import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InstanciaTour } from "../../../dominio/entidades/InstanciaTour";
import { TipoPasaje } from "../../../dominio/entidades/TipoPasaje";
import { PaquetePasajes } from "../../../dominio/entidades/PaquetePasajes";

// Interfaces para el carrito
export interface ItemCarritoPasaje {
  tipoPasaje: TipoPasaje;
  cantidad: number;
}

export interface ItemCarritoPaquete {
  paquete: PaquetePasajes;
  cantidad: number;
}

export interface ItemCarrito {
  instanciaTour: InstanciaTour;
  pasajes: ItemCarritoPasaje[];
  paquetes: ItemCarritoPaquete[];
  subtotal: number;
  fechaAgregado: string;
}

export interface CarritoState {
  items: ItemCarrito[];
  total: number;
}

// Función para cargar el carrito desde localStorage
const cargarCarritoDeLocalStorage = (): CarritoState => {
  if (typeof window === 'undefined') {
    return { items: [], total: 0 };
  }
  
  const carritoGuardado = localStorage.getItem('carrito');
  if (carritoGuardado) {
    try {
      return JSON.parse(carritoGuardado);
    } catch (error) {
      console.error('Error al parsear el carrito desde localStorage:', error);
      return { items: [], total: 0 };
    }
  }
  return { items: [], total: 0 };
};

// Función para guardar el carrito en localStorage
const guardarCarritoEnLocalStorage = (carrito: CarritoState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('carrito', JSON.stringify(carrito));
  }
};

// Función para calcular el total del carrito
const calcularTotal = (items: ItemCarrito[]): number => {
  return items.reduce((total, item) => total + item.subtotal, 0);
};

// Estado inicial del carrito
const initialState: CarritoState = cargarCarritoDeLocalStorage();

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarAlCarrito: (state, action: PayloadAction<ItemCarrito>) => {
      // Verificar si ya existe un tour con el mismo ID
      const index = state.items.findIndex(
        item => item.instanciaTour.id_instancia === action.payload.instanciaTour.id_instancia
      );
      
      if (index >= 0) {
        // Si existe, actualizarlo
        state.items[index] = action.payload;
      } else {
        // Si no existe, agregarlo
        state.items.push(action.payload);
      }
      
      // Recalcular el total
      state.total = calcularTotal(state.items);
      
      // Guardar en localStorage
      guardarCarritoEnLocalStorage(state);
    },
    
    eliminarDelCarrito: (state, action: PayloadAction<number>) => {
      // Eliminar el item por el ID de instancia de tour
      state.items = state.items.filter(
        item => item.instanciaTour.id_instancia !== action.payload
      );
      
      // Recalcular el total
      state.total = calcularTotal(state.items);
      
      // Guardar en localStorage
      guardarCarritoEnLocalStorage(state);
    },
    
    actualizarCantidadPasaje: (state, action: PayloadAction<{
      idInstanciaTour: number;
      idTipoPasaje: number;
      cantidad: number;
    }>) => {
      const { idInstanciaTour, idTipoPasaje, cantidad } = action.payload;
      
      // Encontrar el ítem del carrito
      const itemIndex = state.items.findIndex(
        item => item.instanciaTour.id_instancia === idInstanciaTour
      );
      
      if (itemIndex >= 0) {
        // Encontrar el pasaje
        const pasajeIndex = state.items[itemIndex].pasajes.findIndex(
          p => p.tipoPasaje.id_tipo_pasaje === idTipoPasaje
        );
        
        if (pasajeIndex >= 0) {
          // Actualizar cantidad
          state.items[itemIndex].pasajes[pasajeIndex].cantidad = cantidad;
          
          // Recalcular subtotal del ítem
          const subtotal = state.items[itemIndex].pasajes.reduce(
            (sum, p) => sum + p.tipoPasaje.costo * p.cantidad, 0
          ) + state.items[itemIndex].paquetes.reduce(
            (sum, pq) => sum + pq.paquete.precio_total * pq.cantidad, 0
          );
          
          state.items[itemIndex].subtotal = subtotal;
          
          // Recalcular total
          state.total = calcularTotal(state.items);
          
          // Guardar en localStorage
          guardarCarritoEnLocalStorage(state);
        }
      }
    },
    
    actualizarCantidadPaquete: (state, action: PayloadAction<{
      idInstanciaTour: number;
      idPaquete: number;
      cantidad: number;
    }>) => {
      const { idInstanciaTour, idPaquete, cantidad } = action.payload;
      
      // Encontrar el ítem del carrito
      const itemIndex = state.items.findIndex(
        item => item.instanciaTour.id_instancia === idInstanciaTour
      );
      
      if (itemIndex >= 0) {
        // Encontrar el paquete
        const paqueteIndex = state.items[itemIndex].paquetes.findIndex(
          pq => pq.paquete.id_paquete === idPaquete
        );
        
        if (paqueteIndex >= 0) {
          // Actualizar cantidad
          state.items[itemIndex].paquetes[paqueteIndex].cantidad = cantidad;
          
          // Recalcular subtotal del ítem
          const subtotal = state.items[itemIndex].pasajes.reduce(
            (sum, p) => sum + p.tipoPasaje.costo * p.cantidad, 0
          ) + state.items[itemIndex].paquetes.reduce(
            (sum, pq) => sum + pq.paquete.precio_total * pq.cantidad, 0
          );
          
          state.items[itemIndex].subtotal = subtotal;
          
          // Recalcular total
          state.total = calcularTotal(state.items);
          
          // Guardar en localStorage
          guardarCarritoEnLocalStorage(state);
        }
      }
    },
    
    vaciarCarrito: (state) => {
      state.items = [];
      state.total = 0;
      
      // Guardar en localStorage
      guardarCarritoEnLocalStorage(state);
    }
  }
});

export const { 
  agregarAlCarrito, 
  eliminarDelCarrito, 
  actualizarCantidadPasaje, 
  actualizarCantidadPaquete,
  vaciarCarrito 
} = carritoSlice.actions;

export default carritoSlice.reducer;