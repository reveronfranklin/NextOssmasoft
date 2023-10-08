// ** React Imports
import { Ref, forwardRef, ReactElement} from 'react'

// ** MUI Imports

import Card from '@mui/material/Card'

import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'


import IconButton from '@mui/material/IconButton'

//import CardContent from '@mui/material/CardContent'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'


import { RootState } from 'src/store'
import { useSelector } from 'react-redux'



// ** Third Party Imports
//import { ReactDatePickerProps } from 'react-datepicker'


// ** Third Party Imports


import QRCode from "react-qr-code";
import { setBm1Seleccionado, setVerBmBm1ActiveActive } from 'src/store/apps/bm'
import { Typography } from '@mui/material'

// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogBm1Info = ()  => {


  // ** States
  const dispatch = useDispatch();
  const {verBmBm1Active,bmBm1Seleccionado} = useSelector((state: RootState) => state.bmBm1)


  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues ={}
      dispatch(setBm1Seleccionado(defaultValues));

    }
    dispatch(setVerBmBm1ActiveActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verBmBm1Active}
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
            { bmBm1Seleccionado.numeroPlaca
              ?
               <>
                <QRCode
                  size={256}
                  style={{ height: "auto", maxWidth: "80%", width: "80%" }}
                  value={bmBm1Seleccionado.numeroPlaca + '-' + bmBm1Seleccionado.articulo + '-' + bmBm1Seleccionado.unidadTrabajo}
                  viewBox={`0 0 128 128`}
                  />
                  <Typography variant='body2' sx={{ color: 'text.primary' }}>
                  {bmBm1Seleccionado.numeroPlaca} - {bmBm1Seleccionado.articulo}- {bmBm1Seleccionado.unidadTrabajo}
                     </Typography>
               </>


                :   <Typography variant='body2' sx={{ color: 'text.primary' }}>
                      No Data
                     </Typography>
              }



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

export default DialogBm1Info
