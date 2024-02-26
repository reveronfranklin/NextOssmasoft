// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IBmConteoResponseDto } from 'src/interfaces/Bm/BmConteo/BmConteoResponseDto';

import { ICPGetDto } from 'src/interfaces/Bm/BmConteo/ICPGetDto';
import { IBmConteoDetalleResponseDto } from 'src/interfaces/Bm/BmConteoDetalle/BmConteoDetalleResponseDto';
import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva';




export const bmBmConteoSlice = createSlice({
  name: 'bmConteo',
  initialState: {
    bmConteoSeleccionado: {} as IBmConteoResponseDto,
    listBmConteoResponseDto:[] as IBmConteoResponseDto[],
    listIcp:[]as ICPGetDto[],
    listIcpSeleccionado:[]as ICPGetDto[],
    operacionCrudBmConteo:0,
    verBmConteoActive:false,
    listConteoDescriptiva:[] as ISelectListDescriptiva[],
    bmConteoDetalleSeleccionado: {} as IBmConteoDetalleResponseDto,
    listBmConteoDetalleResponseDto:[] as IBmConteoDetalleResponseDto[],
    operacionCrudBmConteoDetalle:0,
    verBmConteoDetalleActive:false,

  },
  reducers: {




    setBmConteoSeleccionado:(state,action)=>{

      state.bmConteoSeleccionado=action.payload;
    },
    setOperacionCrudBmConteo:(state,action)=>{
      state.operacionCrudBmConteo=action.payload;
    },
    setOperacionCrudBmConteoDetalle:(state,action)=>{
      state.operacionCrudBmConteoDetalle=action.payload;
    },
    setListIcp:(state,action)=>{

      state.listIcp=action.payload;
    },
    setListIcpSeleccionado:(state,action)=>{

      state.listIcpSeleccionado=action.payload;
    },
    setVerBmConteoActive:(state,action)=>{

      state.verBmConteoActive=action.payload;
    },
    setVerBmConteoDetalleActive:(state,action)=>{

      state.verBmConteoDetalleActive=action.payload;
    },
    setListBmConteoResponseDto:(state,action)=>{

      state.listBmConteoResponseDto=action.payload;
    },
    setListConteoDescriptiva:(state,action)=>{

      state.listConteoDescriptiva=action.payload;
    },
    setBmConteoDetalleSeleccionado:(state,action)=>{

      state.bmConteoDetalleSeleccionado=action.payload;
    },
    setListBmConteoDetalleResponseDto:(state,action)=>{

      state.listBmConteoDetalleResponseDto=action.payload;
    },

  },

});

export const {setBmConteoSeleccionado,
              setVerBmConteoActive,
              setListBmConteoResponseDto,
              setOperacionCrudBmConteo,
              setListIcp,
              setListIcpSeleccionado,
              setListConteoDescriptiva,
              setBmConteoDetalleSeleccionado,
              setListBmConteoDetalleResponseDto,
              setVerBmConteoDetalleActive,
              setOperacionCrudBmConteoDetalle

              } = bmBmConteoSlice.actions;
