import React, { useState } from 'react'
import { Box, Button, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesRetencionesOp } from '../../services/index'
import SearchIcon from '@mui/icons-material/Search'
import {
  setIsOpenDialogConfirmButtons,
  setRetencionOpSeleccionado,
  setRetencionSeleccionado,
  setIsOpenDialogListRetenciones
} from "src/store/apps/ordenPago"

import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateRetencionOp } from '../../interfaces/retencionesOp/createRetencionOp'
import { IUpdateRetencionOp } from '../../interfaces/retencionesOp/updateRetencionOp'
import { IDeleteRetencionOp } from '../../interfaces/retencionesOp/deleteRetencionOp'

import TipoRetencion from 'src/adm/ordenesPago/components/AutoComplete/TipoRetencion'

interface getValuesForm {
  tipoRetencion: number
  conceptoPago: string
  montoRetencion: string
  montoRetenido: number,
  codigoRetencion: number
}

const FormCreateRetencionesOp = () => {
  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const { codigoOrdenPago, retencionOpSeleccionado, isOpenDialogConfirmButtons, retencionSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, presupuestoSeleccionado, createRetencionOp, updateRetencionOp, deleteRetencionOp } = useServicesRetencionesOp()
  const [localMessage, setLocalMessage] = useState<any | null>(message)

  const { control, setValue, getValues, formState: { errors, isValid } } = useForm<any>({
    defaultValues: {
      tipoRetencion: retencionOpSeleccionado?.tipoRetencionId ?? '',
      conceptoPago: retencionOpSeleccionado?.conceptoPago ?? '',
      montoRetencion: retencionOpSeleccionado?.montoRetencion ?? '',
      montoRetenido: retencionOpSeleccionado?.montoRetenido ?? '',
      descripcionTipoRetencion: retencionOpSeleccionado?.descripcionTipoRetencion ?? '',
      codigoRetencion: retencionOpSeleccionado?.codigoRetencion ?? 0
    },
    mode: 'onChange',
  })

  const handleCreateOrden = async (): Promise<void> => {
    const formData: getValuesForm = getValues()

    try {
      const payload: ICreateRetencionOp = {
        codigoRetencionOp: 0,
        codigoOrdenPago,
        tipoRetencionId: Number(formData.tipoRetencion),
        porRetencion: 0,
        montoRetencion: Number(formData.montoRetencion),
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        baseImponible: 0,
        codigoRetencion: Number(formData.codigoRetencion),
      }

      await createRetencionOp(payload)
      clearForm()
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({
        queryKey: ['retencionesOpTable']
      })
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleUpdateOrden = async (): Promise<void> => {
    const formData: getValuesForm = getValues()

    try {
      const payload: IUpdateRetencionOp = {
        codigoRetencionOp: retencionOpSeleccionado.codigoRetencionOp,
        codigoOrdenPago: retencionOpSeleccionado.codigoOrdenPago,
        tipoRetencionId: Number(formData.tipoRetencion),
        codigoRetencion: Number(formData.codigoRetencion),
        porRetencion: 0,
        montoRetencion: Number(formData.montoRetencion),
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        baseImponible: 0
      }

      await updateRetencionOp(payload)
      clearForm()
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({
        queryKey: ['retencionesOpTable']
      })
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleDeleteOrden = async (): Promise<void> => {
    try {
      const payload: IDeleteRetencionOp = {
        codigoRetencionOp: retencionOpSeleccionado?.codigoRetencionOp ?? 0,
      }

      await deleteRetencionOp(payload)
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({
        queryKey: ['retencionesOpTable']
      })
      clearForm()
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const clearForm = async (): Promise<void> => {
    // setLocalMessage(null)
    setValue('tipoRetencion', '')
    setValue('conceptoPago', '')
    setValue('montoRetencion', '')
    setValue('montoRetenido', '')
    setValue('descripcionTipoRetencion', '')
    setValue('numeroComprobante', '')
    dispatch(setRetencionOpSeleccionado(null))
    dispatch(setRetencionSeleccionado(null))
  }

  const viewDialogListRetenciones = () => {
    dispatch(setIsOpenDialogListRetenciones(true))
  }

  useEffect(() => {
    if (retencionOpSeleccionado) {
      setValue('tipoRetencion', retencionOpSeleccionado?.tipoRetencionId)
      setValue('conceptoPago', retencionOpSeleccionado?.conceptoPago)
      setValue('montoRetencion', retencionOpSeleccionado?.montoRetencion)
      setValue('montoRetenido', retencionOpSeleccionado?.montoRetenido)
      setValue('descripcionTipoRetencion', retencionOpSeleccionado?.descripcionTipoRetencion)
      setValue('numeroComprobante', retencionOpSeleccionado?.numeroComprobante)
    }
  }, [retencionOpSeleccionado, setValue])

  useEffect(() => {
    console.log(retencionSeleccionado)
    if (retencionSeleccionado) {
      setValue('conceptoPago', retencionSeleccionado?.descripcionTipoRetencion ?? '')
      setValue('codigoRetencion', retencionSeleccionado?.codigoRetencion ?? 0)
    }
  }, [retencionSeleccionado, setValue])

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid container item sm={12} xs={12} sx={{ padding: 2 }}>
            <TipoRetencion
              id={retencionOpSeleccionado?.tipoRetencionId || 0}
              onSelectionChange={(value: any) => setValue('tipoRetencion', value.id)}
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
          <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='montoRetencion'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Monto Retención'
                  variant='outlined'
                  size='small'
                  error={!!errors.montoRetencion}
                  helperText={errors.montoRetencion?.message as string | undefined}
                />
              )}
            />
          </Grid>
          <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='montoRetenido'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Monto Retenido'
                  variant='outlined'
                  size='small'
                  error={!!errors.montoRetenido}
                  helperText={errors.montoRetenido?.message as string | undefined}
                  disabled
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
                  error={!!errors.numeroComprobante}
                  helperText={errors.numeroComprobante?.message as string | undefined}
                  disabled
                />
              )}
            />
          </Grid>
          <Grid container item sm={6} xs={12} sx={{ padding: 2 }}>
            {/* {localMessage && (
              <Box>
                <FormHelperText sx={{ color: 'error.main', fontSize: 16 }}>{localMessage}</FormHelperText>
              </Box>
            )} */}
          </Grid>
        </Grid>
      </form>
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
      {/* {message.isValid && (
        <Box>
          <FormHelperText sx={{ color: 'error.main', fontSize: 16 }}>{message.text}</FormHelperText>
        </Box>
      )} */}
    </Box>
  )
}

export default FormCreateRetencionesOp