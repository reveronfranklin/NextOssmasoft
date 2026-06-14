import { ReactElement, Ref, forwardRef } from 'react'
import { Button, Card, Dialog, DialogActions, DialogContent, IconButton } from '@mui/material'
import Fade, { FadeProps } from '@mui/material/Fade'
import { useDispatch, useSelector } from 'react-redux'
import Icon from 'src/@core/components/icon'
import { RootState } from 'src/store'
import {
  defaultOssUsuarioRol,
  setOssUsuarioRolSeleccionado,
  setVerOssUsuarioRolActive
} from 'src/store/apps/oss-usuario-rol'
import FormOssUsuarioRolCreateAsync from '../forms/FormOssUsuarioRolCreateAsync'
import FormOssUsuarioRolUpdateAsync from '../forms/FormOssUsuarioRolUpdateAsync'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogOssUsuarioRolInfo = () => {
  const dispatch = useDispatch()
  const { verOssUsuarioRolActive, operacionCrudOssUsuarioRol } = useSelector((state: RootState) => state.ossUsuarioRol)

  const handleSetShow = (active: boolean) => {
    if (!active) {
      dispatch(setOssUsuarioRolSeleccionado(defaultOssUsuarioRol))
    }

    dispatch(setVerOssUsuarioRolActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verOssUsuarioRolActive}
        maxWidth='lg'
        scroll='body'
        onClose={() => handleSetShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => handleSetShow(false)}
      >
        <DialogContent sx={{ pb: 8, px: { xs: 5, sm: 10 }, pt: { xs: 8, sm: 10 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => handleSetShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          {operacionCrudOssUsuarioRol === 1 ? <FormOssUsuarioRolCreateAsync /> : <FormOssUsuarioRolUpdateAsync />}
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 10 }, justifyContent: 'center' }}>
          <Button variant='outlined' color='secondary' onClick={() => handleSetShow(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogOssUsuarioRolInfo
