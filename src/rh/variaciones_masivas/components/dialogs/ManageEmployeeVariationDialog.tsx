import { Ref, forwardRef, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Grid, Toolbar, Typography, Box } from "@mui/material";
import Fade, { FadeProps } from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import { RootState } from 'src/store';
import { getShortName } from '../../../../utilities/employees/shortName';
import { formatCedula } from '../../../../utilities/employees/formatId';
import { setIsOpenManageEmployeeVariationDialog } from 'src/store/apps/rh-variaciones_masivas';
import VariacionManager from 'src/rh/variacion/views/VariacionManager';

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const ManageEmployeeVariationDialog = () => {
  const dispatch = useDispatch()

  const { isOpenManageEmployeeVariationDialog, selectedEmployee } = useSelector((state: RootState) => state.rhVariacionesMasivas )

  const handleClose = () => {
    dispatch(setIsOpenManageEmployeeVariationDialog(false))
  }

  return (
    <Dialog
      fullWidth
      maxWidth='lg'
      scroll='body'
      open={isOpenManageEmployeeVariationDialog}
      TransitionComponent={Transition}
      onClose={() => handleClose()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      disableEnforceFocus
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          height: '90vh',
          margin: 0,
          borderRadius: 0,
          padding: 0
        }
      }}
    >
      <Grid>
        <Box position="static" sx={{ boxShadow: 'none' }}>
          <Toolbar sx={{ justifyContent: 'space-between', padding: 0 }}>
            <Box sx={{ width: '100%', textAlign: 'center', py: 2 }}>
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center', mt: 3 }}>
                Gestionar Variaciones
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                Empleado: {getShortName(selectedEmployee?.nombre, selectedEmployee?.apellido)}
                {" • "}
                {formatCedula(selectedEmployee?.nacionalidad, selectedEmployee?.cedula)}
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
               { `${ selectedEmployee?.descripcionCargo ?? '' }` }
              </Typography>
            </Box>
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
          <Box sx={{ p: 5 }} >
            <VariacionManager></VariacionManager>
          </Box>
        </DialogContent>
      </Grid>
    </Dialog>
  )
}

export default ManageEmployeeVariationDialog;