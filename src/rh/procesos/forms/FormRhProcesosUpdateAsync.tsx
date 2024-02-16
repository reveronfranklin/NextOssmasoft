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
import {  Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider} from '@mui/material'




// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports

import { setRhProcesosSeleccionado, setVerRhProcesosActive } from 'src/store/apps/rh-procesos'
import { IRhProcesosDeleteDto } from 'src/interfaces/rh/Procesos/RhProcesosDeleteDto'
import { IRhProcesosUpdateDto } from 'src/interfaces/rh/Procesos/RhProcesosUpdateDto'
import ProcesosDetalleList from 'src/rh/procesosDetalle/views/ProcesosDetalleList'

interface FormInputs {
  codigoProceso :number;
  descripcion :string;


}




const FormRhProcesoUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();



  const {rhProcesosSeleccionado} = useSelector((state: RootState) => state.rhProceso)






  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);


  const defaultValues = {
      codigoProceso:rhProcesosSeleccionado.codigoProceso,
      descripcion :rhProcesosSeleccionado.descripcion,

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })







  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhProcesosActive(false))
    dispatch(setRhProcesosSeleccionado({}))
  };




  const handleDelete = async  () => {

    setOpen(false);
    const deleteProceso : IRhProcesosDeleteDto={
      codigoProceso:rhProcesosSeleccionado.codigoProceso
    }
    const responseAll= await ossmmasofApi.post<any>('/RhProcesos/Delete',deleteProceso);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhProcesosActive(false))
      dispatch(setRhProcesosSeleccionado({}))
    }


  };


  const onSubmit = async (data:FormInputs) => {

    setLoading(true)
    setErrorMessage('')
    const update:IRhProcesosUpdateDto= {
      codigoProceso :rhProcesosSeleccionado.codigoProceso,
      descripcion :data.descripcion,

    };

    const responseAll= await ossmmasofApi.post<any>('/RhProcesos/Update',update);

    if(responseAll.data.isValid){
      dispatch(setRhProcesosSeleccionado(responseAll.data.data))
      dispatch(setVerRhProcesosActive(false))
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
      <CardHeader title='RH - Proceso de Nómina' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoProceso'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
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
        <Divider   component="li" />
        <Box sx={{ width: '100%', typography: 'body1' }}>
            <ProcesosDetalleList></ProcesosDetalleList>
        </Box>
      </CardContent>
    </Card>
  )


}

export default FormRhProcesoUpdateAsync
