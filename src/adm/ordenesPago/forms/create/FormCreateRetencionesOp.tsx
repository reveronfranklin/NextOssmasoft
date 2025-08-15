"use client"

import React, { useState } from 'react'
import { Box, Button, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesRetencionesOp } from '../../services/index'
import SearchIcon from '@mui/icons-material/Search'
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

import {
  setIsOpenDialogConfirmButtons,
  setRetencionOpSeleccionado,
  setRetencionSeleccionado,
  setIsOpenDialogListRetenciones,
  setTipoRetencion,
  setBaseTotalDocumentos,
  setTotalCompromiso
} from "src/store/apps/ordenPago"

import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateRetencionOp } from '../../interfaces/retencionesOp/createRetencionOp'
import { IUpdateRetencionOp } from '../../interfaces/retencionesOp/updateRetencionOp'
import { IDeleteRetencionOp } from '../../interfaces/retencionesOp/deleteRetencionOp'

import TipoRetencion from 'src/adm/ordenesPago/components/AutoComplete/TipoRetencion'
import AlertMessage from 'src/views/components/alerts/AlertMessage'
import calcularMontoRetencion from '../../helpers/montoRetencion'
import { NumericFormat } from 'react-number-format'
import FormatNumber from 'src/utilities/format-numbers'
import { useDocumentosOpData } from '../../hooks/useDocumentosOpData'
interface getValuesForm {
  tipoRetencion: number
  conceptoPago: string
  montoRetencion: string
  montoRetenido: number,
  codigoRetencion: number
}

const FormCreateRetencionesOp = () => {
  const [isDisabledRetencion, setIsDisabledRetencion] = useState<boolean>(false)
  const [tipoRetencionId, setTipoRetencionId] = useState<number>(0)
  const [porRetencion, setPorRetencion] = useState<number>(0)

  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const { prefetchDocumentos } = useDocumentosOpData()

  const {
    isOpenDialogConfirmButtons,
    codigoOrdenPago,
    retencionOpSeleccionado,
    retencionSeleccionado,
    tipoRetencion,
    baseTotalDocumentos,
    totalCompromiso
  } = useSelector((state: RootState) => state.admOrdenPago)

  const {
    message,
    loading,
    presupuestoSeleccionado,
    createRetencionOp,
    updateRetencionOp,
    deleteRetencionOp
  } = useServicesRetencionesOp()

  if (!baseTotalDocumentos) {
    prefetchDocumentos({ codigoOrdenPago })
      .then()
      .catch()
  }

  const { control, setValue, getValues, formState: { isValid } } = useForm<any>({
    defaultValues: {
      tipoRetencion: retencionOpSeleccionado?.tipoRetencionId ?? '',
      conceptoPago: retencionOpSeleccionado?.conceptoPago ?? '',
      montoRetencion: retencionOpSeleccionado?.montoRetencion ?? '',
      montoRetenido: retencionOpSeleccionado?.montoRetenido ?? '',
      descripcionTipoRetencion: retencionOpSeleccionado?.descripcionTipoRetencion ?? '',
      codigoRetencion: retencionOpSeleccionado?.codigoRetencion ?? 0,

      porcentajeRetencion: 0,
      baseTotalDocumento: baseTotalDocumentos || totalCompromiso,
    },
    mode: 'onChange',
  })

  const handleCreateOrden = async (): Promise<void> => {
    const formData: getValuesForm = getValues()

    if (!formData.tipoRetencion || !formData.montoRetencion || !presupuestoSeleccionado.codigoPresupuesto) {
      console.log('Faltan datos obligatorios')

      return
    }

    try {
      const payload: ICreateRetencionOp = {
        codigoRetencionOp: 0,
        codigoOrdenPago,
        tipoRetencionId: Number(formData.tipoRetencion),
        porRetencion: retencionSeleccionado?.porRetencion || 0,
        montoRetencion: Number(formData.montoRetencion),
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        baseImponible: baseTotalDocumentos || totalCompromiso,
        codigoRetencion: Number(formData.codigoRetencion),
      }

      await createRetencionOp(payload)
      clearForm()
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({ queryKey: ['retencionesOpTable'] })
      qc.invalidateQueries({ queryKey: ['beneficioOpTable'] })
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleUpdateOrden = async (): Promise<void> => {
    const formData: getValuesForm = getValues()

    if (!formData.tipoRetencion || !formData.montoRetencion || !presupuestoSeleccionado.codigoPresupuesto) {
      console.log('Faltan datos obligatorios')

      return
    }

    try {
      const payload: IUpdateRetencionOp = {
        codigoRetencionOp: retencionOpSeleccionado.codigoRetencionOp,
        codigoOrdenPago: retencionOpSeleccionado.codigoOrdenPago,
        tipoRetencionId: Number(formData.tipoRetencion),
        codigoRetencion: Number(formData.codigoRetencion),
        porRetencion: retencionSeleccionado?.porRetencion || 0,
        montoRetencion: Number(formData.montoRetencion),
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        baseImponible: baseTotalDocumentos || totalCompromiso,
      }

      await updateRetencionOp(payload)
      clearForm()
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({ queryKey: ['retencionesOpTable'] })
      qc.invalidateQueries({ queryKey: ['beneficioOpTable'] })
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleDeleteOrden = async (): Promise<void> => {
    try {
      const payload: IDeleteRetencionOp = {
        codigoRetencionOp: retencionOpSeleccionado?.codigoRetencionOp ?? 0,
      }

      await deleteRetencionOp(payload)

      clearForm()
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({ queryKey: ['retencionesOpTable'] })
      qc.invalidateQueries({ queryKey: ['beneficioOpTable'] })
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const clearForm = async (): Promise<void> => {
    setValue('tipoRetencion', '')
    setValue('conceptoPago', '')
    setValue('montoRetencion', 0)
    setValue('montoRetenido', '')
    setValue('descripcionTipoRetencion', '')
    setValue('numeroComprobante', '')

    setPorRetencion(0)
    setTipoRetencionId(0)
    dispatch(setTipoRetencion(0))
    dispatch(setRetencionOpSeleccionado(null))
    dispatch(setRetencionSeleccionado(null))
    setIsDisabledRetencion(false)

    // dispatch(setBaseTotalDocumentos(0))
    // dispatch(setTotalCompromiso(0))
  }

  const viewDialogListRetenciones = () => {
    dispatch(setIsOpenDialogListRetenciones(true))
  }

  useEffect(() => {
    if (retencionOpSeleccionado) {
      setIsDisabledRetencion(true)
      setTipoRetencionId(retencionOpSeleccionado?.tipoRetencionId || 0);
      setPorRetencion(retencionOpSeleccionado?.porRetencion || 0);

      setValue('tipoRetencion', retencionOpSeleccionado?.tipoRetencionId)
      setValue('conceptoPago', retencionOpSeleccionado?.conceptoPago)
      setValue('montoRetencion', retencionOpSeleccionado?.montoRetencion)
      setValue('montoRetenido', retencionOpSeleccionado?.montoRetenido)
      setValue('descripcionTipoRetencion', retencionOpSeleccionado?.descripcionTipoRetencion)
      setValue('numeroComprobante', retencionOpSeleccionado?.numeroComprobante)
    } else {
      clearForm();
      setTipoRetencionId(0);
    }
  }, [retencionOpSeleccionado, setValue])

  useEffect(() => {
    if (retencionSeleccionado && retencionSeleccionado.porRetencion) {
      const { descripcionTipoRetencion, codigoRetencion, porRetencion } = retencionSeleccionado

      setValue('conceptoPago', descripcionTipoRetencion || '')
      setValue('codigoRetencion', codigoRetencion || 0)
      setPorRetencion(porRetencion || 0)

      const respuestaMontoRetencion = baseTotalDocumentos === 0 ?
        calcularMontoRetencion(totalCompromiso, porRetencion)
        : calcularMontoRetencion(baseTotalDocumentos, porRetencion)

      if (respuestaMontoRetencion) {
        setIsDisabledRetencion(true)
        setValue('montoRetencion', respuestaMontoRetencion)
      }
    }
  }, [retencionSeleccionado, setValue])

  const handleTipoRetencion = (tipoRetencionId: any) => {
    setValue('tipoRetencion', tipoRetencionId)
    dispatch(setTipoRetencion(tipoRetencionId))
  }

  useEffect(() => {
    return () => {
      dispatch(setRetencionOpSeleccionado(null));
    };
  }, [])

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid container item sm={12} xs={12} sx={{ padding: 2 }}>
            <TipoRetencion
              id={tipoRetencionId}
              onSelectionChange={(value: any) => handleTipoRetencion(value.id)}
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
                    sx={{ flexGrow: 1 }}
                  />
                )}
              />
              <Tooltip
                title={
                  <Box sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    p: 0.5,
                    color: 'common.white'
                  }}>
                    % Retención: { FormatNumber(porRetencion) }
                  </Box>
                }
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'primary.main',
                      fontSize: '1rem',
                      fontWeight: 'medium',
                      boxShadow: 3
                    }
                  },
                  arrow: {
                    sx: {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <InfoIcon
                  sx={{
                    paddingLeft: .5,
                    fontSize: '1.4rem',
                    color: porRetencion > 0 ? 'primary.dark' : 'action.active',
                    transition: 'all 0.2s ease'
                  }}
                />
              </Tooltip>
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
                disabled={tipoRetencion === 0}
              >
                <SearchIcon />
              </Button>
            </Box>
          </Grid>

          <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Controller
                name='montoRetencion'
                control={control}
                render={({ field: { value, onChange, ref } }) => (
                  <NumericFormat
                    customInput={TextField}
                    value={value}
                    onValueChange={(values) => {
                      onChange(values.floatValue);
                    }}
                    thousandSeparator="."
                    decimalSeparator=","
                    decimalScale={2}
                    fullWidth
                    label='Monto Retención'
                    variant='outlined'
                    size='small'
                    disabled={isDisabledRetencion}
                    inputRef={ref}
                  />
                )}
              />
              <Tooltip
                title={
                  <Box sx={{
                    fontSize: '1rem',
                    fontWeight: 500,
                    p: 0.5,
                    color: 'common.white'
                  }}>
                    Base Total: {baseTotalDocumentos === 0 ? FormatNumber(totalCompromiso) : FormatNumber(baseTotalDocumentos)}
                  </Box>
                }
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: 'primary.main',
                      fontSize: '1rem',
                      fontWeight: 'medium',
                      boxShadow: 3
                    }
                  },
                  arrow: {
                    sx: {
                      color: 'primary.main'
                    }
                  }
                }}
              >
                <InfoIcon
                  sx={{
                    paddingLeft: .5,
                    fontSize: '1.4rem',
                    color: baseTotalDocumentos > 0 || totalCompromiso > 0 ? 'primary.dark' : 'action.active',
                    transition: 'all 0.2s ease'
                  }}
                />
              </Tooltip>
            </Box>
          </Grid>
          <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='montoRetencion'
              control={control}
              render={({ field: { value, onChange, ref } }) => (
                <NumericFormat
                  customInput={TextField}
                  value={value}
                  onValueChange={(values) => {
                    onChange(values.floatValue);
                  }}
                  thousandSeparator="."
                  decimalSeparator=","
                  decimalScale={2}
                  fullWidth
                  label='Monto Retenido'
                  variant='outlined'
                  size='small'
                  disabled
                  inputRef={ref}
                />
              )}
            />
          </Grid>
          <Grid container item sm={12} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='numeroComprobante'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  placeholder='Número Comprobante'
                  variant='outlined'
                  size='small'
                  disabled
                />
              )}
            />
          </Grid>
          <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
          </Grid>
        </Grid>
      </form>
      <Box sx={{ paddingTop: 4 }}>
        <CustomButtonDialog
          saveButtonConfig={{
            label: 'Crear',
            onClick: handleCreateOrden,
            show: true,
            confirm: true
          }}
          updateButtonConfig={{
            label: 'Modificar',
            onClick: handleUpdateOrden,
            show: !!retencionOpSeleccionado?.codigoRetencionOp,
            confirm: true
          }}
          deleteButtonConfig={{
            label: 'Eliminar',
            onClick: handleDeleteOrden,
            show: !!retencionOpSeleccionado?.codigoRetencionOp,
            confirm: true
          }}
          clearButtonConfig={{
            label: 'Limpiar',
            onClick: clearForm,
            show: true
          }}
          loading={loading}
          isOpenDialog={isOpenDialogConfirmButtons}
          setIsOpenDialog={setIsOpenDialogConfirmButtons}
          isFormValid={isValid}
        />
      </Box>
      <AlertMessage
        message={message?.text ?? ''}
        severity={message?.isValid ? 'success' : 'error'}
        duration={4000}
        show={message?.text ? true : false}
      />
    </Box>
  )
}

export default FormCreateRetencionesOp