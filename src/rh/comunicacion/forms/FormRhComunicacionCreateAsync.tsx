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
import { Autocomplete, Box, Checkbox, FormControlLabel} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'

// ** Third Party Imports

// ** Custom Component Imports

import { IRhComunicacionResponseDto } from 'src/interfaces/rh/RhComunicacionResponseDto'
import { setRhComunicacionSeleccionado, setVerRhComunicacionActive } from 'src/store/apps/rh-comunicacion'
import { IRhComunicacionUpdate } from 'src/interfaces/rh/RhComunicacionUpdate'

interface FormInputs {
  codigoComunicacion :number;
  codigoPersona :number;
  tipoComunicacionId:number;
  codigoArea :string;
  lineaComunicacion:string;
  principal :boolean;


}



const FormRhComunicacionCreateAsync = () => {
  // ** States
  const dispatch = useDispatch();



  const {rhComunicacionSeleccionado,listRhTipoComunicacion} = useSelector((state: RootState) => state.rhComunicacion)


  const  getTipoComunicacion=(id:number)=>{

    const result = listRhTipoComunicacion?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [principal, setPrincipal] = useState(false);


  const [tipoComunicacion,setTipoComunicacion] = useState<ISelectListDescriptiva>(getTipoComunicacion(rhComunicacionSeleccionado.tipoComunicacionId))
  const [listTipoComunicacion] = useState<ISelectListDescriptiva[]>(listRhTipoComunicacion)



  const defaultValues:IRhComunicacionResponseDto = {
    codigoComunicacion :0,
    codigoPersona :rhComunicacionSeleccionado.codigoPersona,
    tipoComunicacionId :rhComunicacionSeleccionado.tipoComunicacionId,
    descripcionTipoComunicacion:'',
    codigoArea :'',
    lineaComunicacion :'',
    extencion :0,
    principal:false,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerTipoComunicacion=async (e: any,value:any)=>{
    console.log('tipo comunicacion>>>> ',value)
    if(value!=null){
      setValue('tipoComunicacionId',value.id);
      setTipoComunicacion(value);
    }else{
      setValue('tipoComunicacionId',0);

    }
  }



  const handlePrincipal=async (e: any,value:any)=>{
    console.log('valuee on click principal',value)
    setPrincipal(value);
    if(principal===true) {
      setValue('principal',value);
    }else{
      setValue('principal',value);
    }

  };



  const onSubmit = async (data:FormInputs) => {
    console.log('data',data)
    setLoading(true)

    const createComunicacion:IRhComunicacionUpdate= {
      codigoComunicacion :data.codigoComunicacion,
      codigoPersona :rhComunicacionSeleccionado.codigoPersona,
      tipoComunicacionId :data.tipoComunicacionId,
      codigoArea :data.codigoArea,
      lineaComunicacion :data.lineaComunicacion,
      extencion :0,
      principal:data.principal


    };
    console.log('object al crear',createComunicacion)
    console.log('valor principal',principal)
    const responseAll= await ossmmasofApi.post<any>('/RhComunicaciones/Create',createComunicacion);
    console.log('responseAll update comunicaciones',responseAll)
    if(responseAll.data.isValid){
      dispatch(setRhComunicacionSeleccionado(responseAll.data.data))
      dispatch(setVerRhComunicacionActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }
  useEffect(() => {
    setPrincipal(rhComunicacionSeleccionado.principal)


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Crear Comunicaion' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoComunicacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoComunicacion)}
                      aria-describedby='validation-async-codigoComunicacion'
                      disabled
                    />
                  )}
                />
                {errors.codigoComunicacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoComunicacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
           {/* Tipo de Pago */}
           <Grid item sm={6} xs={12}>

              <Autocomplete

                    options={listTipoComunicacion}
                    value={tipoComunicacion}
                    id='autocomplete-tipoComunicacion'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerTipoComunicacion}
                    renderInput={params => <TextField {...params} label='Tipo Comunicacion' />}
                  />

          </Grid>
          <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
              <FormControlLabel  control={ <Checkbox

                    checked={principal}
                    onChange={handlePrincipal}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />} label="Principal?" />

              </FormControl>
            </Grid>

            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoArea'
                  control={control}
                  rules={{ maxLength:20}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Area'
                      onChange={onChange}
                      placeholder='noCuenta'
                      error={Boolean(errors.codigoArea)}
                      aria-describedby='validation-async-codigoArea'
                    />
                  )}
                />
                {errors.codigoArea && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoArea'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item sm={9} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='lineaComunicacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Linea'
                      onChange={onChange}
                      placeholder='linea Comunicacion'
                      error={Boolean(errors.lineaComunicacion)}
                      aria-describedby='validation-async-lineaComunicacion'
                    />
                  )}
                />
                {errors.lineaComunicacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-lineaComunicacion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
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

export default FormRhComunicacionCreateAsync
