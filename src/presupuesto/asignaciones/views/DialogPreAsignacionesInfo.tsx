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
import { IPreAsignacionesGetDto } from 'src/interfaces/Presupuesto/PreAsignaciones/PreAsignacionesGetDto'
import { setPreAsignacionesSeleccionado, setVerPreAsignacionesActive } from 'src/store/apps/pre-asignaciones'
import FormPreAsignacionesUpdateAsync from '../forms/FormPreAsignacionesUpdateAsync'
import FormPreAsignacionesCreateAsync from '../forms/FormPreAsignacionesCreateAsync'
import FormPreAsignacionesExcelCreateAsync from '../forms/FormPreAsignacionesExcelCreateAsync'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogPreAsignacionesInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();


  const {verPreAsignacionesActive,operacionCrudPreAsignaciones} = useSelector((state: RootState) => state.preAsignaciones)
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

      const defaultValues:IPreAsignacionesGetDto = {

        codigoAsignacion :0,
        codigoPresupuesto:0,
        año :0,
        escenario:0,
        codigoIcp:0,
        codigoIcpConcat:'',
        DenominacionIcp:'',
        codigoPuc:0,
        codigoPucConcat:'',
        denominacionPuc:'',
        presupuestado:0,
        ordinario:0,
        coordinado:0,
        laee:0,
        fides:0,
        total:0,
        totalDesembolso:0,
        searchText:''

      }
      console.log(defaultDateString,defaultDate)
      dispatch(setPreAsignacionesSeleccionado(defaultValues));

    }
    dispatch(setVerPreAsignacionesActive(active))


  }



    return (
      <Card>

        <Dialog
          fullWidth

          open={verPreAsignacionesActive}
          maxWidth='lg'
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
             { operacionCrudPreAsignaciones===1
              ?  <FormPreAsignacionesCreateAsync popperPlacement={popperPlacement}/>
                :<div></div>
              }
              { operacionCrudPreAsignaciones===2
              ?  <FormPreAsignacionesUpdateAsync popperPlacement={popperPlacement} />
                :<div></div>
              }
              { operacionCrudPreAsignaciones===3
              ?  <FormPreAsignacionesExcelCreateAsync popperPlacement={popperPlacement}/>
                :<div></div>
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

export default DialogPreAsignacionesInfo
