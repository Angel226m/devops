 
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  canalesVenta: [],
  canalActual: null,
  cargando: false,
  error: null
};

const sliceCanalVenta = createSlice({
  name: 'canalVenta',
  initialState,
  reducers: {}
});

export default sliceCanalVenta.reducer;