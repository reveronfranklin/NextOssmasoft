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


import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'

// ** Third Party Imports
import { ReactDatePickerProps } from 'react-datepicker'

import FormRhConceptosCreateAsync from '../forms/FormRhConceptosCreateAsync'
import FormRhConceptosUpdateAsync from '../forms/FormRhConceptosUpdateAsync'
import { setRhConceptosSeleccionado, setVerRhConceptosActive } from 'src/store/apps/rh-conceptos'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhConceptosInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();

  //const {operacionCrudRhAdministrativas,verRhAdministrativasActive} = useSelector((state: RootState) => state.rhAdministrativos)

  const {operacionCrudRhConceptos,verRhConceptosActive} = useSelector((state: RootState) => state.rhConceptos)
  const handleSetShow= (active:boolean)=>{

    if(active==false){


      const defaultValues = {


        codigo :'',
        codigoTipoNomina:0,
        denominacion:'',
        descripcion :'',
        tipoConcepto:'',
        moduloId :0,
        codigoPuc:0,
        status :'',
        frecuenciaId :0,
        dedusible :0,
        automatico :0


      }
      dispatch(setRhConceptosSeleccionado(defaultValues));

    }
    dispatch(setVerRhConceptosActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verRhConceptosActive}
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
              { operacionCrudRhConceptos===1
              ?  <FormRhConceptosCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhConceptosUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogRhConceptosInfo
