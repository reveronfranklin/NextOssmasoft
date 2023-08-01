// ** Toolkit imports
import { configureStore } from '@reduxjs/toolkit'

// ** Reducers
import chat from 'src/store/apps/chat'
import user from 'src/store/apps/user'
import email from 'src/store/apps/email'
import invoice from 'src/store/apps/invoice'
import calendar from 'src/store/apps/calendar'
import permissions from 'src/store/apps/permissions'
import { presupuestoSlice } from './apps/presupuesto'
import { nominaSlice } from './apps/rh'
import {ossmmasoftSlice} from './apps/ossmasoft';
import { icpSlice } from './apps/ICP'
import { pucSlice } from './apps/PUC'
import { preDescriptivaSlice } from './apps/pre-descriptiva'
import { preTituloSlice } from './apps/pre-titulos'
import { preCargoSlice } from './apps/pre-cargo'





export const store = configureStore({
  reducer: {
    user,
    chat,
    email,
    invoice,
    calendar,
    permissions,
    presupuesto:presupuestoSlice.reducer,
    icp:icpSlice.reducer,
    puc:pucSlice.reducer,
    preDescriptiva:preDescriptivaSlice.reducer,
    preCargo:preCargoSlice.reducer,
    preTitulo:preTituloSlice.reducer,
    nomina:nominaSlice.reducer,
    ossmmasofGlobal:ossmmasoftSlice.reducer

    //nominas:nominaSlice.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
