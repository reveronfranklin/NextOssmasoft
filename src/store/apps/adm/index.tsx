import { createSlice } from "@reduxjs/toolkit";
import { CrudOperation } from 'src/adm/solicitudCompromiso/enums/CrudOperations.enum'

export const admSolicitudCompromisoSlice = createSlice({
    name: 'admSolicitudCompromiso',
    initialState: {
        verSolicitudCompromisosActive: false,
        operacionCrudAdmSolCompromiso: CrudOperation.DEFAULT,
        solicitudCompromisoSeleccionado: {}
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
        }
    }
})
export const {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso,
    setSolicitudCompromisoSeleccionado
} = admSolicitudCompromisoSlice.actions