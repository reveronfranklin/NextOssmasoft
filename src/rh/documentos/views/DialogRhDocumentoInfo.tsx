import { ReactElement, Ref, forwardRef } from 'react'
import { Button, Card, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material'
import Fade, { FadeProps } from '@mui/material/Fade'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { RootState } from 'src/store'
import { defaultRhDocumento, setRhDocumentoSeleccionado, setVerRhDocumentoActive } from 'src/store/apps/rh-documentos'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import FormRhDocumentoCreateAsync from '../forms/FormRhDocumentoCreateAsync'
import FormRhDocumentoUpdateAsync from '../forms/FormRhDocumentoUpdateAsync'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogRhDocumentoInfo = () => {
  const dispatch = useDispatch()
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)
  const { verRhDocumentoActive, operacionCrudRhDocumento } = useSelector((state: RootState) => state.rhDocumento)

  const handleSetShow = (active: boolean) => {
    if (!active) {
      dispatch(setRhDocumentoSeleccionado({ ...defaultRhDocumento, codigoPersona: personaSeleccionado.codigoPersona }))
    }

    dispatch(setVerRhDocumentoActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verRhDocumentoActive}
        maxWidth='md'
        scroll='body'
        onClose={() => handleSetShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => handleSetShow(false)}
      >
        <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => handleSetShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <DatePickerWrapper>
            {operacionCrudRhDocumento === 1 ? <FormRhDocumentoCreateAsync /> : <FormRhDocumentoUpdateAsync />}
          </DatePickerWrapper>
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={() => handleSetShow(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogRhDocumentoInfo
