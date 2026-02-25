// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

// ** Interfaces
import { IProveedor } from 'src/adm/proveedor/interfaces/proveedor/proveedor.interfaces'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'

export const proveedorSlice = createSlice({
  name: 'proveedor',
  initialState: {
    proveedores: [] as IProveedor[],
    proveedoresDto: [] as IProveedor[],
    proveedorSeleccionado: {} as IProveedor,
    proveedoresDtoSeleccionado: {} as IProveedor,

    isLoading: false,

    verProveedorActive: false,
    operacionCrudProveedor: 0,

    listPaises: [] as ISelectListDescriptiva[],
    listEstados: [] as ISelectListDescriptiva[]
  },
  reducers: {
    startLoadingProveedor: state => {
      state.isLoading = true
    },
    stopLoadingProveedor: state => {
      state.isLoading = false
    },

    setProveedores: (state, action) => {
      state.isLoading = false
      state.proveedores = action.payload
    },

    setProveedorSeleccionado: (state, action) => {
      state.proveedorSeleccionado = action.payload
    },

    setProveedoresDto: (state, action) => {
      state.isLoading = false
      state.proveedoresDto = action.payload
    },

    setProveedoresDtoSeleccionado: (state, action) => {
      state.proveedoresDtoSeleccionado = action.payload
    },

    setVerProveedorActive: (state, action) => {
      state.verProveedorActive = action.payload
    },

    setOperacionCrudProveedor: (state, action) => {
      state.operacionCrudProveedor = action.payload
    },

    setListPaises: (state, action) => {
      state.listPaises = action.payload
    },

    setListEstados: (state, action) => {
      state.listEstados = action.payload
    }
  }
})

export const {
  startLoadingProveedor,
  stopLoadingProveedor,
  setProveedores,
  setProveedorSeleccionado,
  setProveedoresDto,
  setProveedoresDtoSeleccionado,
  setVerProveedorActive,
  setOperacionCrudProveedor,
  setListPaises,
  setListEstados
} = proveedorSlice.actions

export default proveedorSlice
