import React from 'react';
import { Box, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setIsOpenDialogConfirmButtons, setRetencionSeleccionado } from "src/store/apps/ordenPago"
import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateRetencionOp } from '../../interfaces/retenciones/createRetencionOp'
import { IUpdateRetencionOp } from '../../interfaces/retenciones/updateRetencionOp'
import { IDeleteRetencionOp } from '../../interfaces/retenciones/deleteRetencionOp'

interface getValuesForm {
  tipoRetencion: number
  conceptoPago: string
  montoRetencion: number
  montoRetenido: number
}

const FormCreateRetenciones = () => {
  const { retencionSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)
  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const {
    message,
    loading,
    presupuestoSeleccionado,
    createRetencion,
    updateRetencion,
    deleteRetencion
  } = useServicesRetenciones()

  const { control, setValue, getValues, formState: { errors } } = useForm<any>({
    defaultValues: {
      tipoRetencion: retencionSeleccionado?.tipoRetencionId || '',
      conceptoPago: retencionSeleccionado?.conceptoPago || '',
      montoRetencion: retencionSeleccionado?.montoRetencion || '',
      montoRetenido: retencionSeleccionado?.montoRetenido || '',
    },
    mode: 'onChange',
  })

  const handleCreateOrden = async () => {
    const formData: getValuesForm = getValues()

    try {
      const payload: ICreateRetencionOp = {
        codigoRetencionOp: 0,
        codigoOrdenPago: retencionSeleccionado.codigoOrdenPago,
        tipoRetencionId: Number(formData.tipoRetencion),
        codigoRetencion: 39, //todo cambiar este valor
        porRetencion: 0,
        montoRetencion: Number(formData.montoRetencion),
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        baseImponible: 0
      }

      const response = await createRetencion(payload)
      console.log('response', response)
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({
        queryKey: ['retencionesTable']
      })
      clearForm()
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleUpdateOrden = async () => {
    const formData: getValuesForm = getValues()

    try {
      const payload: IUpdateRetencionOp = {
        codigoRetencionOp: retencionSeleccionado.codigoRetencionOp,
        codigoOrdenPago: retencionSeleccionado.codigoOrdenPago,
        tipoRetencionId: Number(formData.tipoRetencion),
        codigoRetencion: 39, //todo cambiar este valor
        porRetencion: 0,
        montoRetencion: Number(formData.montoRetencion),
        codigoPresupuesto: presupuestoSeleccionado.codigoPresupuesto,
        baseImponible: 0
      }

      const response = await updateRetencion(payload)
      console.log('response', response)
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({
        queryKey: ['retencionesTable']
      })
      clearForm()
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const handleDeleteOrden = async () => {
    try {
      const payload: IDeleteRetencionOp = {
        codigoRetencionOp: retencionSeleccionado?.codigoRetencionOp ?? 0,
      }

      const response = await deleteRetencion(payload)
      console.log('response', response)
    } catch (error) {
      console.log(error)
    } finally {
      qc.invalidateQueries({
        queryKey: ['retencionesTable']
      })
      dispatch(setIsOpenDialogConfirmButtons(false))
    }
  }

  const clearForm = async (): Promise<void> => {
    setValue('tipoRetencion', '')
    setValue('conceptoPago', '')
    setValue('montoRetencion', '')
    setValue('montoRetenido', '')
    dispatch(setRetencionSeleccionado(null))
  }

  useEffect(() => {
    if (retencionSeleccionado) {
      setValue('tipoRetencion', retencionSeleccionado.tipoRetencionId)
      setValue('conceptoPago', retencionSeleccionado.conceptoPago)
      setValue('montoRetencion', retencionSeleccionado.montoRetencion)
      setValue('montoRetenido', retencionSeleccionado.montoRetenido)
    }
  }, [retencionSeleccionado, setValue])

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='tipoRetencion'
              control={control}
              render={({ field: { value, onChange} }) => (
                <TextField
                  fullWidth
                  label='Tipo Retención'
                  value={value}
                  onChange={onChange}
                  variant='outlined'
                  size='small'
                  error={!!errors.tipoRetencion}
                  helperText={errors.tipoRetencion?.message as string | undefined}
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
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
                  size='small'
                  error={!!errors.conceptoPago}
                  helperText={errors.conceptoPago?.message as string | undefined}
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
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
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
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
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Box> {message && (<FormHelperText sx={{ color: 'error.main', fontSize: 16 }}>{message}</FormHelperText>)}</Box>
          </Grid>
          <CustomButtonDialog
            saveButtonConfig={{
              label: 'Guardar',
              onClick: handleCreateOrden,
              show: true,
              confirm: true
            }}
            updateButtonConfig={{
              label: 'Modificar',
              onClick: handleUpdateOrden,
              show: true,
              confirm: true
            }}
            deleteButtonConfig={{
              label: 'Eliminar',
              onClick: handleDeleteOrden,
              show: true,
              confirm: true
            }}
            clearButtonConfig={{
              label: 'Limpiar',
              onClick: clearForm,
              show: true
            }}
            loading={loading}
          />
        </Grid>
      </form>
    </Box>
  )
}

export default FormCreateRetenciones