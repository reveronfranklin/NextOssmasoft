import React, { useState } from 'react'
import { useEffect, useRef } from 'react'
import { Box, Button, Grid, TextField, FormHelperText } from '@mui/material'
import CustomButtonDialog from './../../components/BottonsActions'
import { useServicesImpuestosDocumentosOp } from '../../services/index'
import { setIsOpenDialogConfirmButtons } from 'src/store/apps/ordenPago'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { Controller, useForm } from 'react-hook-form'
import { NumericFormat } from 'react-number-format'
import TipoRetencion from 'src/adm/ordenesPago/components/AutoComplete/TipoRetencion'

import { ICreateImpuestoDocumentosOp } from './../../interfaces/impuestoDocumentosOp/createImpuestoDocumentosOp'
import { IUpdateImpuestoDocumentosOp } from './../../interfaces/impuestoDocumentosOp/updateImpuestoDocumentosOp'
import { IDeleteImpuestoDocumentosOp } from './../../interfaces/impuestoDocumentosOp/deleteImpuestoDocumentosOp'

import SearchIcon from '@mui/icons-material/Search'
import {
  setIsOpenDialogListRetenciones,
  resetImpuestoDocumentoOpSeleccionado
} from "src/store/apps/ordenPago"

import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useQuery } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import AlertMessage from 'src/views/components/alerts/AlertMessage'

const FormImpuestoDocumentosOp = () => {
  const [porRetencion, setPorRetencion] = useState<number>(0)
  const [validationError, setValidationError] = useState<string | null>(null)

  const {
    message, loading,
    createImpuestoDocumentosOp,
    updateImpuestoDocumentosOp,
    deleteImpuestoDocumentosOp,
  } = useServicesImpuestosDocumentosOp()

  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()
  const autocompleteRef = useRef()

  const {
    impuestoDocumentoOpSeleccionado,
    retencionSeleccionado,
    documentoOpSeleccionado,
    isOpenDialogConfirmButtons
  } = useSelector((state: RootState) => state.admOrdenPago)

  const showOnlyCreate = impuestoDocumentoOpSeleccionado?.codigoDocumentoOp ?? false

  const { getRetenciones } = useServicesRetenciones()
  const { data } = useQuery({
    queryKey: ['retencionesTable'],
    queryFn: () => getRetenciones(),
  })

  const defaultValues: any = {
    codigoImpuestoDocumentoOp: 0,
    codigoDocumentoOp: 0,
    codigoRetencion: 0,
    conceptoPago: '',
    tipoRetencionId: 0,
    periodoImpositivo: '',
    baseImponible: 0,
    montoImpuesto: 0,
    montoImpuestoExento: 0,
    montoRetenido: 0,
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues
  })

  const baseImponible = watch('baseImponible')
  const montoImpuestoExento = watch('montoImpuestoExento')
  const montoImpuesto = watch('montoImpuesto')

  const baseImponibleRules = {
    required: 'Este campo es obligatorio',
    validate: (value: number) => value > 0 || 'El monto debe ser mayor a cero'
  }

  const invalidateAndReset = (nameTable: string) => {
    if (nameTable && nameTable !== null) {
      qc.invalidateQueries({
        queryKey: [nameTable]
      })
    }
  }

  useEffect(() => {
    if (porRetencion) {
      const montoImpuestoCalculado = (baseImponible * porRetencion) / 100
      const valorFinal = montoImpuestoCalculado > 0 ? montoImpuestoCalculado : 0
      setValue('montoImpuesto', valorFinal)

      calcularMontoRetenido(valorFinal, montoImpuestoExento)
    }
  }, [baseImponible, setValue])

  const calcularMontoRetenido = (impuesto: number, exento: number) => {
    if (exento < 0) {
      setValidationError('El monto exento no puede ser negativo')

      return
    }

    const nuevoMontoRetenido = exento > 0 && impuesto > 0 && impuesto > exento
      ? impuesto - exento
      : impuesto

    setValue('montoRetenido', nuevoMontoRetenido)
    setValidationError(null)
  }

  useEffect(()=> {
    if (retencionSeleccionado && Object.keys(retencionSeleccionado).length > 0) {
      setValue('codigoRetencion', retencionSeleccionado.codigoRetencion)
      setValue('conceptoPago', retencionSeleccionado.conceptoPago)
      setPorRetencion(retencionSeleccionado.porRetencion)
    }
  }, [retencionSeleccionado])

  useEffect(() => {
    calcularMontoRetenido(montoImpuesto, montoImpuestoExento)
  }, [montoImpuestoExento, montoImpuesto])

  const handleCreateImpuestoDocumentosOp = async (): Promise<void> => {
    try {
      const newCreate: ICreateImpuestoDocumentosOp = {
        codigoImpuestoDocumentoOp: getValues('codigoImpuestoDocumentoOp') || 0,
        codigoDocumentoOp: getValues('codigoDocumentoOp') ?? documentoOpSeleccionado.codigoDocumentoOp,
        codigoRetencion: getValues('codigoRetencion'),
        tipoRetencionId: getValues('tipoRetencionId'),
        periodoImpositivo: getValues('periodoImpositivo') ?? documentoOpSeleccionado.periodoImpositivo,
        baseImponible: getValues('baseImponible'),
        montoImpuesto: getValues('montoImpuesto'),
        montoImpuestoExento: getValues('montoImpuestoExento') ?? 0,
        montoRetenido: getValues('montoRetenido'),
      }

      await createImpuestoDocumentosOp(newCreate)
      invalidateAndReset('impuestoDocumentosTable')
      clearForm()
    } catch (e: any) {
      console.log(e)
    } finally {
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleUpdateImpuestoDocumentosOp = async (): Promise<void> => {
    try {
      const payload: IUpdateImpuestoDocumentosOp = {
        codigoImpuestoDocumentoOp: getValues('codigoImpuestoDocumentoOp'),
        codigoDocumentoOp: getValues('codigoDocumentoOp'),
        codigoRetencion: getValues('codigoRetencion'),
        tipoRetencionId: getValues('tipoRetencionId'),
        periodoImpositivo: getValues('periodoImpositivo'),
        baseImponible: getValues('baseImponible'),
        montoImpuesto: getValues('montoImpuesto'),
        montoImpuestoExento: getValues('montoImpuestoExento'),
        montoRetenido: getValues('montoRetenido'),
      }

      await updateImpuestoDocumentosOp(payload)
      invalidateAndReset('impuestoDocumentosTable')
    } catch (e: any) {
      console.log(e)
    } finally {
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleDeleteImpuestoDocumentosOp = async (): Promise<void> => {
    try {
      const payload: IDeleteImpuestoDocumentosOp = {
        codigoImpuestoDocumentoOp: getValues('codigoImpuestoDocumentoOp')
      }

      await deleteImpuestoDocumentosOp(payload)
      invalidateAndReset('impuestoDocumentosTable')
    } catch (e: any) {
      console.log(e)
    } finally {
      clearForm()
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const clearForm: () => Promise<void> = async () => {
    setValue('codigoImpuestoDocumentoOp', 0)
    setValue('codigoDocumentoOp', 0)
    setValue('codigoRetencion', 0)
    setValue('tipoRetencionId', 0)
    setValue('periodoImpositivo', '')
    setValue('baseImponible', 0)
    setValue('montoImpuesto', 0)
    setValue('montoImpuestoExento', 0)
    setValue('montoRetenido', 0)
    setValue('conceptoPago', '')

    dispatch(resetImpuestoDocumentoOpSeleccionado())
    setValidationError(null)
  }

  useEffect(() => {
    return () => {
      clearForm()
      reset(defaultValues)
      setValidationError(null)
      setPorRetencion(0)
    }
  }, [reset, dispatch])

  const viewDialogListRetenciones = () => {
    dispatch(setIsOpenDialogListRetenciones(true))
  }

  useEffect(() => {
    setValue('periodoImpositivo', documentoOpSeleccionado.periodoImpositivo)
    setValue('codigoDocumentoOp', documentoOpSeleccionado.codigoDocumentoOp)
  }, [])

  useEffect(() => {
    if (impuestoDocumentoOpSeleccionado) {
      setValue('codigoImpuestoDocumentoOp', impuestoDocumentoOpSeleccionado['codigoImpuestoDocumentoOp'])
      setValue('codigoDocumentoOp', impuestoDocumentoOpSeleccionado['codigoDocumentoOp'])
      setValue('codigoRetencion', impuestoDocumentoOpSeleccionado['codigoRetencion'])
      setValue('tipoRetencionId', impuestoDocumentoOpSeleccionado['tipoRetencionId'])
      setValue('periodoImpositivo', impuestoDocumentoOpSeleccionado['periodoImpositivo'])

      setValue('baseImponible', impuestoDocumentoOpSeleccionado['baseImponible'])
      setValue('montoImpuesto', impuestoDocumentoOpSeleccionado['montoImpuesto'])
      setValue('montoImpuestoExento', impuestoDocumentoOpSeleccionado['montoImpuestoExento'])
      setValue('montoRetenido', impuestoDocumentoOpSeleccionado['montoRetenido'])

      const retencionesFiltradas = data?.data?.find(
        (retencion: any) => retencion?.codigoRetencion === impuestoDocumentoOpSeleccionado['codigoRetencion']
      )

      if (retencionesFiltradas) {
        setPorRetencion(retencionesFiltradas?.porRetencion)
        setValue('conceptoPago', retencionesFiltradas?.conceptoPago)
      }
    }
  }, [impuestoDocumentoOpSeleccionado])

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} paddingTop={0} justifyContent='flex-start'>
          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            {/* codigo de impuesto */}
            <Grid item xs={4}>
              <Controller
                name='codigoImpuestoDocumentoOp'
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <TextField
                    fullWidth
                    value={value || 0}
                    onChange={onChange}
                    label='Codigo Impuesto'
                    variant='outlined'
                    InputProps={{
                      readOnly: true,
                    }}
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'text.disabled'
                      }
                    }}
                    inputRef={ref}
                  />
                )}
              />
            </Grid>

            {/* codigo Documento*/}
            <Grid item xs={4}>
              <Controller
                name='codigoDocumentoOp'
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <TextField
                    fullWidth
                    value={value || documentoOpSeleccionado.codigoDocumentoOp}
                    onChange={onChange}
                    label='Codigo Documento'
                    variant='outlined'
                    InputProps={{
                      readOnly: true,
                    }}
                    inputRef={ref}
                  />
                )}
              />
            </Grid>

            {/* Codigo Retencion */}
            <Grid item xs={4}>
              <Controller
                name='codigoRetencion'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Codigo Retencion'
                    variant='outlined'
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid container item sm={12} xs={12} sx={{ padding: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Controller
                  name='conceptoPago'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      fullWidth
                      label='Concepto Pago'
                      value={value}
                      onChange={onChange}
                      variant='outlined'
                      error={!!errors.conceptoPago}
                      helperText={errors.conceptoPago?.message as string | undefined}
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                />
                <Button
                  onClick={viewDialogListRetenciones}
                  variant="contained"
                  sx={{
                    marginLeft: 2,
                    flexShrink: 0,
                    height: '100%',
                    minHeight: '48px',
                    minWidth: '80px',
                    justifyContent: 'flex-center',
                  }}
                >
                  <SearchIcon />
                </Button>
              </Box>
            </Grid>

          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
              <TipoRetencion
                id={ impuestoDocumentoOpSeleccionado?.tipoRetencionId || 0}
                autocompleteRef={autocompleteRef}
                onSelectionChange={(value: any) => setValue('tipoRetencionId', value.id)}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name='periodoImpositivo'
                control={control}
                render={({ field: { value, onChange, ref }, fieldState: { } }) => (
                  <TextField
                    fullWidth
                    value={value || documentoOpSeleccionado.periodoImpositivo}
                    onChange={onChange}
                    label='periodo Impositivo'
                    variant='outlined'
                    InputProps={{
                      readOnly: false,
                    }}
                    inputRef={ref}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="baseImponible"
                control={control}
                rules={baseImponibleRules}
                render={({ field: { onChange, value, ref }, fieldState: { } }) => (
                  <NumericFormat
                    value={value}
                    onValueChange={(values) => onChange(values.floatValue)}
                    customInput={TextField}
                    thousandSeparator='.'
                    decimalSeparator=','
                    decimalScale={2}
                    fixedDecimalScale
                    label='Base Imponible'
                    fullWidth
                    inputProps={{
                      type: 'text',
                      inputMode: 'numeric'
                    }}
                    getInputRef={ref}
                    onFocus={(e) => {
                      e.target.setSelectionRange(0, 0);
                    }}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={4}>
              <Controller
                name="montoImpuesto"
                control={control}
                render={({ field: { value, ref } }) => (
                  <NumericFormat
                    fullWidth
                    value={value}
                    customInput={TextField}
                    thousandSeparator='.'
                    decimalSeparator=','
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    label='Impuesto'
                    onFocus={event => event.target.select()}
                    placeholder='0,00'
                    aria-describedby='validation-async-cantidad'
                    inputProps={{
                      type: 'text',
                      inputMode: 'numeric',
                      readOnly: true
                    }}
                    getInputRef={ref}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="montoImpuestoExento"
                control={control}
                render={({ field: { onChange, value, ref }, fieldState: { } }) => (
                  <NumericFormat
                    fullWidth
                    value={value}
                    onValueChange={(values) => {
                      const newValue = values.floatValue || 0;
                      onChange(newValue);
                      const impuesto = getValues('montoImpuesto');
                      const nuevoRetenido = newValue > 0 && impuesto > 0
                        ? impuesto - newValue
                        : impuesto;
                      setValue('montoRetenido', nuevoRetenido);
                    }}
                    customInput={TextField}
                    thousandSeparator='.'
                    decimalSeparator=','
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    label='Impuesto Exento'
                    placeholder='0,00'
                    aria-describedby='validation-async-exento'
                    inputProps={{
                      type: 'text',
                      inputMode: 'numeric'
                    }}
                    getInputRef={ref}
                    onFocus={(e) => {
                      e.target.setSelectionRange(0, 0);
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={4}>
              <Controller
                name="montoRetenido"
                control={control}
                render={({ field: { value, ref } }) => (
                  <NumericFormat
                    fullWidth
                    value={value}
                    customInput={TextField}
                    thousandSeparator='.'
                    decimalSeparator=','
                    allowNegative={false}
                    decimalScale={2}
                    fixedDecimalScale={true}
                    label='Monto Retenido'
                    onFocus={event => event.target.select()}
                    placeholder='0,00'
                    aria-describedby='validation-async-retenido'
                    inputProps={{
                      type: 'text',
                      inputMode: 'numeric',
                      readOnly: true
                    }}
                    getInputRef={ref}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                )}
              />
            </Grid>
            <Box>
              {validationError && validationError.length > 0 && (
                <FormHelperText sx={{ color: 'error.main', fontSize: 20, mt: 4 }}>
                  {validationError}
                </FormHelperText>
              )}
            </Box>
          </Grid>
        </Grid>
      </form>
      <CustomButtonDialog
        saveButtonConfig={{
          label: 'Crear',
          onClick: handleCreateImpuestoDocumentosOp,
          show: !showOnlyCreate,
          confirm: true,
          disabled: !isValid || loading
        }}
        updateButtonConfig={{
          label: 'Actualizar',
          onClick: handleUpdateImpuestoDocumentosOp,
          show: showOnlyCreate,
          confirm: true,
          disabled: !isValid || loading
        }}
        deleteButtonConfig={{
          label: 'Eliminar',
          onClick: handleDeleteImpuestoDocumentosOp,
          show: showOnlyCreate,
          confirm: true,
          disabled: false
        }}
        clearButtonConfig={{
          label: 'Limpiar',
          onClick: async () => clearForm(),
          show: true,
          disabled: false
        }}
        loading={loading}
        isOpenDialog={isOpenDialogConfirmButtons}
        setIsOpenDialog={setIsOpenDialogConfirmButtons}
        isFormValid={isValid}
      />
      <AlertMessage
        message={message?.text ?? ''}
        severity={message?.isValid ? 'success' : 'error'}
        duration={8000}
        show={message?.text ? true : false}
      />
    </>
  )
}

export default FormImpuestoDocumentosOp