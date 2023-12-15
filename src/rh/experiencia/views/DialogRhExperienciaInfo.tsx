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
import { monthByIndex } from 'src/utilities/ge-date-by-object'
import FormRhExperienciaUpdateAsync from '../forms/FormRhExperienciaUpdateAsync'
import FormRhExperienciaCreateAsync from '../forms/FormRhExperienciaCreateAsync'
import { setRhExperienciaSeleccionado, setVerRhExperienciaActive } from 'src/store/apps/rh-experiencia'
import { IRhExpLaboralResponseDto } from 'src/interfaces/rh/RhExpLaboralResponseDto'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhExperienciaInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();

  const {operacionCrudRhExperiencia,verRhExperienciaActive} = useSelector((state: RootState) => state.rhExperiencia)
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


      const defaultValues:IRhExpLaboralResponseDto = {

        codigoExpLaboral:0,
        codigoPersona :personaSeleccionado.codigoPersona,
        nombreEmpresa :'',
        tipoEmpresa :'',
        ramoId :0,
        cargo:'',
        fechaDesde :fechaActual,
        fechaDesdeString :defaultDateString,
        fechaHasta :fechaActual,
        fechaHastaString :defaultDateString,
        fechaDesdeObj:defaultDate,
        fechaHastaObj:defaultDate,
        ultimoSueldo:0,
        supervisor :'',
        cargoSupervisor  :'',
        telefono: '',
        descripcion  :''


    }
      dispatch(setRhExperienciaSeleccionado(defaultValues));

    }
    dispatch(setVerRhExperienciaActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verRhExperienciaActive}
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
              { operacionCrudRhExperiencia===1
              ?  <FormRhExperienciaCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhExperienciaUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogRhExperienciaInfo
