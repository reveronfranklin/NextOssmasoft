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

import FormRhAdministrativoCreateAsync from '../forms/FormRhAdministrativoCreateAsync'
import FormRhAdministrativoUpdateAsync from '../forms/FormRhAdministrativoUpdateAsync'
import { IRhAdministrativosResponseDto } from 'src/interfaces/rh/i-rh-administrativos-response-dto'
import { setRhAdministrativoSeleccionado, setVerRhAdministrativasActive } from 'src/store/apps/rh-administrativos'
import { IFechaDto } from '../../../interfaces/fecha-dto';
import { monthByIndex } from 'src/utilities/ge-date-by-object'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhAdministrativosInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();

  const {operacionCrudRhAdministrativas,verRhAdministrativasActive} = useSelector((state: RootState) => state.rhAdministrativos)
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)


  const fechaActual = new Date()

  const currentYear  = new Date().getFullYear();
  const currentMonth = new Date().getMonth();
  const currentMonthString ='00' + monthByIndex(currentMonth).toString();

  const currentDay =new Date().getDate();
  const currentDayString = '00' + currentDay.toString();
  const defaultDate :IFechaDto = {year:currentYear.toString(),month:currentMonthString.slice(-2),day:currentDayString.slice(-2)}

  const defaultDateString = fechaActual.toISOString();
  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues:IRhAdministrativosResponseDto = {
        codigoAdministrativo :0,
        codigoPersona :personaSeleccionado.codigoPersona,
        fechaIngreso:defaultDateString,
        fechaIngresoObj:defaultDate,
        tipoPago :'',
        descripcionTipoPago:'',
        bancoId :0,
        descripcionBanco :'',
        tipoCuentaId :0,
        descripcionCuenta:'',
        noCuenta:'',

      }
      dispatch(setRhAdministrativoSeleccionado(defaultValues));

    }
    dispatch(setVerRhAdministrativasActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verRhAdministrativasActive}
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
              { operacionCrudRhAdministrativas===1
              ?  <FormRhAdministrativoCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhAdministrativoUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogRhAdministrativosInfo
