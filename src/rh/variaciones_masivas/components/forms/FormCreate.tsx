import { useState, useEffect } from 'react';

/* import { useQueryClient, QueryClient } from '@tanstack/react-query'; */

import { Controller, useForm, Path } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format'
import {
    Box,
    Grid,
    TextField,
    Autocomplete,
    Button,
    styled
} from '@mui/material';

import AlertMessage from 'src/views/components/alerts/AlertMessage';
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import getRules from './rules';
import { useServices } from '../../services';
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import toast from 'react-hot-toast'
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { CreateRhMovNominaCommand } from '../../interfaces'
import { setVerRhPersonaMovCtrActive, setIsExpandedAccordion } from 'src/store/apps/rh-persona-mov-ctrl'
import { setConceptoSeleccionado, setFrecuenciaSeleccionada } from 'src/store/apps/rh'

type FormInputs = CreateRhMovNominaCommand

const StyledCustomInput = styled(TextField)(() => ({
  width: '100%'
}))


const FormCreate = () => {
    const [isFormEnabled, setIsFormEnabled] = useState<boolean>(true)

    /* const qc: QueryClient   = useQueryClient() */
    const rules             = getRules()

    console.log('🚀 ~ file: FormCreate.tsx:28 ~ FormCreate ~ rules:', rules)

      const handleClearPagoLote = () => {

          reset(defaultValues)
      }

    const {
        message,
    } = useServices()

const dispatch = useDispatch()

  const moventTypeOptions = [
    { value: 'E', label: 'Especial' },
    { value: 'F', label: 'Fijo' },
    { value: 'V', label: 'Variable' }
  ]

  const { rhPersonaMovCtrSeleccionado, verRhPersonaMovCtrActive, listRhPersonaMovCtr }  = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const { conceptos, frecuencias, personaSeleccionado }                                 = useSelector((state: RootState) => state.nomina)
  const { listRhTipoNomina }                                                            = useSelector((state: RootState) => state.rhTipoNomina)

  const  getConcepto = (id:number | null) => {
    const result = conceptos?.filter((elemento) => elemento.codigoConcepto == id)

    return result[0]
  }

  const getFrecuencia = (id:number | null) => {
    const result = frecuencias?.filter((elemento) => elemento.id == id)

    return result[0]
  }

  const getTipoMovimientoLabel = (tipo: string) => {
    const result = moventTypeOptions.filter((elemento) => elemento.value == tipo)

    return result[0]
  }

  const getTipoNomina = (id:number | null) => {
    const result = listRhTipoNomina?.filter((elemento) => elemento.codigoTipoNomina == id)

    return result[0]
  }

  const isConceptUse = (codigoConcepto: number) : boolean => {
    if (!listRhPersonaMovCtr) {
      return false
    }

    if (listRhPersonaMovCtr.length === 0) {
      return false
    }

    const existCodigoConcepto = listRhPersonaMovCtr.some((element) => element.codigoConcepto == codigoConcepto)

    return existCodigoConcepto
  }

  const getConceptosOptions = () => {
    const conceptosOptions = conceptos?.filter((concepto) => {
      const conceptInUse = isConceptUse(concepto.codigoConcepto)

      return (concepto.automatico == false && !conceptInUse)
    })

    setConceptosOptions(conceptosOptions || [])
  }

  const checkNominaDeshabilitada = (option: any) => {
    return (option.codigoTipoNomina !== personaSeleccionado.codigoTipoNomina)
  }

  const [dialogOpen, setDialogOpen]             = useState<boolean>(false)
  const [monto, setMonto]                       = useState<number>(0)
  const [loading, setLoading]                   = useState<boolean>(false)
  const [frecuencia, setFrecuencia]             = useState<any | null>(getFrecuencia(rhPersonaMovCtrSeleccionado.frecuenciaId || null))
  const [concepto, setConcepto]                 = useState<any | null>(getConcepto(rhPersonaMovCtrSeleccionado.codigoConcepto || null))
  const [tipoNomina, setTipoNomina]             = useState<any | null>(getTipoNomina(rhPersonaMovCtrSeleccionado.codigoTipoNomina || null))
  const [tipoMovimiento, setTipoMovimiento]     = useState<any | null>(getTipoMovimientoLabel(rhPersonaMovCtrSeleccionado.tipo || ''))
  const [conceptosOptions, setConceptosOptions] = useState<any | null>([])
  const [errorMessage, setErrorMessage]         = useState<string>('')

  const defaultValues: CreateRhMovNominaCommand = {
    codigoEmpresa: 13,
    codigoTipoNomina: personaSeleccionado.codigoTipoNomina,
    codigoPersona: personaSeleccionado.codigoPersona,
    codigoConcepto: null,
    complementoConcepto: '',
    tipo: '',
    frecuenciaId: null,
    monto: 0,
    status: 'A',
    usuarioIns: 1
  }

  const {
    control,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    trigger,
    reset,
    getFieldState,
    watch,
    formState: { errors, isValid }
  } = useForm<FormInputs>({
    defaultValues,
    mode: 'onChange'
  })

  useEffect(() => {
    const nominaActiva = listRhTipoNomina.find(
      (option: any) => option.codigoTipoNomina === personaSeleccionado.codigoTipoNomina
    )

    if (nominaActiva) {
      setTipoNomina(nominaActiva)
    }
  }, [personaSeleccionado.codigoTipoNomina, listRhTipoNomina])

  useEffect(() => {
    setLoading(true)
    clearForm()

    setValue('codigoPersona', defaultValues.codigoPersona)
    setValue('codigoTipoNomina', defaultValues.codigoTipoNomina)

    setTipoNomina(getTipoNomina(defaultValues.codigoTipoNomina || null))

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [defaultValues.codigoPersona])

  const stateMonto = getFieldState('monto')

  const watchCodigoConcepto   = watch('codigoConcepto')
  const watchFrecuenciaId     = watch('frecuenciaId')
  const watchTipo             = watch('tipo')
  const watchCodigoTipoNomina = watch('codigoTipoNomina')
  const complementoValue      = watch('complementoConcepto', '') || '';

  const setErrorDynamic = (field: Path<FormInputs>) => {
    setError(field, {
      type: 'manual',
      message: `El ${field} es requerido, ingrese un monto válido.`
    }, { shouldFocus: true })
  }

  useEffect(() => {
    if (!monto) {
      setErrorDynamic('monto')
    } else {
      clearErrors('monto')
      trigger('monto')
    }
  }, [monto, setError, clearErrors, trigger])

  const handleOnChangeAmount = (amount: string) => {
    const amountToPay = parseFloat(amount) || 0
    setMonto(amountToPay)
    setValue('monto', amountToPay)
  }

  const handlerConceptos = (e: any, value:any) => {
    if (value) {
      dispatch(setConceptoSeleccionado(value))
      setConcepto(value)
      setValue('codigoConcepto', value.codigoConcepto)
    }
  }

  const handlerFrecuencias = (e: any, value:any) => {
    if (value) {
      dispatch(setFrecuenciaSeleccionada(value))
      setFrecuencia(value)
      setValue('frecuenciaId', value.id)
    }
  }

  const handlerTipoMovimiento = (e: any, option:any) => {
    if (option) {
      setTipoMovimiento(option)
      setValue('tipo', option.value)
    }
  }

  const handlerTipoNomina = (e: any, option:any) => {
    if (option) {
      setTipoNomina(option)
      setValue('codigoTipoNomina', option.codigoTipoNomina)
    }
  }

  const clearForm = () => {
    setFrecuencia(null)
    setConcepto(null)
    setTipoMovimiento(null)
    setMonto(0)
    reset(defaultValues)
    setValue('codigoPersona', personaSeleccionado.codigoPersona)
    setValue('codigoConcepto', null)
    setValue('frecuenciaId', null)
    setValue('tipo', '')
    setValue('codigoTipoNomina', personaSeleccionado.codigoTipoNomina)
    setErrorMessage('')
  }

  const handleOpenDialog = () => {
    if (stateMonto.invalid) {
      setErrorDynamic('monto')
    } else if (!watchCodigoConcepto) {
      setErrorDynamic('codigoConcepto')
    } else if (!watchFrecuenciaId) {
      setErrorDynamic('frecuenciaId')
    } else if (!watchTipo) {
      setErrorDynamic('tipo')
    } else if (!watchCodigoTipoNomina) {
      setErrorDynamic('codigoTipoNomina')
    } else {
      clearErrors()
      setDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const onSubmitCreate = async (data: FormInputs) => {
    setLoading(true)
    handleCloseDialog()
    setIsFormEnabled(true)
    console.log(errorMessage)

    const createMovControl: CreateRhMovNominaCommand = {
      codigoEmpresa: 13,
      codigoTipoNomina: personaSeleccionado.codigoTipoNomina,
      codigoPersona: personaSeleccionado.codigoPersona,
      codigoConcepto: data.codigoConcepto,
      complementoConcepto: data.complementoConcepto,
      tipo: data.tipo,
      frecuenciaId: data.frecuenciaId,
      monto: data.monto,
      status: data.status,
      usuarioIns: 1
    }

    try {
      const responseAll= await ossmmasofApiVertical.post<any>('/RhMovNomina/create', createMovControl)

      if (responseAll.data.isValid) {
        const flag = !verRhPersonaMovCtrActive
        dispatch(setVerRhPersonaMovCtrActive(flag))
        dispatch(setIsExpandedAccordion(false))
        clearForm()
        toast.success('Variación creada correctamente')
      } else {
        toast.error(responseAll.data.message || 'Error al crear variación')
        setErrorMessage(responseAll.data.message)
      }
    } catch (error: any) {
      toast.error('Error al conectar con el servidor')
      setErrorMessage('Error al conectar con el servidor')
      console.error('Error en la solicitud:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true)
      setLoading(false)
    }

    getData()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    getConceptosOptions()
  }, [conceptos])


  return (
    <>
      <Grid container spacing={5} paddingTop={1}>
        <Grid
          item
          sm={12}
          xs={12}
          sx={{
            overflow: 'auto',
            padding: '0 1rem',
          }}
        >
          <Box>
            {!!isFormEnabled ?
              <form>
<Grid container spacing={2}>


                  {/* Selección tipo codigo nomina */}
                  <Grid item sm={12} xs={12}>
                    <Autocomplete
                      size="small"
                      options={listRhTipoNomina || null}
                      id='autocomplete-codigo-tipo-nomina'
                      value={tipoNomina || null}
                      getOptionDisabled={(option) => checkNominaDeshabilitada(option)}
                      getOptionLabel={(option) => option.siglasTipoNomina + ' - ' + option.descripcion + ' - ' + option.frecuenciaPago || ""}
                      isOptionEqualToValue={(option, value) => option.codigoTipoNomina === value.codigoTipoNomina}
                      onChange={handlerTipoNomina}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Tipos de nomina'
                          required
                          error={Boolean(errors.tipo)}
                          helperText={errors.tipo && "Tipo de nomina requerido"}
                        />
                      )}
                    />
                  </Grid>

                  {/* Selección de Concepto */}
                  <Grid item sm={12} xs={12}>
                    <Autocomplete
                      size="small"
                      options={conceptosOptions || null}
                      id='autocomplete-concepto'
                      value={concepto || null}
                      isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo + value.codigoTipoNomina}
                      getOptionLabel={option => option.codigo + '-' + option.codigoTipoNomina + '-' + option.denominacion}
                      onChange={handlerConceptos}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Conceptos'
                          required
                          error={Boolean(errors.codigoConcepto)}
                          helperText={errors.codigoConcepto && "Concepto requerido"}
                        />
                      )}
                    />
                  </Grid>

                  {/* Selección tipo */}
                  <Grid item sm={3} xs={12}>
                    <Autocomplete
                      size="small"
                      options={moventTypeOptions || null}
                      id='autocomplete-tipo-movimiento'
                      value={tipoMovimiento || null}
                      getOptionLabel={(option) => option.label || ""}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      onChange={handlerTipoMovimiento}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Tipos de Movimiento'
                          required
                          error={Boolean(errors.tipo)}
                          helperText={errors.tipo && "Tipo de movimiento requerido"}
                        />
                      )}
                    />
                  </Grid>

                  {/* Selección de frecuencia */}
                  <Grid item sm={6} xs={12}>
                    <Autocomplete
                      size="small"
                      options={frecuencias || null}
                      id='autocomplete-frecuencia'
                      value={frecuencia || null}
                      getOptionLabel={option => option.id + '-' + option.descripcion || ""}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      onChange={handlerFrecuencias}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Frecuencias'
                          required
                          error={Boolean(errors.frecuenciaId)}
                          helperText={errors.frecuenciaId && "Frecuencia requerida"}
                        />
                      )}
                    />
                  </Grid>

                  {/* Monto */}
                  <Grid item sm={3} xs={12}>
                    <NumericFormat
                      size='small'
                      value={monto}
                      customInput={StyledCustomInput}
                      thousandSeparator="."
                      decimalSeparator=","
                      allowNegative={true}
                      decimalScale={2}
                      fixedDecimalScale={true}
                      label="Monto"
                      required
                      onFocus={(event) => {
                        event.target.select()
                      }}
                      onValueChange={(values: any) => {
                        const { value } = values
                        handleOnChangeAmount(value)
                      }}
                      placeholder='Monto'
                      inputProps={{
                        type: 'text'
                      }}
                      error={!!errors.monto}
                      helperText={errors.monto?.message}
                    />
                  </Grid>

                  {/* Complemento / Descripción adicional */}
                  <Grid item sm={12} xs={12}>
                    <Controller
                      name='complementoConcepto'
                      control={control}
                      rules={{
                        required: false,
                        maxLength: {
                          value: 100,
                          message: 'Máximo 100 caracter'
                        }
                      }}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          label='Complemento del Concepto'
                          placeholder='Información adicional...'
                          multiline
                          rows={3}
                          helperText={
                            <Box component="span" sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>{errors.complementoConcepto?.message || 'Información adicional'}</span>
                              <span>{`${complementoValue.length}/100`}</span>
                            </Box>
                          }
                          error={!!errors.complementoConcepto}
                        />
                      )}
                    />
                  </Grid>

                  <DialogConfirmation
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    onConfirm={handleSubmit(onSubmitCreate)}
                    loading={loading}
                    title="Crear nuevo registro"
                    content="¿Desea continuar con la creación del registro?"
                  />
                </Grid>

                <DialogConfirmation
                  open={dialogOpen}
                  onClose={handleCloseDialog}
                  onConfirm={handleSubmit(onSubmitCreate)}
                  loading={loading}
                  title="Crear nuevo registro"
                  content="¿Desea continuar con la creación del registro?"
                />

                <Box sx={{ paddingTop: 6 }}>
                  <Button
                    variant='contained'
                    color='primary'
                    size='small'
                    onClick={handleOpenDialog}
                    disabled={!isValid}
                  >
                    { 'Crear' }
                  </Button>
                  <Button
                    color='primary'
                    size='small'
                    onClick={handleClearPagoLote}
                  >
                    <CleaningServices /> Limpiar
                  </Button>
                </Box>
              </form>
              : null
            }
          </Box>
        </Grid>
      </Grid>
      <AlertMessage
        message={message?.text ?? ''}
        severity={message?.isValid ? 'success' : 'error'}
        duration={8000}
        show={message?.text ? true : false}
      />
    </>
  )
}

export default FormCreate