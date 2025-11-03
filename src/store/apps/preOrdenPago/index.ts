import { createSlice } from '@reduxjs/toolkit';
import { PreOrdenPagoDto } from 'src/adm/preOrdenPago/interfaces';

export const admPreOrdenPagoSlice = createSlice({
    name: 'admPreOrdenPago',
    initialState: {
        typeOperation: null,
        isOpenDialogPreOrdenPago: false,
        idPreOrdenPago: null,
        preOrdenPago: {} as PreOrdenPagoDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setIsOpenDialogPreOrdenPago: (state, action) => {
            state.isOpenDialogPreOrdenPago = action.payload
        },
        setPreOrdenPagoShow: (state, action) => {
            state.preOrdenPago = action.payload
        },
        resetPreOrdenPagoShow: (state): void => {
            state.preOrdenPago = {} as PreOrdenPagoDto
        },
        setIdPreOrdenPAgo: (state, action) => {
            state.idPreOrdenPago = action.payload
        }
    }
})

export const {
    setTypeOperation,
    setIsOpenDialogPreOrdenPago,
    setPreOrdenPagoShow,
    resetPreOrdenPagoShow,
    setIdPreOrdenPAgo,
} = admPreOrdenPagoSlice.actions