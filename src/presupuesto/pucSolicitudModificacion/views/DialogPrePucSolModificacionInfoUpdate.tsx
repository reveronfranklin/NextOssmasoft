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

import FormPrePucSolModificacionCreateAsync from '../forms/FormPrePucSolModificacionCreateAsync'
import FormPrePucSolModificacionUpdateAsync from '../forms/FormPrePucSolModificacionUpdateAsync'
import { IPrePucSolModificacionUpdateDto } from 'src/interfaces/Presupuesto/PrePucSolicitudModificacion/PreSolicitudModificacion/PrePucSolModificacionUpdateDto'
import {
  setPrePucSolModificacionSeleccionado,
  setVerPrePucSolModificacionUpdateActive
} from 'src/store/apps/pre-puc-sol-modificacion'
import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'
import { setPreSaldoDisponibleSeleccionado } from 'src/store/apps/pre-saldo-disponible'

// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

interface Props {
  dePara: string
}

const DialogPrePucSolModificacionInfoUpdate = ({ dePara }: Props) => {
  // ** States
  const dispatch = useDispatch()
  const { verPrePucSolModificacionUpdateActive, operacionCrudPrePucSolModificacionUpdate } = useSelector(
    (state: RootState) => state.prePucSolModificacion
  )
  const { preSolModificacionSeleccionado } = useSelector((state: RootState) => state.preSolModificacion)

  const handleSetShow = (active: boolean) => {
    if (active == false) {
      const defaultValues: IPrePucSolModificacionUpdateDto = {
        codigoPucSolModificacion: 0,
        codigoSaldo: 0,
        codigoSolModificacion: preSolModificacionSeleccionado.codigoSolModificacion,
        financiadoId: 0,
        codigoIcp: 0,
        codigoPuc: 0,
        monto: 0,
        dePara: '',
        codigoPresupuesto: preSolModificacionSeleccionado.codigoPresupuesto
      }

      dispatch(setPrePucSolModificacionSeleccionado(defaultValues))

      const defaultValuesListSaldos: IListIcpPucConDisponible = {
        codigoSaldo: 0,
        codigoIcp: 0,
        codigoIcpConcat: '',
        denominacionIcp: '',
        codigoPuc: 0,
        codigoPucConcat: '',
        denominacionPuc: '',
        financiadoId: 0,
        denominacionFinanciado: '',
        disponible: 0,
        searchText: ''
      }

      dispatch(setPreSaldoDisponibleSeleccionado(defaultValuesListSaldos))
    }
    dispatch(setVerPrePucSolModificacionUpdateActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verPrePucSolModificacionUpdateActive}
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
            {operacionCrudPrePucSolModificacionUpdate === 1 ? (
              <FormPrePucSolModificacionCreateAsync dePara={dePara} />
            ) : (
              <FormPrePucSolModificacionUpdateAsync dePara={dePara} />
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

export default DialogPrePucSolModificacionInfoUpdate
