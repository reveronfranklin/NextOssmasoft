// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { IRhExpLaboralResponseDto } from 'src/interfaces/rh/RhExpLaboralResponseDto';





export const rhExperienciaSlice = createSlice({
  name: 'rhExperiencia',
  initialState: {
    rhExperienciaSeleccionado: {} as IRhExpLaboralResponseDto,
    listRhExperiencia:[] as IRhExpLaboralResponseDto[],
    verRhExperienciaActive:false,
    operacionCrudRhExperiencia:0,


  },
  reducers: {


    setRhExperienciaSeleccionado:(state,action)=>{

      state.rhExperienciaSeleccionado=action.payload;
    },
    setListRhExeriencia:(state,action)=>{

      state.listRhExperiencia=action.payload;
    },
    setVerRhExperienciaActive:(state,action)=>{

      state.verRhExperienciaActive=action.payload;
    },
    setOperacionCrudRhExperiencia:(state,action)=>{
      state.operacionCrudRhExperiencia=action.payload;
    },



  },

});

export const {
          setRhExperienciaSeleccionado,
          setListRhExeriencia,
          setVerRhExperienciaActive,
          setOperacionCrudRhExperiencia

              } = rhExperienciaSlice.actions;
