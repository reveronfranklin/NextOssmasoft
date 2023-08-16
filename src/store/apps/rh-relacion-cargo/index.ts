// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'



import { IRhRelacionCargoDto } from 'src/interfaces/rh/i-rh-relacion-cargo-dto';






export const rhRelacionCargoSlice = createSlice({
  name: 'rhRelacionCArgo',
  initialState: {
    rhRelacionCargoSeleccionado: {} as IRhRelacionCargoDto,
    verRhRelacionCargoActive:false,
    operacionCrudRhRelacionCargo:0,



  },
  reducers: {




    setRhRelacionCargoSeleccionado:(state,action)=>{

      state.rhRelacionCargoSeleccionado=action.payload;
    },
    setVerRhRelacionCargoActive:(state,action)=>{

      state.verRhRelacionCargoActive=action.payload;
    },
    setOperacionCrudRhRelacionCargo:(state,action)=>{
      state.operacionCrudRhRelacionCargo=action.payload;
    },



  },

});

export const {setRhRelacionCargoSeleccionado,
              setVerRhRelacionCargoActive,
              setOperacionCrudRhRelacionCargo,

              } = rhRelacionCargoSlice.actions;
