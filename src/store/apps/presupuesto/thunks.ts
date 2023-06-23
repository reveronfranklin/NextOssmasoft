


import { IPreDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-denominacion-puc';
import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';

//import { IPresupuesto } from 'src/interfaces/Presupuesto/i-presupuesto';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi';

import { setPreDenominacionPuc, setPresupuesto, setPresupuestos ,setPreDenominacionPucResumen, setPreMtrDenominacionPuc, setPreMtrUnidadEjecutora, setListPresupuestoDto} from 'src/store/apps/presupuesto';

//import { getValidationError } from 'src/utlities/get-validation-error';
import { IFilterPreVDenominacionPuc } from '../../../interfaces/Presupuesto/i-pre-denominacion-puc';
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora';
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc';
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto';
import { FilterByPresupuestoDto } from 'src/interfaces/Presupuesto/i-filter-by-presupuesto-dto';
import { IPreDetalleDocumentoGetDto } from 'src/interfaces/Presupuesto/i-pre-detalle-documento-get-dto';
import { IFilterDocumentosPreVSaldo } from 'src/interfaces/Presupuesto/i-filter-documentos-pre-VSaldo';
import { IFilterPreDenominacionDto, IPreDenominacionDto } from 'src/interfaces/Presupuesto/i-filter-pre-denominacion-dto';

// ** Config
//import authConfig from 'src/configs/auth'


// ** Fetch Presupuesto
export const fetchData = async(dispatch:any) => {

    try {
      //const storedToken = localStorage.getItem(authConfig.storageTokenKeyName)


    //const responseAll= await ossmmasofApi.get<IPresupuesto[]>('/PrePresupuesto/GetAll',{headers: {Authorization: 'Bearer ' + storedToken}});

    const responseAll= await ossmmasofApi.get<IPresupuesto[]>('/PrePresupuesto/GetAll');

   /*  const filter:IFilterPreDenominacionDto ={
      codigoPresupuesto: 17,
      financiadoId: 92,
      fechaDesde: "2023-01-01T00:00:00.000Z",
      fechaHasta: "2023-03-31T00:00:00.000Z",
      codigoGrupo: "4",
      nivel:1
    }

    const responseAllPreDenominacion= await ossmmasofApi.post<IPreDenominacionDto[]>('/PreVSaldos/GetPreVDenominacionPuc',filter);
    console.log('responseAllPreDenominacion',responseAllPreDenominacion)
      */
    const {data,status} = responseAll;



      if(data){


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
export const fetchDataMenu = async() => {


  const {data} = await ossmmasofApi.get<any>('/SisUsuarios/GetMenu');


  return data


};

export const fetchDataPreMtrUnidadEjecutora= async(dispatch:any,filter:FilterByPresupuestoDto) => {


  const {data} = await ossmmasofApi.post<IListPreMtrUnidadEjecutora[]>('/PreMtrUnidadEjecutora/GetByPresupuesto',filter);

  dispatch(setPreMtrUnidadEjecutora(data));

  return data;

};


export const fetchDataPreMtrDenominacionPuc= async(dispatch:any,filter:FilterByPresupuestoDto) => {



  const responseAll= await ossmmasofApi.post<IListPreMtrDenominacionPuc[]>('/PreMtrDenominacionPuc/GetByPresupuesto',filter);
  console.log('responseAll fetchDataPreMtrDenominacionPuc',responseAll)
  const {data} = responseAll;
  dispatch(setPreMtrDenominacionPuc(data));

  return data;

};

export const fetchDataPreVDocCompromisos = async(dispatch:any,filter:IFilterDocumentosPreVSaldo) => {



  const responseAll= await ossmmasofApi.post<IPreDetalleDocumentoGetDto[]>('/PreVDocCompromisos/GetAllByCodigoSaldo',filter);
  console.log('responseAll fetchDataPreVDocCompromisos',responseAll)
  const {data} = responseAll;

  return data;

};


export const fetchDataListPresupuestoDto= async(dispatch:any) => {



  const responseAll= await ossmmasofApi.get<IListPresupuestoDto[]>('/PrePresupuesto/GetListPresupuesto');
  console.log('responseAll fetchDataListPresupuestoDto',responseAll)
  const {data} = responseAll;
  dispatch(setListPresupuestoDto(data));

  return data;

};


