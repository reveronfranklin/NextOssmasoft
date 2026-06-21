import { createSlice } from '@reduxjs/toolkit'
import { OssUsuarioRolResponseDto } from 'src/sis/usuarioRol/interfaces/OssUsuarioRolDtos'

export const defaultOssUsuarioRol: OssUsuarioRolResponseDto = {
  codigoUsuarioRol: 0,
  usuario: '',
  codigoUsuario: 0,
  descripcion: '',
  jsonMenu: []
}

export const ossUsuarioRolSlice = createSlice({
  name: 'ossUsuarioRol',
  initialState: {
    ossUsuarioRolSeleccionado: defaultOssUsuarioRol,
    verOssUsuarioRolActive: false,
    operacionCrudOssUsuarioRol: 0
  },
  reducers: {
    setOssUsuarioRolSeleccionado: (state, action) => {
      state.ossUsuarioRolSeleccionado = action.payload
    },
    setVerOssUsuarioRolActive: (state, action) => {
      state.verOssUsuarioRolActive = action.payload
    },
    setOperacionCrudOssUsuarioRol: (state, action) => {
      state.operacionCrudOssUsuarioRol = action.payload
    }
  }
})

export const {
  setOssUsuarioRolSeleccionado,
  setVerOssUsuarioRolActive,
  setOperacionCrudOssUsuarioRol
} = ossUsuarioRolSlice.actions
