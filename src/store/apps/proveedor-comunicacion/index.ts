import { createSlice } from '@reduxjs/toolkit'
import { ISelectListDescriptiva } from 'src/adm/proveedor/interfaces/common/select-list-descriptivas.interfaces'
import { ComunicacionResponse } from 'src/adm/proveedor/interfaces'

export const admProveedorSlice = createSlice({
  name: 'admProveedor',
  initialState: {
    proveedorSeleccionado: {} as ComunicacionResponse,
    listProveedores: [] as ComunicacionResponse[],
    verProveedorActive: false,
    operacionCrudProveedor: 0,
    tipoProveedorSeleccionado: {} as ISelectListDescriptiva,
    listTipoProveedor: [] as ISelectListDescriptiva[],
  },
  reducers: {
    setProveedorSeleccionado: (state, action) => {
      state.proveedorSeleccionado = action.payload
    },
    setListProveedores: (state, action) => {
      state.listProveedores = action.payload
    },
    setTipoProveedorSeleccionado: (state, action) => {
      state.tipoProveedorSeleccionado = action.payload
    },
    setListTipoProveedor: (state, action) => {
      state.listTipoProveedor = action.payload
    },
    setVerProveedorActive: (state, action) => {
      state.verProveedorActive = action.payload
    },
    setOperacionCrudProveedor: (state, action) => {
      state.operacionCrudProveedor = action.payload
    },
  },
})

export const {
  setProveedorSeleccionado,
  setListProveedores,
  setTipoProveedorSeleccionado,
  setListTipoProveedor,
  setVerProveedorActive,
  setOperacionCrudProveedor,
} = admProveedorSlice.actions

export default admProveedorSlice
