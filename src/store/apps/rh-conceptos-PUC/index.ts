// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import {  IRhConceptosPUCResponseDto } from 'src/interfaces/rh/ConceptosPUC/RhConceptosPUCResponseDto';



export const rhConceptosPUCSlice = createSlice({
  name: 'rhConceptosPUC',
  initialState: {
    rhConceptoPUCSeleccionado: {} as IRhConceptosPUCResponseDto,
    listRhConceptosPUC:[] as IRhConceptosPUCResponseDto[],
    verRhConceptosPUCActive:false,
    operacionCrudRhConceptosPUC:0,

  },
  reducers: {


    setRhConceptosPUCSeleccionado:(state,action)=>{

      state.rhConceptoPUCSeleccionado=action.payload;
    },
    setListRhConceptosPUC:(state,action)=>{

      state.listRhConceptosPUC=action.payload;
    },
    setVerRhConceptosPUCActive:(state,action)=>{

      state.verRhConceptosPUCActive=action.payload;
    },
    setOperacionCrudRhConceptosPUC:(state,action)=>{
      state.operacionCrudRhConceptosPUC=action.payload;
    },
  },

});

export const {
                  setRhConceptosPUCSeleccionado,
                  setListRhConceptosPUC,
                  setVerRhConceptosPUCActive,
                  setOperacionCrudRhConceptosPUC,

              } = rhConceptosPUCSlice.actions;
