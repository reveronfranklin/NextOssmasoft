// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { Bm1GetDto } from 'src/interfaces/Bm/Bm1HetDto';




export const bmBm1Slice = createSlice({
  name: 'bmBm1',
  initialState: {
    bmBm1Seleccionado: {} as Bm1GetDto,
    verBmBm1Active:false,

  },
  reducers: {




    setBm1Seleccionado:(state,action)=>{

      state.bmBm1Seleccionado=action.payload;
    },


    setVerBmBm1ActiveActive:(state,action)=>{

      state.verBmBm1Active=action.payload;
    },

  },

});

export const {setBm1Seleccionado,
              setVerBmBm1ActiveActive,


              } = bmBm1Slice.actions;
