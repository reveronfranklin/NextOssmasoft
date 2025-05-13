import { createSlice } from '@reduxjs/toolkit';
import { LoteResponseDto, LoteFilterFechaPagoDto } from 'src/adm/pagos/lotes/interfaces';

export const admLoteSlice = createSlice({
    name: 'admLote',
    initialState: {
        typeOperation: null,
        isOpenDialogLote: false,
        CodigoLote: null,
        lote: {} as LoteResponseDto,
        batchPaymentDate: {} as LoteFilterFechaPagoDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setIsOpenDialogLote: (state, action) => {
            state.isOpenDialogLote = action.payload
        },
        setLoteShow: (state, action) => {
            state.lote = action.payload
        },
        resetLoteShow: (state): void => {
            state.lote = {} as LoteResponseDto
        },
        setBatchPaymentDate: (state, action) => {
            state.batchPaymentDate = action.payload
        },
        setCodigoLote: (state, action) => {
            state.CodigoLote = action.payload
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogLote,
    setLoteShow,
    resetLoteShow,
    setBatchPaymentDate,
    setCodigoLote
} = admLoteSlice.actions