 
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LenguajeState {
  idioma: string;
}

const initialState: LenguajeState = {
  idioma: localStorage.getItem('idioma') || 'es'
};

const lenguajeSlice = createSlice({
  name: 'lenguaje',
  initialState,
  reducers: {
    cambiarIdioma: (state, action: PayloadAction<string>) => {
      state.idioma = action.payload;
      localStorage.setItem('idioma', action.payload);
    }
  }
});

export const { cambiarIdioma } = lenguajeSlice.actions;
export default lenguajeSlice.reducer;