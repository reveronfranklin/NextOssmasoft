// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IBmPlacaCuarentenaResponseDto } from 'src/interfaces/Bm/BmPlacasCuarentena/BmPlacaCuarentenaResponseDto'
import { IBmPlacaDto } from 'src/interfaces/Bm/BmPlacasCuarentena/BmPlacas'

export const bmPlacaCuarentenaSlice = createSlice({
  name: 'bmBm1',
  initialState: {
    bmPlacaCuarentenaSeleccionado: {} as IBmPlacaCuarentenaResponseDto,
    operacionCrudBmPlacaCuarentena: 0,
    verBmPlacaCuarentenaActive: false,
    listPlacas: [] as IBmPlacaDto[]
  },
  reducers: {
    setBmPlacaCuarentenaSeleccionado: (state, action) => {
      state.bmPlacaCuarentenaSeleccionado = action.payload
    },

    setVerBmPlacaCuarentenaActive: (state, action) => {
      state.verBmPlacaCuarentenaActive = action.payload
    },
    setOperacionCrudBmPlacaCuarentena: (state, action) => {
      state.operacionCrudBmPlacaCuarentena = action.payload
    },
    setListPlacas: (state, action) => {
      state.listPlacas = action.payload
    }
  }
})

export const {
  setBmPlacaCuarentenaSeleccionado,
  setVerBmPlacaCuarentenaActive,
  setOperacionCrudBmPlacaCuarentena,
  setListPlacas
} = bmPlacaCuarentenaSlice.actions
