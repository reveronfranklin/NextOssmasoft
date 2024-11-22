import React from 'react';
import { Box, Button, FormHelperText, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesRetencionesOp } from '../../services/index'
import { setIsOpenDialogConfirmButtons, setRetencionSeleccionado } from "src/store/apps/ordenPago"
import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateRetencionOp } from '../../interfaces/retencionesOp/createRetencionOp'
import { IUpdateRetencionOp } from '../../interfaces/retencionesOp/updateRetencionOp'
import { IDeleteRetencionOp } from '../../interfaces/retencionesOp/deleteRetencionOp'

import TipoRetencion from 'src/adm/ordenesPago/components/AutoComplete/TipoRetencion'

interface getValuesForm {
  tipoRetencion: number
  conceptoPago: string
  montoRetencion: number
  montoRetenido: number
}

const FormCreateRetencionesOp = () => {
  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const { retencionSeleccionado, isOpenDialogConfirmButtons } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, presupuestoSeleccionado, createRetencionOp, updateRetencionOp, deleteRetencionOp } = useServicesRetencionesOp()

  const { control, setValue, getValues, formState: { errors } } = useForm<any>({
    defaultValues: {
      tipoRetencion: retencionSeleccionado?.tipoRetencionId || '',
      conceptoPago: retencionSeleccionado?.conceptoPago || '',
      montoRetencion: retencionSeleccionado?.montoRetencion || '',
      montoRetenido: retencionSeleccionado?.montoRetenido || '',
      descripcionTipoRetencion: retencionSeleccionado?.descripcionTipoRetencion || ''
    },
    mode: 'onChange',
  })

  const handleCreateOrden = async (): Promise<void> => {
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

      const response = await createRetencionOp(payload)
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

  const handleUpdateOrden = async (): Promise<void> => {
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

      const response = await updateRetencionOp(payload)
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

  const handleDeleteOrden = async (): Promise<void> => {
    try {
      const payload: IDeleteRetencionOp = {
        codigoRetencionOp: retencionSeleccionado?.codigoRetencionOp ?? 0,
      }

      const response = await deleteRetencionOp(payload)
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
    setValue('descripcionTipoRetencion', '')
    dispatch(setRetencionSeleccionado(null))
  }

  useEffect(() => {
    if (retencionSeleccionado) {
      setValue('tipoRetencion', retencionSeleccionado.tipoRetencionId)
      setValue('conceptoPago', retencionSeleccionado.conceptoPago)
      setValue('montoRetencion', retencionSeleccionado.montoRetencion)
      setValue('montoRetenido', retencionSeleccionado.montoRetenido)
      setValue('descripcionTipoRetencion', retencionSeleccionado.descripcionTipoRetencion)
    }
  }, [retencionSeleccionado, setValue])

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <TipoRetencion
              id={retencionSeleccionado?.tipoRetencionId || 0}
              onSelectionChange={(value: any) => setValue('tipoRetencion', value.id)}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2, display: 'flex', alignItems: 'center' }}>
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
                  sx={{ flexGrow: 1 }}
                />
              )}
            />
            <Button variant="contained" size="small" sx={{ marginLeft: 2, flex: '0 0 10%' }}>
              ver
            </Button>
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
                  disabled
                />
              )}
            />
          </Grid>
          <Grid container sm={12} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='numeroComprobante'
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='numero Comprobante'
                  variant='outlined'
                  size='small'
                  error={!!errors.numeroComprobante}
                  helperText={errors.numeroComprobante?.message as string | undefined}
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Box> {message && (<FormHelperText sx={{ color: 'error.main', fontSize: 16 }}>{message}</FormHelperText>)}</Box>
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
          show: !!retencionSeleccionado?.codigoRetencionOp,
          confirm: true
        }}
        deleteButtonConfig={{
          label: 'Eliminar',
          onClick: handleDeleteOrden,
          show: !!retencionSeleccionado?.codigoRetencionOp,
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
      />
    </Box>
  )
}

export default FormCreateRetencionesOp