// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'

export const preSaldoDisponibleSlice = createSlice({
  name: 'preSaldoDisponible',
  initialState: {
    preSaldoDisponibleSeleccionado: {} as IListIcpPucConDisponible,
    verPreSaldoDisponibleActive: false
  },
  reducers: {
    setPreSaldoDisponibleSeleccionado: (state, action) => {
      state.preSaldoDisponibleSeleccionado = action.payload
    },

    setVerPreSaldoDisponibleActive: (state, action) => {
      state.verPreSaldoDisponibleActive = action.payload
    }
  }
})

export const { setPreSaldoDisponibleSeleccionado, setVerPreSaldoDisponibleActive } = preSaldoDisponibleSlice.actions
