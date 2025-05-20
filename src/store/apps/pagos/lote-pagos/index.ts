import { createSlice } from '@reduxjs/toolkit';

export const admLotePagosSlice = createSlice({
    name: 'admLotePagos',
    initialState: {
        codigoLote: null,
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
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogPago,
    setCodigoLote
} = admLotePagosSlice.actions