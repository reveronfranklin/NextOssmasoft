// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreSolModificacionResponseDto } from 'src/interfaces/Presupuesto/PreSolicitudModificacion/PreSolModificacionResponseDto'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'

export const preSolModificacionSlice = createSlice({
  name: 'preSolModificacion',
  initialState: {
    preSolModificacionSeleccionado: {} as IPreSolModificacionResponseDto,
    listPreSolModificacionCreate: [] as IPreSolModificacionResponseDto[],
    listTipoModificacion: [] as ISelectListDescriptiva[],
    verPreSolModificacionActive: false,
    operacionCrudPreSolModificacion: 0
  },
  reducers: {
    setPreSolModificacionSeleccionado: (state, action) => {
      state.preSolModificacionSeleccionado = action.payload
    },
    setVerPreSolModificacionActive: (state, action) => {
      state.verPreSolModificacionActive = action.payload
    },
    setOperacionCrudPreSolModificacion: (state, action) => {
      state.operacionCrudPreSolModificacion = action.payload
    },
    setListTipoModificacion: (state, action) => {
      state.listTipoModificacion = action.payload
    }
  }
})

export const {
  setPreSolModificacionSeleccionado,
  setVerPreSolModificacionActive,
  setOperacionCrudPreSolModificacion,
  setListTipoModificacion
} = preSolModificacionSlice.actions
