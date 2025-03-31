import { createSlice } from "@reduxjs/toolkit";
import { SisBancoUpdateDto } from 'src/adm/pagos/bancos/interfaces';

export const admMaestroBancoSlice = createSlice({
    name: 'admMaestroBanco',
    initialState: {
        typeOperation: null,
        codigoBanco: 0,
        isOpenDialogMaestroBancoDetalle: false,
        isOpenDialogMaestroBancoDelete: false,
        maestroBanco: {} as SisBancoUpdateDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setCodigoBanco: (state, action) => {
            state.codigoBanco = action.payload
        },
        setIsOpenDialogMaestroBancoDetalle: (state, action) => {
            state.isOpenDialogMaestroBancoDetalle = action.payload
        },
        setIsOpenDialogMaestroBancoDelete: (state, action) => {
            state.isOpenDialogMaestroBancoDelete = action.payload
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
    setCodigoBanco,
    setIsOpenDialogMaestroBancoDetalle,
    setIsOpenDialogMaestroBancoDelete,
    setMaestroBancoSeleccionadoDetalle,
    resetMaestroBancoSeleccionadoDetalle
} = admMaestroBancoSlice.actions