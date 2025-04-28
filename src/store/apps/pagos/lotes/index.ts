import { createSlice } from '@reduxjs/toolkit';
import { LoteResponseDto } from 'src/adm/pagos/lotes/interfaces';

export const admLoteSlice = createSlice({
    name: 'admLote',
    initialState: {
        typeOperation: null,
        isOpenDialogLote: false,
        lote: {} as LoteResponseDto
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
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogLote,
    setLoteShow,
    resetLoteShow
} = admLoteSlice.actions