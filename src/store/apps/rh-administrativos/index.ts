// ** Redux Imports
import { createSlice } from '@reduxjs/toolkit'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva';
import { IRhAdministrativosResponseDto } from 'src/interfaces/rh/i-rh-administrativos-response-dto';





export const rhAdministrativosSlice = createSlice({
  name: 'rhAdministrativos',
  initialState: {
    rhAdministrativoSeleccionado: {} as IRhAdministrativosResponseDto,
    listRhAdministrativos:[] as IRhAdministrativosResponseDto[],
    verRhAdministrativasActive:false,
    operacionCrudRhAdministrativas:0,
    rhBancoSeleccionado: {} as ISelectListDescriptiva,
    listRhBancos:[] as ISelectListDescriptiva[],
    rhTipoCuentaSeleccionado: {} as ISelectListDescriptiva,
    listRhTipoCuenta:[] as ISelectListDescriptiva[],
  },
  reducers: {


    setRhAdministrativoSeleccionado:(state,action)=>{

      state.rhAdministrativoSeleccionado=action.payload;
    },
    setListRhAdministrativos:(state,action)=>{

      state.listRhAdministrativos=action.payload;
    },

    setRhBancoSeleccionado:(state,action)=>{

      state.rhBancoSeleccionado=action.payload;
    },
    setListRhBancos:(state,action)=>{

      state.listRhBancos=action.payload;
    },

    setRhTipoCuentaSeleccionado:(state,action)=>{

      state.rhTipoCuentaSeleccionado=action.payload;
    },
    setListRhTipoCuenta:(state,action)=>{

      state.listRhTipoCuenta=action.payload;
    },


    setVerRhAdministrativasActive:(state,action)=>{

      state.verRhAdministrativasActive=action.payload;
    },
    setOperacionCrudRhAdministrativas:(state,action)=>{
      state.operacionCrudRhAdministrativas=action.payload;
    }

  },

});

export const {setRhAdministrativoSeleccionado,
              setListRhAdministrativos,
              setVerRhAdministrativasActive,
              setOperacionCrudRhAdministrativas,
              setRhBancoSeleccionado,
              setListRhBancos,
              setListRhTipoCuenta,
              setRhTipoCuentaSeleccionado

              } = rhAdministrativosSlice.actions;
