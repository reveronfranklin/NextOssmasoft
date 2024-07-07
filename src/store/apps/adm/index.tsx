import { createSlice } from "@reduxjs/toolkit";
import { CrudOperation } from 'src/adm/solicitudCompromiso/enums/CrudOperations.enum'
import { ITipoSolicitud } from 'src/adm/solicitudCompromiso/interfaces/tipoSolicitud.interfaces'

export const admSolicitudCompromisoSlice = createSlice({
    name: 'admSolicitudCompromiso',
    initialState: {
        verSolicitudCompromisosActive: false,
        verSolicitudCompromisoDetalleActive: false,
        operacionCrudAdmSolCompromiso: CrudOperation.DEFAULT,
        solicitudCompromisoSeleccionado: {} as any,
        solicitudCompromisoSeleccionadoDetalle: {} as any,
        listTipoDeSolicitud: {} as ITipoSolicitud[],
        listProveedores: {} as any[],
        listTipoImpuesto: {} as any[],
        listTipoUnidades: {} as any[],
    },
    reducers: {
        setVerSolicitudCompromisosActive: (state, action) => {
            state.verSolicitudCompromisosActive = action.payload
        },
        setVerSolicitudCompromisoDetalleActive: (state, action) => {
            state.verSolicitudCompromisoDetalleActive = action.payload
        },
        setOperacionCrudAdmSolCompromiso: (state, action) => {
            state.operacionCrudAdmSolCompromiso = action.payload
        },
        setSolicitudCompromisoSeleccionado: (state, action) => {
            state.solicitudCompromisoSeleccionado = action.payload
        },
        setSolicitudCompromisoSeleccionadoDetalle: (state, action) => {
            state.solicitudCompromisoSeleccionadoDetalle = action.payload
        },
        setListTipoDeSolicitud: (state, action) => {
            state.listTipoDeSolicitud = action.payload
        },
        setListProveedores: (state, action) => {
            state.listProveedores = action.payload
        },
        setListTipoImpuesto: (state, action) => {
            state.listTipoImpuesto = action.payload
        },
        setListTipoUnidades: (state, action) => {
            state.listTipoUnidades = action.payload
        }
    }
})
export const {
        setVerSolicitudCompromisosActive,
        setOperacionCrudAdmSolCompromiso,
        setSolicitudCompromisoSeleccionado,
        setListTipoDeSolicitud,
        setSolicitudCompromisoSeleccionadoDetalle,
        setVerSolicitudCompromisoDetalleActive,
        setListTipoImpuesto,
        setListTipoUnidades,
        setListProveedores,
    } = admSolicitudCompromisoSlice.actions