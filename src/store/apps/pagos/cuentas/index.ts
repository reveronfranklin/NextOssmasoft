import { createSlice } from '@reduxjs/toolkit';
import { CuentaDto } from 'src/adm/pagos/cuentas/interfaces';

export const admMaestroCuentaSlice = createSlice({
    name: 'admMaestroCuenta',
    initialState: {
        typeOperation: null,
        codigoCuentaBanco: 0,
        isOpenDialogCreate: false,
        isOpenDialogDelete: false,
        maestroCuenta: {} as CuentaDto
    },
    reducers: {
        setTypeOperation: (state, action) => {
            state.typeOperation = action.payload
        },
        setCodigoCuentaBanco: (state, action) => {
            state.codigoCuentaBanco = action.payload
        },
        setIsOpenDialogCreate: (state, action) => {
            state.isOpenDialogCreate = action.payload
        },
        setIsOpenDialogDelete: (state, action) => {
            state.isOpenDialogDelete = action.payload
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
    setCodigoCuentaBanco,
    setIsOpenDialogCreate,
    setIsOpenDialogDelete,
    setMaestroCuentaShow,
    resetMaestroCuentaShow
} = admMaestroCuentaSlice.actions