import { createSlice } from '@reduxjs/toolkit';
import { LoteDto } from 'src/adm/pagos/lotes/interfaces';

export const admLoteSlice = createSlice({
    name: 'admLote',
    initialState: {
        typeOperation: null,
        isOpenDialogLote: false,
        lote: {} as LoteDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setIsOpenDialogLote: (state, action) => {
            state.isOpenDialogLote = action.payload
        },
        setMaestroCuentaShow: (state, action) => {
            state.lote = action.payload
        },
        resetMaestroLoteShow: (state): void => {
            state.lote = {} as LoteDto
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogLote,
    setMaestroCuentaShow,
    resetMaestroLoteShow
} = admLoteSlice.actions