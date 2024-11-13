import { Box, Grid, TextField } from "@mui/material"
import { useServicesRetenciones } from '../../services/index'
import { Controller, useForm } from "react-hook-form"
import { RootState } from "src/store"
import { useSelector } from "react-redux"
import { useEffect } from "react"
import CustomButtonDialog from 'src/adm/ordenesPago/components/BottonsActions'

const FormCreateRetenciones = () => {
  const { retencionSeleccionado } = useSelector((state: RootState) => state.admOrdenPago)
  const { message, loading, createRetencion, updateRetencion, deleteRetencion } = useServicesRetenciones()

  const defaultValues: any = {
    tipoRetencion: retencionSeleccionado?.tipoRetencionId || '',
    conceptoPago: retencionSeleccionado?.conceptoPago || '',
    montoRetencion: retencionSeleccionado?.montoRetencion || '',
    montoRetenido: retencionSeleccionado?.montoRetenido || ''
  }

  const { control, handleSubmit, setValue, formState: { errors, isValid } } = useForm<any>({ defaultValues, mode: 'onChange' })

  const onSubmit = async (data: any) => {
    console.log(data)
  }

  useEffect(() => {
    if (retencionSeleccionado) {
      setValue('tipoRetencion', retencionSeleccionado.tipoRetencionId)
      setValue('conceptoPago', retencionSeleccionado.conceptoPago)
      setValue('montoRetencion', retencionSeleccionado.montoRetencion)
      setValue('montoRetenido', retencionSeleccionado.montoRetenido)
    }
  }, [retencionSeleccionado])

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={0} justifyContent="flex">
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='tipoRetencion'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Tipo Retención'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='conceptoPago'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Concepto Pago'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='montoRetencion'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Monto Retención'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              )}
            />
          </Grid>
          <Grid container sm={6} xs={12} sx={{ padding: 2 }}>
            <Controller
              name='montoRetenido'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label='Monto Retenido'
                  variant='outlined'
                  size='small'
                  fullWidth
                />
              )}
            />
          </Grid>
          <CustomButtonDialog
            saveButtonConfig={{
              label: 'Crear',
              onClick: createRetencion,
              show: true,
              variant: 'outlined',
              color: 'success',
            }}
            updateButtonConfig={{
              label: 'Actualizar',
              onClick: updateRetencion,
              show: true
            }}
            deleteButtonConfig={{
              label: 'Eliminar',
              onClick: deleteRetencion,
              show: true
            }}
            clearButtonConfig={{
              label: 'Limpiar',
              onClick: deleteRetencion,
              show: true
            }}
            handleSubmit
            onSubmit
          />
        </Grid>
      </form>
    </Box>
  )
}

export default FormCreateRetenciones