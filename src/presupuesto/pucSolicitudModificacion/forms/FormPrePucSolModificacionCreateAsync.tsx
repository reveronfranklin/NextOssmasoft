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
import { Autocomplete, Box, Typography } from '@mui/material'

// ** Third Party Imports

// ** Custom Component Imports

import { IListPreMtrUnidadEjecutora } from 'src/interfaces/Presupuesto/i-pre-mtr-unidad-ejecutora'
import { setPreMtrDenominacionPucSeleccionado, setPreMtrUnidadEjecutoraSeleccionado } from 'src/store/apps/presupuesto'
import { setPrePucSolModificacionSeleccionado } from 'src/store/apps/pre-puc-sol-modificacion'
import { IListPreMtrDenominacionPuc } from 'src/interfaces/Presupuesto/i-pre-mtr-denominacion-puc'
import { IPrePucSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionUpdateDto'
import { ISelectListDescriptiva } from 'src/interfaces/rh/SelectListDescriptiva'
import DialogPreSaldoDisponibleInfo from 'src/presupuesto/preSaldoPendiente/views/DialogPreSaldoDisponibleInfo'
import { setPreSaldoDisponibleSeleccionado, setVerPreSaldoDisponibleActive } from 'src/store/apps/pre-saldo-disponible'
import PreSolModificacionTableServerSide from '../components/PreSolModificacionTableServerSide'
import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'

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

const FormPrePucSolModificacionCreateAsync = ({ dePara }: Props) => {
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

  const { totalDescontar, totalAportar } = useSelector((state: RootState) => state.prePucSolModificacion)
  const { preSolModificacionSeleccionado } = useSelector((state: RootState) => state.preSolModificacion)
  const { preSaldoDisponibleSeleccionado } = useSelector((state: RootState) => state.preSaldoDisponible)
  const [titulo, setTitulo] = useState<string>(
    'Pre - Agregar PUC-ICP Solicitud de Modificación' + (dePara == 'D' ? '(DESCONTAR)' : '(APORTAR)')
  )
  const [deParaState, setDeParaState] = useState<string>(dePara)
  const { prePucSolModificacionSeleccionado, listFinanciado } = useSelector(
    (state: RootState) => state.prePucSolModificacion
  )
  const { preMtrUnidadEjecutora, preMtrDenominacionPuc } = useSelector((state: RootState) => state.presupuesto)
  const [icp, setIcp] = useState<IListPreMtrUnidadEjecutora>(getIcp(prePucSolModificacionSeleccionado.codigoIcp))
  const [puc, setPuc] = useState<IListPreMtrDenominacionPuc>(getPuc(+prePucSolModificacionSeleccionado.codigoPuc))
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
    dePara: deParaState
  }

  // ** Hook
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormInputs>({ defaultValues })

  const viewPreSaldoPendiente = () => {
    dispatch(setVerPreSaldoDisponibleActive(true))
  }

  const handleChangeDePara = () => {
    if (deParaState === 'P') {
      setDeParaState('D')
      setTitulo('Pre - Agregar PUC-ICP Solicitud de Modificación' + '(DESCONTAR)')
    }
    if (deParaState === 'D') {
      setDeParaState('P')
      setTitulo('Pre - Agregar PUC-ICP Solicitud de Modificación' + '(APORTAR)')
    }
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
    const totalAportarDef = totalAportar + +data.monto

    if (
      deParaState === 'P' &&
      preSolModificacionSeleccionado.descontar == true &&
      preSolModificacionSeleccionado.aportar == true
    ) {
      if (totalAportarDef > totalDescontar) {
        setErrorMessage('Total Aportar no puede superar a el Total Descontar')
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(2000)
        setErrorMessage('')
        setLoading(false)

        return
      }

      if (data.financiadoId <= 0) {
        setErrorMessage('Financiado Invalido')
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(2000)
        setErrorMessage('')
        setLoading(false)

        return
      }
      if (data.codigoIcp <= 0) {
        setErrorMessage('ICP Invalido')
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(2000)
        setErrorMessage('')
        setLoading(false)

        return
      }
      if (data.codigoPuc <= 0) {
        setErrorMessage('PUC Invalido')
        const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
        await sleep(2000)
        setErrorMessage('')
        setLoading(false)

        return
      }
    }

    setLoading(true)
    const update: IPrePucSolModificacionUpdateDto = {
      codigoPucSolModificacion: 0,
      codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
      codigoSaldo: preSaldoDisponibleSeleccionado.codigoSaldo,
      codigoPresupuesto: preSolModificacionSeleccionado.codigoPresupuesto,
      financiadoId: data.financiadoId,
      codigoIcp: data.codigoIcp,
      codigoPuc: data.codigoPuc,
      monto: data.monto,
      dePara: deParaState
    }

    if (deParaState === 'D' && data.monto > preSaldoDisponibleSeleccionado.disponible) {
      setErrorMessage('Monto no puede ser Mayor que el disponible ' + preSaldoDisponibleSeleccionado.disponible)
      const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
      await sleep(2000)
      setErrorMessage('')
      setLoading(false)

      return
    }

    const responseAll = await ossmmasofApi.post<any>('/PrePucSolModificacion/Create', update)

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
  useEffect(() => {
    const getData = async () => {
      setLoading(true)

      /*setTitulo('Pre - Agregar PUC-ICP Solicitud de Modificación')
      setDeParaState(dePara)
      if (deParaState === 'D') {
        setTitulo('Pre - Agregar PUC-ICP Solicitud de Modificación (DESCONTAR)' + deParaState)
      }
      if (deParaState === 'P') {
        setTitulo('Pre - Agregar PUC-ICP Solicitud de Modificación (APORTAR)' + deParaState)
      }*/
      setLoading(false)
    }

    getData()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [preSaldoDisponibleSeleccionado])

  return (
    <Card>
      <CardHeader title={titulo} />
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={5}>
            <Grid item sm={12} xs={12}></Grid>

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
                  rules={{ min: 0.001 }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      value={value || 0}
                      type='decimal'
                      label='Monto'
                      onChange={onChange}
                      placeholder='Monto'
                      error={Boolean(errors.monto)}
                      aria-describedby='validation-async-sueldo'
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

              <Button variant='outlined' size='large' onClick={handleChangeDePara} sx={{ ml: 2 }}>
                Cambiar De(Descontar)-Para(Aportar)
              </Button>
              {deParaState === 'D' && (
                <Button variant='contained' color='success' size='large' onClick={viewPreSaldoPendiente} sx={{ ml: 2 }}>
                  VER SALDOS
                </Button>
              )}
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
      <PreSolModificacionTableServerSide dePara='D'></PreSolModificacionTableServerSide>
    </Card>
  )
}

export default FormPrePucSolModificacionCreateAsync
