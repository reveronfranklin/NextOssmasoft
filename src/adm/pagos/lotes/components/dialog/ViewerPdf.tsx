import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material"
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'src/@core/components/icon'
import IconButton from '@mui/material/IconButton'
import { RootState } from 'src/store';
import { setIsOpenViewerPdf } from 'src/store/apps/pagos/lote-pagos/index';
import FormViewerPdf from '../viewer/FormViewerPdf'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})


const ViewerPdf = () => {
  const dispatch = useDispatch()
  const { isOpenViewerPdf } = useSelector((state: RootState) => state.admLotePagos )

  const handleClose = () => {
    dispatch(setIsOpenViewerPdf(false))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        maxWidth={'xl'}
        scroll='body'
        open={isOpenViewerPdf}
        TransitionComponent={Transition}
        onClose={() => handleClose()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            height: '95vh',
            margin: 0,
            borderRadius: 0,
            padding: 0,
          },
        }}
      >
        <Grid>
          <Box position="static" sx={{ boxShadow: 'none' }}>
            <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Reportes
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
            <FormViewerPdf />
          </DialogContent>
        </Grid>
      </Dialog>
    </Card>
  )
}

export default ViewerPdf