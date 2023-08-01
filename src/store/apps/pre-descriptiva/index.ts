// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto';





export const preDescriptivaSlice = createSlice({
  name: 'preDescriptiva',
  initialState: {
    preDescriptivaSeleccionado: {} as IPreDescriptivasGetDto,
    listPreDescriptivas:[] as IPreDescriptivasGetDto[],
    verPreDescriptivaActive:false,
    operacionCrudPreDescriptiva:0,


  },
  reducers: {




    setPreDescriptivaSeleccionado:(state,action)=>{

      state.preDescriptivaSeleccionado=action.payload;
    },
    setListPreDescriptivas:(state,action)=>{

      state.listPreDescriptivas=action.payload;
    },
    setVerPreDescriptivaActive:(state,action)=>{

      state.verPreDescriptivaActive=action.payload;
    },
    setOperacionCrudPreDescriptiva:(state,action)=>{
      state.operacionCrudPreDescriptiva=action.payload;
    },


  },

});

export const {setPreDescriptivaSeleccionado,
              setListPreDescriptivas,
              setVerPreDescriptivaActive,
              setOperacionCrudPreDescriptiva,

              } = preDescriptivaSlice.actions;
