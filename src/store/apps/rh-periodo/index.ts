// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhPeriodosResponseDto } from 'src/interfaces/rh/Periodos/RhPeriodosResponseDto'

export const rhPeriodoSlice = createSlice({
  name: 'rhPeriodo',
  initialState: {
    rhPeriodoSeleccionado: {} as IRhPeriodosResponseDto,
    listRhPeriodo: [] as IRhPeriodosResponseDto[],
    verRhPeriodoActive: false,
    operacionCrudRhPeriodo: 0
  },
  reducers: {
    setRhPeriodoSeleccionado: (state, action) => {
      state.rhPeriodoSeleccionado = action.payload
    },
    setListRhPeriodo: (state, action) => {
      state.listRhPeriodo = action.payload
    },
    setVerRhPeriodoActive: (state, action) => {
      state.verRhPeriodoActive = action.payload
    },
    setOperacionCrudRhPeriodo: (state, action) => {
      state.operacionCrudRhPeriodo = action.payload
    }
  }
})

export const { setRhPeriodoSeleccionado, setListRhPeriodo, setVerRhPeriodoActive, setOperacionCrudRhPeriodo } =
  rhPeriodoSlice.actions
