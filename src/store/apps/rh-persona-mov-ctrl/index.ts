// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto';





export const rhPersonaMovCtrlSlice = createSlice({
  name: 'rhPersonaMovCtrl',
  initialState: {
    rhPersonaMovCtrSeleccionado: {} as IRhPersonasMovControlResponseDto,
    listRhPersonaMovCtr:[] as IRhPersonasMovControlResponseDto[],
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
