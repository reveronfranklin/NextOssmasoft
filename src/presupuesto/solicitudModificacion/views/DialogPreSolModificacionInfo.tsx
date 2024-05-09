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
import { IPreSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PreSolicitudModificacion/PreSolModificacionUpdateDto'

import {
  setPrePucSolModificacionSeleccionado,
  setVerPrePucSolModificacionActive
} from 'src/store/apps/pre-puc-sol-modificacion'
import FormPreSolModificacionUpdateAsync from '../forms/FormPreSolModificacionUpdateAsync'
import FormPreSolModificacionCreateAsync from '../forms/FormPreSolModificacionCreateAsync'
import { IFechaDto } from 'src/interfaces/fecha-dto'
import { monthByIndex } from 'src/utilities/ge-date-by-object'
import { setPreSolModificacionSeleccionado, setVerPreSolModificacionActive } from 'src/store/apps/pre-sol-modificacion'

// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogPreSolModificacionInfo = ({
  popperPlacement
}: {
  popperPlacement: ReactDatePickerProps['popperPlacement']
}) => {
  // ** States
  const dispatch = useDispatch()
  const { verPreSolModificacionActive, operacionCrudPreSolModificacion } = useSelector(
    (state: RootState) => state.preSolModificacion
  )
  const { listpresupuestoDtoSeleccionado } = useSelector((state: RootState) => state.presupuesto)
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
      const defaultValues: IPreSolModificacionUpdateDto = {
        codigoSolModificacion: 0,
        tipoModificacionId: 0,
        fechaSolicitud: fechaActual,
        fechaSolicitudString: defaultDateString,
        fechaSolicitudObj: defaultDate,
        numeroSolModificacion: '',
        codigoSolicitante: 0,
        motivo: '',
        numeroCorrelativo: 0,
        codigoPresupuesto: listpresupuestoDtoSeleccionado.codigoPresupuesto
      }

      dispatch(setPreSolModificacionSeleccionado(defaultValues))
    }
    dispatch(setVerPreSolModificacionActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verPreSolModificacionActive}
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
            {operacionCrudPreSolModificacion === 1 ? (
              <FormPreSolModificacionCreateAsync popperPlacement={popperPlacement} />
            ) : (
              <FormPreSolModificacionUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogPreSolModificacionInfo
