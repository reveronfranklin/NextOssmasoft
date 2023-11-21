// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhComunicacionResponseDto } from 'src/interfaces/rh/RhComunicacionResponseDto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';




export const rhComunicacionSlice = createSlice({
  name: 'rComunicacion',
  initialState: {
    rhComunicacionSeleccionado: {} as IRhComunicacionResponseDto,
    listRhComunicaciones:[] as IRhComunicacionResponseDto[],
    verRhComunicacionActive:false,
    operacionCrudRhComunicacion:0,
    rhTipoComunicacionSeleccionado: {} as ISelectListDescriptiva,
    listRhTipoComunicacion:[] as ISelectListDescriptiva[],

  },
  reducers: {


    setRhComunicacionSeleccionado:(state,action)=>{

      state.rhComunicacionSeleccionado=action.payload;
    },
    setListRhComunicacion:(state,action)=>{

      state.listRhComunicaciones=action.payload;
    },

    setRhTipoComunicacionSeleccionado:(state,action)=>{

      state.rhTipoComunicacionSeleccionado=action.payload;
    },
    setListRhTipoComunicacion:(state,action)=>{

      state.listRhTipoComunicacion=action.payload;
    },

    setVerRhComunicacionActive:(state,action)=>{

      state.verRhComunicacionActive=action.payload;
    },
    setOperacionCrudRhComunicacion:(state,action)=>{
      state.operacionCrudRhComunicacion=action.payload;
    }

  },

});

export const {setRhComunicacionSeleccionado,
              setListRhComunicacion,
              setRhTipoComunicacionSeleccionado,
              setListRhTipoComunicacion,
              setVerRhComunicacionActive,
              setOperacionCrudRhComunicacion,

              } = rhComunicacionSlice.actions;
