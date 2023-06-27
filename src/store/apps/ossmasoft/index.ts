// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'



export const ossmmasoftSlice = createSlice({
  name: 'nomina',
  initialState: {

    isLoading:false
  },
  reducers: {

    startLoading:(state)=>{
      state.isLoading=true;
    },
    stopLoading:(state)=>{
      state.isLoading=false;
    },

  },

});

export const {startLoading,
              stopLoading,
           } = ossmmasoftSlice.actions;
