// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-cargos-get-dto';
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto';





export const preCargoSlice = createSlice({
  name: 'preCargo',
  initialState: {
    preCargoSeleccionado: {} as IPreCargosGetDto,
    listPreCargos:[] as IPreCargosGetDto[],
    verPreCargoActive:false,
    operacionCrudPreCargo:0,
    listTipoPersonal:[] as IPreDescriptivasGetDto[],
    tipoPersonalSeleccionado: {} as IPreDescriptivasGetDto,
    listTipoCargo:[] as IPreDescriptivasGetDto[],

  },
  reducers: {




    setPreCargoSeleccionado:(state,action)=>{

      state.preCargoSeleccionado=action.payload;
    },
    setListPreCargos:(state,action)=>{

      state.listPreCargos=action.payload;
    },
    setTipoPersonalSeleccionado:(state,action)=>{

      state.tipoPersonalSeleccionado=action.payload;
    },
    setVerPreCargoActive:(state,action)=>{

      state.verPreCargoActive=action.payload;
    },
    setOperacionCrudPreCargo:(state,action)=>{
      state.operacionCrudPreCargo=action.payload;
    },
    setListTipoPersonal:(state,action)=>{
      state.listTipoPersonal=action.payload;
    },
    setListTipoCargo:(state,action)=>{
      state.listTipoCargo=action.payload;
    },

  },

});

export const {setPreCargoSeleccionado,
              setListPreCargos,
              setVerPreCargoActive,
              setOperacionCrudPreCargo,
              setListTipoPersonal,
              setListTipoCargo,
              setTipoPersonalSeleccionado

              } = preCargoSlice.actions;
