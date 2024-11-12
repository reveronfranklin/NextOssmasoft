import { Box, Grid, TextField, FormControl, Button, FormHelperText, Dialog, DialogTitle, DialogContentText, DialogContent, DialogActions, CircularProgress,
  Checkbox, FormControlLabel
} from "@mui/material"
import { Controller, useForm } from "react-hook-form"

const FormCreateRetenciones = (props: any) => {
  const defaultValues: any = {
    conFactura: true,
    tipoRetencion: '',
    conceptoPago: '',
    montoRetencion: '',
    montoRetenido: ''
  }

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isValid }
  } = useForm<any>({ defaultValues, mode: 'onChange' })

  return (
    <Box>
      <form>
        <Grid container spacing={0} paddingTop={1} justifyContent="flex">
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
        </Grid>
        <Button
          variant='contained'
          color='primary'
          size='small'
          onClick={() => {}}
        >
          { false ? (
            <>
              <CircularProgress
                sx={{
                  color: 'common.white',
                  width: '20px !important',
                  height: '20px !important',
                  mr: theme => theme.spacing(2)
                }}
              />
              Espere un momento...
            </>
          ) : 'Guardar'}
        </Button>
      </form>
    </Box>
  )
}

export default FormCreateRetenciones