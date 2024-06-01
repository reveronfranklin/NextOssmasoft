import { createSlice } from "@reduxjs/toolkit";
import { CrudOperation } from 'src/adm/solicitudCompromiso/enums/CrudOperations.enum'
import { ITipoSolicitud } from 'src/adm/solicitudCompromiso/interfaces/tipoSolicitud.interfaces'

export const admSolicitudCompromisoSlice = createSlice({
    name: 'admSolicitudCompromiso',
    initialState: {
        verSolicitudCompromisosActive: false,
        operacionCrudAdmSolCompromiso: CrudOperation.DEFAULT,
        solicitudCompromisoSeleccionado: {} as any,
        listTipoDeSolicitud: {} as ITipoSolicitud[],
        listProveedores: {} as any[]
    },
    reducers: {
        setVerSolicitudCompromisosActive: (state, action) => {
            state.verSolicitudCompromisosActive = action.payload
        },
        setOperacionCrudAdmSolCompromiso: (state, action) => {
            state.operacionCrudAdmSolCompromiso = action.payload
        },
        setSolicitudCompromisoSeleccionado: (state, action) => {
            state.solicitudCompromisoSeleccionado = action.payload
        },
        setListTipoDeSolicitud: (state, action) => {
            state.listTipoDeSolicitud = action.payload
        },
        setListProveedores: (state, action) => {
            state.listProveedores = action.payload
        }
    }
})
export const {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso,
    setSolicitudCompromisoSeleccionado,
    setListTipoDeSolicitud,
    setListProveedores } = admSolicitudCompromisoSlice.actions