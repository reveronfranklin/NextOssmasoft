// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhConceptosAcumulaResponseDto } from 'src/interfaces/rh/ConceptosAcumula/RhConceptosAcumulaResponseDto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';



export const rhConceptosAcumuladoSlice = createSlice({
  name: 'rhConceptosAcumulado',
  initialState: {
    rhConceptoAcumuladoSeleccionado: {} as IRhConceptosAcumulaResponseDto,
    listRhConceptosAcumula:[] as IRhConceptosAcumulaResponseDto[],
    verRhConceptosAcumulaActive:false,
    operacionCrudRhConceptosAcumula:0,
    rhTipoAcumuladoSeleccionado: {} as ISelectListDescriptiva,
    listRhTipoAcumulado:[] as ISelectListDescriptiva[],

  },
  reducers: {


    setRhConceptosAcumuladoSeleccionado:(state,action)=>{

      state.rhConceptoAcumuladoSeleccionado=action.payload;
    },
    setListRhConceptosAcumulado:(state,action)=>{

      state.listRhConceptosAcumula=action.payload;
    },
    setVerRhConceptosAcumuladoActive:(state,action)=>{

      state.verRhConceptosAcumulaActive=action.payload;
    },
    setOperacionCrudRhConceptosAcumulado:(state,action)=>{
      state.operacionCrudRhConceptosAcumula=action.payload;
    },

    setRhTipoAcumuladoSeleccionado:(state,action)=>{

      state.rhTipoAcumuladoSeleccionado=action.payload;
    },
    setListRhTipoAcumulado:(state,action)=>{

      state.listRhTipoAcumulado=action.payload;
    },


  },

});

export const {
                setRhConceptosAcumuladoSeleccionado,
                setListRhConceptosAcumulado,
                setVerRhConceptosAcumuladoActive,
                setOperacionCrudRhConceptosAcumulado,
                setRhTipoAcumuladoSeleccionado,
                setListRhTipoAcumulado



              } = rhConceptosAcumuladoSlice.actions;
