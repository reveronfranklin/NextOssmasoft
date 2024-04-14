// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { RhListOficinaDto } from 'src/interfaces/rh/Recibos/RhReporteNominaResponseDto'

export const rhListOficinaSlice = createSlice({
  name: 'rhListOficina',
  initialState: {
    rhListOficinaSeleccionado: {} as RhListOficinaDto,
    listRhListOficina: [] as RhListOficinaDto[]
  },
  reducers: {
    setRhListOficinaSeleccionado: (state, action) => {
      state.rhListOficinaSeleccionado = action.payload
    },
    setListRhListOficina: (state, action) => {
      state.listRhListOficina = action.payload
    }
  }
})

export const { setRhListOficinaSeleccionado, setListRhListOficina } = rhListOficinaSlice.actions
