import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic'
import { CleaningServices } from '@mui/icons-material'
import { styled } from '@mui/material/styles'
import { NumericFormat } from 'react-number-format'
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { useEffect, useState } from 'react'
import { Autocomplete, Box} from '@mui/material'
import { setVerRhPersonaMovCtrActive, setIsExpandedAccordion } from 'src/store/apps/rh-persona-mov-ctrl'
import { setConceptoSeleccionado, setFrecuenciaSeleccionada } from 'src/store/apps/rh'
import { CreateRhMovNominaCommand } from '../interfaces'
import { validateFields } from 'src/utilities/forms/formUtils'

type FormInputs = CreateRhMovNominaCommand

const StyledCustomInput = styled(TextField)(() => ({
  width: '100%'
}))

const FormRhVariacionCreateAsync = () => {
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

  const watchCodigoConcepto   = watch('codigoConcepto')
  const watchFrecuenciaId     = watch('frecuenciaId')
  const watchTipo             = watch('tipo')
  const watchCodigoTipoNomina = watch('codigoTipoNomina')
  const complementoValue      = watch('complementoConcepto', '') || ''
  const watchMonto            = watch('monto')

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

    setValue('codigoPersona', personaSeleccionado.codigoPersona)
    setValue('codigoTipoNomina', personaSeleccionado.codigoTipoNomina)
    setValue('codigoConcepto', null)
    setValue('frecuenciaId', null)
    setValue('tipo', '')

    setErrorMessage('')
    reset(defaultValues)
  }

  const checkFormIsValid = () => {
    const fields: { name: keyof CreateRhMovNominaCommand; value: any; message?: string; isMonto?: boolean }[] = [
      { name: 'codigoTipoNomina', value: watchCodigoTipoNomina || personaSeleccionado.codigoTipoNomina },
      { name: 'codigoConcepto', value: watchCodigoConcepto },
      { name: 'tipo', value: watchTipo },
      { name: 'frecuenciaId', value: watchFrecuenciaId },
      {
        name: 'monto',
        value: watchMonto,
        isMonto: true,
        message: 'Monto es requerido, acepta números negativos, pero no se permite 0'
      }
    ]

    return validateFields(fields, setError)
  }

  const handleOpenDialog = () => {
    const formIsValid = checkFormIsValid()

    if (formIsValid) {
      setDialogOpen(true)
      clearErrors()
      setErrorMessage('')
    } else {
      trigger()
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const onSubmitCreate = async (data: FormInputs) => {
    setLoading(true)
    handleCloseDialog()

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
      { loading
        ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )
        : (
            <Box sx={{ my: 4 }}>
              <form>
                <Grid container spacing={2}>

                  {/* CodigoPersona (Solo lectura o Hidden) */}
                  <Grid item sm={2} xs={12}>
                    <FormControl fullWidth size="small">
                      <Controller
                        name='codigoPersona'
                        control={control}
                        rules={{ required: true }}
                        render={({ field: { value } }) => (
                          <TextField
                            size="small"
                            value={value || 0}
                            label='Id'
                            placeholder='0'
                            error={Boolean(errors.codigoPersona)}
                            aria-describedby='validation-async-codigoPersona'
                            disabled
                          />
                        )}
                      />
                      {errors.codigoPersona && (
                        <FormHelperText sx={{ color: 'error.main' }} id='validation-async-codigoPersona'>
                          This field is required
                        </FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  {/* Selección tipo codigo nomina */}
                  <Grid item sm={10} xs={12}>
                    <Autocomplete
                      size="small"
                      options={listRhTipoNomina || null}
                      id='autocomplete-codigo-tipo-nomina'
                      value={tipoNomina || null}
                      getOptionDisabled={(option) => checkNominaDeshabilitada(option)}
                      getOptionLabel={(option) => option.siglasTipoNomina + ' - ' + option.descripcion + ' - ' + option.frecuenciaPago || ""}
                      isOptionEqualToValue={(option, value) => option.codigoTipoNomina === value.codigoTipoNomina}
                      onChange={(_, newValue) => {
                        handlerTipoNomina(_, newValue)

                        if (newValue) {
                          clearErrors('codigoTipoNomina')
                        }
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          label='Tipos de nomina'
                          required
                          error={Boolean(errors.codigoTipoNomina)}
                          helperText={errors.codigoTipoNomina && "Tipo de nomina requerido"}
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
                      onChange={(_, newValue) => {
                        handlerConceptos(_, newValue)

                        if (newValue) {
                          clearErrors('codigoConcepto')
                        }
                      }}
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
                      onChange={(_, newValue) => {
                        handlerTipoMovimiento(_, newValue)

                        if (newValue) {
                          clearErrors('tipo')
                        }
                      }}
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
                      onChange={(_, newValue) => {
                        handlerFrecuencias(_, newValue)

                        if (newValue) {
                          clearErrors('frecuenciaId')
                        }
                      }}
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

                        if (value) {
                          clearErrors('monto')
                        }
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

                  <Grid item xs={12} sx={{ m: 1 }}>
                    <Button
                      size='small'
                      variant='contained'
                      disabled={!isValid}
                      onClick={async () => {
                        const isValid = await trigger()

                        if (isValid) {
                          handleOpenDialog()
                        }
                      }}
                    >
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
                    <Button
                      color='primary'
                      size='small'
                      onClick={clearForm}
                      disabled={loading}
                    >
                      <CleaningServices /> Limpiar
                    </Button>
                  </Grid>
                </Grid>

                <Box>
                  { errorMessage.length> 0 &&
                    <FormHelperText
                      sx={{ color: 'error.main' ,fontSize: 20,mt:4 }}
                    >
                      {errorMessage}
                    </FormHelperText>
                  }
                </Box>
              </form>
            </Box>
          )
      }
    </>
  )
}

export default FormRhVariacionCreateAsync
