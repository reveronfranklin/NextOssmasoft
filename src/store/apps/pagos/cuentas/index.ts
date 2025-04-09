import { createSlice } from '@reduxjs/toolkit';
import { CuentaDto } from 'src/adm/pagos/cuentas/interfaces';

export const admMaestroCuentaSlice = createSlice({
    name: 'admMaestroCuenta',
    initialState: {
        typeOperation: null,
        isOpenDialogCuenta: false,
        isOpenDialogDelete: false,
        maestroCuenta: {} as CuentaDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setIsOpenDialogCuenta: (state, action) => {
            state.isOpenDialogCuenta = action.payload
        },
        setMaestroCuentaShow: (state, action) => {
            state.maestroCuenta = action.payload
        },
        resetMaestroCuentaShow: (state): void => {
            state.maestroCuenta = {} as CuentaDto
        }
    }
})
export const {
    setTypeOperation,
    setIsOpenDialogCuenta,
    setMaestroCuentaShow,
    resetMaestroCuentaShow
} = admMaestroCuentaSlice.actions