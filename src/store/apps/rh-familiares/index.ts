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
    rhNivelEducativoSeleccionado: {} as ISelectListDescriptiva,
    listRhPariente: [] as ISelectListDescriptiva[],
    listRhNivelEducativo: [] as ISelectListDescriptiva[],

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
    setRhNivelEducativoSeleccionado:(state,action)=>{

      state.rhNivelEducativoSeleccionado=action.payload;
    },

    setVerRhFamiliaresActive:(state,action)=>{

      state.verRhFamiliaresActive=action.payload;
    },
    setOperacionCrudRhFamiliares:(state,action)=>{
      state.operacionCrudRhFamiliares=action.payload;
    },
    setListRhPariente:(state,action)=>{

      state.listRhPariente=action.payload;
    },

    setListRhNivelEducativo:(state,action)=>{

      state.listRhNivelEducativo=action.payload;
    },

  },

});

export const {setRhFamiliaresSeleccionado,
              setListRhFamiliares,
              setRhParienteSeleccionado,
              setRhNivelEducativoSeleccionado,
              setVerRhFamiliaresActive,
              setOperacionCrudRhFamiliares,
              setListRhPariente,
              setListRhNivelEducativo


              } = rhFamiliaresSlice.actions;
