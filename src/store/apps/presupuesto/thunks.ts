


import { IPreDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-denominacion-puc';
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';

//import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';

import { setPreDenominacionPuc, setPresupuesto, setPresupuestos ,setPreDenominacionPucResumen} from 'src/store/apps/presupuesto';

//import { getValidationError } from 'src/utlities/get-validation-error';
import { IFilterPreVDenominacionPuc } from '../../../interfaces/Presupuesto/i-pre-denominacion-puc';

// ** Config
//import authConfig from 'src/configs/auth'

// ** Fetch Presupuesto
export const fetchData = async(dispatch:any) => {

    try {
      //const storedToken = localStorage.getItem(authConfig.storageTokenKeyName)


    //const responseAll= await ossmmasofApi.get<IPresupuesto[]>('/PrePresupuesto/GetAll',{headers: {Authorization: 'Bearer ' + storedToken}});

    const responseAll= await ossmmasofApi.get<IPresupuesto[]>('/PrePresupuesto/GetAll');


      const {data,status} = responseAll;



      if(data){

        console.log('Data en fetchData primer presupuesto',data[0]);
        dispatch(setPresupuestos({presupuestos:data}));

        dispatch(setPresupuesto(data[0]));

        dispatch(setPreDenominacionPuc(data[0].preDenominacionPuc))
        dispatch(setPreDenominacionPucResumen(data[0].preDenominacionPucResumen))



      }

      return {data,status}
    } catch (error) {
      console.log(error)
    }




};

export const fetchDataPreDenominacionPuc = async(dispatch:any,filter:IFilterPreVDenominacionPuc) => {


  const {data} = await ossmmasofApi.post<IPreDenominacionPuc[]>('/PreVSaldos/GetResumenPresupuestoDenominacionPuc',filter);



  dispatch(setPreDenominacionPuc({preDenominacionPuc:data}))


  return data


};
