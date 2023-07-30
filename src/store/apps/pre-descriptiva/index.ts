// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto';


import { IPreTitulosGetDto } from 'src/interfaces/Presupuesto/i-pre-titulos-get-dto';






export const preDescriptivaSlice = createSlice({
  name: 'preDescriptiva',
  initialState: {
    preDescriptivaSeleccionado: {} as IPreDescriptivasGetDto,

    verPreDescriptivaActive:false,
    operacionCrudPreDescriptiva:0,
    listPreTitulos:[] as IPreTitulosGetDto[],

  },
  reducers: {




    setPreDescriptivaSeleccionado:(state,action)=>{

      state.preDescriptivaSeleccionado=action.payload;
    },
    setVerPreDescriptivaActive:(state,action)=>{

      state.verPreDescriptivaActive=action.payload;
    },
    setOperacionCrudPreDescriptiva:(state,action)=>{
      state.operacionCrudPreDescriptiva=action.payload;
    },
    setListPreTitulo:(state,action)=>{
      state.listPreTitulos=action.payload;
    },

  },

});

export const {setPreDescriptivaSeleccionado,
              setVerPreDescriptivaActive,
              setOperacionCrudPreDescriptiva,
              setListPreTitulo
              } = preDescriptivaSlice.actions;
