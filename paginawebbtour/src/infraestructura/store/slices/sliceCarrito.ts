import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ItemCarrito {
  id: number;
  tourId: number;
  nombre: string;
  precio: number;
  cantidad: number;
  tipoPasaje: string;
  fecha: string;
  imagen?: string;
}

interface CarritoState {
  items: ItemCarrito[];
  total: number;
}

const initialState: CarritoState = {
  items: [],
  total: 0
};

const carritoSlice = createSlice({
  name: 'carrito',
  initialState,
  reducers: {
    agregarAlCarrito: (state, action: PayloadAction<ItemCarrito>) => {
      const existeItem = state.items.find(
        item => item.tourId === action.payload.tourId && 
                item.tipoPasaje === action.payload.tipoPasaje && 
                item.fecha === action.payload.fecha
      );

      if (existeItem) {
        existeItem.cantidad += action.payload.cantidad;
      } else {
        state.items.push({
          ...action.payload,
          id: Date.now() // Generar un ID único
        });
      }

      // Recalcular total
      state.total = state.items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
    },
    
    eliminarDelCarrito: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      
      // Recalcular total
      state.total = state.items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
    },
    
    actualizarCantidad: (state, action: PayloadAction<{ id: number; cantidad: number }>) => {
      const item = state.items.find(item => item.id === action.payload.id);
      
      if (item) {
        item.cantidad = action.payload.cantidad;
      }
      
      // Recalcular total
      state.total = state.items.reduce(
        (sum, item) => sum + item.precio * item.cantidad,
        0
      );
    },
    
    vaciarCarrito: (state) => {
      state.items = [];
      state.total = 0;
    }
  }
});

export const { agregarAlCarrito, eliminarDelCarrito, actualizarCantidad, vaciarCarrito } = carritoSlice.actions;
export default carritoSlice.reducer;