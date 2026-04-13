import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, QueryClient, useQuery } from '@tanstack/react-query';
import { Controller, useForm, Path } from 'react-hook-form';
import { CleaningServices } from '@mui/icons-material';
import { NumericFormat } from 'react-number-format';
import Spinner from 'src/@core/components/spinner';
import toast from 'react-hot-toast';
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
import { RootState } from 'src/store';
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical';
import { MOVEMENT_TYPE_OPTIONS } from '../../constants/options';
import { selectEmployeeListIsEmpty } from 'src/store/apps/rh-variaciones_masivas';
import { setIsExpandedAccordion } from 'src/store/apps/rh-variaciones_masivas';
import { usePayrollMetadata } from '../../hooks/usePayrollSelections';
import {
  VariationMovementForm,
  TypePayroll,
  Concept,
  Frequency,
  AutocompleteOption
} from '../../interfaces';

const StyledCustomInput = styled(TextField)(() => ({
  width: '100%'
}))

const FormCreate = () => {
  const dispatch = useDispatch()

  const { listEmployeeCodes, selectedPayrollTypeCode } = useSelector((state: RootState) => state.rhVariacionesMasivas)

  const queryClient: QueryClient  = useQueryClient()
  const { store, message }        = useServices()

  const disableForm   = useSelector(selectEmployeeListIsEmpty)
  const rules         = getRules('formCreateVariacion')

  const {
    frecuencias: frecuenciasOptions,
    tiposNomina: tiposNominaOptions,
    isLoading: selectorLoading
  } = usePayrollMetadata()

  const { conceptos: conceptosOptions } = usePayrollMetadata({
    codigoTipoNomina: selectedPayrollTypeCode,
    automatico: false
  })

  const [dialogOpen, setDialogOpen]             = useState<boolean>(false)
  const [loading, setLoading]                   = useState<boolean>(false)
  const [errorMessage, setErrorMessage]         = useState<string>('')
  const [monto, setMonto]                       = useState<number>(0)
  const [tipoNomina, setTipoNomina]             = useState<TypePayroll | null>()
  const [concepto, setConcepto]                 = useState<Concept | null>()
  const [frecuencia, setFrecuencia]             = useState<Frequency | null>()
  const [tipoMovimiento, setTipoMovimiento]      = useState<AutocompleteOption | null>()

  const defaultValues: VariationMovementForm = {
    codigoEmpresa: 13,
    codigoTipoNomina: selectedPayrollTypeCode,
    listCodigoPersona: listEmployeeCodes,
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
  } = useForm<VariationMovementForm>({
    defaultValues,
    mode: 'onChange'
  })

  const stateMonto = getFieldState('monto')

  const watchCodigoConcepto   = watch('codigoConcepto')
  const watchFrecuenciaId     = watch('frecuenciaId')
  const watchTipo             = watch('tipo')
  const watchCodigoTipoNomina = watch('codigoTipoNomina')
  const complementoValue      = watch('complementoConcepto', '') || '';

  const setErrorDynamic = (field: Path<VariationMovementForm>) => {
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

  const handlerTipoNomina = (e: any, option:any) => {
    if (option) {
      setTipoNomina(option)
      setValue('codigoTipoNomina', option.codigoTipoNomina)
    }
  }

  const handlerConceptos = (e: any, option:any) => {
    if (option) {
      setConcepto(option)
      setValue('codigoConcepto', option.codigoConcepto)
    }
  }

  const handlerFrecuencias = (e: any, option:any) => {
    if (option) {
      setFrecuencia(option)
      setValue('frecuenciaId', option.id)
    }
  }

  const handlerTipoMovimiento = (e: any, option:any) => {
    if (option) {
      setTipoMovimiento(option)
      setValue('tipo', option.value)
    }
  }

  const clearForm = () => {
    setTipoNomina(null)
    setConcepto(null)
    setFrecuencia(null)
    setTipoMovimiento(null)
    setMonto(0)
    reset(defaultValues)
    setValue('listCodigoPersona', null)
    setValue('codigoConcepto', null)
    setValue('frecuenciaId', null)
    setValue('tipo', '')
    setValue('codigoTipoNomina', null)
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

  const disabledPayrollType = (option: any) => {
    return (option.codigoTipoNomina != selectedPayrollTypeCode)
  }

  const onSubmitCreate = async (data: VariationMovementForm) => {
    setLoading(true)
    handleCloseDialog()
    console.log(errorMessage)

    const createMovControl: VariationMovementForm = {
      codigoEmpresa: 13,
      codigoTipoNomina: selectedPayrollTypeCode,
      listCodigoPersona: listEmployeeCodes,
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
    const selectedPayroll = tiposNominaOptions.find(
      (option: any) => Number(option.id) === Number(selectedPayrollTypeCode)
    )

    if (selectedPayroll) {
      setTipoNomina(selectedPayroll.value as unknown as TypePayroll)
    } else {
      setTipoNomina(null)
    }
  }, [selectedPayrollTypeCode, tiposNominaOptions])

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
            { (selectorLoading || loading)
              ?
                (<Spinner sx={{ height: '100%' }} />)
              : (
                <form>
                  <Grid container spacing={2}>
                    {/* Selección tipo codigo nomina */}
                    <Grid item sm={12} xs={12}>
                      <Autocomplete
                        size="small"
                        options={tiposNominaOptions || null}
                        id='autocomplete-codigo-tipo-nomina'
                        value={tiposNominaOptions.find(option => option.id === tipoNomina?.codigoTipoNomina) || null}
                        getOptionDisabled={(option) => disabledPayrollType(option.value)}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(_, newValue) => {
                          handlerTipoNomina(_, newValue ? newValue.value : null)
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Tipos de nomina'
                            required
                            error={Boolean(errors.tipo)}
                            helperText={errors.tipo && "Tipo de nomina requerido"}
                            disabled={disableForm}
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
                        value={conceptosOptions.find(option => option.id === `${concepto?.codigo}${concepto?.codigoTipoNomina}`) || null}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        getOptionLabel={(option) => option.label || ''}
                        onChange={(_, newValue) => {
                          handlerConceptos(_, newValue ? newValue.value : null)
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Conceptos'
                            required
                            error={Boolean(errors.codigoConcepto)}
                            helperText={errors.codigoConcepto && "Concepto requerido"}
                            disabled={disableForm}
                          />
                        )}
                      />
                    </Grid>

                    {/* Selección tipo */}
                    <Grid item sm={3} xs={12}>
                      <Autocomplete
                        size="small"
                        options={MOVEMENT_TYPE_OPTIONS || null}
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
                            disabled={disableForm}
                          />
                        )}
                      />
                    </Grid>

                    {/* Selección de frecuencia */}
                    <Grid item sm={6} xs={12}>
                      <Autocomplete
                        size="small"
                        options={frecuenciasOptions || null}
                        id='autocomplete-frecuencia'
                        value={frecuenciasOptions.find(option => option.id === frecuencia?.id) || null}
                        getOptionLabel={(option) => option.label || ""}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        onChange={(_, newValue) => {
                          handlerFrecuencias(_, newValue ? newValue.value : null)
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Frecuencias'
                            required
                            error={Boolean(errors.frecuenciaId)}
                            helperText={errors.frecuenciaId && "Frecuencia requerida"}
                            disabled={disableForm}
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
                        disabled={disableForm}
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
                            disabled={disableForm}
                          />
                        )}
                      />
                    </Grid>
                  </Grid>

                  <DialogConfirmation
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    onConfirm={handleSubmit(onSubmitCreate)}
                    loading={loading}
                    title="Procesar Variaciones Masivas"
                    content="¿Desea continuar con el procesamiento de variaciones?"
                  />

                  <Box sx={{ paddingTop: 6 }}>
                    <Button
                      variant='contained'
                      color='primary'
                      size='small'
                      onClick={handleOpenDialog}
                      disabled={!isValid || loading || disableForm}
                    >
                      { 'Procesar' }
                    </Button>
                    <Button
                      color='primary'
                      size='small'
                      onClick={clearForm}
                      disabled={loading || disableForm}
                    >
                      <CleaningServices /> Limpiar
                    </Button>
                  </Box>
                </form>
              )
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