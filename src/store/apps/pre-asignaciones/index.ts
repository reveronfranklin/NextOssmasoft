// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreAsignacionesGetDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesGetDto';


export const preAsignacionesSlice = createSlice({
  name: 'preAsignaciones',
  initialState: {
    preAsignacionesSeleccionado: {} as IPreAsignacionesGetDto,
    listPreAsignacionesCreate: [] as IPreAsignacionesGetDto[],
    verPreAsignacionesActive:false,
    operacionCrudPreAsignaciones:0,
    refrescarTablaAsignaciones:false,

  },
  reducers: {


    setPreAsignacionesSeleccionado:(state,action)=>{

      state.preAsignacionesSeleccionado=action.payload;
    },

    setVerPreAsignacionesActive:(state,action)=>{

      state.verPreAsignacionesActive=action.payload;
    },
    setRefrescarTablaAsignaciones:(state)=>{

      state.refrescarTablaAsignaciones= !state.refrescarTablaAsignaciones;
    },
    setOperacionCrudPreAsignaciones:(state,action)=>{
      state.operacionCrudPreAsignaciones=action.payload;
    },
    setListPreAsignacionesCreate:(state,action)=>{
      state.listPreAsignacionesCreate=action.payload;
    },


  },

});

export const {
                  setPreAsignacionesSeleccionado,
                  setVerPreAsignacionesActive,
                  setOperacionCrudPreAsignaciones,
                  setRefrescarTablaAsignaciones,
                  setListPreAsignacionesCreate
              } = preAsignacionesSlice.actions;
