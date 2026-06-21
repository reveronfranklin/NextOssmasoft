import { createSlice } from '@reduxjs/toolkit'
import { IRhDocumentoResponseDto } from 'src/interfaces/rh/RhDocumentoResponseDto'

export const defaultRhDocumento: IRhDocumentoResponseDto = {
  codigoPersona: 0,
  codigoDocumento: 0,
  tipoDocumentoId: 0,
  tipoDocumento: '',
  numeroDocumento: '',
  fechaVencimiento: null,
  tipoGradoId: 0,
  tipoGrado: '',
  gradoId: 0,
  grado: '',
  extra1: '',
  extra2: '',
  extra3: '',
  usuarioIns: 1,
  fechaIns: null,
  usuarioUpd: null,
  fechaUpd: null,
  codigoEmpresa: 0,
  persona: ''
}

export const rhDocumentosSlice = createSlice({
  name: 'rhDocumentos',
  initialState: {
    rhDocumentoSeleccionado: defaultRhDocumento,
    verRhDocumentoActive: false,
    operacionCrudRhDocumento: 0
  },
  reducers: {
    setRhDocumentoSeleccionado: (state, action) => {
      state.rhDocumentoSeleccionado = action.payload
    },
    setVerRhDocumentoActive: (state, action) => {
      state.verRhDocumentoActive = action.payload
    },
    setOperacionCrudRhDocumento: (state, action) => {
      state.operacionCrudRhDocumento = action.payload
    }
  }
})

export const {
  setRhDocumentoSeleccionado,
  setVerRhDocumentoActive,
  setOperacionCrudRhDocumento
} = rhDocumentosSlice.actions
