// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { IRhEducacionResponseDto } from 'src/interfaces/rh/RhEducacionResponseDto';

import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';




export const rhEducacionSlice = createSlice({
  name: 'rhEducacion',
  initialState: {
    rhEducacionSeleccionado: {} as IRhEducacionResponseDto,
    listRhEducacion:[] as IRhEducacionResponseDto[],
    verRhEducacionActive:false,
    operacionCrudRhEducacion:0,
    rhNivelSeleccionado: {} as ISelectListDescriptiva,
    rhProfesionSeleccionado: {} as ISelectListDescriptiva,
    rhTituloSeleccionado: {} as ISelectListDescriptiva,
    rhMencionEspecialidadSeleccionado: {} as ISelectListDescriptiva,
    listRhNivel: [] as ISelectListDescriptiva[],
    listRhProfesion: [] as ISelectListDescriptiva[],
    listRhTitulo: [] as ISelectListDescriptiva[],
    listRhMencionEspecialidad: [] as ISelectListDescriptiva[],

  },
  reducers: {


    setRhEducacionSeleccionado:(state,action)=>{

      state.rhEducacionSeleccionado=action.payload;
    },
    setListRhEducacion:(state,action)=>{

      state.listRhEducacion=action.payload;
    },
    setVerRhEducacionActive:(state,action)=>{

      state.verRhEducacionActive=action.payload;
    },
    setOperacionCrudRhEducacion:(state,action)=>{
      state.operacionCrudRhEducacion=action.payload;
    },
    setRhNivelSeleccionado:(state,action)=>{

      state.rhNivelSeleccionado=action.payload;
    },
    setRhProfesionSeleccionado:(state,action)=>{

      state.rhProfesionSeleccionado=action.payload;
    },

    setRhTituloSeleccionado:(state,action)=>{

      state.rhTituloSeleccionado=action.payload;
    },

    setRhMencionEspecialidadSeleccionado:(state,action)=>{

      state.rhMencionEspecialidadSeleccionado=action.payload;
    },
    setListRhNivel:(state,action)=>{

      state.listRhNivel=action.payload;
    },
    setListRhProfesion:(state,action)=>{

      state.listRhProfesion=action.payload;
    },
    setListRhTitulo:(state,action)=>{

      state.listRhTitulo=action.payload;
    },
    setListRhMencionEspecialidad:(state,action)=>{

      state.listRhMencionEspecialidad=action.payload;
    },


  },

});

export const {setRhEducacionSeleccionado,
              setListRhEducacion,
              setVerRhEducacionActive,
              setOperacionCrudRhEducacion,
              setRhNivelSeleccionado,
              setRhProfesionSeleccionado,
              setRhTituloSeleccionado,
              setRhMencionEspecialidadSeleccionado,
              setListRhNivel,
              setListRhProfesion,
              setListRhTitulo,
              setListRhMencionEspecialidad


              } = rhEducacionSlice.actions;
