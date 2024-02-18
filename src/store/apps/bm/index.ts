// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { Bm1GetDto } from 'src/interfaces/Bm/Bm1HetDto';
import { IBmBienesFotoResponseDto } from 'src/interfaces/Bm/BmBienesFoto/BmBienesFotoResponseDto';




export const bmBm1Slice = createSlice({
  name: 'bmBm1',
  initialState: {
    bmBm1Seleccionado: {} as Bm1GetDto,
    listBmBienesFotoResponseDto:[] as IBmBienesFotoResponseDto[],
    verBmBm1Active:false,

  },
  reducers: {




    setBm1Seleccionado:(state,action)=>{

      state.bmBm1Seleccionado=action.payload;
    },


    setVerBmBm1ActiveActive:(state,action)=>{

      state.verBmBm1Active=action.payload;
    },
    setListBmBienesFotoResponseDto:(state,action)=>{

      state.listBmBienesFotoResponseDto=action.payload;
    },

  },

});

export const {setBm1Seleccionado,
              setVerBmBm1ActiveActive,
              setListBmBienesFotoResponseDto


              } = bmBm1Slice.actions;
