// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'

import { IPreTitulosGetDto } from 'src/interfaces/Presupuesto/i-pre-titulos-get-dto';






export const preTituloSlice = createSlice({
  name: 'preTitulo',
  initialState: {
    preTituloSeleccionado: {} as IPreTitulosGetDto,
    verPreTituloActive:false,
    operacionCrudPreTitulo:0,
    listPreTitulos:[] as IPreTitulosGetDto[],

  },
  reducers: {




    setPreTituloSeleccionado:(state,action)=>{

      state.preTituloSeleccionado=action.payload;
    },
    setVerPreTituloActive:(state,action)=>{

      state.verPreTituloActive=action.payload;
    },
    setOperacionCrudPreTitulo:(state,action)=>{
      state.operacionCrudPreTitulo=action.payload;
    },
    setListPreTitulo:(state,action)=>{
      state.listPreTitulos=action.payload;
    },

  },

});

export const {setPreTituloSeleccionado,
              setVerPreTituloActive,
              setOperacionCrudPreTitulo,
              setListPreTitulo
              } = preTituloSlice.actions;
