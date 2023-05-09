// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPresupuesto } from '../../../interfaces/Presupuesto/i-presupuesto';
import { IPreDenominacionPuc, IPreDenominacionPucResumen } from '../../../interfaces/Presupuesto/i-pre-denominacion-puc';
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora';
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc';
import { IFilterPresupuestoIpcPuc } from 'src/interfaces/Presupuesto/i-filter-presupuesto-ipc-puc';
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto';
import { IPreVSaldo } from 'src/interfaces/Presupuesto/i-pre-vsaldo';
import { IPreDetalleDocumentoGetDto } from '../../../interfaces/Presupuesto/i-pre-detalle-documento-get-dto';
import { IPreSaldoPorPartidaGetDto } from 'src/interfaces/Presupuesto/i-pre-saldo-por-partida-get-dto';






export const presupuestoSlice = createSlice({
  name: 'presupuesto',
  initialState: {
    presupuestoSeleccionado: {} as IPresupuesto,
    presupuestos: [] as IPresupuesto[],
    listpresupuestoDto: [] as IListPresupuestoDto[],
    listpresupuestoDtoSeleccionado: {} as IListPresupuestoDto,
    preDenominacionPuc:[] as IPreDenominacionPuc[],
    preDenominacionPucResumen:[] as IPreDenominacionPucResumen[],
    preMtrUnidadEjecutora: [] as IListPreMtrUnidadEjecutora[],
    preMtrDenominacionPuc: [] as IListPreMtrDenominacionPuc[],
    preMtrUnidadEjecutoraSeleccionado: {} as IListPreMtrUnidadEjecutora,
    preMtrDenominacionPucSeleccionado: {} as IListPreMtrDenominacionPuc,
    filterPresupuestoIpcPuc: {} as IFilterPresupuestoIpcPuc,
    preVSaldoSeleccionado: {} as IPreVSaldo,
    verDetallePreVSaldoActive:false,
    preDetalleDocumentoCompromisos:[] as IPreDetalleDocumentoGetDto[],
    verPreDetalleDocumentoCompromisosActive:false,
    preDetalleDocumentoCausado:[] as IPreDetalleDocumentoGetDto[],
    verPreDetalleDocumentoCausadoActive:false,
    preDetalleDocumentoPagado:[] as IPreDetalleDocumentoGetDto[],
    verPreDetalleDocumentoPagadoActive:false,
    preDetalleDocumentoBloqueado:[] as IPreDetalleDocumentoGetDto[],
    verPreDetalleDocumentoBloqueadoActive:false,
    preDetalleDocumentoModificado:[] as IPreDetalleDocumentoGetDto[],
    verPreDetalleDocumentoModificadoActive:false,
    preDetalleSaldoPorPartida:[] as IPreSaldoPorPartidaGetDto[],
    verPreDetalleSaldoPorPartidaActive:false,
    preTotalSaldoPorPartida:{} as IPreSaldoPorPartidaGetDto,


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
    setPreMtrUnidadEjecutoraSeleccionado:(state,action)=>{

      state.preMtrUnidadEjecutoraSeleccionado=action.payload;
    },
    setPreMtrDenominacionPuc:(state,action)=>{

      state.preMtrDenominacionPuc=action.payload;
    },
    setPreMtrDenominacionPucSeleccionado:(state,action)=>{

      state.preMtrDenominacionPucSeleccionado=action.payload;
    },
    setListPresupuestoDto:(state,action)=>{

      state.listpresupuestoDto=action.payload;
    },
    setListpresupuestoDtoSeleccionado:(state,action)=>{

      state.listpresupuestoDtoSeleccionado=action.payload;
    },
    setFilterPresupuestoIpcPuc:(state,action)=>{

      state.filterPresupuestoIpcPuc=action.payload;
    },
    setPreVSAldoSeleccionado:(state,action)=>{

      state.preVSaldoSeleccionado=action.payload;
    },
    setVerDetallePreVSaldoActive:(state,action)=>{
      state.verDetallePreVSaldoActive=action.payload;
    },
    setPreDetalleDocumentoCompromisos:(state,action)=>{

      state.preDetalleDocumentoCompromisos=action.payload;
    },
    setVerPreDetalleDocumentoCompromisosActive:(state,action)=>{
      state.verPreDetalleDocumentoCompromisosActive=action.payload;
    },
    setPreDetalleDocumentoCausado:(state,action)=>{

      state.preDetalleDocumentoCausado=action.payload;
    },
    setVerPreDetalleDocumentoCausadoActive:(state,action)=>{
      state.verPreDetalleDocumentoCausadoActive=action.payload;
    },
    setPreDetalleDocumentoPagado:(state,action)=>{

      state.preDetalleDocumentoPagado=action.payload;
    },
    setVerPreDetalleDocumentoPagadoActive:(state,action)=>{
      state.verPreDetalleDocumentoPagadoActive=action.payload;
    },
    setPreDetalleDocumentoBloqueado:(state,action)=>{

      state.preDetalleDocumentoBloqueado=action.payload;
    },
    setVerPreDetalleDocumentoBloqueadoActive:(state,action)=>{
      state.verPreDetalleDocumentoBloqueadoActive=action.payload;
    },
    setPreDetalleDocumentoModificado:(state,action)=>{

      state.preDetalleDocumentoModificado=action.payload;
    },
    setVerPreDetalleDocumentoModificadoActive:(state,action)=>{
      state.verPreDetalleDocumentoModificadoActive=action.payload;
    },
    setPreDetalleSaldoPorPartida:(state,action)=>{

      state.preDetalleSaldoPorPartida=action.payload;
    },
    setVerPreDetalleSaldoPorPartidaActive:(state,action)=>{
      state.verPreDetalleSaldoPorPartidaActive=action.payload;
    },
    setPreTotalSaldoPorPartida:(state,action)=>{
      state.preTotalSaldoPorPartida=action.payload;
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
              setFilterPresupuestoIpcPuc,
              setListPresupuestoDto,
              setListpresupuestoDtoSeleccionado,
              setPreMtrUnidadEjecutoraSeleccionado,
              setPreMtrDenominacionPucSeleccionado,
              setPreVSAldoSeleccionado,
              setVerDetallePreVSaldoActive,
              setPreDetalleDocumentoCompromisos,
              setVerPreDetalleDocumentoCompromisosActive,
              setPreDetalleDocumentoCausado,
              setVerPreDetalleDocumentoCausadoActive,
              setPreDetalleDocumentoPagado,
              setVerPreDetalleDocumentoPagadoActive,
              setPreDetalleDocumentoBloqueado,
              setVerPreDetalleDocumentoBloqueadoActive,
              setPreDetalleDocumentoModificado,
              setVerPreDetalleDocumentoModificadoActive,
              setPreDetalleSaldoPorPartida,
              setVerPreDetalleSaldoPorPartidaActive,
              setPreTotalSaldoPorPartida} = presupuestoSlice.actions;
