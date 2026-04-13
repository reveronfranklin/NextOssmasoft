import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { Controller, useForm } from 'react-hook-form';
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
import { RootState } from 'src/store';
import { setErrorDynamic } from 'src/utilities/forms/formUtils';
import { useServices } from '../../services';
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
  const dispatch                  = useDispatch()
  const queryClient: QueryClient  = useQueryClient()

  const { listEmployeeCodes, selectedPayrollTypeCode } = useSelector((state: RootState) => state.rhVariacionesMasivas)

  const {
    store,
    message,
    loading: loadingStore
  } = useServices()

  const disableForm   = useSelector(selectEmployeeListIsEmpty)
  const rules         = getRules('formCreateVariacion')

  const {
    frecuencias: frecuenciasOptions,
    tiposNomina: tiposNominaOptions,
    isLoading: selectorLoading
  } = usePayrollMetadata()

  const { conceptos: conceptosOptions } = usePayrollMetadata({
    codigoTipoNomina: Number(selectedPayrollTypeCode),
    automatico: false
  })

  const [dialogOpen, setDialogOpen]             = useState<boolean>(false)
  const [loading, setLoading]                   = useState<boolean>(false)
  const [monto, setMonto]                       = useState<number>(0)
  const [tipoNomina, setTipoNomina]             = useState<TypePayroll | null>()
  const [concepto, setConcepto]                 = useState<Concept | null>()
  const [frecuencia, setFrecuencia]             = useState<Frequency | null>()
  const [tipoMovimiento, setTipoMovimiento]      = useState<AutocompleteOption | null>()

  const defaultValues: VariationMovementForm = {
    codigoMovNomina: null,
    codigoEmpresa: 13,
    codigoTipoNomina: Number(selectedPayrollTypeCode),
    codigoPersona: listEmployeeCodes,
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
    getValues,
    formState: { errors, isValid }
  } = useForm<VariationMovementForm>({
    defaultValues,
    mode: 'onChange'
  })

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
    setConcepto(null)
    setFrecuencia(null)
    setTipoMovimiento(null)
    setMonto(0)

    setValue('codigoPersona', listEmployeeCodes)
    setValue('codigoTipoNomina', Number(selectedPayrollTypeCode))
    setValue('codigoConcepto', null)
    setValue('frecuenciaId', null)
    setValue('tipo', '')

    reset(defaultValues)
  }

  const checkFormIsValid = () => {
    const fields: { name: keyof VariationMovementForm; value: any; message?: string; isMonto?: boolean }[] = [
      { name: 'codigoTipoNomina', value: watchCodigoTipoNomina || selectedPayrollTypeCode },
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

    const firstError = fields.find(field => {
      if (field.isMonto) {
        const amount = Number(field.value)

        return field.value === '' || isNaN(amount) || amount === 0
      }

      return !field.value
    })

    if (firstError) {
      setErrorDynamic(setError, firstError.name, firstError.message)

      return false
    }

    return true
  }

  const handleOpenDialog = () => {
    const formIsValid = checkFormIsValid()

    if (formIsValid) {
      setDialogOpen(true)
      clearErrors()
    } else {
      trigger()
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const disabledPayrollType = (option: any) => {
    return (option.codigoTipoNomina != selectedPayrollTypeCode)
  }

  const onSubmitCreate = async (formDataVariation: VariationMovementForm) => {
    setLoading(loadingStore)
    handleCloseDialog()

    const variationMovement: VariationMovementForm = {
      ...formDataVariation,
      codigoPersona: listEmployeeCodes
    }

    try {
      const responseAll = await store(variationMovement)

      if (responseAll.isValid) {
        dispatch(setIsExpandedAccordion(false))
        clearForm()

        await queryClient.refetchQueries({
          queryKey: ['employeesTable'],
          exact: true
        })

        toast.success('Variaciones procesadas correctamente')
      } else {
        toast.error(responseAll.data.message || 'Error al crear el lote de variaciones')
      }
    } catch (error: any) {
      toast.error('Error al conectar con el servidor')
      console.error('Error en la solicitud:', error)
    } finally {
      setLoading(loadingStore)
    }
  }

  useEffect(() => {
    const currentFormValue = getValues('codigoTipoNomina')
    const newValue = Number(selectedPayrollTypeCode)

    if (currentFormValue !== newValue) {
      setValue('codigoTipoNomina', newValue)
    }

    const selectedPayroll = tiposNominaOptions.find(
      (option: any) => Number(option.id) === Number(selectedPayrollTypeCode)
    )

    if (selectedPayroll) {
      setTipoNomina(selectedPayroll.value as unknown as TypePayroll)
    } else {
      setTipoNomina(null)
    }
  }, [selectedPayrollTypeCode, tiposNominaOptions, setValue, getValues])

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

                          if (newValue) {
                            clearErrors('codigoTipoNomina')
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Tipos de nomina'
                            required={ rules.tipoNomina.required }
                            error={Boolean(errors.codigoTipoNomina)}
                            helperText={errors.codigoTipoNomina && "Tipo de nomina requerido"}
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

                          if (newValue) {
                            clearErrors('codigoConcepto')
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Conceptos'
                            required={ rules.concepto.required }
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
                            required={ rules.tipo.required }
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

                          if (newValue) {
                            clearErrors('frecuenciaId')
                          }
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label='Frecuencias'
                            required={ rules.frecuencia.required }
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
                        required={ rules.monto.required }
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
                        disabled={disableForm}
                      />
                    </Grid>

                    {/* Complemento / Descripción adicional */}
                    <Grid item sm={12} xs={12}>
                      <Controller
                        name='complementoConcepto'
                        control={control}
                        rules={ rules.complementoConcepto }
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