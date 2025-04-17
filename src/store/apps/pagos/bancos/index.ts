import { createSlice } from "@reduxjs/toolkit";
import { SisBancoUpdateDto } from 'src/adm/pagos/bancos/interfaces';

export const admMaestroBancoSlice = createSlice({
    name: 'admMaestroBanco',
    initialState: {
        typeOperation: null,
        isOpenDialogMaestroBancoDetalle: false,
        maestroBanco: {} as SisBancoUpdateDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setIsOpenDialogMaestroBancoDetalle: (state, action) => {
            state.isOpenDialogMaestroBancoDetalle = action.payload
        },
        setMaestroBancoSeleccionadoDetalle: (state, action) => {
            state.maestroBanco = action.payload
        },
        resetMaestroBancoSeleccionadoDetalle: (state): void => {
            state.maestroBanco = {} as SisBancoUpdateDto
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogMaestroBancoDetalle,
    setMaestroBancoSeleccionadoDetalle,
    resetMaestroBancoSeleccionadoDetalle
} = admMaestroBancoSlice.actions