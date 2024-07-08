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
//import Icon from 'src/@core/components/icon'

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
import {
  Autocomplete,
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography
} from '@mui/material'

// ** Third Party Imports

// ** Custom Component Imports

import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { setPreMtrDenominacionPucSeleccionado, setPreMtrUnidadEjecutoraSeleccionado } from 'src/store/apps/presupuesto'
import {
  setPrePucSolModificacionSeleccionado,
  setVerPrePucSolModificacionUpdateActive
} from 'src/store/apps/pre-puc-sol-modificacion'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IPrePucSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionUpdateDto'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'
import DialogPreSaldoDisponibleInfo from 'src/presupuesto/preSaldoPendiente/views/DialogPreSaldoDisponibleInfo'
import { setPreSaldoDisponibleSeleccionado, setVerPreSaldoDisponibleActive } from 'src/store/apps/pre-saldo-disponible'
import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'
import { IPrePucSolModificacionDeleteDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionDeleteDto'
import { NumericFormat } from 'react-number-format'

interface FormInputs {
  codigoPucSolModificacion: number
  codigoSolModificacion: number
  codigoSaldo: number
  statusProceso: string
  financiadoId: number
  codigoIcp: number
  codigoPuc: number
  monto: number
  dePara: string
}

interface Props {
  dePara: string
}

const FormPrePucSolModificacionUpdateAsync = ({ dePara }: Props) => {
  // ** States
  const dispatch = useDispatch()

  const getIcp = (id: number) => {
    const result = preMtrUnidadEjecutora?.filter(elemento => {
      return elemento.codigoIcp == id
    })

    return result[0]
  }
  const getPuc = (id: number) => {
    const result = preMtrDenominacionPuc?.filter(elemento => {
      return elemento.codigoPuc == id
    })

    return result[0]
  }
  const getFinanciado = (id: number) => {
    const result = listFinanciado?.filter(elemento => {
      return elemento.id == id
    })

    return result[0]
  }

  // ** States
  //const [date, setDate] = useState<DateType>(new Date())
  const [loading, setLoading] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string>('')

  const [open, setOpen] = useState(false)

  const { preSolModificacionSeleccionado } = useSelector((state: RootState) => state.preSolModificacion)
  const { preSaldoDisponibleSeleccionado } = useSelector((state: RootState) => state.preSaldoDisponible)
  const [titulo] = useState<string>(
    'Pre - Modificar PUC-ICP Solicitud de Modificación' + (dePara == 'D' ? '(DESCONTAR)' : '(APORTAR)')
  )
  const { prePucSolModificacionSeleccionado, listFinanciado } = useSelector(
    (state: RootState) => state.prePucSolModificacion
  )
  const { preMtrUnidadEjecutora, preMtrDenominacionPuc } = useSelector((state: RootState) => state.presupuesto)
  const [icp, setIcp] = useState<IListPreMtrUnidadEjecutora>(getIcp(prePucSolModificacionSeleccionado.codigoIcp))
  const [puc, setPuc] = useState<IListPreMtrDenominacionPuc>(getPuc(+prePucSolModificacionSeleccionado.codigoPuc))
  const [deParaState, setDeParaState] = useState<string>(prePucSolModificacionSeleccionado.dePara)
  const [financiado, setFinanciado] = useState<ISelectListDescriptiva>(
    getFinanciado(+prePucSolModificacionSeleccionado.financiadoId)
  )

  const defaultValues = {
    codigoSaldo: prePucSolModificacionSeleccionado.codigoSaldo,
    codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
    codigoPucSolModificacion: prePucSolModificacionSeleccionado.codigoPucSolModificacion,
    statusProceso: preSolModificacionSeleccionado.statusProceso,
    financiadoId: prePucSolModificacionSeleccionado.financiadoId,
    codigoIcp: prePucSolModificacionSeleccionado.codigoIcp,
    codigoPuc: prePucSolModificacionSeleccionado.codigoPuc,
    monto: prePucSolModificacionSeleccionado.monto,
    dePara: prePucSolModificacionSeleccionado.dePara
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)

    //dispatch(setVerPreSolModificacionActive(false))
    //dispatch(setPreSolModificacionSeleccionado({}))
  }

  const handleDelete = async () => {
    setLoading(true)
    setOpen(false)

    const deleteSol: IPrePucSolModificacionDeleteDto = {
      codigoPucSolModificacion: prePucSolModificacionSeleccionado.codigoPucSolModificacion
    }
    const responseAll = await ossmmasofApi.post<any>('/PrePucSolModificacion/Delete', deleteSol)

    if (responseAll.data.isValid) {
      setLoading(false)
      const defaultValues: IPrePucSolModificacionUpdateDto = {
        codigoPucSolModificacion: 0,
        codigoSaldo: 0,
        codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
        financiadoId: 0,
        codigoIcp: 0,
        codigoPuc: 0,
        monto: 0,
        dePara: deParaState,
        codigoPresupuesto: preSolModificacionSeleccionado.codigoPresupuesto
      }

      dispatch(setPrePucSolModificacionSeleccionado(defaultValues))
      dispatch(setVerPrePucSolModificacionUpdateActive(false))
      const defaultSaldoSeleccionado: IListIcpPucConDisponible = {
        codigoSaldo: 0,
        codigoIcp: 0,
        codigoIcpConcat: '',
        denominacionIcp: '',
        codigoPuc: 0,
        codigoPucConcat: '',
        denominacionPuc: '',
        financiadoId: 0,
        denominacionFinanciado: '',
        disponible: 0,
        searchText: ''
      }
      dispatch(setPreSaldoDisponibleSeleccionado(defaultSaldoSeleccionado))
    }
    setLoading(false)
    setErrorMessage(responseAll.data.message)
  }
  const handlerUnidadEjecutora = (e: any, value: any) => {
    if (value) {
      dispatch(setPreMtrUnidadEjecutoraSeleccionado(value))
      setValue('codigoIcp', value.codigoIcp)

      const solTmp = {
        ...preSolModificacionSeleccionado,
        codigoIcp: value.codigoIcp
      }
      dispatch(setPrePucSolModificacionSeleccionado(solTmp))
      setIcp(value)
    } else {
      const unidadEjecutora: IListPreMtrUnidadEjecutora = {
        id: 0,

        codigoIcp: 0,

        codigoIcpConcat: '',

        unidadEjecutora: '',

        dercripcion: ''
      }

      dispatch(setPreMtrUnidadEjecutoraSeleccionado(unidadEjecutora))
    }
  }

  const handlerDenominacionPuc = (e: any, value: any) => {
    if (value) {
      dispatch(setPreMtrDenominacionPucSeleccionado(value))
      setValue('codigoPuc', value.codigoPuc)
      setPuc(value)
    } else {
      const denominacionPuc: IListPreMtrDenominacionPuc = {
        id: 0,
        codigoPuc: 0,
        codigoPucConcat: '',
        denominacionPuc: '',
        dercripcion: ''
      }

      dispatch(setPreMtrDenominacionPucSeleccionado(denominacionPuc))
    }
  }
  const handlerFinanciado = (e: any, value: any) => {
    if (value) {
      dispatch(setPreMtrDenominacionPucSeleccionado(value))
      setValue('financiadoId', value.id)
      setFinanciado(value)
    }
  }

  const onSubmit = async (data: FormInputs) => {
    setLoading(true)

    const update: IPrePucSolModificacionUpdateDto = {
      codigoPucSolModificacion: prePucSolModificacionSeleccionado.codigoPucSolModificacion,
      codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
      codigoSaldo: prePucSolModificacionSeleccionado.codigoSaldo,
      financiadoId: data.financiadoId,
      codigoIcp: data.codigoIcp,
      codigoPuc: data.codigoPuc,
      monto: data.monto,
      dePara: deParaState,
      codigoPresupuesto: preSolModificacionSeleccionado.codigoPresupuesto
    }

    if (deParaState === 'D' && data.monto > preSaldoDisponibleSeleccionado.disponible) {
      setErrorMessage('Monto no puede ser Mayor que el disponible ' + preSaldoDisponibleSeleccionado.disponible)
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(2000)
      setErrorMessage('')
      setLoading(false)

      return
    }

    const responseAll = await ossmmasofApi.post<any>('/PrePucSolModificacion/Update', update)

    if (responseAll.data.isValid) {
      // dispatch(setPreAsignacionesDetalleSeleccionado(responseAll.data.data))

      const defaultValues: IPrePucSolModificacionUpdateDto = {
        codigoPucSolModificacion: 0,
        codigoSaldo: 0,
        codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
        financiadoId: 0,
        codigoIcp: 0,
        codigoPuc: 0,
        monto: 0,
        dePara: deParaState,
        codigoPresupuesto: preSolModificacionSeleccionado.codigoPresupuesto
      }

      dispatch(setPrePucSolModificacionSeleccionado(defaultValues))
      dispatch(setVerPrePucSolModificacionUpdateActive(false))
      const defaultSaldoSeleccionado: IListIcpPucConDisponible = {
        codigoSaldo: 0,
        codigoIcp: 0,
        codigoIcpConcat: '',
        denominacionIcp: '',
        codigoPuc: 0,
        codigoPucConcat: '',
        denominacionPuc: '',
        financiadoId: 0,
        denominacionFinanciado: '',
        disponible: 0,
        searchText: ''
      }
      dispatch(setPreSaldoDisponibleSeleccionado(defaultSaldoSeleccionado))
    }

    setErrorMessage(responseAll.data.message)

    //const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
    //await sleep(2000)

    setLoading(false)
    toast.success('Form Submitted')
  }

  const handlerMonto = (value: string) => {
    const valueInt = value === '' ? 0 : parseFloat(value)

    setValue('monto', valueInt)
  }
  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      setDeParaState(prePucSolModificacionSeleccionado.dePara)
      const filter = {
        codigoPresupuesto: preSolModificacionSeleccionado.codigoPresupuesto,
        codigoSaldo: prePucSolModificacionSeleccionado.codigoSaldo
      }

      const responseAll = await ossmmasofApi.post<any>('/PreVSaldos/GetListIcpPucConDisponibleByCodigoSaldo', filter)

      dispatch(setPreSaldoDisponibleSeleccionado(responseAll.data.data))

      dispatch(setVerPreSaldoDisponibleActive(false))

      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Card>
      <CardHeader title={titulo} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            {/* descripcionId */}
            <Grid item sm={2} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='codigoSolModificacion'
                  control={control}
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      label='Id'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.codigoSolModificacion)}
                      aria-describedby='validation-async-codigoAdministrativo'
                      disabled
                    />
                  )}
                />
                {errors.codigoSolModificacion && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoAsignacionDetalle'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>
            {/* statusProceso */}
            <Grid item sm={10} xs={12}>
              <FormControl fullWidth>
                <Controller
                  name='statusProceso'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || ''}
                      label='Estatus'
                      onChange={onChange}
                      placeholder='0'
                      error={Boolean(errors.statusProceso)}
                      aria-describedby='validation-async-statusProceso'
                      disabled
                    />
                  )}
                />
                {errors.statusProceso && (
                  <FormHelperText sx={{ color: 'error.main' }} id='validation-async-statusProceso'>
                    This field is required
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            {deParaState === 'P' && (
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  options={preMtrUnidadEjecutora}
                  value={icp}
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  id='autocomplete-concepto'
                  getOptionLabel={option => option.dercripcion + '-' + option.id}
                  onChange={handlerUnidadEjecutora}
                  renderInput={params => <TextField {...params} label='Icp' />}
                />
              </Grid>
            )}
            {deParaState === 'D' && preSaldoDisponibleSeleccionado && (
              <Grid item sm={4} xs={12}>
                <Typography variant='subtitle2' gutterBottom>
                  {preSaldoDisponibleSeleccionado.codigoIcpConcat} {preSaldoDisponibleSeleccionado.denominacionIcp}
                </Typography>
              </Grid>
            )}

            {deParaState === 'P' && (
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  value={puc}
                  options={preMtrDenominacionPuc}
                  id='autocomplete-preMtrDenominacionPuc'
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={option => option.dercripcion + '-' + option.id + '' + option.codigoPuc}
                  onChange={handlerDenominacionPuc}
                  renderInput={params => <TextField {...params} label='Puc' />}
                />
              </Grid>
            )}
            {deParaState === 'D' && preSaldoDisponibleSeleccionado && (
              <Grid item sm={4} xs={12}>
                <Typography variant='subtitle2' gutterBottom>
                  {preSaldoDisponibleSeleccionado.codigoPucConcat} {preSaldoDisponibleSeleccionado.denominacionPuc}
                </Typography>
              </Grid>
            )}
            {deParaState === 'P' && (
              <Grid item sm={6} xs={12}>
                <Autocomplete
                  value={financiado}
                  options={listFinanciado}
                  id='autocomplete-preFinanciado'
                  isOptionEqualToValue={(option, value) => option.id === value.id}
                  getOptionLabel={option => option.descripcion + '-' + option.id}
                  onChange={handlerFinanciado}
                  renderInput={params => <TextField {...params} label='Financiado' />}
                />
              </Grid>
            )}
            {deParaState === 'D' && preSaldoDisponibleSeleccionado && preSaldoDisponibleSeleccionado.disponible > 0 && (
              <Grid item sm={4} xs={12}>
                <Typography variant='subtitle2' gutterBottom>
                  {preSaldoDisponibleSeleccionado.denominacionFinanciado} Disponible =
                  {preSaldoDisponibleSeleccionado.disponible}
                </Typography>
              </Grid>
            )}
            {/* Presupuestado*/}
            <Grid item sm={12} xs={12}>
            <FormControl fullWidth>
                                  <Controller
                                      name='monto'
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
                                              label="Monto"
                                              onValueChange={(values: any) => {
                                                  const { value } = values
                                                  handlerMonto(value)
                                              }}
                                              placeholder='Monto'
                                              error={Boolean(errors.monto)}
                                              aria-describedby='validation-async-monto'
                                              inputProps={{
                                                  type: 'text',
                                              }}
                                          />
                                      )}
                                  />
                                  {errors.monto && (
                                      <FormHelperText sx={{ color: 'error.main' }} id='validation-async-monto'>
                                          This field is required
                                      </FormHelperText>
                                  )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button variant='outlined' size='large' onClick={handleClickOpen} sx={{ color: 'error.main', ml: 2 }}>
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
                Eliminar
              </Button>
              <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby='alert-dialog-title'
                aria-describedby='alert-dialog-description'
              >
                <DialogTitle id='alert-dialog-title'>
                  {'Esta Seguro de Eliminar esta solicitud de modificacion?'}
                </DialogTitle>
                <DialogContent>
                  <DialogContentText id='alert-dialog-description'>
                    Se eliminaran los datos de esta solicitud de modificacion solo si no existe en historico
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
            {errorMessage.length > 0 && (
              <FormHelperText sx={{ color: 'primary.main', fontSize: 10, mt: 4 }}>{errorMessage}</FormHelperText>
            )}
          </Box>
        </form>
      </CardContent>
      <DialogPreSaldoDisponibleInfo></DialogPreSaldoDisponibleInfo>
    </Card>
  )
}

export default FormPrePucSolModificacionUpdateAsync
