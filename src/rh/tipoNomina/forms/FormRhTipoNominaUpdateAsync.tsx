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
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material'



import { ISelectListDescriptiva } from 'src/interfaces/rh/ISelectListDescriptiva'



// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import { setRhTipoNominaSeleccionado, setVerRhTipoNominaActive } from 'src/store/apps/rh-tipoNomina'
import { IRhTiposNominaDeleteDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaDeleteDto'
import { IRhTiposNominaUpdateDto } from 'src/interfaces/rh/TipoNomina/RhTiposNominaUpdateDto'

interface FormInputs {
  codigoTipoNomina :number;
  descripcion :string;
  siglasTipoNomina :string;
  frecuenciaPagoId :number;
  sueldoMinimo :number;

}




const FormRhTipoNominaUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();



  const {rhTipoNominaSeleccionado,listRhFrecuencia} = useSelector((state: RootState) => state.rhTipoNomina)




  const  getFrecuencia=(id:number)=>{

    const result = listRhFrecuencia?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }


  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [frecuencia,setFrecuencia] = useState<ISelectListDescriptiva>(getFrecuencia(rhTipoNominaSeleccionado.frecuenciaPagoId))

  const defaultValues = {
      codigoTipoNomina:rhTipoNominaSeleccionado.codigoTipoNomina,

      descripcion :rhTipoNominaSeleccionado.descripcion,
      siglasTipoNomina :rhTipoNominaSeleccionado.siglasTipoNomina,
      frecuenciaPagoId :rhTipoNominaSeleccionado.frecuenciaPagoId,
      frecuenciaPago:rhTipoNominaSeleccionado.frecuenciaPago,
      sueldoMinimo :rhTipoNominaSeleccionado.sueldoMinimo,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerFrecuencia=async (e: any,value:any)=>{

    if(value!=null){
      setValue('frecuenciaPagoId',value.id);
      setFrecuencia(value);

    }else{
      setValue('frecuenciaPagoId',0);

    }
  }





  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhTipoNominaActive(false))
    dispatch(setRhTipoNominaSeleccionado({}))
  };




  const handleDelete = async  () => {

    setOpen(false);
    const deleteTipoNomina : IRhTiposNominaDeleteDto={
      codigoTipoNomina:rhTipoNominaSeleccionado.codigoTipoNomina
    }
    const responseAll= await ossmmasofApi.post<any>('/RhTipoNomina/Delete',deleteTipoNomina);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhTipoNominaActive(false))
      dispatch(setRhTipoNominaSeleccionado({}))
    }


  };
  function isNumber(value:any) {
    return !isNaN(parseFloat(value)) && isFinite(value);
  }

  const onSubmit = async (data:FormInputs) => {

    console.log('data.sueldoMinimo',data.sueldoMinimo)
    console.log('Is number',isNumber(data.sueldoMinimo))
    if(!isNumber(data.sueldoMinimo)){
      setErrorMessage('Sueldo Minimo Invalido')

      return;
    }

    setLoading(true)
    setErrorMessage('')
    const update:IRhTiposNominaUpdateDto= {
      codigoTipoNomina :rhTipoNominaSeleccionado.codigoTipoNomina,
      descripcion :data.descripcion,
      siglasTipoNomina:data.siglasTipoNomina,
      frecuenciaPagoId :data.frecuenciaPagoId,
      sueldoMinimo :data.sueldoMinimo,
    };

    const responseAll= await ossmmasofApi.post<any>('/RhTipoNomina/Update',update);

    if(responseAll.data.isValid){
      dispatch(setRhTipoNominaSeleccionado(responseAll.data.data))
      dispatch(setVerRhTipoNominaActive(false))
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
      console.log(popperPlacement);

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
      <CardHeader title='RH - Tipo de Nómina' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoTipoNomina'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoTipoNomina)}
                      aria-describedby='validation-async-codigoTipoNomina'
                      disabled
                    />
                  )}
                />
                {errors.codigoTipoNomina && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoTipoNomina'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
           {/* Frecuencia */}
           <Grid item sm={10} xs={12}>

              <Autocomplete

                    options={listRhFrecuencia}
                    value={frecuencia}
                    id='autocomplete-padre'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerFrecuencia}
                    renderInput={params => <TextField {...params} label='Frecuencia' />}
                  />

          </Grid>





            {/* siglasTipoNomina*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='siglasTipoNomina'
                  control={control}
                  rules={{ maxLength:3,minLength:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Sigla'
                      onChange={onChange}
                      placeholder='Sigla'
                      error={Boolean(errors.siglasTipoNomina)}
                      aria-describedby='validation-async-siglasTipoNomina'
                    />
                  )}
                />
                {errors.siglasTipoNomina && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-siglasTipoNomina'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>


            {/* descripcion*/}
            <Grid item sm={8} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='descripcion'
                  control={control}
                  rules={{ maxLength:100,minLength:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Descripcion'
                      onChange={onChange}
                      placeholder='Descripcion'
                      error={Boolean(errors.descripcion)}
                      aria-describedby='validation-async-Descripcion'
                    />
                  )}
                />
                {errors.descripcion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-descripcion'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* sueldoMinimo*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='sueldoMinimo'
                  control={control}
                  rules={{ maxLength:100,minLength:1}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Sueldo Minimo'
                      onChange={onChange}
                      placeholder='Sueldo Minimo'
                      error={Boolean(errors.sueldoMinimo)}
                      aria-describedby='validation-async-sueldoMinimo'
                    />
                  )}
                />
                {errors.sueldoMinimo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sueldoMinimo'>
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
                  {"Esta Seguro de Eliminar estos Datos Tipo Nomina?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos de Tipo Nomina
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

export default FormRhTipoNominaUpdateAsync
