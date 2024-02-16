// ** React Imports

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'

import FormHelperText from '@mui/material/FormHelperText'

import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

//import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'



// ** Third Party Imports
//import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types


import { useDispatch } from 'react-redux'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box} from '@mui/material'




// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { setRhTipoNominaSeleccionado } from 'src/store/apps/rh-tipoNomina'
import { setRhConceptosSeleccionado } from 'src/store/apps/rh-conceptos'
import { setRhProcesosDetalleSeleccionado, setVerRhProcesosDetalleActive } from 'src/store/apps/rh-procesosDetalle'
import { IRhProcesosDetalleUpdateDto } from 'src/interfaces/rh/ProcesosDetalle/RhProcesosDetalleUpdateDto'

interface FormInputs {
  codigoDetalleProceso :number;
  codigoProceso :number;
  codigoConcepto :number;
  codigoTipoNomina :number;

}



const FormRhProcesosDetalleCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const {listRhConceptos} = useSelector((state: RootState) => state.rhConceptos)
  const {rhProcesosDetalleSeleccionado} = useSelector((state: RootState) => state.rhProcesoDetalle)
  const {listRhTipoNomina} = useSelector((state: RootState) => state.rhTipoNomina)


  const  getTipoNomina=(id:number)=>{


    const result = listRhTipoNomina?.filter((elemento:any)=>{

      return elemento.codigoTipoNomina==id;
    });


    return result[0];
  }

  const  getConcepto=(codigoTipoNomina:number,codigoConcepto:number)=>{

    const result = listRhConceptos?.filter((elemento:any)=>{

      return elemento.codigoTipoNomina==codigoTipoNomina && elemento.codigoConcepto==codigoConcepto;
    });


    return result[0];
  }

  const  getConceptosList=(codigoTipoNomina:number)=>{

    const result = listRhConceptos?.filter((elemento:any)=>{

      return elemento.codigoTipoNomina==codigoTipoNomina;
    });


    return result;
  }



  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')


  const [tipoNomina,setTipoNomina] = useState<any>(getTipoNomina(rhProcesosDetalleSeleccionado.codigoTipoNomina));

  const [concepto,setConcepto] = useState<any>(getConcepto(rhProcesosDetalleSeleccionado.codigoTipoNomina,rhProcesosDetalleSeleccionado.codigoConcepto));
  const [conceptosList,setConceptosList] = useState<any>(getConceptosList(rhProcesosDetalleSeleccionado.codigoTipoNomina));

  const defaultValues = {


    codigoDetalleProceso :rhProcesosDetalleSeleccionado.codigoDetalleProceso,
    codigoProceso :rhProcesosDetalleSeleccionado.codigoProceso,
    codigoConcepto :rhProcesosDetalleSeleccionado.codigoConcepto,
    codigoTipoNomina :rhProcesosDetalleSeleccionado.codigoTipoNomina

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })




  const handleTiposNomina= (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('codigoTipoNomina',value.codigoTipoNomina)
      dispatch(setRhTipoNominaSeleccionado(value));
      setTipoNomina(value)
      setConceptosList( getConceptosList(value.codigoTipoNomina))


    }else{

      dispatch(setRhTipoNominaSeleccionado({}));
      setValue('codigoTipoNomina',0)
      setTipoNomina(null)
    }
  }

  const handleConceptos= (e: any,value:any)=>{
    console.log(value)
    if(value!=null){
      setValue('codigoConcepto',value.codigoConcepto)
      dispatch(setRhConceptosSeleccionado(value));
      setConcepto(value)

    }else{

      dispatch(setRhConceptosSeleccionado({}));
      setValue('codigoConcepto',0)
      setConcepto(null)
    }
  }



  const onSubmit = async (data:FormInputs) => {


    setLoading(true)

    const updateProcesoDetalle:IRhProcesosDetalleUpdateDto= {

      codigoDetalleProceso :rhProcesosDetalleSeleccionado.codigoDetalleProceso,
      codigoProceso :rhProcesosDetalleSeleccionado.codigoProceso,
      codigoConcepto :data.codigoConcepto,
      codigoTipoNomina :data.codigoTipoNomina

    };

    console.log('updateConceptoAcumulado',updateProcesoDetalle)
    const responseAll= await ossmmasofApi.post<any>('/RhProcesosDetalle/Create',updateProcesoDetalle);

    if(responseAll.data.isValid){
      dispatch(setRhProcesosDetalleSeleccionado(responseAll.data.data))
      dispatch(setVerRhProcesosDetalleActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }
  useEffect(() => {

    const getData = async () => {
      setLoading(true);
      console.log(popperPlacement)


      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Modificar Proceso Detalle' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
          <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoDetalleProceso'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoDetalleProceso)}
                      aria-describedby='validation-async-codigoDetalleProceso'
                      disabled
                    />
                  )}
                />
                {errors.codigoDetalleProceso && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoDetalleProceso'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoProceso'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id Proceso'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoProceso)}
                      aria-describedby='validation-async-codigoProceso'
                      disabled
                    />
                  )}
                />
                {errors.codigoProceso && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoProceso'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* Tipo Nomina */}
            <Grid item sm={8} xs={12}>




              {listRhTipoNomina ?
                  ( <Autocomplete


                    options={listRhTipoNomina}
                    value={tipoNomina}
                    id='autocomplete-tipo-nomina'
                    isOptionEqualToValue={(option, value) => option.codigoTipoNomina=== value.codigoTipoNomina}
                    getOptionLabel={option => option.codigoTipoNomina + '-'+option.descripcion}
                    onChange={handleTiposNomina}
                    renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                  /> ) : <div></div>
              }



            </Grid>
            {/* Tipo Nomina */}
            <Grid item sm={12} xs={12}>


            <div>

              {listRhConceptos ?
                  ( <Autocomplete


                    options={conceptosList}
                    value={concepto}
                    id='autocomplete-tipo-nomina'
                    isOptionEqualToValue={(option, value) => option.codigoConcepto === value.codigoConcepto}
                    getOptionLabel={option => option.codigoTipoNomina +'-'+ option.codigoConcepto + '-' + option.denominacion}
                    onChange={handleConceptos}
                    renderInput={params => <TextField {...params} label='Tipo Nomina' />}
                  /> ) : <div></div>
              }
              </div>


            </Grid>

            <Grid item xs={12}>
              <Button size='large' type='submit' variant='contained'>
                {loading ? (
                  <CircularProgress
                    sx={{
                      color: 'common.white',
                      width: '20px !important',
                      height: '20px !important',
                      mr: theme => theme.spacing(2)
                    }}
                  />
                ) : null}
                Guardar
              </Button>

            </Grid>

          </Grid>
          <Box>
              {errorMessage.length>0 && <FormHelperText sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}>{errorMessage}</FormHelperText>}
          </Box>
        </form>
      </CardContent>
    </Card>
  )


}

export default FormRhProcesosDetalleCreateAsync
