// ** React Imports
import { useEffect} from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'

// ** Third Party Imports
//import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../pickers/PickersCustomInput'

// ** Types
//import { DateType } from 'src/types/forms/reactDatepickerTypes'
import { Autocomplete, Card, CardContent, CardHeader, Grid, TextField } from '@mui/material'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { fetchDataListPresupuestoDto, fetchDataPreMtrDenominacionPuc, fetchDataPreMtrUnidadEjecutora } from 'src/store/apps/presupuesto/thunks'



import { setListpresupuestoDtoSeleccionado, setPreMtrDenominacionPucSeleccionado, setPreMtrUnidadEjecutoraSeleccionado } from 'src/store/apps/presupuesto'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { FilterByPresupuestoDto } from '../../../../interfaces/Presupuesto/i-filter-by-presupuesto-dto';

//const FilterPresupuesto = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {

const FilterPresupuesto = () => {


  const dispatch = useDispatch();

  const {listpresupuestoDto,preMtrUnidadEjecutora,preMtrDenominacionPuc,listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)





  // ** States

  //const [conceptosPorTipoNomina, setConceptosPorTipoNomina] = useState<IListConceptosDto[]>(conceptos)


  const handlePresupuestos= async (e: any,value:any)=>{

    console.log(value)

    if(value){



      dispatch(setListpresupuestoDtoSeleccionado(value));

      const filter:FilterByPresupuestoDto ={
        codigoPresupuesto:value.codigoPresupuesto
      }
      console.log('Filter presupuesto seleccionado',filter)
      await fetchDataPreMtrDenominacionPuc(dispatch,filter);
      await fetchDataPreMtrUnidadEjecutora(dispatch,filter);

    }else{

      const presupuesto:IListPresupuestoDto ={
        codigoPresupuesto:0,
        descripcion:'',

      };


      dispatch(setListpresupuestoDtoSeleccionado(presupuesto));
    }


  }
  const handlerDenominacionPuc= (e: any,value:any)=>{

    console.log('handlerDenominacionPuc',value)
    if(value){

      dispatch(setPreMtrDenominacionPucSeleccionado(value));
    }else{

      const denominacionPuc:IListPreMtrDenominacionPuc ={
          id:0,
          codigoPuc:0,
          codigoPucConcat:'',
          denominacionPuc:'',
          dercripcion:''


      };


      dispatch(setPreMtrDenominacionPucSeleccionado(denominacionPuc));
    }


  }


  const handlerUnidadEjecutora =(e: any,value:any)=>{

    console.log('handlerUnidadEjecutora en: ',value)
    if(value){

      dispatch(setPreMtrUnidadEjecutoraSeleccionado(value));

    }else{

      const unidadEjecutora:IListPreMtrUnidadEjecutora ={
        id:0,

        codigoIcp:0,

        codigoIcpConcat:'',

        unidadEjecutora:'',

        dercripcion:''


      };


      dispatch(setPreMtrUnidadEjecutoraSeleccionado(unidadEjecutora));
    }


  }

  useEffect(() => {

    const getData = async () => {
      const filter:FilterByPresupuestoDto ={
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto
      }
      await fetchDataListPresupuestoDto(dispatch);
      await fetchDataPreMtrDenominacionPuc(dispatch,filter);
      await fetchDataPreMtrUnidadEjecutora(dispatch,filter);

    };
    getData();



  }, [dispatch, listpresupuestoDtoSeleccionado.codigoPresupuesto]);

  return (
    <Grid item xs={12}>
    <Card>
      <CardHeader title='Filtrar Saldo Presupuesto' />
      <CardContent>
        <Grid container spacing={6}>
          <Grid item xs={12} >
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>


              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={listpresupuestoDto}
                    id='autocomplete-tipo-nomina'
                    getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion}
                    onChange={handlePresupuestos}
                    renderInput={params => <TextField {...params} label='Presupuesto' />}
                  />
              </div>
              <div>
                <Autocomplete
                    sx={{ width: 350 }}
                    options={preMtrUnidadEjecutora}
                    id='autocomplete-concepto'
                    getOptionLabel={option => option.dercripcion  + '-' + option.id }
                    onChange={handlerUnidadEjecutora}
                    renderInput={params => <TextField {...params} label='Unidad Ejecutora' />}
                  />
              </div>
               <div>
                    <Autocomplete

                      sx={{ width: 350 }}

                      options={preMtrDenominacionPuc  }
                      id='autocomplete-preMtrDenominacionPuc'
                      getOptionLabel={option => option.dercripcion + '-' + option.id + '' + option.codigoPuc}
                      onChange={handlerDenominacionPuc}
                      renderInput={params => <TextField {...params} label='Puc' />}
                      />
            </div>



          </Box>
        </Grid>

        </Grid>
      </CardContent>
    </Card>
  </Grid>

  )
}

export default FilterPresupuesto
