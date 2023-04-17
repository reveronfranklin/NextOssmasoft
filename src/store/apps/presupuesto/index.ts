// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPresupuesto } from '../../../interfaces/Presupuesto/i-presupuesto';
import { IPreDenominacionPuc, IPreDenominacionPucResumen } from '../../../interfaces/Presupuesto/i-pre-denominacion-puc';
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora';
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc';
import { IFilterPresupuestoIpcPuc } from 'src/interfaces/Presupuesto/i-filter-presupuesto-ipc-puc';
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto';






export const presupuestoSlice = createSlice({
  name: 'presupuesto',
  initialState: {
    presupuestoSeleccionado: {} as IPresupuesto,
    presupuestos: [] as IPresupuesto[],
    listpresupuestoDto: [] as IListPresupuestoDto[],
    preDenominacionPuc:[] as IPreDenominacionPuc[],
    preDenominacionPucResumen:[] as IPreDenominacionPucResumen[],
    preMtrUnidadEjecutora: [] as IListPreMtrUnidadEjecutora[],
    preMtrDenominacionPuc: [] as IListPreMtrDenominacionPuc[],
    filterPresupuestoIpcPuc: {} as IFilterPresupuestoIpcPuc,
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

      state.preDenominacionPuc=action.payload;
    },
    setPreDenominacionPucResumen:(state,action)=>{
      state.isLoading=false;

      state.preDenominacionPucResumen=action.payload;
    },
    setPresupuesto:(state,action)=>{

      state.presupuestoSeleccionado=action.payload;
    },
    setPreMtrUnidadEjecutora:(state,action)=>{

      state.preMtrUnidadEjecutora=action.payload;
    },
    setPreMtrDenominacionPuc:(state,action)=>{

      state.preMtrDenominacionPuc=action.payload;
    },
    setListPresupuestoDto:(state,action)=>{

      state.listpresupuestoDto=action.payload;
    },
    setFilterPresupuestoIpcPuc:(state,action)=>{
      console.log('payload recibido en setFilterPresupuestoIpcPuc action',action.payload)
      state.filterPresupuestoIpcPuc=action.payload;
    },
  },

});

export const {startLoadingPresupuesto,
              setPresupuestos,
              setPresupuesto,
              setPreDenominacionPuc,
              setPreDenominacionPucResumen,
              setPreMtrDenominacionPuc,
              setPreMtrUnidadEjecutora,
              setFilterPresupuestoIpcPuc,setListPresupuestoDto} = presupuestoSlice.actions;
