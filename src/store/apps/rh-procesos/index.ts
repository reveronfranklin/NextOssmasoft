// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhProcesosResponseDto } from 'src/interfaces/rh/Procesos/RhProcesosResponseDto';



export const rhProcesosSlice = createSlice({
  name: 'rhProcesosPUC',
  initialState: {
    rhProcesosSeleccionado: {} as IRhProcesosResponseDto,
    listProcesos:[] as IRhProcesosResponseDto[],
    verRhProcesosActive:false,
    operacionCrudRhProcesos:0,

  },
  reducers: {


    setRhProcesosSeleccionado:(state,action)=>{

      state.rhProcesosSeleccionado=action.payload;
    },
    setListProcesos:(state,action)=>{

      state.listProcesos=action.payload;
    },
    setVerRhProcesosActive:(state,action)=>{

      state.verRhProcesosActive=action.payload;
    },
    setOperacionCrudRhProcesos:(state,action)=>{
      state.operacionCrudRhProcesos=action.payload;
    },
  },

});

export const {
                  setRhProcesosSeleccionado,
                  setListProcesos,
                  setVerRhProcesosActive,
                  setOperacionCrudRhProcesos,

              } = rhProcesosSlice.actions;
