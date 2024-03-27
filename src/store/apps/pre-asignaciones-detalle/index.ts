// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreAsignacionesDetalleGetDto } from '../../../interfaces/Presupuesto/PreAsignacionesDetalle/PreAsignacionesDetalleGetDto';


export const preAsignacionesDetalleSlice = createSlice({
  name: 'preAsignacionesDetalle',
  initialState: {
    preAsignacionesDetalleSeleccionado: {} as IPreAsignacionesDetalleGetDto,
    listPreAsignacionesDetalleCreate: [] as IPreAsignacionesDetalleGetDto[],
    verPreAsignacionesDetalleActive:false,
    operacionCrudPreAsignacionesDetalle:0,
    totalMonto:0,

  },
  reducers: {

    setTotalMonto:(state,action)=>{

      state.totalMonto=action.payload;
    },

    setPreAsignacionesDetalleSeleccionado:(state,action)=>{

      state.preAsignacionesDetalleSeleccionado=action.payload;
    },

    setVerPreAsignacionesDetalleActive:(state,action)=>{

      state.verPreAsignacionesDetalleActive=action.payload;
    },

    setOperacionCrudPreAsignacionesDetalle:(state,action)=>{
      state.operacionCrudPreAsignacionesDetalle=action.payload;
    },
    setListPreAsignacionesDetalleCreate:(state,action)=>{
      state.listPreAsignacionesDetalleCreate=action.payload;
    },


  },

});

export const {
                  setPreAsignacionesDetalleSeleccionado,
                  setVerPreAsignacionesDetalleActive,
                  setOperacionCrudPreAsignacionesDetalle,
                  setListPreAsignacionesDetalleCreate,
                  setTotalMonto
              } = preAsignacionesDetalleSlice.actions;
