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
import FormRhPersonaUpdateAsync from '../forms/FormRhPersonaUpdateAsync'
import FormRhPersonaCreateAsync from '../forms/FormRhPersonaCreateAsync'
import { setPersonasDtoSeleccionado, setVerRhPersonasActive } from 'src/store/apps/rh'
import { IPersonaDto } from 'src/interfaces/rh/i-rh-persona-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhPersonasInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();


  const {operacionCrudRhPersonas,verRhPersonasActive,personaSeleccionado} = useSelector((state: RootState) => state.nomina)



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

      const defaultValues:IPersonaDto = {

        codigoPersona :personaSeleccionado.codigoPersona,
        cedula:0,
        nombre:'',
        apellido:'',
        nombreCompleto:'',
        nacionalidad:'',
        sexo:'',
        edad:0,
        paisNacimientoId:0,
        estadoNacimientoId:0,
        numeroGacetaNacional:'',
        estadoCivilId:0,
        descripcionEstadoCivil:'',
        estatura:0,
        peso:0,
        manoHabil:'',
        extra1:'',
        extra2:'',
        extra3:'',
        status:'',
        descripcionStatus:'',
        identificacionId:0,
        numeroIdentificacion:0,
        fechaNacimiento:fechaActual,
        fechaNacimientoString:defaultDateString,
        fechaNacimientoObj:defaultDate,
        codigoCargo:0,
        descripcionCargo:'',
        codigoIcp:0,
        descripcionIcp:'',
        avatar:'',
        sueldo:0,
        fechaGacetaNacional:defaultDateString,
        fechaGacetaNacionalObj:defaultDate
      }




      dispatch(setPersonasDtoSeleccionado(defaultValues));

    }
    dispatch(setVerRhPersonasActive(active))


  }









    return (
      <Card>

        <Dialog
          fullWidth
          open={verRhPersonasActive}
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
              { operacionCrudRhPersonas===1
              ?  <FormRhPersonaCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhPersonaUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogRhPersonasInfo
