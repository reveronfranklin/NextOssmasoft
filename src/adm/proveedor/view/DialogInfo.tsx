// ** React Imports
import { Ref, forwardRef, ReactElement } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Fade, { FadeProps } from '@mui/material/Fade'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from 'src/store'

// ** Third Party Imports
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'

// ** Redux Actions
import {
  setProveedorSeleccionado,
  setProveedoresDtoSeleccionado,
  setVerProveedorActive
} from 'src/store/apps/adm-proveedor'

// ** Interfaces
import { IProveedor } from '../interfaces/proveedor/proveedor.interfaces'

import FormProveedorCreateAsync from '../forms/FormProveedorCreateAsync'
import FormProveedorUpdateAsync from '../forms/FormProveedorUpdateAsync'

// ** Custom Transition
const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})

const DialogInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] }) => {
  const dispatch = useDispatch()
  const { operacionCrudProveedor, verProveedorActive, proveedorSeleccionado } = useSelector(
    (state: RootState) => state.proveedor
  )

  const fechaActual = new Date()
  const defaultDateString = fechaActual.toISOString()

  const handleSetShow = (active: boolean) => {
    if (!active && operacionCrudProveedor === 1) {
      const defaultValues: IProveedor = {
        codigoProveedor: proveedorSeleccionado?.codigoProveedor ?? 0,
        nombreProveedor: '',
        tipoProveedorId: 0,
        nacionalidad: null,
        cedula: 0,
        rif: '',
        fechaRif: fechaActual,
        nit: null,
        fechaNit: null,
        numeroRegistroContraloria: null,
        fechaRegistroContraloria: null,
        fechaRegistroContraloriaString: defaultDateString,
        fechaRegistroContraloriaObj: null,
        capitalPagado: 0,
        capitalSuscrito: 0,
        status: '',
        estatusFisicoId: 0,
        numeroCuenta: '',
        activo: true
      }

      dispatch(setProveedoresDtoSeleccionado(defaultValues))
      dispatch(setProveedorSeleccionado(defaultValues))
    }

    dispatch(setVerProveedorActive(active))
  }

  return (
    <Card>
      <Dialog
        fullWidth
        open={verProveedorActive}
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
            {operacionCrudProveedor === 1
              ? <FormProveedorCreateAsync popperPlacement={popperPlacement} />
              : <FormProveedorUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogInfo
