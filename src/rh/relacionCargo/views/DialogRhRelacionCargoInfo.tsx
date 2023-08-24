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

import { setRhRelacionCargoSeleccionado, setVerRhRelacionCargoActive } from 'src/store/apps/rh-relacion-cargo'
import { IRhRelacionCargoDto } from 'src/interfaces/rh/i-rh-relacion-cargo-dto'
import FormRhRelacionCargoCreateAsync from '../forms/FormRhRelacionCargoCreateAsync'
import FormRhRelacionCargoUpdateAsync from '../forms/FormRhRelacionCargoUpdateAsync'
import { ReactDatePickerProps } from 'react-datepicker'



// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhRelacionCargoInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();
  const {verRhRelacionCargoActive,operacionCrudRhRelacionCargo} = useSelector((state: RootState) => state.rhRelacionCargo)




  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues:IRhRelacionCargoDto = {
        codigoRelacionCargo:0,
        codigoCargo :0,
        denominacionCargo :'',
        codigoPersona :0,
        nombre:'',
        apellido :'',
        cedula:0,
        sueldo :0,
        codigoRelacionCargoPre :0,
        searchText:'',
        fechaIni:'',
        fechaFin:'',
        fechaIniObj:{ year:'2024',month:'08',day:'01'},
        fechaFinObj:{ year:'2024',month:'08',day:'01'},
        tipoNomina:0,
        codigoIcp:0

      }

      dispatch(setRhRelacionCargoSeleccionado(defaultValues))
    }
    dispatch(setVerRhRelacionCargoActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          maxWidth='lg'
          open={verRhRelacionCargoActive}

          scroll='body'
          onClose={() => handleSetShow(false)}
          TransitionComponent={Transition}
          onBackdropClick={() => handleSetShow(false)}

        >
          <DialogContent sx={{ pb: 8, px: { xs: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 }, position: 'relative' }} style={{height:'700px'}}>
            <IconButton
              size='small'
              onClick={() => handleSetShow(false)}
              sx={{ position: 'absolute', right: '1rem', top: '1rem' }}
            >
              <Icon icon='mdi:close' />
            </IconButton>

            <DatePickerWrapper>
              { operacionCrudRhRelacionCargo===1
              ?  <FormRhRelacionCargoCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhRelacionCargoUpdateAsync  popperPlacement={popperPlacement}/>
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

export default DialogRhRelacionCargoInfo
