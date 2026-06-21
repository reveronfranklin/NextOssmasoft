import { forwardRef, ReactElement, Ref } from 'react'
import { Box, Card, Dialog, DialogContent, Fade, FadeProps, Grid, IconButton, Toolbar, Typography } from '@mui/material'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'
import { setIsOpenViewerReportePersonal } from 'src/store/apps/rh-tipoNomina'
import FormReportePersonalViewer from '../forms/FormReportePersonalViewer'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogReportePersonalTipoNomina = () => {
  const dispatch = useDispatch()
  const { isOpenViewerReportePersonal, rhTipoNominaReporteSeleccionado } = useSelector(
    (state: RootState) => state.rhTipoNomina
  )

  const handleClose = () => {
    dispatch(setIsOpenViewerReportePersonal(false))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        maxWidth='xl'
        scroll='body'
        open={isOpenViewerReportePersonal}
        TransitionComponent={Transition}
        onClose={() => handleClose()}
        aria-labelledby='reporte-personal-tipo-nomina-title'
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            height: '95vh',
            margin: 0,
            borderRadius: 0,
            padding: 0
          }
        }}
      >
        <Grid>
          <Box position='static' sx={{ boxShadow: 'none' }}>
            <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
              <Typography id='reporte-personal-tipo-nomina-title' variant='h6' sx={{ flexGrow: 1, textAlign: 'center' }}>
                Reporte de Personal
                {rhTipoNominaReporteSeleccionado?.descripcion
                  ? ` - ${rhTipoNominaReporteSeleccionado.descripcion}`
                  : ''}
              </Typography>
              <IconButton
                size='small'
                onClick={() => handleClose()}
                sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
              >
                <Icon icon='mdi:close' />
              </IconButton>
            </Toolbar>
          </Box>
          <DialogContent>
            <FormReportePersonalViewer />
          </DialogContent>
        </Grid>
      </Dialog>
    </Card>
  )
}

export default DialogReportePersonalTipoNomina
