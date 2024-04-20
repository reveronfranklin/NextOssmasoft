// ** React Imports
import { Ref, forwardRef, ReactElement } from 'react'

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
import { ReactDatePickerProps } from 'react-datepicker'
import { monthByIndex } from 'src/utilities/ge-date-by-object'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { setRhPeriodoSeleccionado, setVerRhPeriodoActive } from 'src/store/apps/rh-periodo'
import { IRhPeriodosUpdate } from 'src/interfaces/rh/Periodos/RhPeriodosUpdate'
import FormRhPeriodoCreateAsync from '../forms/FormRhPeriodoCreateAsync'
import FormRhPeriodoUpdateAsync from '../forms/FormRhPeriodoUpdateAsync'

// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogRhPeriodoInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  // ** States
  const dispatch = useDispatch()
  const { verRhPeriodoActive, operacionCrudRhPeriodo } = useSelector((state: RootState) => state.rhPeriodo)

  const { rhPeriodoSeleccionado } = useSelector((state: RootState) => state.rhPeriodo)
  const fechaActual = new Date()

  const currentYear = new Date().getFullYear()
  const currentMonth = new Date().getMonth()
  const currentMonthString = '00' + monthByIndex(currentMonth).toString()

  const currentDay = new Date().getDate()
  const currentDayString = '00' + currentDay.toString()
  const defaultDate: IFechaDto = {
    year: currentYear.toString(),
    month: currentMonthString.slice(-2),
    day: currentDayString.slice(-2)
  }

  const defaultDateString = fechaActual.toISOString()

  const handleSetShow = (active: boolean) => {
    if (active == false) {
      const defaultValues: IRhPeriodosUpdate = {
        codigoPeriodo: rhPeriodoSeleccionado.codigoPeriodo,
        descripcion: '',
        codigoTipoNomina: 0,
        fechaNomina: fechaActual,
        fechaNominaString: defaultDateString,
        fechaNominaObj: defaultDate,
        periodo: 0,
        tipoNomina: ''
      }

      dispatch(setRhPeriodoSeleccionado(defaultValues))
    }
    dispatch(setVerRhPeriodoActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verRhPeriodoActive}
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
            {operacionCrudRhPeriodo === 1 ? (
              <FormRhPeriodoCreateAsync popperPlacement={popperPlacement} />
            ) : (
              <FormRhPeriodoUpdateAsync popperPlacement={popperPlacement} />
            )}
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

export default DialogRhPeriodoInfo
