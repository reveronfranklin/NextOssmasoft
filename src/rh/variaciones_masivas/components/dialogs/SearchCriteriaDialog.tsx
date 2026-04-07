import { Ref, forwardRef, ReactElement } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, DialogContent, Grid, Toolbar, Typography, Box, Button } from "@mui/material";
import Fade, { FadeProps } from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';
import { RootState } from 'src/store';
import { setIsOpenSearchCriteriaDialog, setSearchCustomText } from 'src/store/apps/rh-variaciones_masivas';

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const SearchCriteriaDialog = () => {
  const dispatch = useDispatch()
  const { isOpenSearchCriteriaDialog } = useSelector((state: RootState) => state.rhVariacionesMasivas )

  const handleClose = () => {
    dispatch(setIsOpenSearchCriteriaDialog(false))
  }

  const handleSearch = () => {
    dispatch(setSearchCustomText('SUELDO > 400'))
    dispatch(setIsOpenSearchCriteriaDialog(false))
  }

  return (
    <Dialog
      fullWidth
      maxWidth='md'
      scroll='body'
      open={isOpenSearchCriteriaDialog}
      TransitionComponent={Transition}
      onClose={() => handleClose()}
      aria-labelledby='modal-modal-title'
      aria-describedby='modal-modal-description'
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          height: '50vh',
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
              Criterio de búsqueda
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
           <Button
              variant='contained'
              color='primary'
              size='small'
              onClick={handleSearch}
            >
              { 'Aceptar' }
            </Button>
          {/* Aquí puedes agregar el contenido de tu diálogo */}
        </DialogContent>
      </Grid>
    </Dialog>
  )
}

export default SearchCriteriaDialog;