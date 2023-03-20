// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPresupuesto } from '../../../interfaces/Presupuesto/i-presupuesto';
import { IPreDenominacionPuc } from '../../../interfaces/Presupuesto/i-pre-denominacion-puc';






export const presupuestoSlice = createSlice({
  name: 'presupuesto',
  initialState: {
    presupuestoSeleccionado: {} as IPresupuesto,
    presupuestos: [] as IPresupuesto[],
    preDenominacionPuc:[] as IPreDenominacionPuc[],
    isLoading:false
  },
  reducers: {

    startLoadingPresupuesto:(state)=>{
      state.isLoading=true;
    },
    setPresupuestos:(state,action)=>{
      state.isLoading=false;

      state.presupuestos=action.payload.presupuestos;
      state.presupuestoSeleccionado=action.payload.presupuestos[0];
    },
    setPreDenominacionPuc:(state,action)=>{
      state.isLoading=false;
      console.log('payload recibido en setPreDenominacionPuc action',action.payload)
      state.preDenominacionPuc=action.payload;
    },
    setPresupuesto:(state,action)=>{
      console.log('payload recibido en setPresuesto action',action.payload)
      state.presupuestoSeleccionado=action.payload;

      //state.preDenominacionPuc=action.payload.presupuestoSeleccionado.preDenominacionPuc;
    },
  },

});

export const {startLoadingPresupuesto,setPresupuestos,setPresupuesto,setPreDenominacionPuc} = presupuestoSlice.actions;
