import React, { useState, useEffect, useRef } from 'react'
import { Button, Box, Grid, TextField } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { useSelector, useDispatch } from 'react-redux'
import useInvalidateReset from 'src/hooks/useInvalidateReset'
import { RootState } from 'src/store'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import dayjs from 'dayjs'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import { NumericFormat } from 'react-number-format'

// Components
import EstatusFisico from '../../components/AutoComplete/documentos/EstatusFisico'
import TipoDocumento from '../../components/AutoComplete/documentos/TipoDocumento'
import TipoImpuesto from '../../components/AutoComplete/documentos/TipoImpuesto'
import TipoOperacion from '../../components/AutoComplete/documentos/TipoOperación'
import TipoTransaction from '../../components/AutoComplete/documentos/TipoTransaccion'
import useServicesDocumentosOp from '../../services/useServicesDocumentosOp'
import CustomButtonDialog from './../../components/BottonsActions'

// Store actions
import {
  setIsOpenDialogConfirmButtons,
  resetDocumentoOpSeleccionado,
  setDocumentoOpSeleccionado,
  setIsOpenDialogImpuestoDocumentosEdit
} from 'src/store/apps/ordenPago'

import { ICreateDocumentosOp } from '../../interfaces/documentosOp/createDocumentosOp'
import { IUpdateDocumentosOp } from '../../interfaces/documentosOp/updateDocumentosOp'
import { IDeleteDocumentoOp } from '../../interfaces/documentosOp/deleteDocumentosOp'

import calcularBaseImponible from '../../helpers/baseImponible'
import calculoImpuesto from '../../helpers/calculoImpuesto'
import calcularMontoRetenido from '../../helpers/montoRetenido'

import AlertMessage from 'src/views/components/alerts/AlertMessage'

const FormCreateDocumentosOp = () => {
  const [montoDocumento, setMontoDocumento] = useState<number>(0)
  const [baseImponible, setBaseImponible] = useState<number>(0)
  const [montoImpuesto, setMontoImpuesto] = useState<number>(0)
  const [montoImpuestoExento, setMontoImpuestoExento] = useState<number>(0)
  const [retencionMonto, setRetencionMonto] = useState<number>(0)
  const [impuesto, setImpuesto] = useState<number>(0)
  const [estatusFisico, setEstatusFisico] = useState<number>(0)
  const autocompleteRef = useRef()

  const invalidateReset = useInvalidateReset()
  const dispatch = useDispatch()
  const {
    documentoOpSeleccionado,
    typeOperationDocumento,
    isOpenDialogConfirmButtons,
    codigoOrdenPago,
  } = useSelector((state: RootState) => state.admOrdenPago)

  const {
    message,
    presupuestoSeleccionado,
    loading,
    createDocumentos,
    updateDocumentos,
    deleteDocumentos
  } = useServicesDocumentosOp()

  const defaultValues: ICreateDocumentosOp = {
    codigoDocumentoOp: 0,
    codigoOrdenPago: codigoOrdenPago,
    codigoPresupuesto: presupuestoSeleccionado?.codigoPresupuesto ?? 0,
    fechaComprobante: '',
    periodoImpositivo: '',
    tipoOperacionId: 0,
    tipoDocumentoId: 0,
    tipoTransaccionId: 669,
    tipoImpuestoId: 0,
    estatusFiscoId: 0,
    fechaDocumento: '',
    numeroDocumento: '',
    numeroControlDocumento: '',
    montoDocumento: 0,
    baseImponible: 0,
    montoImpuesto: 0,
    numeroExpediente: '',
    numeroDocumentoAfectado: '',
    montoImpuestoExento: 0,
    montoRetenido: 0
  }

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
    reset
  } = useForm({
    mode: 'onChange',
    defaultValues
  })

  useEffect(() => {
    const calculateValues = async () => {
      if (montoDocumento > 0 && impuesto !== 0) {
        const base = await calcularBaseImponible(montoDocumento, impuesto)
        setBaseImponible(base)

        if (base > 0) {
          const calculoMontoImpuesto = await calculoImpuesto(base, impuesto)
          setMontoImpuesto(calculoMontoImpuesto)
        } else {
          setMontoImpuesto(0)
          setRetencionMonto(0)
        }
      } else {
        setBaseImponible(0)
        setMontoImpuesto(0)
        setRetencionMonto(0)
      }
    }

    calculateValues()
  }, [montoDocumento, impuesto])

  useEffect(() => {
    const calculateMontoRetenido = async () => {
      if (montoImpuesto > 0) {
        const montoRetenido = await calcularMontoRetenido(montoImpuesto, estatusFisico)
        setRetencionMonto(montoRetenido)
      } else {
        setRetencionMonto(0)
      }
    }

    calculateMontoRetenido()
  }, [montoImpuesto, estatusFisico])

  const handleTipoImpuestoChange = (tipoImpuesto: any) => {
    setValue('tipoImpuestoId', tipoImpuesto.id)
    setImpuesto(tipoImpuesto.value)
  }

  const handleEstatusFisicoChange = (estatusFisico: any) => {
    setValue('estatusFiscoId', estatusFisico.id)
    setEstatusFisico(estatusFisico.value)
  }

  useEffect(() => {
    if (typeOperationDocumento === 'create') {
      dispatch(resetDocumentoOpSeleccionado({}))
      reset(defaultValues)
    }
  }, [setValue, typeOperationDocumento, reset])

  const handleCreateDocumento = async (): Promise<void> => {
    try {
      const newDocumento: ICreateDocumentosOp = {
        codigoDocumentoOp: 0,
        codigoOrdenPago,
        fechaComprobante: getValues('fechaComprobante'),
        fechaDocumento: getValues('fechaDocumento'),
        periodoImpositivo: getValues('periodoImpositivo'),
        tipoOperacionId: getValues('tipoOperacionId'),
        tipoDocumentoId: getValues('tipoDocumentoId'),
        tipoTransaccionId: 669,
        tipoImpuestoId: getValues('tipoImpuestoId'),
        estatusFiscoId: getValues('estatusFiscoId'),
        numeroDocumento: getValues('numeroDocumento'),
        numeroControlDocumento: getValues('numeroControlDocumento'),
        montoDocumento: Number(montoDocumento),
        baseImponible: Number(baseImponible),
        montoImpuesto,
        numeroDocumentoAfectado: getValues('numeroDocumentoAfectado'),
        montoImpuestoExento: getValues('montoImpuestoExento'),
        montoRetenido: retencionMonto,
        codigoPresupuesto: getValues('codigoPresupuesto'),
        numeroExpediente: getValues('numeroExpediente')
      }

      const result = await createDocumentos(newDocumento)

      if (result?.isValid) {
        invalidateReset({
          tables: ['documentosTable'],
          resetForm: () => clearForm(),
        })
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleUpdateDocumento = async (): Promise<void> => {
    try {
      const Documento: IUpdateDocumentosOp = {
        codigoDocumentoOp: getValues('codigoDocumentoOp'),
        codigoOrdenPago: getValues('codigoOrdenPago'),
        fechaComprobante: getValues('fechaComprobante'),
        periodoImpositivo: getValues('periodoImpositivo'),
        tipoOperacionId: getValues('tipoOperacionId'),
        tipoDocumentoId: getValues('tipoDocumentoId'),
        tipoTransaccionId: 669,
        tipoImpuestoId: getValues('tipoImpuestoId'),
        estatusFiscoId: getValues('estatusFiscoId'),
        fechaDocumento: getValues('fechaDocumento'),
        numeroDocumento: getValues('numeroDocumento'),
        numeroControlDocumento: getValues('numeroControlDocumento'),
        montoDocumento: Number(montoDocumento),
        baseImponible: Number(baseImponible),
        montoImpuesto,
        numeroDocumentoAfectado: getValues('numeroDocumentoAfectado'),
        montoImpuestoExento: getValues('montoImpuestoExento'),
        montoRetenido: retencionMonto,
        codigoPresupuesto: getValues('codigoPresupuesto'),
        numeroExpediente: getValues('numeroExpediente')
      }

      const result = await updateDocumentos(Documento)

      if (result?.isValid) {
        invalidateReset({
          tables: ['documentosTable'],
        })
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleDeleteDocumento = async (): Promise<void> => {
    try {
      const data: IDeleteDocumentoOp = {
        codigoDocumentoOp: getValues('codigoDocumentoOp')
      }

      const result = await deleteDocumentos(data)

      if (result?.isValid) {
        invalidateReset({
          tables: ['documentosTable'],
          resetForm: () => clearForm(),
        })
      }
    } catch (e: any) {
      console.error(e)
    } finally {
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const clearForm: () => Promise<void> = async () => {
    setBaseImponible(0)
    setMontoDocumento(0)
    setMontoImpuesto(0)
    setMontoImpuestoExento(0)

    setValue('codigoDocumentoOp', 0)
    setValue('codigoOrdenPago', 0)
    setValue('fechaComprobante', '')
    setValue('periodoImpositivo', '')
    setValue('tipoOperacionId', 0)
    setValue('tipoDocumentoId', 0)
    setValue('tipoTransaccionId', 0)
    setValue('tipoImpuestoId', 0)
    setValue('estatusFiscoId', 0)
    setValue('fechaDocumento', '')
    setValue('numeroDocumento', '0')
    setValue('numeroControlDocumento', '0')
    setValue('montoDocumento', 0)
    setValue('baseImponible', 0)
    setValue('montoImpuesto', 0)
    setValue('numeroDocumentoAfectado', '')
    setValue('montoImpuestoExento', 0)
    setValue('montoRetenido', 0)
    setValue('codigoPresupuesto', 0)
    setValue('numeroExpediente', '')
  }

  const handleFechaComprobanteObjChange = (fecha: Date | null) => {
    if (fecha && dayjs(fecha).isValid()) {
      const fechaComprobanteObj = fechaToFechaObj(fecha)
      const fechaComprobanteObjString = dayjs(fecha).format('DD/MM/YYYY')
      const fechaComprobante = dayjs(fecha).format('YYYY-MM-DDTHH:mm:ss')

      const documentoUpdate: any = {
        ...documentoOpSeleccionado,
        fechaComprobanteObj,
        fechaComprobanteObjString,
        fechaComprobante
      }

      dispatch(setDocumentoOpSeleccionado(documentoUpdate))
      setValue('fechaComprobante', fechaComprobante)
    }
  }

  const generatePImpositivo = (fecha: Date | null) => {
    if (fecha) {
      setValue('periodoImpositivo', dayjs(fecha).format('YYYYMM'))
    }
  }

  const handleFechaDocumentoObjChange = (fecha: Date | null) => {
    if (fecha && dayjs(fecha).isValid()) {
      const fechaDocumentoObj = fechaToFechaObj(fecha)
      const fechaDocumentoObjString = dayjs(fecha).format('DD/MM/YYYY')
      const fechaDocumento = dayjs(fecha).format('YYYY-MM-DDTHH:mm:ss')

      const documentoUpdate: any = {
        ...documentoOpSeleccionado,
        fechaDocumentoObj,
        fechaDocumentoObjString,
        fechaDocumento
      }

      dispatch(setDocumentoOpSeleccionado(documentoUpdate))
      setValue('fechaDocumento', fechaDocumento)

      handleFechaComprobanteObjChange(fecha)

      generatePImpositivo(fecha)
    }
  }

  useEffect(() => {
    if (documentoOpSeleccionado && typeOperationDocumento !== 'create') {
      setValue('fechaComprobante', documentoOpSeleccionado['fechaComprobante'])
      setValue('fechaDocumento', documentoOpSeleccionado['fechaDocumento'])

      setValue('codigoOrdenPago', documentoOpSeleccionado['codigoOrdenPago'])
      setValue('codigoDocumentoOp', documentoOpSeleccionado['codigoDocumentoOp'])

      setValue('numeroDocumento', documentoOpSeleccionado['numeroDocumento'])
      setValue('numeroControlDocumento', documentoOpSeleccionado['numeroControlDocumento'])
      setValue('numeroDocumentoAfectado', documentoOpSeleccionado['numeroDocumentoAfectado'] ?? '')
      setValue('montoImpuestoExento', documentoOpSeleccionado['montoImpuestoExento'])
      setValue('montoRetenido', documentoOpSeleccionado['montoRetenido'])
      setValue('numeroExpediente', documentoOpSeleccionado['numeroExpediente'] ?? '')
      setValue('periodoImpositivo', documentoOpSeleccionado['periodoImpositivo'])

      setValue('tipoOperacionId', documentoOpSeleccionado['tipoOperacionId'])
      setValue('tipoDocumentoId', documentoOpSeleccionado['tipoDocumentoId'])
      setValue('tipoTransaccionId', documentoOpSeleccionado['tipoTransaccionId'])
      setValue('tipoImpuestoId', documentoOpSeleccionado['tipoImpuestoId'])
      setValue('estatusFiscoId', documentoOpSeleccionado['estatusFiscoId'])

      setMontoDocumento(documentoOpSeleccionado['montoDocumento'])
      setBaseImponible(documentoOpSeleccionado['baseImponible'])
      setMontoImpuesto(documentoOpSeleccionado['montoImpuesto'])
      setMontoImpuestoExento(documentoOpSeleccionado['montoImpuestoExento'])
    }
  }, [documentoOpSeleccionado])

  const onSubmit = (data: any) => {
    console.log(data)
  }

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2} paddingTop={0} justifyContent='flex-start'>
          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={2}>
              <Controller
                name='codigoPresupuesto'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Código Presupuesto'
                    variant='outlined'
                    disabled={true}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name='codigoOrdenPago'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Código Orden Pago'
                    variant='outlined'
                    disabled
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name='codigoDocumentoOp'
                control={control}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={e => onChange(parseFloat(e.target.value) || '')}
                    label='Código Documento OP'
                    variant='outlined'
                    disabled
                  />
                )}
              />
            </Grid>

            <Grid item xs={3} style={{ marginLeft: 'auto' }}>
              <DatePickerWrapper>
                <Controller
                  name='fechaDocumento'
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      selected={field.value ? new Date(field.value) : null}
                      id='Fecha-documento'
                      dateFormat='dd/MM/yyyy'
                      onChange={(date: Date) => {
                          field.onChange(dayjs(date).format('YYYY-MM-DDTHH:mm:ss'))
                          handleFechaDocumentoObjChange(date)
                      }}
                      placeholderText='Fecha Documento'
                      customInput={<TextField fullWidth label='Fecha Documento' variant='outlined' value={field.value ? dayjs(field.value).format('DD/MM/YYYY') : ''} />}
                      disabled={false}
                    />
                    )}
                />
              </DatePickerWrapper>
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={3}>
              <Controller
                name='periodoImpositivo'
                control={control}
                rules={{
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^\d{4}\d{2}$/, // Formato YYYY-MM
                    message: 'El período debe tener el formato YYYYMM'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Periodo Impositivo'
                    variant='outlined'
                    error={!!errors.periodoImpositivo}
                    helperText={errors.periodoImpositivo ? errors.periodoImpositivo.message : null}
                    disabled={true}
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <TipoTransaction
                id={documentoOpSeleccionado?.tipoTransaccionId ?? 669}
                autocompleteRef={autocompleteRef}
                onSelectionChange={(value: any) => {
                  setValue('tipoTransaccionId', value.id)
                }}
                disabled={true}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name='tipoOperacionId'
                control={control}
                render={({ field: {} }) => (
                  <TipoOperacion
                    id={documentoOpSeleccionado?.tipoOperacionId ?? 0}
                    autocompleteRef={autocompleteRef}
                    onSelectionChange={(value: any) => {
                      setValue('tipoOperacionId', value.id)
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <TipoDocumento
                id={documentoOpSeleccionado?.tipoDocumentoId ?? 0}
                autocompleteRef={autocompleteRef}
                onSelectionChange={(value: any) => {
                  setValue('tipoDocumentoId', value.id)
                }}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={6}>
              <EstatusFisico
                id={documentoOpSeleccionado?.estatusFiscoId ?? 0}
                autocompleteRef={autocompleteRef}
                onSelectionChange={handleEstatusFisicoChange}
              />
            </Grid>

            <Grid item xs={6}>
              <TipoImpuesto
                id={documentoOpSeleccionado?.tipoImpuestoId ?? 0}
                autocompleteRef={autocompleteRef}
                onSelectionChange={handleTipoImpuestoChange}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={2}>
              <DatePickerWrapper>
                <DatePicker
                  selected={
                    documentoOpSeleccionado?.fechaComprobanteObj
                      ? getDateByObject(documentoOpSeleccionado?.fechaComprobanteObj)
                      : null
                  }
                  id='Fecha-comprobante'
                  dateFormat='dd/MM/yyyy'
                  onChange={(date: Date) => {
                    handleFechaComprobanteObjChange(date)
                  }}
                  placeholderText='Fecha Comprobante'
                  customInput={<TextField fullWidth label='Fecha Comprobante' variant='outlined' />}
                  disabled={true}
                />
              </DatePickerWrapper>
            </Grid>

            <Grid item xs={2}>
              <Controller
                name='numeroDocumento'
                control={control}
                rules={{
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'hay un caracter no permitido'
                  },
                  maxLength: {
                    value: 20,
                    message: 'Máximo 20 dígitos permitidos'
                  },
                  minLength: {
                    value: 1,
                    message: 'Mínimo 1 dígito requerido'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Número Documento'
                    variant='outlined'
                    error={!!errors.numeroDocumento}
                    helperText={errors.numeroDocumento ? errors.numeroDocumento.message : null}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <Controller
                name='numeroControlDocumento'
                control={control}
                rules={{
                  required: 'Este campo es requerido',
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'hay un caracter no permitido'
                  },
                  maxLength: {
                    value: 20,
                    message: 'Máximo 20 dígitos permitidos'
                  },
                  minLength: {
                    value: 1,
                    message: 'Mínimo 1 dígito requerido'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value}
                    onChange={onChange}
                    label='Número Control Documento'
                    variant='outlined'
                    error={!!errors.numeroControlDocumento}
                    helperText={errors.numeroControlDocumento ? errors.numeroControlDocumento.message : null}
                  />
                )}
              />
            </Grid>

            <Grid item xs={2}>
              <NumericFormat
                value={montoDocumento}
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                label='Monto'
                onFocus={event => {
                  event.target.select()
                }}
                onValueChange={(values: any) => {
                  const { value } = values
                  setMontoDocumento(value || 0)
                }}
                placeholder='0,00'
                error={Boolean(errors.montoDocumento)}
                aria-describedby='validation-async-cantidad'
                inputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  autoFocus: false
                }}
                disabled={false}
              />
            </Grid>

            <Grid item xs={2}>
              <NumericFormat
                value={baseImponible}
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                label='Base'
                onFocus={event => {
                  event.target.select()
                }}
                onValueChange={(values: any) => {
                  const { value } = values
                  setBaseImponible(value)
                }}
                placeholder='0,00'
                error={Boolean(errors.baseImponible)}
                aria-describedby='validation-async-cantidad'
                inputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  autoFocus: true
                }}
                disabled={true}
              />
            </Grid>

            <Grid item xs={2}>
              <NumericFormat
                value={montoImpuesto}
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                label='% Impuesto'
                onFocus={event => {
                  event.target.select()
                }}
                placeholder='0,00'
                error={Boolean(errors.montoImpuesto)}
                aria-describedby='validation-async-cantidad'
                inputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  autoFocus: true
                }}
                disabled={true}
              />
            </Grid>
          </Grid>

          <Grid container item xs={12} spacing={2} sx={{ marginBottom: 1 }}>
            <Grid item xs={3}>
              <Controller
                name='numeroDocumentoAfectado'
                control={control}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Solo se permiten números'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField
                    fullWidth
                    value={value || ''}
                    onChange={onChange}
                    label='Número Documento Afectado'
                    variant='outlined'
                  />
                )}
              />
            </Grid>

            <Grid item xs={3}>
              <NumericFormat
                value={montoImpuestoExento}
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                label='Impuesto Exento'
                onFocus={event => {
                  event.target.select()
                }}
                placeholder='0,00'
                error={Boolean(errors.montoImpuesto)}
                aria-describedby='validation-async-cantidad'
                inputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  autoFocus: true
                }}
              />
            </Grid>

            <Grid item xs={3}>
              <NumericFormat
                value={retencionMonto}
                customInput={TextField}
                thousandSeparator='.'
                decimalSeparator=','
                allowNegative={false}
                decimalScale={2}
                fixedDecimalScale={true}
                label='% Retenido'
                onFocus={event => {
                  event.target.select()
                }}
                placeholder='0,00'
                error={Boolean(errors.montoImpuesto)}
                aria-describedby='validation-async-cantidad'
                inputProps={{
                  type: 'text',
                  inputMode: 'numeric',
                  autoFocus: true
                }}
                disabled={true}
              />
            </Grid>

            <Grid item xs={3}>
              <Controller
                name='numeroExpediente'
                control={control}
                rules={{
                  pattern: {
                    value: /^[a-zA-Z0-9]+$/,
                    message: 'Solo se permiten números'
                  }
                }}
                render={({ field: { value, onChange } }) => (
                  <TextField fullWidth value={value ?? ''} onChange={onChange} label='Número Expediente' variant='outlined' />
                )}
              />
            </Grid>
          </Grid>
        </Grid>
      </form>
      <Box
        sx={{
          padding: 2,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'flex-end',
          height: '100%',
          flexGrow: 1
        }}
      >
        <>
          <CustomButtonDialog
            saveButtonConfig={{
              label: 'Crear',
              onClick: handleCreateDocumento,
              show: typeOperationDocumento === 'create' ? true : false,
              confirm: true,
              disabled: !isValid
            }}
            updateButtonConfig={{
              label: 'Actualizar',
              onClick: handleUpdateDocumento,
              show: typeOperationDocumento !== 'create' ? true : false,
              confirm: true,
              disabled: !isValid
            }}
            deleteButtonConfig={{
              label: 'Eliminar',
              onClick: handleDeleteDocumento,
              show: typeOperationDocumento !== 'create' ? true : false,
              confirm: true,
              disabled: false
            }}
            clearButtonConfig={{
              label: 'Limpiar',
              onClick: async () => clearForm(),
              show: false,
              disabled: false
            }}
            loading={loading}
            isOpenDialog={isOpenDialogConfirmButtons}
            setIsOpenDialog={setIsOpenDialogConfirmButtons}
            isFormValid={isValid}
          />
          <Button
            onClick={() => dispatch(setIsOpenDialogImpuestoDocumentosEdit(true))}
            variant='outlined'
            size='small'
            disabled={typeOperationDocumento === 'create' ? true : false}
          >
            Impuestos
          </Button>
          <AlertMessage
            message={message?.text ?? ''}
            severity={message?.isValid ? 'success' : 'error'}
            duration={message?.isValid ? 2000 : 4000}
            show={message?.text ? true : false}
          />
        </>
      </Box>
    </>
  )
}

export default FormCreateDocumentosOp
