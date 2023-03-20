


import { IPreDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-denominacion-puc';
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';

//import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';

import { setPreDenominacionPuc, setPresupuesto, setPresupuestos ,setPreDenominacionPucResumen} from 'src/store/apps/presupuesto';

//import { getValidationError } from 'src/utlities/get-validation-error';
import { IFilterPreVDenominacionPuc } from '../../../interfaces/Presupuesto/i-pre-denominacion-puc';

// ** Fetch Presupuesto
export const fetchData = async(dispatch:any) => {



  /* const response = await ossmmasofApi.get('/PrePresupuesto/GetAll')
  .then((response: AxiosResponse<IPresupuesto[]>) => {
      console.log('AxiosResponse+++',response)
  })
  .catch((reason: AxiosError<{additionalInfo:string}>) => {

    console.log(reason)
    console.log(reason.message)
    console.log('error desde el thunks', getValidationError(reason.code));
  }) */


  const responseAll= await ossmmasofApi.get<IPresupuesto[]>('/PrePresupuesto/GetAll');


  const {data,status} = responseAll;

  console.log('Status',status)

  if(data){

    console.log('Data en fetchData',data);
    dispatch(setPresupuestos({presupuestos:data}));

    dispatch(setPresupuesto({presupuestoSeleccionado:data[0]}));

    dispatch(setPreDenominacionPuc({preDenominacionPuc:data[0].preDenominacionPuc}))
    dispatch(setPreDenominacionPucResumen({preDenominacionPuc:data[0].preDenominacionPucResumen}))

  }

  return {data,status}


};

export const fetchDataPreDenominacionPuc = async(dispatch:any,filter:IFilterPreVDenominacionPuc) => {


  const {data} = await ossmmasofApi.post<IPreDenominacionPuc[]>('/PreVSaldos/GetResumenPresupuestoDenominacionPuc',filter);



  dispatch(setPreDenominacionPuc({preDenominacionPuc:data}))


  return data


};
