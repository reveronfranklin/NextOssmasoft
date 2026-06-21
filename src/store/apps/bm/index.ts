// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { Bm1GetDto } from 'src/interfaces/Bm/Bm1HetDto';
import { IBmBienesFotoResponseDto } from 'src/interfaces/Bm/BmBienesFoto/BmBienesFotoResponseDto';

const getDefaultBmDateRange = () => ({
  fechaDesde: new Date(2010, 0, 1),
  fechaHasta: new Date()
})

const defaultBmDateRange = getDefaultBmDateRange()



export const bmBm1Slice = createSlice({
  name: 'bmBm1',
  initialState: {
    bmBm1Seleccionado: {} as Bm1GetDto,
    listBmBienesFotoResponseDto:[] as IBmBienesFotoResponseDto[],
    verBmBm1Active:false,
    fechaDesde: defaultBmDateRange.fechaDesde,
    fechaHasta: defaultBmDateRange.fechaHasta,

  },
  reducers: {




    setBm1Seleccionado:(state,action)=>{

      state.bmBm1Seleccionado=action.payload;
    },


    setVerBmBm1ActiveActive:(state,action)=>{

      state.verBmBm1Active=action.payload;
    },
    setListBmBienesFotoResponseDto:(state,action)=>{

      state.listBmBienesFotoResponseDto=action.payload;
    },
    setBmFechaDesde:(state,action)=>{

      state.fechaDesde=action.payload;
    },
    setBmFechaHasta:(state,action)=>{

      state.fechaHasta=action.payload;
    },

  },

});

export const {setBm1Seleccionado,
              setVerBmBm1ActiveActive,
              setListBmBienesFotoResponseDto,
              setBmFechaDesde,
              setBmFechaHasta


              } = bmBm1Slice.actions;
