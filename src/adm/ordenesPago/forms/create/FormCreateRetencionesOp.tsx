import React from 'react'
import { Box, Button, Grid, TextField } from "@mui/material"
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
  setIsOpenDialogListRetenciones,
  setTipoRetencion
} from "src/store/apps/ordenPago"

import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateRetencionOp } from '../../interfaces/retencionesOp/createRetencionOp'
import { IUpdateRetencionOp } from '../../interfaces/retencionesOp/updateRetencionOp'
import { IDeleteRetencionOp } from '../../interfaces/retencionesOp/deleteRetencionOp'

import TipoRetencion from 'src/adm/ordenesPago/components/AutoComplete/TipoRetencion'
import AlertMessage from 'src/views/components/alerts/AlertMessage'

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

  const { codigoOrdenPago, retencionOpSeleccionado, isOpenDialogConfirmButtons, retencionSeleccionado, tipoRetencion } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, presupuestoSeleccionado, createRetencionOp, updateRetencionOp, deleteRetencionOp } = useServicesRetencionesOp()

  const { control, setValue, getValues, formState: { isValid } } = useForm<any>({
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

  const clearForm = async (): Promise<void> => {
    setValue('tipoRetencion', '')
    setValue('conceptoPago', '')
    setValue('montoRetencion', '')
    setValue('montoRetenido', '')
    setValue('descripcionTipoRetencion', '')
    setValue('numeroComprobante', '')

    dispatch(setTipoRetencion(0))
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
    if (retencionSeleccionado) {
      setValue('conceptoPago', retencionSeleccionado?.descripcionTipoRetencion ?? '')
      setValue('codigoRetencion', retencionSeleccionado?.codigoRetencion ?? 0)
    }
  }, [retencionSeleccionado, setValue])

  const handleTipoRetencion = (tipoRetencionId: any) => {
    setValue('tipoRetencion', tipoRetencionId)
    dispatch(setTipoRetencion(tipoRetencionId))
  }

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid container item sm={12} xs={12} sx={{ padding: 2 }}>
            <TipoRetencion
              id={retencionOpSeleccionado?.tipoRetencionId || 0}
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
                />
              )}
            />
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
                  label='Monto Retenido'
                  variant='outlined'
                  size='small'
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