import { createSlice } from "@reduxjs/toolkit";
import { SisBancoUpdateDto } from 'src/adm/pagos/bancos/interfaces/SisBanco/SisBancoUpdateDto';

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
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogMaestroBancoDetalle
} = admMaestroBancoSlice.actions