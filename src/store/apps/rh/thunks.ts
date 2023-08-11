
import { IFilterHistoricoNomina } from 'src/interfaces/rh/i-filter-historico';
import { IListConceptosDto } from 'src/interfaces/rh/i-list-conceptos';
import { IListSimplePersonaDto } from 'src/interfaces/rh/i-list-personas';
import { IListTipoNominaDto } from 'src/interfaces/rh/i-list-tipo-nomina';

//import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';


import { setConceptos, setPersonas, setTiposNomina } from '.';
import { IHistoricoMovimiento } from 'src/interfaces/rh/I-historico-movimientoDto';

//import { getValidationError } from 'src/utlities/get-validation-error';

// ** Config
//import authConfig from 'src/configs/auth'

// ** Fetch Presupuesto
export const fetchDataConceptos = async(dispatch:any) => {

    try {

     const responseAll= await ossmmasofApi.get<IListConceptosDto[]>('/RhConceptos/GetAll');


      const {data,status} = responseAll;

      if(data){


        dispatch(setConceptos(data));


      }

      return {data,status}
    } catch (error) {

    }

};

// ** Fetch Tipo Nomina
export const fetchDataTipoNomina = async(dispatch:any) => {

  try {

   const responseAll= await ossmmasofApi.get<IListTipoNominaDto[]>('/RhTipoNomina/GetAll');


    const {data,status} = responseAll;



    if(data){


      dispatch(setTiposNomina(data));


    }

    return {data,status}
  } catch (error) {

  }

};

// ** Fetch Tipo Nomina
export const fetchDataPersonas = async(dispatch:any) => {

  try {


   const responseAll= await ossmmasofApi.get<IListSimplePersonaDto[]>('/RhPersona/GetAllSimple');

   console.log('responseAll personal',responseAll)


    const {data,status} = responseAll;



    if(data){


      dispatch(setPersonas(data));

    }

    return {data,status}
  } catch (error) {

  }

};

// ** Fetch Historico Nomina
export const fetchDataHistorico = async(dispatch:any,filter:IFilterHistoricoNomina) => {


  const {data} = await ossmmasofApi.post<IHistoricoMovimiento[]>('/HistoricoMovimiento/GetHistoricoFecha',filter);



  //dispatch(setHisto(data))


  return data


};
