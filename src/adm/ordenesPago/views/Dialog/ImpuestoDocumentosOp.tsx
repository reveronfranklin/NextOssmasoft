import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material"
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import Icon from 'src/@core/components/icon'
import { useDispatch } from "react-redux"
import { setIsOpenDialogImpuestoDocumentosEdit } from "src/store/apps/ordenPago"
import FormImpuestoDocumentosOp from '../../forms/create/FormImpuestoDocumentosOp'
import Component from '../../components/Datagrid/listImpuestoDocumentoOp'

import DialogListRetenciones from '../../views/Dialog/ListRetenciones'

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogImpuestoDocumentosEdit = () => {
  const dispatch = useDispatch()
  const { isOpenDialogImpuestoDocumentosEdit } = useSelector((state: RootState) => state.admOrdenPago)

  const handleClose = () => {
    dispatch(setIsOpenDialogImpuestoDocumentosEdit(false))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        maxWidth={'lg'}
        scroll='body'
        open={isOpenDialogImpuestoDocumentosEdit}
        TransitionComponent={Transition}
        onClose={() => handleClose()}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{
          '& .MuiDialog-paper': {
            width: '100%',
            height: '90vh',
            margin: 0,
            borderRadius: 0,
            padding: 10,
          },
        }}
      >
        <Grid>
          <Box position="static" sx={{ boxShadow: 'none' }}>
            <Toolbar sx={{
              justifyContent: 'space-between',
              padding: 0,
            }}
            >
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>
                Editar Impuestos Documentos
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
            <>
              <FormImpuestoDocumentosOp />
              <DialogListRetenciones />
              <Component />
            </>
          </DialogContent>
        </Grid>
      </Dialog>
    </Card>
  )
}

export default DialogImpuestoDocumentosEdit