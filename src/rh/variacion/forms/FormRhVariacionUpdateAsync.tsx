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
import { useForm, Controller } from 'react-hook-form'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { useDispatch } from 'react-redux'
import { ossmmasofApi } from 'src/MyApis/ossmmasofApi'
import { useEffect, useState } from 'react'
import { Autocomplete, Box } from '@mui/material'
import { setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl'
import { setConceptoSeleccionado, setFrecuenciaSeleccionada } from 'src/store/apps/rh'
import { UpdateRhMovNominaCommand, DeleteRhMovNominaCommand } from '../interfaces'

type FormInputs = UpdateRhMovNominaCommand

const StyledCustomInput = styled(TextField)(() => ({
  width: '100%'
}))

const FormRhVariacionUpdateAsync = () => {
  const dispatch = useDispatch()

  const moventTypeOptions = [
		{ value: 'E', label: 'Especial' },
		{ value: 'F', label: 'Fijo' },
		{ value: 'V', label: 'Variable' }
  ]

  const { rhPersonaMovCtrSeleccionado } = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const { conceptos, frecuencias } = useSelector((state: RootState) => state.nomina)

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

  const [dialogOpen, setDialogOpen]               = useState<boolean>(false)
  const [dialogDeleteOpen, setDialogDeleteOpen]   = useState<boolean>(false)
  const [monto, setMonto]                         = useState<number>(0)
  const [loading, setLoading]                     = useState<boolean>(false)
  const [concepto, setConcepto]                   = useState<any>(getConcepto(rhPersonaMovCtrSeleccionado.codigoConcepto))
  const [frecuencia, setFrecuencia]               = useState<any>(getFrecuencia(rhPersonaMovCtrSeleccionado.frecuenciaId))
  const [tipoMovimiento, setTipoMovimiento]       = useState<any>(getTipoMovimientoLabel(rhPersonaMovCtrSeleccionado.tipo))
  const [errorMessage, setErrorMessage]           = useState<string>('')

  const defaultValues: UpdateRhMovNominaCommand = {
    codigoMovNomina: rhPersonaMovCtrSeleccionado.codigoMovNomina,
    codigoTipoNomina: rhPersonaMovCtrSeleccionado.codigoTipoNomina,
    codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona,
    codigoConcepto: rhPersonaMovCtrSeleccionado.codigoConcepto,
    complementoConcepto: rhPersonaMovCtrSeleccionado.complementoConcepto,
    tipo: rhPersonaMovCtrSeleccionado.tipo,
    frecuenciaId: rhPersonaMovCtrSeleccionado.frecuenciaId,
    monto: rhPersonaMovCtrSeleccionado.monto,
    status: rhPersonaMovCtrSeleccionado.status,
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

  const watchMonto = watch('monto')
  const stateMonto = getFieldState('monto')

  const setErrorMonto = () => {
    setError('monto', {
      type: 'manual',
      message: 'El monto es requerido, ingrese un monto válido.'
    }, { shouldFocus: true })
  }

  useEffect(() => {
    if (!monto) {
      setErrorMonto()
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

  const clearForm = () => {
    setFrecuencia(null)
    setConcepto(null)
    setTipoMovimiento(null)
    setMonto(0)
    reset(defaultValues)
  }

  const handleOpenDialog = () => {
    if (stateMonto.invalid) {
      setErrorMonto()
    } else {
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
    handleCloseDialogDelete()

    const deleteMovControl: DeleteRhMovNominaCommand = {
      codigoMovNomina: rhPersonaMovCtrSeleccionado.codigoMovNomina
    }

    const responseAll= await ossmmasofApi.post<any>('/RhMovNomina/delete',deleteMovControl);
    setErrorMessage(responseAll.data.message)

    if (responseAll.data.isValid) {
      dispatch(setVerRhPersonaMovCtrActive(false))
      dispatch(setRhPersonaMovCtrSeleccionado({}))
      clearForm()
      toast.success('Form Submitted')
    }
  }

  const onSubmitUpdate = async (data: FormInputs) => {
    setLoading(true)
    handleCloseDialog()

    const updateMovControl: UpdateRhMovNominaCommand = {
      codigoMovNomina: rhPersonaMovCtrSeleccionado.codigoMovNomina,
      codigoTipoNomina: rhPersonaMovCtrSeleccionado.codigoTipoNomina,
      codigoPersona: rhPersonaMovCtrSeleccionado.codigoPersona,
      codigoConcepto: data.codigoConcepto,
      complementoConcepto: data.complementoConcepto,
      tipo: data.tipo,
      frecuenciaId: data.frecuenciaId,
      monto: data.monto,
      status: data.status,
      usuarioUpd: 1
    };

    const responseAll = await ossmmasofApi.post<any>('/RhMovNomina/update', updateMovControl);

    if (responseAll.data.isValid) {
      dispatch(setRhPersonaMovCtrSeleccionado(responseAll.data.data))
      dispatch(setVerRhPersonaMovCtrActive(false))
      clearForm()
      toast.success('Form Submitted')
    }

    setErrorMessage(responseAll.data.message)
    setLoading(false)
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
                value={concepto}
                isOptionEqualToValue={(option, value) => option.codigo + option.codigoTipoNomina === value.codigo + value.codigoTipoNomina}
                getOptionLabel={option => option.codigo + '-' + option.codigoTipoNomina + '-' + option.denominacion}
                onChange={handlerConceptos}
                renderInput={params => <TextField {...params} label='Conceptos' />}
              />
            </Grid>

            {/* Selección de frecuencia */}
            <Grid item sm={5} xs={12}>
              <Autocomplete
                size="small"
                options={frecuencias}
                id='autocomplete-frecuencia'
                value={frecuencia}
                getOptionLabel={option => option.id + '-' + option.descripcion}
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
            <Grid item sm={5} xs={12}>
              <Autocomplete
                size="small"
                options={moventTypeOptions}
                id='autocomplete-tipo-movimiento'
                value={tipoMovimiento}
                getOptionLabel={option => option.label}
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

            {/* Monto */}
            <Grid item sm={7} xs={12}>
            {/*    <Controller
                name='monto'
                control={control}
                rules={{ required: true, min: 0.01 }}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    type="number"
                    size="small"
                    label='Monto'
                    error={Boolean(errors.monto)}
                    helperText={errors.monto && "Monto requerido"}
                  />
                )}
              /> */}

              <NumericFormat
                size='small'
                value={monto}
                customInput={StyledCustomInput}
                thousandSeparator="."
                decimalSeparator=","
                allowNegative={false}
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
                variant="outlined"
                size='small'
                onClick={handleOpenDialogDelete}
                disabled={!isValid && loading}
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
    </>
  )
}

export default FormRhVariacionUpdateAsync
