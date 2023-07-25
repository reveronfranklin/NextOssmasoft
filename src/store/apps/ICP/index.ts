// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreCodigosIcp } from 'src/interfaces/Presupuesto/i-codigos-icp-dto';

import { IPreIndiceCategoriaProgramaticaGetDto } from 'src/interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto';
import { IOssConfig } from 'src/interfaces/SIS/i-oss-config-get-dto';






export const icpSlice = createSlice({
  name: 'icp',
  initialState: {
    icpSeleccionado: {} as IPreIndiceCategoriaProgramaticaGetDto,
    listIcp: [] as IPreIndiceCategoriaProgramaticaGetDto[],

    verIcpActive:false,
    operacionCrudIcp:0,
    listSectores:[] as IOssConfig[],
    listProgramas:[] as IOssConfig[],
    listSubProgramas:[] as IOssConfig[],
    listProyectos:[] as IOssConfig[],
    listActividades:[] as IOssConfig[],
    listOficinas:[] as IOssConfig[],
    listCodigosIcpHistorico: [] as IPreCodigosIcp[]
  },
  reducers: {


    setListIcp:(state,action)=>{


      state.listIcp=action.payload;


    },

    setIcpSeleccionado:(state,action)=>{

      state.icpSeleccionado=action.payload;
    },
    setVerIcpActive:(state,action)=>{

      state.verIcpActive=action.payload;
    },
    setOperacionCrudIcp:(state,action)=>{
      state.operacionCrudIcp=action.payload;
    },
    setListSectores:(state,action)=>{
      state.listSectores=action.payload;
    },
    setListProgramas:(state,action)=>{
      state.listProgramas=action.payload;
    },
    setListSubProgramas:(state,action)=>{
      state.listSubProgramas=action.payload;
    },
    setListProyectos:(state,action)=>{
      state.listProyectos=action.payload;
    },
    setListActividades:(state,action)=>{
      state.listActividades=action.payload;
    },
    setListOficinas:(state,action)=>{
      state.listOficinas=action.payload;
    },
    setListCodigosIcpHistorico:(state,action)=>{
      state.listCodigosIcpHistorico=action.payload;
    },

  },

});

export const {setListIcp,
              setIcpSeleccionado,
              setVerIcpActive,
              setOperacionCrudIcp,
              setListSectores,
              setListProgramas,
              setListSubProgramas,
              setListProyectos,
              setListActividades,
              setListOficinas,
              setListCodigosIcpHistorico

              } = icpSlice.actions;
