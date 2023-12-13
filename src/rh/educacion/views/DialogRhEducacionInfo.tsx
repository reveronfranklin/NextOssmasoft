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

import { IFechaDto } from '../../../interfaces/fecha-dto';
import FormRhEducacionCreateAsync from '../forms/FormRhEducacionCreateAsync'
import FormRhEducacionUpdateAsync from '../forms/FormRhEducacionUpdateAsync'
import { IRhEducacionResponseDto } from 'src/interfaces/rh/RhEducacionResponseDto'
import { setRhEducacionSeleccionado, setVerRhEducacionActive } from 'src/store/apps/rh-educacion'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhEducacionInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();

  const {operacionCrudRhEducacion,verRhEducacionActive} = useSelector((state: RootState) => state.rhEducacion)
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)


  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + currentMonth.toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}

  const defaultDateString = fechaActual.toISOString();
  const handleSetShow= (active:boolean)=>{

    if(active==false){


      const defaultValues:IRhEducacionResponseDto = {

        codigoEducacion :0,
        codigoPersona :personaSeleccionado.codigoPersona,
        nivelId:0,
        descripcionNivel:'',
        nombreInstituto :'',
        localidadInstituto :'',
        profesionID:0,
        fechaIni :fechaActual,
        fechaIniString :defaultDateString,
        fechaFin :fechaActual,
        fechaFinString :defaultDateString,
        fechaIniObj:defaultDate,
        fechaFinObj:defaultDate,
        ultimoAñoAprobado:0,
        graduado :'',
        tituloId :0,
        mencionEspecialidadId:0


      }
      dispatch(setRhEducacionSeleccionado(defaultValues));

    }
    dispatch(setVerRhEducacionActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verRhEducacionActive}
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
              { operacionCrudRhEducacion===1
              ?  <FormRhEducacionCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhEducacionUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogRhEducacionInfo
