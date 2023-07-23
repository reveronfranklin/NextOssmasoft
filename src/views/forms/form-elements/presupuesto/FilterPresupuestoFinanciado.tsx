// ** React Imports
import { useEffect, useState} from 'react'

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


import { setListPresupuestoDto, setListpresupuestoDtoSeleccionado,  setPreFinanciadoDtoSeleccionado} from 'src/store/apps/presupuesto'
import { IListPresupuestoDto } from 'src/interfaces/Presupuesto/i-list-presupuesto-dto'
import { IPreFinanciadoDto } from 'src/interfaces/Presupuesto/i-list-pre-financiado-dto'
import Spinner from 'src/@core/components/spinner';
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'



//const FilterPresupuesto = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {

const FilterPresupuestoFinanciado = () => {


  const dispatch = useDispatch();

  const {listpresupuestoDto=[],listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)





  // ** States

  //const [conceptosPorTipoNomina, setConceptosPorTipoNomina] = useState<IListConceptosDto[]>(conceptos)
  const [pre, setPre] = useState<IListPresupuestoDto>(listpresupuestoDto[0]);

    const [loading, setLoading] = useState(false)
  const handlePresupuestos= async (e: any,value:any)=>{


    if(value){


      setPre(value)
      dispatch(setListpresupuestoDtoSeleccionado(value));
      const seleccionado:IPreFinanciadoDto ={
        financiadoId:0,
        descripcionFinanciado:'',

      };
      dispatch(setPreFinanciadoDtoSeleccionado(seleccionado));



    }else{

      const presupuesto:IListPresupuestoDto ={
        codigoPresupuesto:0,
        ano:0,
        descripcion:'',
        preFinanciadoDto:[]

      };

      dispatch(setListpresupuestoDtoSeleccionado(presupuesto));
    }


  }
  const handlerFinanciado =async (e: any,value:any)=>{
   if(value){
      //const seleccionado = listpresupuestoDtoSeleccionado.preFinanciadoDto.filter( pre => pre.financiadoId==e.target.value);
      dispatch(setPreFinanciadoDtoSeleccionado(value));


    }else{
      const seleccionado:IPreFinanciadoDto ={
        financiadoId:0,
        descripcionFinanciado:'',

      };
      dispatch(setPreFinanciadoDtoSeleccionado(seleccionado));

    }



  }



  useEffect(() => {

    const getData = async () => {
      setLoading(true)
      const responseAll= await ossmmasofApi.get<IListPresupuestoDto[]>('/PrePresupuesto/GetListPresupuesto');

      const {data} = responseAll;
      dispatch(setListPresupuestoDto(data));
      dispatch(setListpresupuestoDtoSeleccionado(data[0]));

      setPre(data[0])


      setLoading(false)


    };
    getData();



  }, []);

  return (
    <Grid item xs={12}>

{ loading  ? (
       <Spinner sx={{ height: '100%' }} />
      ) : (

        <Card>
        <CardHeader title='Filtrar Presupuesto' />
        <CardContent>
          <Grid container spacing={6}>
            <Grid item xs={12} >
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }} className='demo-space-x'>


                <div>

                      <Autocomplete
                          sx={{ width: 350 }}
                          options={listpresupuestoDto}
                          value={pre}
                          id='autocomplete-Presupuesto'
                          isOptionEqualToValue={(option, value) => option.codigoPresupuesto=== value.codigoPresupuesto}
                          getOptionLabel={option => option.codigoPresupuesto + '-' + option.descripcion }
                          onChange={handlePresupuestos}
                          renderInput={params => <TextField {...params} label='Presupuesto' />}
                        />

                </div>

                <div>
                  {listpresupuestoDtoSeleccionado.preFinanciadoDto ?
                    (<Autocomplete
                    sx={{ width: 350 }}
                    options={listpresupuestoDtoSeleccionado.preFinanciadoDto}

                    //value={fin}
                    id='autocomplete-FuenteFinanciado'
                    isOptionEqualToValue={(option, value) => option.financiadoId=== value.financiadoId}
                    getOptionLabel={option => option.descripcionFinanciado  + '-' + option.financiadoId }
                    onChange={handlerFinanciado}
                    renderInput={params => <TextField {...params} label='Financiado' />}
                  />  ) : <div></div>
                }

                </div>




            </Box>
          </Grid>

          </Grid>
        </CardContent>
      </Card>
      )}


  </Grid>

  )
}

export default FilterPresupuestoFinanciado
