// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhFamiliarResponseDto } from 'src/interfaces/rh/RhFamiliarResponseDto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';




export const rhFamiliaresSlice = createSlice({
  name: 'rhFamiliares',
  initialState: {
    rhFamiliaresSeleccionado: {} as IRhFamiliarResponseDto,
    listRhFamiliares:[] as IRhFamiliarResponseDto[],
    verRhFamiliaresActive:false,
    operacionCrudRhFamiliares:0,
    rhParienteSeleccionado: {} as ISelectListDescriptiva,

  },
  reducers: {


    setRhFamiliaresSeleccionado:(state,action)=>{

      state.rhFamiliaresSeleccionado=action.payload;
    },
    setListRhFamiliares:(state,action)=>{

      state.listRhFamiliares=action.payload;
    },

    setRhParienteSeleccionado:(state,action)=>{

      state.rhParienteSeleccionado=action.payload;
    },


    setVerRhFamiliaresActive:(state,action)=>{

      state.verRhFamiliaresActive=action.payload;
    },
    setOperacionCrudRhFamiliares:(state,action)=>{
      state.operacionCrudRhFamiliares=action.payload;
    }

  },

});

export const {setRhFamiliaresSeleccionado,
              setListRhFamiliares,
              setRhParienteSeleccionado,
              setVerRhFamiliaresActive,
              setOperacionCrudRhFamiliares,


              } = rhFamiliaresSlice.actions;
