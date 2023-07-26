// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IFilterHistoricoNomina } from 'src/interfaces/rh/i-filter-historico';
import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos';
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina';
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas';



export const nominaSlice = createSlice({
  name: 'nomina',
  initialState: {
    fechaDesde:  new Date(),
    fechaHasta:new Date(),
    filterHistorico:{} as IFilterHistoricoNomina,
    conceptoSeleccionado: [] as IListConceptosDto[],
    conceptos: [] as IListConceptosDto[],
    tiposNomina:[] as IListTipoNominaDto[],
    tiposNominaSeleccionado:{} as IListTipoNominaDto,
    personas:[] as IListSimplePersonaDto[],
    personaSeleccionado:{} as IListSimplePersonaDto,
    isLoading:false
  },
  reducers: {

    startLoadingNomina:(state)=>{
      state.isLoading=true;
    },
    stopLoadingNomina:(state)=>{
      state.isLoading=false;
    },
    setFechaDesde:(state,action)=>{
      state.fechaDesde=action.payload;
    },
    setFechaHasta:(state,action)=>{
      state.fechaHasta=action.payload;
    },
    setFilterHistorico:(state,action)=>{
      state.isLoading=true;
      state.filterHistorico=action.payload
    },
    setPersonas:(state,action)=>{
      state.isLoading=false;

      state.personas=action.payload

    },
    setPersonaSeleccionado:(state,action)=>{
      state.isLoading=false;

      state.personaSeleccionado=action.payload

    },
    setTiposNomina:(state,action)=>{
      state.isLoading=false;

      state.tiposNomina=action.payload;
    },
    setTiposNominaSeleccionado:(state,action)=>{
      state.isLoading=false;

      state.tiposNominaSeleccionado=action.payload;

    },
    setConceptos:(state,action)=>{
      state.isLoading=false;

      state.conceptos=action.payload;
    },
    setConceptoSeleccionado:(state,action)=>{
      state.isLoading=false;
      state.conceptoSeleccionado=action.payload;

    },
  },

});

export const {startLoadingNomina,
              stopLoadingNomina,
              setFechaDesde,
              setFechaHasta,
              setFilterHistorico,
              setPersonas,
              setPersonaSeleccionado,
              setTiposNomina,
              setTiposNominaSeleccionado,
              setConceptos,
              setConceptoSeleccionado} = nominaSlice.actions;
