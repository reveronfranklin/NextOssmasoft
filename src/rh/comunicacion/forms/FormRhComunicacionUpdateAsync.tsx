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
import { Autocomplete, Box, Checkbox, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControlLabel} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'

// ** Third Party Imports

// ** Custom Component Imports

import { IRhComunicacionResponseDto } from 'src/interfaces/rh/RhComunicacionResponseDto'
import { setRhComunicacionSeleccionado, setVerRhComunicacionActive } from 'src/store/apps/rh-comunicacion'
import { IRhComunicacionDeleteDto } from 'src/interfaces/rh/RhComunicacionDeleteDto'
import { IRhComunicacionUpdate } from 'src/interfaces/rh/RhComunicacionUpdate'

interface FormInputs {
  codigoComunicacion :number;
  codigoPersona :number;
  tipoComunicacionId:number;
  codigoArea :string;
  lineaComunicacion:string;
  principal :boolean;


}



const FormRhComunicacionUpdateAsync = () => {
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
  const [open, setOpen] = useState(false);
  const [principal, setPrincipal] = useState(false);


  const [tipoComunicacion,setTipoComunicacion] = useState<ISelectListDescriptiva>(getTipoComunicacion(rhComunicacionSeleccionado.tipoComunicacionId))
  const [listTipoComunicacion] = useState<ISelectListDescriptiva[]>(listRhTipoComunicacion)



  const defaultValues:IRhComunicacionResponseDto = {
    codigoComunicacion :rhComunicacionSeleccionado.codigoComunicacion,
    codigoPersona :rhComunicacionSeleccionado.codigoPersona,
    tipoComunicacionId :rhComunicacionSeleccionado.tipoComunicacionId,
    descripcionTipoComunicacion:rhComunicacionSeleccionado.descripcionTipoComunicacion,
    codigoArea :rhComunicacionSeleccionado.codigoArea,
    lineaComunicacion :rhComunicacionSeleccionado.lineaComunicacion,
    extencion :rhComunicacionSeleccionado.extencion,
    principal:rhComunicacionSeleccionado.principal,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handlerTipoComunicacion=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoComunicacionId',value.tipoComunicacionId);
      setTipoComunicacion(value);
    }else{
      setValue('tipoComunicacionId',0);

    }
  }



  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhComunicacionActive(false))
    dispatch(setRhComunicacionSeleccionado({}))
  };
  const handlePrincipal=async (e: any,value:any)=>{
    console.log('valuee on click principal',value)
    setPrincipal(value);
    if(principal===true) {
      setValue('principal',value);
    }else{
      setValue('principal',value);
    }

  };


  const handleDelete = async  () => {

    setOpen(false);
    const deleteComunicacion : IRhComunicacionDeleteDto={
      codigoComunicacion:rhComunicacionSeleccionado.codigoComunicacion
    }
    const responseAll= await ossmmasofApi.post<any>('/RhComunicaciones/Delete',deleteComunicacion);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhComunicacionActive(false))
      dispatch(setRhComunicacionSeleccionado({}))
    }


  };
  function validarEmail(valor:string) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(valor)){
     return true;
    } else {
     return false;
    }
  }
  const onSubmit = async (data:FormInputs) => {

    console.log('tipoComunicacion',tipoComunicacion.descripcion)
    const isEmail = tipoComunicacion.descripcion.includes('CORREO');
    console.log('es email',isEmail)
    if(isEmail==true && !validarEmail(data.lineaComunicacion)){
      setErrorMessage('Formato de Email Invalido');

      return;
    }
    setLoading(true)

    const updateComunicacion:IRhComunicacionUpdate= {
      codigoComunicacion :data.codigoComunicacion,
      codigoPersona :rhComunicacionSeleccionado.codigoPersona,
      tipoComunicacionId :data.tipoComunicacionId,
      codigoArea :data.codigoArea,
      lineaComunicacion :data.lineaComunicacion,
      extencion :0,
      principal:data.principal


    };
    console.log('object a guardar',updateComunicacion)
    console.log('valor principal',principal)
    const responseAll= await ossmmasofApi.post<any>('/RhComunicaciones/Update',updateComunicacion);
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
    setTipoComunicacion(getTipoComunicacion(rhComunicacionSeleccionado.tipoComunicacionId));


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Modificar Comunicaion' />
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
           {/* Tipo de Comunicacion */}
           <Grid item sm={6} xs={12}>

              <Autocomplete

                    options={listTipoComunicacion}
                    value={tipoComunicacion}
                    id='autocomplete-tipoComunicacion'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerTipoComunicacion}
                    renderInput={params => <TextField {...params} label='Tipo Pago' />}
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
              <Button variant="outlined"  size='large' onClick={handleClickOpen} sx={{ color: 'error.main' ,ml:2}} >
                Eliminar
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">
                  {"Esta Seguro de Eliminar estos Datos?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos de esta linea de comunicacion
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={handleDelete} autoFocus>
                    Si
                  </Button>
                </DialogActions>
              </Dialog>

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

export default FormRhComunicacionUpdateAsync
