import { createSlice } from "@reduxjs/toolkit";
import { Orden } from 'src/adm/ordenesPago/interfaces/responseGetOrdenes.interfaces'

export const admOrdenPagoSlice = createSlice({
    name: 'admOrdenPago',
    initialState: {
        typeOperation: null,
        isOpenDialogListCompromiso: false,
        isOpenDialogOrdenPagoDetalle: false,
        isOpenDialogListPucOrdenPago: false,
        compromisoSeleccionadoListaDetalle: {} as Orden,
    },
    reducers: {
        setIsOpenDialogListCompromiso: (state, action) => {
            state.isOpenDialogListCompromiso = action.payload
        },
        setIsOpenDialogOrdenPagoDetalle: (state, action) => {
            state.isOpenDialogOrdenPagoDetalle = action.payload
        },
        setIsOpenDialogListPucOrdenPago: (state, action) => {
            state.isOpenDialogListPucOrdenPago = action.payload
        },
        setCompromisoSeleccionadoDetalle: (state, action) => {
            state.compromisoSeleccionadoListaDetalle = action.payload
        },
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        resetCompromisoSeleccionadoDetalle: (state): void => {
            state.compromisoSeleccionadoListaDetalle = {} as Orden
        }
    }
})
export const {
    setIsOpenDialogOrdenPagoDetalle,
    setIsOpenDialogListCompromiso,
    setCompromisoSeleccionadoDetalle,
    setIsOpenDialogListPucOrdenPago,
    setTypeOperation,
    resetCompromisoSeleccionadoDetalle,
} = admOrdenPagoSlice.actions