// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'


import { IPreRelacionCargosGetDto } from '../../../interfaces/Presupuesto/i-pre-relacion-cargos-get-dto';






export const preRelacionCargoSlice = createSlice({
  name: 'preTitulo',
  initialState: {
    preRelacionCargoSeleccionado: {} as IPreRelacionCargosGetDto,
    verPreRelacionCargoActive:false,
    operacionCrudPreRelacionCargo:0,
    totalSueldo:0,
    totalSueldoAnual:0


  },
  reducers: {




    setPreRelacionCargoSeleccionado:(state,action)=>{

      state.preRelacionCargoSeleccionado=action.payload;
    },
    setVerPreRelacionCargoActive:(state,action)=>{

      state.verPreRelacionCargoActive=action.payload;
    },
    setOperacionCrudPreRelacionCargo:(state,action)=>{
      state.operacionCrudPreRelacionCargo=action.payload;
    },
    setTotalSueldo:(state,action)=>{
      state.totalSueldo=action.payload;
    },
    setTotalSueldoAnual:(state,action)=>{
      state.totalSueldoAnual=action.payload;
    },


  },

});

export const {setPreRelacionCargoSeleccionado,
              setVerPreRelacionCargoActive,
              setOperacionCrudPreRelacionCargo,
              setTotalSueldo,
              setTotalSueldoAnual
              } = preRelacionCargoSlice.actions;
