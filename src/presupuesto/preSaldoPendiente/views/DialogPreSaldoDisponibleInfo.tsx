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

import ListSaldoDisponibleTableServerSide from '../components/ListSaldoDisponibleTableServerSide'
import { IListIcpPucConDisponible } from 'src/interfaces/Presupuesto/PreSaldoPendiente/ListIcpPucConDisponible'
import { setPreSaldoDisponibleSeleccionado, setVerPreSaldoDisponibleActive } from 'src/store/apps/pre-saldo-disponible'
import { Typography } from '@mui/material'

// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogPreSaldoDisponibleInfo = () => {
  // ** States
  const dispatch = useDispatch()

  const { verPreSaldoDisponibleActive } = useSelector((state: RootState) => state.preSaldoDisponible)

  const handleSetShow = (active: boolean) => {
    console.log('al cerrar', active)
    if (active == false) {
      const defaultValues: IListIcpPucConDisponible = {
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

      dispatch(setPreSaldoDisponibleSeleccionado(defaultValues))
    }
    dispatch(setVerPreSaldoDisponibleActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verPreSaldoDisponibleActive}
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
          <Typography variant='h6' gutterBottom>
            Saldos Disponibles
          </Typography>
          <ListSaldoDisponibleTableServerSide></ListSaldoDisponibleTableServerSide>
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

export default DialogPreSaldoDisponibleInfo
