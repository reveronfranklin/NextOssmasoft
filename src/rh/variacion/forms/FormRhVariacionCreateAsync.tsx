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
import  { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports


import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto'

import { setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl'
import { IRhPersonasMovControlUpdateDto } from 'src/interfaces/rh/RhPersonasMovControlUpdateDto'
import { setConceptoSeleccionado } from 'src/store/apps/rh'

interface FormInputs {

  codigoPersonaMovCtrl:number
  codigoPersona :number;
  codigoConcepto :number;
  controlAplica :number;

}



const FormRhVariacionCreateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();

  const listControlAplica=[{id:1,descripcion:'SI'},{id:0,descripcion:'NO'}]
  const {rhPersonaMovCtrSeleccionado} = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const {conceptos} = useSelector((state: RootState) => state.nomina)


  const  getControlAplica=(id:number)=>{

    console.log('control aplica',id,popperPlacement)
    const result = listControlAplica?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }
  const  getConcepto=(id:number)=>{

console.log('Buscar concepto>>>>>>>>',rhPersonaMovCtrSeleccionado.codigoConcepto,conceptos,id)
    const result = conceptos?.filter((elemento)=>{

      return elemento.codigoConcepto==id;
    });


    return result[0];
  }






  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [controlAplica,setControlAplica] = useState<any>(getControlAplica(rhPersonaMovCtrSeleccionado.controlAplica))
  const [concepto,setConcepto] = useState<any>(getConcepto(rhPersonaMovCtrSeleccionado.codigoConcepto))

  const defaultValues:IRhPersonasMovControlResponseDto = {

    codigoPersonaMovCtrl:rhPersonaMovCtrSeleccionado.codigoPersonaMovCtrl,
    codigoPersona :rhPersonaMovCtrSeleccionado.codigoPersona,
    codigoConcepto :rhPersonaMovCtrSeleccionado.codigoConcepto,
    controlAplica :rhPersonaMovCtrSeleccionado.controlAplica,
    descripcionControlAplica:rhPersonaMovCtrSeleccionado.descripcionControlAplica,
    descripcionConcepto:rhPersonaMovCtrSeleccionado.descripcionConcepto


}

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })





  const handlerControlAplica=async (e: any,value:any)=>{

    if(value!=null){
      setValue('controlAplica',value.id);
      setControlAplica(value);

    }else{
      setValue('controlAplica',0);

    }
  }
  const handlerConceptos =(e: any,value:any)=>{
    console.log('conceptos',value)
    if(value){
      dispatch(setConceptoSeleccionado(value));
      setConcepto(value);
      setValue('codigoConcepto',value.codigoConcepto);
    }


  }





  const onSubmit = async (data:FormInputs) => {
    setLoading(true)

    const updateMovControl:IRhPersonasMovControlUpdateDto ={
      codigoPersonaMovCtrl:0,
      codigoPersona :rhPersonaMovCtrSeleccionado.codigoPersona,
      codigoConcepto :data.codigoConcepto,
      controlAplica :data.controlAplica,

    };

    console.log('updateEducacion',updateMovControl)
    const responseAll= await ossmmasofApi.post<any>('/RhPersonasMovControl/Create',updateMovControl);

    if(responseAll.data.isValid){
      dispatch(setRhPersonaMovCtrSeleccionado(responseAll.data.data))
      dispatch(setVerRhPersonaMovCtrActive(false))
      toast.success('Form Submitted')
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)

  }
  useEffect(() => {

    const getData = async () => {
      setLoading(true);

      /*const filterBanco={descripcionId:0,tituloId:18}
      const responseBanco= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
      dispatch(setListRhBancos(responseBanco.data))

      const filterTipoCuenta={descripcionId:0,tituloId:19}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoCuenta);
      dispatch(setListRhTipoCuenta(responseTipoCuenta.data))*/

      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Crear Variación' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoPersonaMovCtrl'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoPersonaMovCtrl)}
                      aria-describedby='validation-async-codigoPersonaMovCtrl'
                      disabled
                    />
                  )}
                />
                {errors.codigoPersonaMovCtrl && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoPersonaMovCtrl'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item sm={6} xs={12}>

                  <Autocomplete

                      sx={{ width: 350 }}
                      options={conceptos}
                      id='autocomplete-concepto'
                      value={concepto}
                      isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo+ value.codigoTipoNomina}
                      getOptionLabel={option => option.codigo + '-' +option.codigoTipoNomina +'-'+ option.denominacion}
                      onChange={handlerConceptos}
                      renderInput={params => <TextField {...params} label='Conceptos' />}
                      />

              </Grid>

              {/* Control Aplica */}
              <Grid item sm={4} xs={12}>

                <Autocomplete

                  options={listControlAplica}
                  value={controlAplica}
                  id='autocomplete-graduado'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerControlAplica}
                  renderInput={params => <TextField {...params} label='Control Aplica' />}
                />

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

export default FormRhVariacionCreateAsync
