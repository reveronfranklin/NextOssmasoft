// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { IPreCodigosPuc } from 'src/interfaces/Presupuesto/i-pre-plan-unico-cuentas-codigos';
import { IPrePlanUnicoCuentasGetDto } from 'src/interfaces/Presupuesto/i-pre-plan-unico-cuentas-get-dto';
import { IOssConfig } from 'src/interfaces/SIS/i-oss-config-get-dto';






export const pucSlice = createSlice({
  name: 'puc',
  initialState: {
    pucSeleccionado: {} as IPrePlanUnicoCuentasGetDto,
    listPuc: [] as IPrePlanUnicoCuentasGetDto[],

    verPucActive:false,
    operacionCrudPuc:0,
    listGrupos:[] as IOssConfig[],
    listNivel1:[] as IOssConfig[],
    listNivel2:[] as IOssConfig[],
    listNivel3:[] as IOssConfig[],
    listNivel4:[] as IOssConfig[],
    listNivel5:[] as IOssConfig[],
    listNivel6:[] as IOssConfig[],
    listCodigosPucHistorico: [] as IPreCodigosPuc[]
  },
  reducers: {


    setListPuc:(state,action)=>{


      state.listPuc=action.payload;


    },

    setPucSeleccionado:(state,action)=>{

      state.pucSeleccionado=action.payload;
    },
    setVerPucActive:(state,action)=>{

      state.verPucActive=action.payload;
    },
    setOperacionCrudPuc:(state,action)=>{
      state.operacionCrudPuc=action.payload;
    },
    setListGrupos:(state,action)=>{
      state.listGrupos=action.payload;
    },
    setListNivel1:(state,action)=>{
      state.listNivel1=action.payload;
    },
    setListNivel2:(state,action)=>{
      state.listNivel2=action.payload;
    },
    setListNivel3:(state,action)=>{
      state.listNivel3=action.payload;
    },
    setListNivel4:(state,action)=>{
      state.listNivel4=action.payload;
    },
    setListNivel5:(state,action)=>{
      state.listNivel5=action.payload;
    },
    setListNivel6:(state,action)=>{
      state.listNivel6=action.payload;
    },
    setListCodigosPucHistorico:(state,action)=>{
      state.listCodigosPucHistorico=action.payload;
    },

  },

});

export const {setListPuc,
              setPucSeleccionado,
              setVerPucActive,
              setOperacionCrudPuc,
              setListGrupos,
              setListNivel1,
              setListNivel2,
              setListNivel3,
              setListNivel4,
              setListNivel5,
              setListNivel6,
              setListCodigosPucHistorico

              } = pucSlice.actions;
