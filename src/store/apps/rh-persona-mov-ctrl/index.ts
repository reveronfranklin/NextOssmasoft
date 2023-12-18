// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { IRhExpLaboralResponseDto } from 'src/interfaces/rh/RhExpLaboralResponseDto';





export const rhPersonaMovCtrlSlice = createSlice({
  name: 'rhPersonaMovCtrl',
  initialState: {
    rhPersonaMovCtrSeleccionado: {} as IRhExpLaboralResponseDto,
    listRhPersonaMovCtr:[] as IRhExpLaboralResponseDto[],
    verRhPersonaMovCtrActive:false,
    operacionCrudRhPersonaMovCtr:0,


  },
  reducers: {


    setRhPersonaMovCtrSeleccionado:(state,action)=>{

      state.rhPersonaMovCtrSeleccionado=action.payload;
    },
    setListRhPersonaMovCtr:(state,action)=>{

      state.listRhPersonaMovCtr=action.payload;
    },
    setVerRhPersonaMovCtrActive:(state,action)=>{

      state.verRhPersonaMovCtrActive=action.payload;
    },
    setOperacionCrudRhPersonaMovCtr:(state,action)=>{
      state.operacionCrudRhPersonaMovCtr=action.payload;
    },



  },

});

export const {
                setRhPersonaMovCtrSeleccionado,
                setListRhPersonaMovCtr,
                setVerRhPersonaMovCtrActive,
                setOperacionCrudRhPersonaMovCtr

              } = rhPersonaMovCtrlSlice.actions;
