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

// import CircularProgress from '@mui/material/CircularProgress'

// ** Third Party Imports
import toast from 'react-hot-toast'
import { useForm, Controller } from 'react-hook-form'

// ** Icon Imports

//import { useDispatch } from 'react-redux'

import { useSelector } from 'react-redux'
import { RootState } from 'src/store'

import { useTheme } from '@mui/material/styles'

// ** Third Party Imports
//import DatePicker, { ReactDatePickerProps } from 'react-datepicker'

// ** Custom Component Imports
//import CustomInput from '../../form-elements/pickers/PickersCustomInput'

// ** Types


import { useDispatch } from 'react-redux'

import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider} from '@mui/material'

import { IPreRelacionCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-get-dto'
import { IPreCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-cargos-get-dto'
import { IPreRelacionCargosUpdateDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-update-dto'
import { setPreRelacionCargoSeleccionado, setVerPreRelacionCargoActive } from 'src/store/apps/pre-relacion-cargo'
import { IPreRelacionCargosDeleteDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-delete-dto'
import { IPreIndiceCategoriaProgramaticaGetDto } from '../../../interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto';
import TableServerSideRhRelacionCargo from 'src/rh/relacionCargo/components/TableServerSideRhRelacionCArgo'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DialogRhRelacionCargoInfo from 'src/rh/relacionCargo/views/DialogRhRelacionCargoInfo'
import { ReactDatePickerProps } from 'react-datepicker'
import { useQueryClient } from '@tanstack/react-query'
import { NumericFormat } from 'react-number-format'

interface FormInputs {
  codigoRelacionCargo: number
  ano: number
  escenario: number
  codigoIcp: number
  denominacionIcp: string
  codigoCargo: number
  denominacionCargo: string
  descripcionTipoCargo: string
  descripcionTipoPersonal: string
  cantidad: number
  sueldo: number
  compensacion: number
  prima: number
  otro: number

  codigoPresupuesto: number
  totalMensual: string
  totalAnual: string


}



const FormPreRelacionCargoUpdateAsync = () => {
  const theme = useTheme()
  const { direction } = theme
  const popperPlacement: ReactDatePickerProps['popperPlacement'] = direction === 'ltr' ? 'bottom-start' : 'bottom-end'

  // ** States



  const { preRelacionCargoSeleccionado} = useSelector((state: RootState) => state.preRelacionCargo)
  const { presupuestoSeleccionado} = useSelector((state: RootState) => state.presupuesto)
  const { listIcp} = useSelector((state: RootState) => state.icp)
  const { listPreCargos} = useSelector((state: RootState) => state.preCargo)
  const dispatch = useDispatch();
 
  const queryClient = useQueryClient();




  const  getCargo=(id:number)=>{

    //if(id==0) return default;

    const result = listPreCargos.filter((elemento)=>{

      return elemento.codigoCargo==id;
    });

    return result[0];
  }

  const  getIcp=(id:number)=>{

    //if(id==0) return default;
    const result = listIcp.filter((elemento)=>{

      return elemento.codigoIcp==id;
    });

    return result[0];
  }



  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  // const [loading, setLoading] = useState<boolean>(false)

  const [errorMessage, setErrorMessage] = useState<string>('')
  const [open, setOpen] = useState(false);




  const [icp,setIcp] = useState<IPreIndiceCategoriaProgramaticaGetDto>(getIcp(preRelacionCargoSeleccionado.codigoIcp))
  const [cargo,setCargo] = useState<IPreCargosGetDto>(getCargo(preRelacionCargoSeleccionado.codigoCargo))

  const defaultValues:IPreRelacionCargosGetDto = {
    codigoRelacionCargo:preRelacionCargoSeleccionado.codigoRelacionCargo,
    ano: presupuestoSeleccionado.ano,
    escenario: preRelacionCargoSeleccionado.escenario,
    codigoIcp: preRelacionCargoSeleccionado.codigoIcp,
    denominacionIcp:preRelacionCargoSeleccionado.denominacionIcp,
    codigoCargo:preRelacionCargoSeleccionado.codigoCargo,
    denominacionCargo: preRelacionCargoSeleccionado.denominacionCargo,
    descripcionTipoCargo:preRelacionCargoSeleccionado.descripcionTipoCargo,
    descripcionTipoPersonal: preRelacionCargoSeleccionado.descripcionTipoPersonal,
    cantidad: preRelacionCargoSeleccionado.cantidad,
    sueldo: preRelacionCargoSeleccionado.sueldo,
    compensacion: preRelacionCargoSeleccionado.compensacion,
    prima: preRelacionCargoSeleccionado.prima ,
    otro: preRelacionCargoSeleccionado.otro,

    totalMensual: preRelacionCargoSeleccionado.totalMensual,
    totalAnual: preRelacionCargoSeleccionado.totalAnual,
    codigoPresupuesto:presupuestoSeleccionado.codigoPresupuesto,
    icpConcat:preRelacionCargoSeleccionado.icpConcat,
    searchText:preRelacionCargoSeleccionado.searchText,
    page:preRelacionCargoSeleccionado.page

  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })


  const handlerCargo=async (e: any,value:any)=>{

    if(value!=null){
      setValue('codigoCargo',value.codigoCargo);
      setValue('denominacionCargo',value.denominacion);
      setCargo(value)
  

    }else{
      setValue('codigoCargo',0);

    }
  }
  const handlerCodigoIcp= async (e: any,value:any)=>{
  
    if(value!=null){
      setValue('codigoIcp',value.codigoIcp);
      setValue('denominacionIcp',value.denominacion);
      setIcp(value)

    }else{
      setValue('codigoIcp',0);
      setValue('denominacionIcp','');
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async  () => {

    setOpen(false);
    const deleteRelacionCargo : IPreRelacionCargosDeleteDto={
      codigoRelacionCargo:preRelacionCargoSeleccionado.codigoRelacionCargo
    }
    const responseAll= await ossmmasofApi.post<any>('/PreRelacionCargos/Delete',deleteRelacionCargo);
    setErrorMessage(responseAll.data.message)
    if(responseAll.data.isValid){

      dispatch(setVerPreRelacionCargoActive(false))
      dispatch(setPreRelacionCargoSeleccionado({}))
    }


  };

  const handlerCantidad = (cantidad: string) => {
    const cantidadInt = cantidad === '' ? 0 : parseFloat(cantidad)
    setValue('cantidad', cantidadInt)
  }
  const handlerSueldo = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)
    setValue('sueldo', valueInt)
  }
  const handlerCompensacion = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('compensacion', valueInt)
  }
  const handlerPrima = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('prima', valueInt)
  }
  const handlerOtro = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('otro', valueInt)
  }
  const onSubmit = async (data:FormInputs) => {
    // setLoading(true)

  
    const updateRelacionCargo:IPreRelacionCargosUpdateDto= {


      codigoRelacionCargo: data.codigoRelacionCargo,
      ano: data.ano,
      escenario: data.escenario,
      codigoIcp: data.codigoIcp,
      denominacionIcp: data.denominacionIcp,
      codigoCargo: data.codigoCargo,
      cantidad: data.cantidad,
      sueldo: data.sueldo,
      compensacion: data.compensacion,
      prima: data.prima,
      otro: data.otro,
      codigoPresupuesto:data.codigoPresupuesto


    };

    console.log('registro seleccionado',preRelacionCargoSeleccionado)
    const responseAll= await ossmmasofApi.post<any>('/PreRelacionCargos/Update',updateRelacionCargo);

    if(responseAll.data.isValid){
      
      queryClient.invalidateQueries({
        queryKey: ['preRelacionCargo',  preRelacionCargoSeleccionado.page,preRelacionCargoSeleccionado.codigoIcp,preRelacionCargoSeleccionado.codigoPresupuesto]
      })
      
      
        dispatch(setPreRelacionCargoSeleccionado(responseAll.data.data))
      dispatch(setVerPreRelacionCargoActive(false))
    }


    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    // setLoading(false)
    toast.success('Form Submitted')
  }
  useEffect(() => {




  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card>
      <CardHeader title='Presupuesto - Modificar Relacion Cargo' />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>

            {/* descripcionId */}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoRelacionCargo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoCargo)}
                      aria-describedby='validation-async-codigoCargo'
                      disabled
                    />
                  )}
                />
                {errors.codigoCargo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoCargo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* descripcion*/}
               <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='ano'
                  control={control}
                  rules={{ required: true ,maxLength:200}}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Ano'
                      onChange={onChange}
                      placeholder='Ano'
                      error={Boolean(errors.ano)}
                      disabled
                      aria-describedby='validation-async-ano'
                    />
                  )}
                />
                {errors.ano && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-ano'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* escenario*/}
            <Grid item sm={4} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='escenario'
                  control={control}
                  rules={{ min:0}}

                  render={({ field: { value, onChange } }) => (

                    <TextField

                      value={value || 0}
                      type="number"
                      label='Escenario'
                      onChange={onChange}
                      placeholder='Escenario'
                      error={Boolean(errors.escenario)}
                      aria-describedby='validation-async-escenario'
                    />
                  )}
                />
                {errors.escenario && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-escenario'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
          {/* codigoIcp */}
          <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoIcp'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='codigoIcp'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoIcp)}
                      aria-describedby='validation-async-codigoIcp'
                      disabled
                    />
                  )}
                />
                {errors.codigoIcp && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-tipoPersonalId'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
          </Grid>

               {/* Icp */}

          <Grid item sm={10} xs={12}>
          <FormControl fullWidth>
            <Autocomplete

                  options={listIcp}
                  value={icp}
                  id='autocomplete-icp'
                  isOptionEqualToValue={(option, value) => option.codigoIcp=== value.codigoIcp}
                  getOptionLabel={option => option.codigoIcpConcat + '-' + option.denominacion }
                  onChange={handlerCodigoIcp}
                  renderInput={params => <TextField {...params} label='Icp' />}
                />

          </FormControl>
          </Grid>


            {/* tipoCargoId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoCargo'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id Cargo'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoCargo)}
                      aria-describedby='validation-async-codigoCargo'
                      disabled
                    />
                  )}
                />
                {errors.codigoCargo && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoCargo'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
               {/* TipoCargo */}

               <Grid item sm={10} xs={12}>
                <FormControl fullWidth>
                  <Autocomplete

                        options={listPreCargos}
                        value={cargo}
                        id='autocomplete-padre'
                        isOptionEqualToValue={(option, value) => option.codigoCargo=== value.codigoCargo}
                        getOptionLabel={option => option.codigoCargo + '-' + option.denominacion }
                        onChange={handlerCargo}
                        renderInput={params => <TextField {...params} label='Cargo' />}
                      />

                </FormControl>
            </Grid>

            {/* cantidad*/}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                                <Controller
                                    name='cantidad'
                                    control={control}
                                    rules={{
                                        required: false,
                                        min: 0,
                                    }}
                                    render={({ field: { value } }) => (
                                        <NumericFormat
                                            value={value}
                                            customInput={TextField}
                                            thousandSeparator="."
                                            decimalSeparator=","
                                            allowNegative={false}
                                            decimalScale={0}
                                            fixedDecimalScale={true}
                                            label="Cantidad"
                                            onValueChange={(values: any) => {
                                                const { value } = values
                                                handlerCantidad(value)
                                            }}
                                            placeholder='Cantidad'
                                            error={Boolean(errors.cantidad)}
                                            aria-describedby='validation-async-cantidad'
                                            inputProps={{
                                                type: 'text',
                                            }}
                                        />
                                    )}
                                />
                                {errors.cantidad && (
                                    <FormHelperText sx={{ color: 'error.main' }} id='validation-async-cantidad'>
                                        This field is required
                                    </FormHelperText>
                                )}
              </FormControl>
            </Grid>
            {/* sueldo*/}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                                  <Controller
                                      name='sueldo'
                                      control={control}
                                      rules={{
                                          required: false,
                                          min: 0.001,
                                      }}
                                      render={({ field: { value } }) => (
                                          <NumericFormat
                                              value={value}
                                              customInput={TextField}
                                              thousandSeparator="."
                                              decimalSeparator=","
                                              allowNegative={false}
                                              decimalScale={2}
                                              fixedDecimalScale={true}
                                              label="Sueldo"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerSueldo(value)
                                              }}
                                              placeholder='Sueldo'
                                              error={Boolean(errors.sueldo)}
                                              aria-describedby='validation-async-sueldo'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.sueldo && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-sueldo'>
                                          This field is required
                                      </FormHelperText>
                                  )}
              </FormControl>
            </Grid>

            {/* compensacion*/}
            <Grid item sm={3} xs={12}>
              <FormControl fullWidth>
                                    <Controller
                                        name='compensacion'
                                        control={control}
                                        rules={{
                                            required: false,
                                            min: 0,
                                        }}
                                        render={({ field: { value } }) => (
                                            <NumericFormat
                                                value={value}
                                                customInput={TextField}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                label="Compensacion"
                                                onValueChange={(values: any) => {
                                                    const { value } = values
                                                    handlerCompensacion(value)
                                                }}
                                                placeholder='Compensacion'
                                                error={Boolean(errors.compensacion)}
                                                aria-describedby='validation-async-compensacion'
                                                inputProps={{
                                                    type: 'text',
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.compensacion && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-async-compensacion'>
                                            This field is required
                                        </FormHelperText>
                                    )}
              </FormControl>
            </Grid>
            {/* prima*/}
            <Grid item sm={2} xs={12}>
             
              <FormControl fullWidth>
                                    <Controller
                                        name='prima'
                                        control={control}
                                        rules={{
                                            required: false,
                                            min: 0,
                                        }}
                                        render={({ field: { value } }) => (
                                            <NumericFormat
                                                value={value}
                                                customInput={TextField}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                label="Prima"
                                                onValueChange={(values: any) => {
                                                    const { value } = values
                                                    handlerPrima(value)
                                                }}
                                                placeholder='Prima'
                                                error={Boolean(errors.prima)}
                                                aria-describedby='validation-async-prima'
                                                inputProps={{
                                                    type: 'text',
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.prima && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-async-prima'>
                                            This field is required
                                        </FormHelperText>
                                    )}
              </FormControl>
            </Grid>
            {/* otro*/}
            <Grid item sm={2} xs={12}>
            <FormControl fullWidth>
                                    <Controller
                                        name='otro'
                                        control={control}
                                        rules={{
                                            required: false,
                                            min: 0,
                                        }}
                                        render={({ field: { value } }) => (
                                            <NumericFormat
                                                value={value}
                                                customInput={TextField}
                                                thousandSeparator="."
                                                decimalSeparator=","
                                                allowNegative={false}
                                                decimalScale={2}
                                                fixedDecimalScale={true}
                                                label="Otro"
                                                onValueChange={(values: any) => {
                                                    const { value } = values
                                                    handlerOtro(value)
                                                }}
                                                placeholder='Prima'
                                                error={Boolean(errors.otro)}
                                                aria-describedby='validation-async-otro'
                                                inputProps={{
                                                    type: 'text',
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.otro && (
                                        <FormHelperText sx={{ color: 'error.main' }} id='validation-async-otro'>
                                            This field is required
                                        </FormHelperText>
                                    )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
             {/*  <Button size='large' type='submit' variant='contained'>
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
              </Button> */}

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
                  {"Esta Seguro de Eliminar este Cargo?"}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">
                    Se eliminara el Cargo solo si no tiene movimiento asociado
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
        <Divider>Movimientos de Cargo</Divider>
        <Grid item sm={12} xs={12}>
          <TableServerSideRhRelacionCargo></TableServerSideRhRelacionCargo>
        </Grid>
        <DatePickerWrapper>
          <DialogRhRelacionCargoInfo  popperPlacement={popperPlacement} />
        </DatePickerWrapper>

      </CardContent>
    </Card>
  )


}



export default FormPreRelacionCargoUpdateAsync
