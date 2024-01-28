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
import { preRelacionCargoSlice } from './apps/pre-relacion-cargo'
import { rhRelacionCargoSlice } from './apps/rh-relacion-cargo'
import { rhAdministrativosSlice } from './apps/rh-administrativos'
import { reportViewSlice } from './apps/report'
import { bmBm1Slice } from './apps/bm'
import { rhComunicacionSlice } from './apps/rh-comunicacion'
import { rhFamiliaresSlice } from './apps/rh-familiares'
import { rhEducacionSlice } from './apps/rh-educacion'
import { rhExperienciaSlice } from './apps/rh-experiencia'
import { rhPersonaMovCtrlSlice } from './apps/rh-persona-mov-ctrl/index';
import { rhTipoNominaSlice } from './apps/rh-tipoNomina'
import { rhConceptosSlice } from './apps/rh-conceptos'
import { rhConceptosAcumuladoSlice } from './apps/rh-conceptos-acumulado'



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
    preRelacionCargo:preRelacionCargoSlice.reducer,
    rhRelacionCargo:rhRelacionCargoSlice.reducer,
    rhAdministrativos:rhAdministrativosSlice.reducer,
    nomina:nominaSlice.reducer,
    ossmmasofGlobal:ossmmasoftSlice.reducer,
    reportView:reportViewSlice.reducer,
    bmBm1:bmBm1Slice.reducer,
    rhComunicacion:rhComunicacionSlice.reducer,
    rhFamiliares:rhFamiliaresSlice.reducer,
    rhEducacion:rhEducacionSlice.reducer,
    rhExperiencia:rhExperienciaSlice.reducer,
    rhPersonaMovCtrl:rhPersonaMovCtrlSlice.reducer,
    rhTipoNomina:rhTipoNominaSlice.reducer,
    rhConceptos:rhConceptosSlice.reducer,
    rhConceptosAcumulado:rhConceptosAcumuladoSlice.reducer

  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
