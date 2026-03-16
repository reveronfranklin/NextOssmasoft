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
import { ossmmasofApiVertical } from 'src/MyApis/ossmmasofApiVertical'
import { useEffect, useState } from 'react'
import { Autocomplete, Box } from '@mui/material'
import { setOperacionCrudRhPersonaMovCtr, setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive, setIsExpandedAccordion } from 'src/store/apps/rh-persona-mov-ctrl'
import { setConceptoSeleccionado, setFrecuenciaSeleccionada } from 'src/store/apps/rh'
import { UpdateRhMovNominaCommand, DeleteRhMovNominaCommand } from '../interfaces'

type FormInputs = UpdateRhMovNominaCommand

const StyledCustomInput = styled(TextField)(() => ({
  width: '100%'
}))

const FormRhVariacionUpdateAsync = () => {
  const dispatch = useDispatch()

  const getErrorMessage = (error: any) => {
    if (error?.data?.message) return error.data.message
    if (!error?.response?.data) return 'Error inesperado. Intente nuevamente.'

    const data = error.response.data

    if (data.message) return data.message

    if (data.errors && typeof data.errors === 'object') {
      return Object.values(data.errors).flat().join(' ')
    }

    if (data.title) return data.title

    return 'Error al procesar la solicitud.'
  }

  const moventTypeOptions = [
		{ value: 'E', label: 'Especial' },
		{ value: 'F', label: 'Fijo' },
		{ value: 'V', label: 'Variable' }
  ]

  const { rhPersonaMovCtrSeleccionado, verRhPersonaMovCtrActive, listRhPersonaMovCtr} = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const { conceptos, frecuencias }                                                    = useSelector((state: RootState) => state.nomina)
  const { listRhTipoNomina }                                                          = useSelector((state: RootState) => state.rhTipoNomina)

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
    if (rhPersonaMovCtrSeleccionado.codigoConcepto != codigoConcepto) {
      const existCodigoConcepto = listRhPersonaMovCtr.some((element) => element.codigoConcepto == codigoConcepto)

      return existCodigoConcepto
    } else {

      return false
    }
  }

  const getConceptosOptions = () => {
    const conceptosOptions = conceptos?.filter((concepto) => {
      const concetInUse = isConceptUse(concepto.codigoConcepto)

      return !concetInUse
    })

    setConceptosOptions(conceptosOptions || [])
  }

  const [isAutomatic, setIsAutomatic]             = useState<boolean>(false)
  const [dialogDeleteOpen, setDialogDeleteOpen]   = useState<boolean>(false)
  const [dialogOpen, setDialogOpen]               = useState<boolean>(false)
  const [loading, setLoading]                     = useState<boolean>(false)
  const [monto, setMonto]                         = useState<number>(0)
  const [conceptosOptions, setConceptosOptions]   = useState<any | null>([])
  const [concepto, setConcepto]                   = useState<any>(getConcepto(rhPersonaMovCtrSeleccionado.codigoConcepto || null))
  const [frecuencia, setFrecuencia]               = useState<any>(getFrecuencia(rhPersonaMovCtrSeleccionado.frecuenciaId || null))
  const [tipoNomina, setTipoNomina]               = useState<any>(getTipoNomina(rhPersonaMovCtrSeleccionado.codigoTipoNomina || null))
  const [tipoMovimiento, setTipoMovimiento]       = useState<any>(getTipoMovimientoLabel(rhPersonaMovCtrSeleccionado.tipo || ''))
  const [errorMessage, setErrorMessage]           = useState<string>('')

  const defaultValues: UpdateRhMovNominaCommand = {
    codigoMovNomina: rhPersonaMovCtrSeleccionado.codigoMovNomina || null,
    codigoTipoNomina: rhPersonaMovCtrSeleccionado.codigoTipoNomina || null,
    codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona || null,
    codigoConcepto: rhPersonaMovCtrSeleccionado.codigoConcepto || null,
    complementoConcepto: rhPersonaMovCtrSeleccionado.complementoConcepto || '',
    codigoEmpresa: 13,
    tipo: rhPersonaMovCtrSeleccionado.tipo || '',
    frecuenciaId: rhPersonaMovCtrSeleccionado.frecuenciaId || null,
    monto: rhPersonaMovCtrSeleccionado.monto || 0,
    status: rhPersonaMovCtrSeleccionado.status || 'A',
    usuarioUpd: 1
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
    getFieldState,
    formState: { errors, isValid }
  } = useForm<FormInputs>({
    defaultValues,
    mode: 'onChange'
  })

  useEffect(() => {
    setLoading(true)

    if (!defaultValues.codigoMovNomina || defaultValues.codigoMovNomina === 0) {
      dispatch(setOperacionCrudRhPersonaMovCtr(1))

      return
    }

    setValue('codigoPersona', defaultValues.codigoPersona)
    setValue('codigoConcepto', defaultValues.codigoConcepto)
    setValue('frecuenciaId', defaultValues.frecuenciaId)
    setValue('codigoTipoNomina', defaultValues.codigoTipoNomina)
    setValue('tipo', defaultValues.tipo)
    setValue('monto', defaultValues.monto)
    setValue('complementoConcepto', defaultValues.complementoConcepto)

    setIsAutomatic(rhPersonaMovCtrSeleccionado.automatico)
    setConcepto(getConcepto(defaultValues.codigoConcepto || null))
    setFrecuencia(getFrecuencia(defaultValues.frecuenciaId || null))
    setTipoMovimiento(getTipoMovimientoLabel(defaultValues.tipo || ''))
    setTipoNomina(getTipoNomina(defaultValues.codigoTipoNomina || null))

    setTimeout(() => {
      setLoading(false)
    }, 200)
  }, [defaultValues.codigoMovNomina, defaultValues.codigoPersona])

  const stateMonto = getFieldState('monto')

  const watchMonto            = watch('monto')
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

  useEffect(() => {
    setMonto(watchMonto || 0)
  }, [watchMonto, setMonto])

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

  const handlerFrecuencias = (e: any,value:any) => {
    if (value) {
      dispatch(setFrecuenciaSeleccionada(value))
      setFrecuencia(value)
      setValue('frecuenciaId', value.id)
    }
  }

  const handlerTipoMovimiento = (e: any,option:any) => {
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
    setValue('codigoConcepto', null)
    setValue('frecuenciaId', null)
    setValue('tipo', '')
    setValue('codigoTipoNomina', null)
    setValue('codigoPersona', rhPersonaMovCtrSeleccionado.codigoPersona)
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

  const handleOpenDialogDelete = () => {
    setDialogDeleteOpen(true)
  }

  const handleCloseDialogDelete = () => {
    setDialogDeleteOpen(false)
  }

  const handleDelete = async  () => {
    setLoading(true)
    handleCloseDialogDelete()

    const deleteMovControl: DeleteRhMovNominaCommand = {
      codigoMovNomina: rhPersonaMovCtrSeleccionado.codigoMovNomina || 0,
    }

    try {
      const responseAll= await ossmmasofApiVertical.post<any>('/RhMovNomina/delete', deleteMovControl);

      if (responseAll.data.isValid) {
        const flag = !verRhPersonaMovCtrActive
        dispatch(setVerRhPersonaMovCtrActive(flag))
        dispatch(setIsExpandedAccordion(false))
        dispatch(setRhPersonaMovCtrSeleccionado({}))
        clearForm()
        toast.success('Variacion eliminada correctamente')
      } else {
        toast.error(responseAll.data.message || 'Error al eliminar variacion')
        setErrorMessage(responseAll.data.message)
      }
    } catch (error: any) {
      toast.error('Error al conectar con el servidor')
      console.error('Error en la solicitud:', error)
    } finally {
      setLoading(false)
    }
  }

  const onSubmitUpdate = async (data: FormInputs) => {
    setLoading(true)
    handleCloseDialog()

    const updateMovControl: UpdateRhMovNominaCommand = {
      codigoMovNomina: rhPersonaMovCtrSeleccionado.codigoMovNomina || null,
      codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona || null,
      codigoTipoNomina: data.codigoTipoNomina || null,
      codigoConcepto: data.codigoConcepto,
      complementoConcepto: data.complementoConcepto,
      codigoEmpresa: 13,
      tipo: data.tipo,
      frecuenciaId: data.frecuenciaId,
      monto: data.monto,
      status: data.status,
      usuarioUpd: 1
    };

    try {
      const responseAll = await ossmmasofApiVertical.post<any>('/RhMovNomina/update', updateMovControl);

      if (responseAll.data.isValid) {
        const flag = !verRhPersonaMovCtrActive
        dispatch(setVerRhPersonaMovCtrActive(flag))
        dispatch(setIsExpandedAccordion(true))
        dispatch(setRhPersonaMovCtrSeleccionado(updateMovControl))
        reset(updateMovControl)
        toast.success('Variacion actualizada correctamente')
      } else {
        toast.error(responseAll.data.message || 'Error al actualizar proveedor')
        setErrorMessage(getErrorMessage(responseAll))
      }
    } catch (error: any) {
      setErrorMessage(getErrorMessage(error))
      toast.error('Ocurrió un error al procesar la solicitud')
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

  useEffect(() => {
    getConceptosOptions()
  }, [conceptos, rhPersonaMovCtrSeleccionado.codigoConcepto])

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
                  <Grid item sm={3} xs={12}>
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

                  {/* Selección tipo codigo nomina */}
                  <Grid item sm={6} xs={12}>
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
                          disabled={isAutomatic}
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
                          disabled={isAutomatic}
                        />
                      )}
                    />
                  </Grid>

                  {/* Selección de Concepto */}
                  <Grid item sm={4} xs={12}>
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
                          disabled={isAutomatic}
                        />
                      )}
                    />
                  </Grid>

                  {/* Selección de frecuencia */}
                  <Grid item sm={4} xs={12}>
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
                          disabled={isAutomatic}
                        />
                      )}
                    />
                  </Grid>

                  {/* Monto */}
                  <Grid item sm={4} xs={12}>
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
                      disabled={isAutomatic}
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
                          disabled={isAutomatic}
                        />
                      )}
                    />
                  </Grid>

                  <DialogConfirmation
                    open={dialogOpen}
                    onClose={handleCloseDialog}
                    onConfirm={handleSubmit(onSubmitUpdate)}
                    loading={loading}
                    title="Actualizar registro"
                    content="¿Desea continuar con la actualización de este registro?"
                  />

                  <DialogConfirmation
                    open={dialogDeleteOpen}
                    onClose={handleCloseDialogDelete}
                    onConfirm={handleDelete}
                    loading={loading}
                    title="Eliminar registro"
                    content="¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer."
                  />

                  <Grid item xs={12}>
                    <Button
                      size='small'
                      variant='contained'
                      sx={{ pb: 0 }}
                      disabled={!isValid || isAutomatic}
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
                      Actualizar
                    </Button>
                    <Button
                      variant="outlined"
                      size='small'
                      onClick={handleOpenDialogDelete}
                      disabled={(!isValid && loading) || isAutomatic}
                      sx={{ color: 'error.main', ml: 2, pb: 0 }}
                    >
                      Eliminar
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

export default FormRhVariacionUpdateAsync
