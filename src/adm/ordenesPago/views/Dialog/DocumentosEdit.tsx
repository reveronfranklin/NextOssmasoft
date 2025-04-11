import { Ref, forwardRef, ReactElement } from 'react'
import Fade, { FadeProps } from '@mui/material/Fade'
import { Card, Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material"
import IconButton from '@mui/material/IconButton'
import { useSelector } from 'react-redux'
import { RootState } from 'src/store'
import Icon from 'src/@core/components/icon'
import { useDispatch } from "react-redux"
import { setIsOpenDialogDocumentosEdit } from "src/store/apps/ordenPago"
import FormCreateDocumentosOp from '../../forms/create/FormCreateDocumentos'
import DialogImpuestoDocumentosEdit from './ImpuestoDocumentosOp'

import Component from '../../components/Datagrid/listImpuestoDocumentoOp'

const Transition = forwardRef(function Transition(
    props: FadeProps & { children?: ReactElement<any, any> },
    ref: Ref<unknown>
) {
    return <Fade ref={ref} {...props} />
})

const DialogDocumentosEdit = () => {
  const dispatch = useDispatch()
  const { isOpenDialogDocumentosEdit, typeOperationDocumento } = useSelector((state: RootState) => state.admOrdenPago)

  const handleClose = () => {
    dispatch(setIsOpenDialogDocumentosEdit(false))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        maxWidth={'lg'}
        scroll='body'
        open={isOpenDialogDocumentosEdit}
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
                Documentos ({typeOperationDocumento === 'update' ? 'Editar' : 'Crear'})
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
            <FormCreateDocumentosOp />
            <DialogImpuestoDocumentosEdit />
            <Component />
          </DialogContent>
        </Grid>
      </Dialog>
    </Card>
  )
}

export default DialogDocumentosEdit