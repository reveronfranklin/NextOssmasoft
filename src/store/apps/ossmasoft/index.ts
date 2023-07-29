// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'



export const ossmmasoftSlice = createSlice({
  name: 'ossmmasoft',
  initialState: {

    isLoading:false,
    fechaDesde:  new Date(new Date().getFullYear(), 0, 1),
    fechaHasta:new Date(),
  },
  reducers: {

    startLoading:(state)=>{
      state.isLoading=true;
    },
    stopLoading:(state)=>{
      state.isLoading=false;
    },
    setFechaDesde:(state,action)=>{
      state.fechaDesde=action.payload;
    },
    setFechaHasta:(state,action)=>{
      state.fechaHasta=action.payload;
    },

  },

});

export const {startLoading,
              stopLoading,
              setFechaDesde,
              setFechaHasta
           } = ossmmasoftSlice.actions;
