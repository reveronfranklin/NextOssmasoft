import React from 'react';
import { Box, Grid, TextField } from "@mui/material"
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector, useDispatch } from "react-redux"
import { useEffect } from "react"
import { useQueryClient, QueryClient } from '@tanstack/react-query'
import { useServicesRetenciones } from '../../services/index'
import { setIsOpenDialogConfirmButtons, setRetencionSeleccionado } from "src/store/apps/ordenPago"
import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

import { ICreateRetencion } from '../../interfaces/retenciones/createRetencion'
import { IUpdateRetencion } from '../../interfaces/retenciones/updateRetencion'
import { IDeleteRetencion } from '../../interfaces/retenciones/deleteRetencion'

import TipoRetencion from 'src/adm/ordenesPago/components/AutoComplete/TipoRetencion'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import DatePicker from 'react-datepicker'
import { getDateByObject } from 'src/utilities/ge-date-by-object'
import CustomInput from 'src/views/forms/form-elements/pickers/PickersCustomInput'
import dayjs from 'dayjs'
import { fechaToFechaObj } from 'src/utilities/fecha-to-fecha-object'
import AlertMessage from 'src/views/components/alerts/AlertMessage'

const FormCreateRetenciones = () => {
  const dispatch = useDispatch()
  const qc: QueryClient = useQueryClient()

  const { isOpenDialogConfirmButtons, retencionSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, createRetencion, updateRetencion, deleteRetencion } = useServicesRetenciones()

  const { control, setValue, getValues, formState: { isValid } } = useForm<any>({
    defaultValues: {
      codigoRetencion: 0,
      codigo: 0,
      conceptoPago: '',
      tipoPersonaId: 0,
      baseImponible: 0,
      porRetencion: 0,
      montoRetencion: 0,
      fechaIni: null,
      fechaFin: null
    },
    mode: 'onChange',
  })

  const invalidateAndReset = (nameTable: string) => {
    if (nameTable && nameTable !== null) {
      qc.invalidateQueries({
        queryKey: [nameTable]
      })
    }
    clearForm()
    dispatch(setIsOpenDialogConfirmButtons(false))
  }

  const handleCreateOrden = async (): Promise<void> => {
    try {
      const data: ICreateRetencion = {
        codigoRetencion: 0,
        tipoRetencionId: getValues('tipoRetencion'),
        conceptoPago: getValues('conceptoPago'),
        codigo: getValues('codigo'),
        baseImponible: getValues('baseImponible'),
        porRetencion: getValues('porRetencion'),
        montoRetencion: getValues('montoRetencion'),
        fechaIni: getValues('fechaIni') || null,
        fechaFin: getValues('fechaFin') || null
      }

      const result = await createRetencion(data)

      if (result.isValid) {
        dispatch(setRetencionSeleccionado(result.data))
      }
    } catch (error) {
      console.error(error)
    } finally {
      invalidateAndReset('retencionesTable')
    }
  }

  const handleUpdateOrden = async (): Promise<void> => {
    try {
      const data: IUpdateRetencion = {
        codigoRetencion: getValues('codigoRetencion'),
        tipoRetencionId: getValues('tipoRetencion'),
        conceptoPago: getValues('conceptoPago'),
        codigo: getValues('codigo'),
        baseImponible: getValues('baseImponible'),
        porRetencion: getValues('porRetencion'),
        montoRetencion: getValues('montoRetencion'),
        fechaIni: getValues('fechaIni') || null,
        fechaFin: getValues('fechaFin') || null
      }

      const result = await updateRetencion(data)

      if (result.isValid) {
        dispatch(setRetencionSeleccionado(result.data))
      }
    } catch (error) {
      console.error(error)
    } finally {
      invalidateAndReset('retencionesTable')
    }
  }

  const handleDeleteOrden = async (): Promise<void> => {
    try {
      const data: IDeleteRetencion = {
        codigoRetencion: getValues('codigoRetencion')
      }

      const result = await deleteRetencion(data)
      if (result.isValid) {
        dispatch(setRetencionSeleccionado({} as any))
      }
    } catch (error) {
      console.error(error)
    } finally {
      invalidateAndReset('retencionesTable')
    }
  }

  const clearForm = async (): Promise<void> => {
    setValue('codigoRetencion', '')
    setValue('codigo', '')
    setValue('conceptoPago', '')
    setValue('tipoPersonaId', '')
    setValue('baseImponible', '')
    setValue('porRetencion', '')
    setValue('montoRetencion', '')
    setValue('fechaIni', '')
    setValue('fechaFin', '')
  }

  const handleFechaIniChange = (date: Date) => {
    if (dayjs(date).isValid()) {
      const fechaObj: any = fechaToFechaObj(date)

      const retencionFechaIni = {
        ...retencionSeleccionado,
        fechaIni: dayjs(date).format('YYYY-MM-DDTHH:mm:ss'),
        fechaIniString: dayjs(date).format('DD/MM/YYYY'),
        fechaIniObject: fechaObj
      }

      dispatch(setRetencionSeleccionado(retencionFechaIni))
      setValue('fechaIni', dayjs(date).format('YYYY-MM-DDTHH:mm:ss'))
    }
  }

  const handleFechaFinChange = (date: Date) => {
    if (dayjs(date).isValid()) {
      const fechaObj: any = fechaToFechaObj(date)

      const retencionFechaFin = {
        ...retencionSeleccionado,
        fechaFin: dayjs(date).format('YYYY-MM-DDTHH:mm:ss'),
        fechaFinString: dayjs(date).format('DD/MM/YYYY'),
        fechaFinObject: fechaObj
      }

      dispatch(setRetencionSeleccionado(retencionFechaFin))
      setValue('fechaFin', dayjs(date).format('YYYY-MM-DD HH:mm:ss'))
    }
  }

  useEffect(() => {
    if (retencionSeleccionado && Object.keys(retencionSeleccionado).length > 0) {
      setValue('codigoRetencion', retencionSeleccionado.codigoRetencion)
      setValue('tipoRetencionId', retencionSeleccionado.tipoRetencionId)
      setValue('conceptoPago', retencionSeleccionado.conceptoPago)
      setValue('codigo', retencionSeleccionado.codigo)
      setValue('baseImponible', retencionSeleccionado.baseImponible)
      setValue('porRetencion', retencionSeleccionado.porRetencion)
      setValue('montoRetencion', retencionSeleccionado.montoRetencion)
      setValue('fechaIni', retencionSeleccionado.fechaIni)
      setValue('fechaFin', retencionSeleccionado.fechaFin)
    }
  }, [retencionSeleccionado])

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid item sm={2} xs={12} sx={{ padding: 2 }}>
            <Controller
              name="codigoRetencion"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Codigo'
                  variant='outlined'
                  disabled
                />
              )}
            />
          </Grid>

          <Grid item sm={8} xs={12} sx={{ padding: 2 }}>
            <TipoRetencion
              id={retencionSeleccionado?.tipoRetencionId || 0}
              onSelectionChange={(value: any) => setValue('tipoRetencionId', value.id)}
            />
          </Grid>

          <Grid item sm={2} xs={12} sx={{ padding: 2 }}>
            <Controller
              name="codigo"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='codigo'
                  variant='outlined'
                />
              )}
            />
          </Grid>
          <Grid item sm={3} xs={12} sx={{ padding: 2 }}>
            <DatePickerWrapper sx={{ width: '100%' }}>
              <DatePicker
                selected={retencionSeleccionado?.fechaIniObject ? getDateByObject(retencionSeleccionado.fechaIniObject) : null}
                id='fechaIni'
                dateFormat='dd/MM/yyyy'
                onChange={(date: Date) => { handleFechaIniChange(date) }}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='fecha Hasta' />}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item sm={3} xs={12} sx={{ padding: 2 }}>
            <DatePickerWrapper sx={{ width: '100%' }}>
              <DatePicker
                selected={retencionSeleccionado?.fechaFinObject ? getDateByObject(retencionSeleccionado.fechaFinObject) : null}
                id='fechaFin'
                dateFormat='dd/MM/yyyy'
                onChange={(date: Date) => { handleFechaFinChange(date) }}
                placeholderText='Click to select a date'
                customInput={<CustomInput label='Fecha hasta' />}
              />
            </DatePickerWrapper>
          </Grid>

          <Grid item sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name="conceptoPago"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Concepto Pago'
                  variant='outlined'
                />
              )}
            />
          </Grid>

          <Grid item sm={4} xs={12} sx={{ padding: 2 }}>
            <Controller
              name="baseImponible"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Base Imponible'
                  variant='outlined'
                  size='small'
                />
              )}
            />
          </Grid>

          <Grid item sm={4} xs={12} sx={{ padding: 2 }}>
            <Controller
              name="porRetencion"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Por Retencion'
                  variant='outlined'
                  size='small'
                />
              )}
            />
          </Grid>

          <Grid item sm={4} xs={12} sx={{ padding: 2 }}>
            <Controller
              name="montoRetencion"
              control={control}
              render={({ field: { value, onChange } }) => (
                <TextField
                  fullWidth
                  value={value}
                  onChange={onChange}
                  label='Monto Retencion'
                  variant='outlined'
                  size='small'
                />
              )}
            />
          </Grid>
        </Grid>
      </form>
      <Box sx={{ padding: 2 }}>
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
      </Box>
    </Box>
  )
}

export default FormCreateRetenciones