import { Ref, forwardRef, ReactElement} from 'react'
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ComunicacionResponse } from '../../../interfaces'
import { setProveedorSeleccionado, setVerProveedorActive } from 'src/store/apps/proveedor-comunicacion';
import FormComunicacionCreateAsync from '../forms/FormComunicacionCreateAsync'
import FormComunicacionUpdateAsync from '../forms/FormComunicaionUpdateAsync'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogComunicacionInfo = ()  => {
  const dispatch = useDispatch();
  const {proveedorSeleccionado} = useSelector((state: RootState) => state.proveedor)
  const {verProveedorActive,operacionCrudProveedor} = useSelector((state: RootState) => state.admProveedor)

  const handleSetShow= (active:boolean)=>{
    if(active==false){
      const defaultValues:ComunicacionResponse = {
        codigoComProveedor :0,
        codigoProveedor :proveedorSeleccionado.codigoProveedor,
        tipoComunicacionId :1115,
        codigoArea :'',
        lineaComunicacion :'',
        extension :0,
        principal:false
      }

      dispatch(setProveedorSeleccionado(defaultValues));
    }

    dispatch(setVerProveedorActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verProveedorActive}
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
            { operacionCrudProveedor===1
            ?  <FormComunicacionCreateAsync/>
              :<FormComunicacionUpdateAsync/>
            }
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

export default DialogComunicacionInfo
