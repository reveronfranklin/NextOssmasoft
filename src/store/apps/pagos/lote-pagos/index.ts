import { createSlice } from '@reduxjs/toolkit';
import { PagoResponseDto } from 'src/adm/pagos/lotes/interfaces'

export const admLotePagosSlice = createSlice({
    name: 'admLotePagos',
    initialState: {
        codigoLote: null,
        pago: {} as PagoResponseDto,
        codigoPago: null,
        isOpenDialogPago: false,
        typeOperation: null
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setIsOpenDialogPago: (state, action) => {
            state.isOpenDialogPago = action.payload
        },
        setCodigoLote: (state, action) => {
            state.codigoLote = action.payload
        },
        setCodigoPago: (state, action) => {
            state.pago.codigoPago = action.payload
        },
        setPagoShow: (state, action) => {
            state.pago = action.payload
        },
        resetPagoShow: (state): void => {
            state.pago = {} as PagoResponseDto
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogPago,
    setCodigoLote,
    setCodigoPago,
    setPagoShow,
    resetPagoShow
} = admLotePagosSlice.actions