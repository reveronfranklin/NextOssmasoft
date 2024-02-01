// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhConceptosFormulaResponseDto } from 'src/interfaces/rh/ConceptosFormula/RhConceptosFormulaResponseDto';



export const rhConceptosFormulaSlice = createSlice({
  name: 'rhConceptosFormula',
  initialState: {
    rhConceptoFormulaSeleccionado: {} as IRhConceptosFormulaResponseDto,
    listRhConceptosFormula:[] as IRhConceptosFormulaResponseDto[],
    verRhConceptosFormulaActive:false,
    operacionCrudRhConceptosFormula:0,


  },
  reducers: {


    setRhConceptosFormulaSeleccionado:(state,action)=>{

      state.rhConceptoFormulaSeleccionado=action.payload;
    },
    setListRhConceptosFormula:(state,action)=>{

      state.listRhConceptosFormula=action.payload;
    },
    setVerRhConceptosFormulaActive:(state,action)=>{

      state.verRhConceptosFormulaActive=action.payload;
    },
    setOperacionCrudRhConceptosFormula:(state,action)=>{
      state.operacionCrudRhConceptosFormula=action.payload;
    },
  },

});

export const {
                setRhConceptosFormulaSeleccionado,
                setListRhConceptosFormula,
                setVerRhConceptosFormulaActive,
                setOperacionCrudRhConceptosFormula,

              } = rhConceptosFormulaSlice.actions;
