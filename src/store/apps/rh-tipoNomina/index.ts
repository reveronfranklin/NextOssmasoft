// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import { IRhTiposNominaResponseDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaResponseDto';




export const rhTipoNominaSlice = createSlice({
  name: 'rhTipoNomina',
  initialState: {
    rhTipoNominaSeleccionado: {} as IRhTiposNominaResponseDto,
    listRhTipoNomina:[] as IRhTiposNominaResponseDto[],
    verRhTipoNominaActive:false,
    operacionCrudRhTipoNomina:0,
    rhFrecuenciaSeleccionado: {} as ISelectListDescriptiva,
    listRhFrecuencia:[] as ISelectListDescriptiva[],
    isOpenViewerReportePersonal:false,
    rhTipoNominaReporteSeleccionado: {} as IRhTiposNominaResponseDto,

  },
  reducers: {


    setRhTipoNominaSeleccionado:(state,action)=>{

      state.rhTipoNominaSeleccionado=action.payload;
    },
    setListRhTipoNomina:(state,action)=>{

      state.listRhTipoNomina=action.payload;
    },

    setRhFrecuenciaSeleccionado:(state,action)=>{

      state.rhFrecuenciaSeleccionado=action.payload;
    },
    setListRhFrecuencia:(state,action)=>{

      state.listRhFrecuencia=action.payload;
    },

    setVerRhTipoNominaActive:(state,action)=>{

      state.verRhTipoNominaActive=action.payload;
    },
    setOperacionCrudRhTipoNomina:(state,action)=>{
      state.operacionCrudRhTipoNomina=action.payload;
    },
    setIsOpenViewerReportePersonal:(state,action)=>{
      state.isOpenViewerReportePersonal=action.payload;
    },
    setRhTipoNominaReporteSeleccionado:(state,action)=>{
      state.rhTipoNominaReporteSeleccionado=action.payload;
    }

  },

});

export const {
                setRhTipoNominaSeleccionado,
                setListRhTipoNomina,
                setRhFrecuenciaSeleccionado,
                setListRhFrecuencia,
                setVerRhTipoNominaActive,
                setOperacionCrudRhTipoNomina,
                setIsOpenViewerReportePersonal,
                setRhTipoNominaReporteSeleccionado


              } = rhTipoNominaSlice.actions;
