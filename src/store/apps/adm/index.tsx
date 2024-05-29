import { createSlice } from "@reduxjs/toolkit";
import { CrudOperation } from 'src/adm/solicitudCompromiso/enums/CrudOperations.enum'

interface ITipoSolicitud {
    id: number
    descripcion: string
}

export const admSolicitudCompromisoSlice = createSlice({
    name: 'admSolicitudCompromiso',
    initialState: {
        verSolicitudCompromisosActive: false,
        operacionCrudAdmSolCompromiso: CrudOperation.DEFAULT,
        solicitudCompromisoSeleccionado: {} as any,
        listTipoDeSolicitud: {} as ITipoSolicitud[]
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
        }
    }
})
export const {
    setVerSolicitudCompromisosActive,
    setOperacionCrudAdmSolCompromiso,
    setSolicitudCompromisoSeleccionado,
    setListTipoDeSolicitud
} = admSolicitudCompromisoSlice.actions