import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import toast from 'react-hot-toast'
import DialogConfirmation from 'src/views/components/dialogs/DialogConfirmationDynamic';
import { styled } from '@mui/material/styles'
import { NumericFormat } from 'react-number-format'
import { useForm, Controller, Path } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box} from '@mui/material'
import { setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl'
import { setConceptoSeleccionado, setFrecuenciaSeleccionada } from 'src/store/apps/rh'
import { CreateRhMovNominaCommand } from '../interfaces'

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

  const { rhPersonaMovCtrSeleccionado }                 = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const { conceptos, frecuencias, personaSeleccionado } = useSelector((state: RootState) => state.nomina)
  const { listRhTipoNomina }                             = useSelector((state: RootState) => state.rhTipoNomina)

  const  getConcepto = (id:number) => {
    const result = conceptos?.filter((elemento) => elemento.codigoConcepto == id)

    return result[0]
  }

  const getFrecuencia = (id:number) => {
    const result = frecuencias?.filter((elemento) => elemento.id == id)

    return result[0]
  }

  const getTipoMovimientoLabel = (tipo: string) => {
    const result = moventTypeOptions.filter((elemento) => elemento.value == tipo)

    return result[0]
  }

  const getTipoNomina = (id:number) => {
    const result = listRhTipoNomina?.filter((elemento) => elemento.codigoTipoNomina == id)

    return result[0]
  }

  const [dialogOpen, setDialogOpen]         = useState<boolean>(false)
  const [monto, setMonto]                   = useState<number>(0)
  const [loading, setLoading]               = useState<boolean>(false)
  const [frecuencia, setFrecuencia]         = useState<any>(getFrecuencia(rhPersonaMovCtrSeleccionado.frecuenciaId || 0))
  const [concepto, setConcepto]             = useState<any>(getConcepto(rhPersonaMovCtrSeleccionado.codigoConcepto || 0))
  const [tipoMovimiento, setTipoMovimiento] = useState<any>(getTipoMovimientoLabel(rhPersonaMovCtrSeleccionado.tipo || 'E'))
  const [tipoNomina, setTipoNomina]         = useState<any>(getTipoNomina(rhPersonaMovCtrSeleccionado.codigoTipoNomina || 0))
  const [errorMessage, setErrorMessage]     = useState<string>('')

  const defaultValues: CreateRhMovNominaCommand = {
    codigoEmpresa: 13,
    codigoTipoNomina: 0,
    codigoPersona: personaSeleccionado.codigoPersona || 0,
    codigoConcepto: 0,
    complementoConcepto: '',
    tipo: 'E',
    frecuenciaId: 0,
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
    setLoading(true)
    setValue('codigoPersona', defaultValues.codigoPersona)

    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [defaultValues.codigoPersona])

  const stateMonto = getFieldState('monto')

  const watchCodigoConcepto   = watch('codigoConcepto')
  const watchFrecuenciaId     = watch('frecuenciaId')
  const watchTipo             = watch('tipo')
  const watchCodigoTipoNomina = watch('codigoTipoNomina')

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
    reset()
    setValue('codigoConcepto', null)
    setValue('frecuenciaId', null)
    setValue('tipo', '')
    setValue('codigoTipoNomina', 0)
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

    const createMovControl: CreateRhMovNominaCommand = {
      codigoEmpresa: 13,
      codigoTipoNomina: data.codigoTipoNomina,
      codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona || 0,
      codigoConcepto: data.codigoConcepto,
      complementoConcepto: data.complementoConcepto,
      tipo: data.tipo,
      frecuenciaId: data.frecuenciaId,
      monto: data.monto,
      status: data.status,
      usuarioIns: 1
    }

    try {
      const responseAll= await ossmmasofApi.post<any>('/RhMovNomina/create', createMovControl)

      if (responseAll.data.isValid) {
        dispatch(setRhPersonaMovCtrSeleccionado(responseAll.data.data))
        dispatch(setVerRhPersonaMovCtrActive(false))
        clearForm()
        toast.success('Variacion creada correctamente')
      } else {
        toast.error(responseAll.data.message || 'Error al crear variacion')
      }

      setErrorMessage(responseAll.data.message)
    } catch {
      toast.error('Error al conectar con el servidor')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      setLoading(false);
    };

    getData();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            size="small"
                            value={value || 0}
                            label='Id'
                            onChange={onChange}
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

                  {/* Selección de Concepto */}
                  <Grid item sm={5} xs={12}>
                    <Autocomplete
                      size="small"
                      options={conceptos}
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

                  {/* Selección de frecuencia */}
                  <Grid item sm={5} xs={12}>
                    <Autocomplete
                      size="small"
                      options={frecuencias}
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

                  {/* Selección tipo codigo nomina */}
                  <Grid item sm={4} xs={12}>
                    <Autocomplete
                      size="small"
                      options={listRhTipoNomina || null}
                      id='autocomplete-codigo-tipo-nomina'
                      value={tipoNomina || null}
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

                  {/* Monto */}
                  <Grid item sm={5} xs={12}>
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
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          size="small"
                          label='Complemento del Concepto'
                          placeholder='Información adicional...'
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

                  <Grid item xs={12}>
                    <Button
                      size='small'
                      variant='contained'
                      sx={{ pb: 0 }}
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
