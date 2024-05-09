// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPrePucSolModificacionResponseDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionResponseDto'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'

export const prePucSolModificacionSlice = createSlice({
  name: 'prePucSolModificacion',
  initialState: {
    prePucSolModificacionSeleccionado: {} as IPrePucSolModificacionResponseDto,
    listFinanciado: [] as ISelectListDescriptiva[],
    verPrePucSolModificacionActive: false,
    operacionCrudPrePucSolModificacion: 0,
    verPrePucSolModificacionUpdateActive: false,
    operacionCrudPrePucSolModificacionUpdate: 0,
    totalDescontar: 0,
    totalAportar: 0
  },
  reducers: {
    setPrePucSolModificacionSeleccionado: (state, action) => {
      state.prePucSolModificacionSeleccionado = action.payload
    },
    setListFinanciado: (state, action) => {
      state.listFinanciado = action.payload
    },
    setVerPrePucSolModificacionActive: (state, action) => {
      state.verPrePucSolModificacionActive = action.payload
    },
    setOperacionCrudPrePucSolModificacion: (state, action) => {
      state.operacionCrudPrePucSolModificacion = action.payload
    },
    setVerPrePucSolModificacionUpdateActive: (state, action) => {
      state.verPrePucSolModificacionUpdateActive = action.payload
    },
    setOperacionCrudPrePucSolModificacionUpdate: (state, action) => {
      state.operacionCrudPrePucSolModificacionUpdate = action.payload
    },
    setTotalDescontar: (state, action) => {
      state.totalDescontar = action.payload
    },
    setTotalAportar: (state, action) => {
      state.totalAportar = action.payload
    }
  }
})

export const {
  setPrePucSolModificacionSeleccionado,
  setVerPrePucSolModificacionActive,
  setOperacionCrudPrePucSolModificacion,
  setListFinanciado,
  setVerPrePucSolModificacionUpdateActive,
  setOperacionCrudPrePucSolModificacionUpdate,
  setTotalDescontar,
  setTotalAportar
} = prePucSolModificacionSlice.actions
