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
import { IRhAdministrativosDeleteDto } from 'src/interfaces/rh/i-rh-administrativos-delete-dto'
import { setListRhBancos, setListRhTipoCuenta, setRhAdministrativoSeleccionado, setVerRhAdministrativasActive } from 'src/store/apps/rh-administrativos'
import { IRhAdministrativosUpdateDto } from 'src/interfaces/rh/i-rh-administrativos-update-dto'


import { getDateByObject } from 'src/utilities/ge-date-by-object'


// ** Third Party Imports
import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import dayjs from 'dayjs'

interface FormInputs {
  codigoAdministrativo:number,
  fechaIngreso:string,
  tipoPago :string,
  bancoId :number,
  tipoCuentaId :number,
  noCuenta :string,

}



const FormRhAdministrativoUpdateAsync = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch();


  const {rhAdministrativoSeleccionado,listRhBancos,listRhTipoCuenta} = useSelector((state: RootState) => state.rhAdministrativos)

  const listTipoPago =[{id:'D',descripcion:'Deposito'},{id:'E',descripcion:'Efectivo'}]

  const  getTipoPago=(id:string)=>{

    const result = listTipoPago?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getBanco=(id:number)=>{

    const result = listRhBancos?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  const  getTipoCuenta=(id:number)=>{

    const result = listRhTipoCuenta?.filter((elemento)=>{

      return elemento.id==id;
    });


    return result[0];
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);

  const [banco,setBanco] = useState<ISelectListDescriptiva>(getBanco(rhAdministrativoSeleccionado.bancoId))
  const [tipoCuenta,setTipoCuenta] = useState<ISelectListDescriptiva>(getTipoCuenta(rhAdministrativoSeleccionado.tipoCuentaId))
  const [tipoPago,setTipoPago] = useState<any>(getTipoPago(rhAdministrativoSeleccionado.tipoPago))

  const defaultValues = {
      codigoAdministrativo:rhAdministrativoSeleccionado.codigoAdministrativo,
      fechaIngreso:rhAdministrativoSeleccionado.fechaIngreso,
      tipoPago :rhAdministrativoSeleccionado.tipoPago,
      bancoId :rhAdministrativoSeleccionado.bancoId,
      tipoCuentaId :rhAdministrativoSeleccionado.tipoCuentaId,
      noCuenta :rhAdministrativoSeleccionado.noCuenta,


  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })



  const handlerBanco=async (e: any,value:any)=>{

    if(value!=null){
      setValue('bancoId',value.id);
      setBanco(value);

    }else{
      setValue('bancoId',0);

    }
  }
  const handlerTipoCuenta=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoCuentaId',value.id);
      setTipoCuenta(value);
    }else{
      setValue('tipoCuentaId',0);

    }
  }


  const handlerTipoPago=async (e: any,value:any)=>{

    if(value!=null){
      setValue('tipoPago',value.id);
      setTipoPago(value);
    }else{
      setValue('tipoPago','');

    }
  }


  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setVerRhAdministrativasActive(false))
    dispatch(setRhAdministrativoSeleccionado({}))
  };

  const handlerFechaDesde=(desde:Date)=>{

    const dateIsValid = dayjs(desde).isValid();
    if(dateIsValid){
      const fechaObj:IFechaDto =fechaToFechaObj(desde);
      const presupuestoTmp= {...rhAdministrativoSeleccionado,fechaIngreso:desde.toISOString(),fechaIngresoObj:fechaObj};
      dispatch(setRhAdministrativoSeleccionado(presupuestoTmp))
      setValue('fechaIngreso',desde.toISOString());
    }

  }


  const handleDelete = async  () => {

    setOpen(false);
    const deleteAdministrativo : IRhAdministrativosDeleteDto={
      codigoAdministrativo:rhAdministrativoSeleccionado.codigoAdministrativo
    }
    const responseAll= await ossmmasofApi.post<any>('/RhAdministrativos/Delete',deleteAdministrativo);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerRhAdministrativasActive(false))
      dispatch(setRhAdministrativoSeleccionado({}))
    }


  };

  const onSubmit = async (data:FormInputs) => {
    const  now = dayjs();
    const fechaIngreso=dayjs(data.fechaIngreso)
    const fechaPosterior = dayjs(fechaIngreso).isAfter(now );
    if(fechaPosterior==true){
      setErrorMessage('Fecha de Ingreso Invalida')

      return;
    }
    setLoading(true)

    const updateAdministrativo:IRhAdministrativosUpdateDto= {
      codigoAdministrativo :rhAdministrativoSeleccionado.codigoAdministrativo,
      codigoPersona:rhAdministrativoSeleccionado.codigoPersona,
      bancoId :data.bancoId,
      tipoCuentaId:data.tipoCuentaId,
      tipoPago :data.tipoPago,
      noCuenta :data.noCuenta,
      fechaIngreso :data.fechaIngreso,


    };

    const responseAll= await ossmmasofApi.post<any>('/RhAdministrativos/Update',updateAdministrativo);

    if(responseAll.data.isValid){
      dispatch(setRhAdministrativoSeleccionado(responseAll.data.data))
      dispatch(setVerRhAdministrativasActive(false))
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

      const filterBanco={descripcionId:0,tituloId:18}
      const responseBanco= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterBanco);
      dispatch(setListRhBancos(responseBanco.data))

      const filterTipoCuenta={descripcionId:0,tituloId:19}
      const responseTipoCuenta= await ossmmasofApi.post<ISelectListDescriptiva[]>('/RhDescriptivas/GetByTitulo',filterTipoCuenta);
      dispatch(setListRhTipoCuenta(responseTipoCuenta.data))

      setLoading(false);
    };




    getData();


  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='RH - Modificar Banco' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoAdministrativo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoAdministrativo)}
                      aria-describedby='validation-async-codigoAdministrativo'
                      disabled
                    />
                  )}
                />
                {errors.codigoAdministrativo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAdministrativo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
           {/* Tipo de Pago */}
           <Grid item sm={10} xs={12}>

              <Autocomplete

                    options={listTipoPago}
                    value={tipoPago}
                    id='autocomplete-padre'
                    isOptionEqualToValue={(option, value) => option.id=== value.id}
                    getOptionLabel={option => option.id + '-' + option.descripcion }
                    onChange={handlerTipoPago}
                    renderInput={params => <TextField {...params} label='Tipo Pago' />}
                  />

          </Grid>

          {/* Banco */}
          <Grid item sm={12} xs={12}>


          <Autocomplete

              options={listRhBancos}
              value={banco}
              id='autocomplete-bancos'
              isOptionEqualToValue={(option, value) => option.id=== value.id}
              getOptionLabel={option => option.id + '-' + option.descripcion }
              onChange={handlerBanco}
              renderInput={params => <TextField {...params} label='Bancos' />}
            />


          </Grid>



          {/* Tipo Cuenta */}

          <Grid item sm={12} xs={12}>

            <Autocomplete

                  options={listRhTipoCuenta}
                  value={tipoCuenta}
                  id='autocomplete-padre'
                  isOptionEqualToValue={(option, value) => option.id=== value.id}
                  getOptionLabel={option => option.id + '-' + option.descripcion }
                  onChange={handlerTipoCuenta}
                  renderInput={params => <TextField {...params} label='Tipo Cuenta' />}
                />

          </Grid>
          <Grid item  sm={3} xs={12}>
                <DatePicker

                  selected={ getDateByObject(rhAdministrativoSeleccionado.fechaIngresoObj!)}
                  id='date-time-picker-desde'
                  dateFormat='dd/MM/yyyy'
                  popperPlacement={popperPlacement}
                  onChange={(date: Date) => handlerFechaDesde(date)}
                  placeholderText='Click to select a date'
                  customInput={<CustomInput label='Fecha Ingreso' />}
                />
            </Grid>



            {/* descripcion*/}
            <Grid item sm={12} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='noCuenta'
                  control={control}
                  rules={{ maxLength:20,minLength:20}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='noCuenta'
                      onChange={onChange}
                      placeholder='noCuenta'
                      error={Boolean(errors.noCuenta)}
                      aria-describedby='validation-async-noCuenta'
                    />
                  )}
                />
                {errors.noCuenta && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-noCuenta'>
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
                  {"Esta Seguro de Eliminar estos Datos Administrativos?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminaran los datos Administrativos
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

export default FormRhAdministrativoUpdateAsync
