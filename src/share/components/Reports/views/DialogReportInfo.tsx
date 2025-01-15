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
import { setVerReportViewActive } from 'src/store/apps/report'
import ReportViewAsync from '../forms/ReportViewAsync'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>) {
  return <Fade ref={ref} {...props} />
})

const DialogReportInfo = ()  => {
  const dispatch = useDispatch();
  const {verReportViewActive} = useSelector((state: RootState) => state.reportView)

  const handleSetShow= (active:boolean)=>{
    dispatch(setVerReportViewActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verReportViewActive}
        scroll='body'
        onClose={() => handleSetShow(false)}
        TransitionComponent={Transition}
        onBackdropClick={() => handleSetShow(false)}
        sx={{
          "& .MuiDialog-container": {
            "& .MuiPaper-root": {
              width: "90%",
              maxWidth: "90%",
            },
          },
        }}
      >
        <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }}>
          <IconButton
            size='small'
            onClick={() => handleSetShow(false)}
            sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
          >
            <Icon icon='mdi:close' />
          </IconButton>
          <ReportViewAsync
            url="your-url"
            width="your-width"
            height="your-height"
          />
        </DialogContent>
        <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'start' }}>
          <Button variant='outlined' color='secondary' onClick={() => handleSetShow(false)}>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </Card>
  )
}

export default DialogReportInfo
