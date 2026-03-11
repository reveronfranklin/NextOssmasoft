import { createSlice } from '@reduxjs/toolkit'
import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto';
import { ResponseRhMovNominaCommand } from 'src/rh/variacion/interfaces';

export const rhPersonaMovCtrlSlice = createSlice({
  name: 'rhPersonaMovCtrl',
  initialState: {
    rhPersonaMovCtrSeleccionado: {} as ResponseRhMovNominaCommand,
    listRhPersonaMovCtr:[] as IRhPersonasMovControlResponseDto[],
    verRhPersonaMovCtrActive:false,
    operacionCrudRhPersonaMovCtr:1,
    isExpandedAccordion: false
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
    setIsExpandedAccordion:(state,action)=>{
      state.isExpandedAccordion = action.payload
    }
  }
})

export const {
    setRhPersonaMovCtrSeleccionado,
    setListRhPersonaMovCtr,
    setVerRhPersonaMovCtrActive,
    setOperacionCrudRhPersonaMovCtr,
    setIsExpandedAccordion
} = rhPersonaMovCtrlSlice.actions;
