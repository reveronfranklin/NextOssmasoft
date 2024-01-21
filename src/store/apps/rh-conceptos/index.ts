// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhConceptosResponseDto } from 'src/interfaces/rh/Conceptos/RhConceptosResponseDto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';



export const rhConceptosSlice = createSlice({
  name: 'rhConceptos',
  initialState: {
    rhConceptosSeleccionado: {} as IRhConceptosResponseDto,
    listRhConceptos:[] as IRhConceptosResponseDto[],
    verRhConceptosActive:false,
    operacionCrudRhConceptos:0,
    rhFrecuenciaSeleccionado: {} as ISelectListDescriptiva,
    listRhFrecuencia:[] as ISelectListDescriptiva[],
    rhModuloSeleccionado: {} as ISelectListDescriptiva,
    listRhModulo:[] as ISelectListDescriptiva[],
    listOssModeloCalculo:[] as ISelectListDescriptiva[],

  },
  reducers: {


    setRhConceptosSeleccionado:(state,action)=>{

      state.rhConceptosSeleccionado=action.payload;
    },
    setListRhConceptos:(state,action)=>{

      state.listRhConceptos=action.payload;
    },
    setVerRhConceptosActive:(state,action)=>{

      state.verRhConceptosActive=action.payload;
    },
    setOperacionCrudRhConceptos:(state,action)=>{
      state.operacionCrudRhConceptos=action.payload;
    },

    setRhFrecuenciaSeleccionado:(state,action)=>{

      state.rhFrecuenciaSeleccionado=action.payload;
    },
    setListRhFrecuencia:(state,action)=>{

      state.listRhFrecuencia=action.payload;
    },
    setRhModuloSeleccionado:(state,action)=>{

      state.rhModuloSeleccionado=action.payload;
    },
    setListRhModulo:(state,action)=>{

      state.listRhModulo=action.payload;
    },
    setListOssModeloCalculo:(state,action)=>{

      state.listOssModeloCalculo=action.payload;
    },


  },

});

export const {
                setRhConceptosSeleccionado,
                setListRhConceptos,
                setVerRhConceptosActive,
                setOperacionCrudRhConceptos,
                setRhFrecuenciaSeleccionado,
                setListRhFrecuencia,
                setRhModuloSeleccionado,
                setListRhModulo,
                setListOssModeloCalculo
              } = rhConceptosSlice.actions;
