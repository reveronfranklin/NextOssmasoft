// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhProcesosDetalleResponseDto } from 'src/interfaces/rh/ProcesosDetalle/RhProcesosDetalleResponseDto';



export const rhProcesosDetalleSlice = createSlice({
  name: 'rhProcesosDetallePUC',
  initialState: {
    rhProcesosDetalleSeleccionado: {} as IRhProcesosDetalleResponseDto,
    listProcesosDetalle:[] as IRhProcesosDetalleResponseDto[],
    verRhProcesosDetalleActive:false,
    operacionCrudRhProcesosDetalle:0,

  },
  reducers: {


    setRhProcesosDetalleSeleccionado:(state,action)=>{

      state.rhProcesosDetalleSeleccionado=action.payload;
    },
    setListProcesosDetalle:(state,action)=>{

      state.listProcesosDetalle=action.payload;
    },
    setVerRhProcesosDetalleActive:(state,action)=>{

      state.verRhProcesosDetalleActive=action.payload;
    },
    setOperacionCrudRhProcesosDetalle:(state,action)=>{
      state.operacionCrudRhProcesosDetalle=action.payload;
    },
  },

});

export const {
                setRhProcesosDetalleSeleccionado,
                setListProcesosDetalle,
                setVerRhProcesosDetalleActive,
                setOperacionCrudRhProcesosDetalle,

              } = rhProcesosDetalleSlice.actions;
