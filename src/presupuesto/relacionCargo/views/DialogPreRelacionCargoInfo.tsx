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


import { setPreRelacionCargoSeleccionado, setVerPreRelacionCargoActive } from 'src/store/apps/pre-relacion-cargo'
import { IPreRelacionCargosGetDto } from 'src/interfaces/Presupuesto/i-pre-relacion-cargos-get-dto'
import FormPreRelacionCargoCreateAsync from '../forms/FormPreRelacionCargoCreateAsync'
import FormPreRelacionCargoUpdateAsync from '../forms/FormPreRelacionCargoUpdateAsync'



// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogPreRelacionCargoInfo = ()  => {


  // ** States
  const dispatch = useDispatch();
  const {verPreRelacionCargoActive,operacionCrudPreRelacionCargo} = useSelector((state: RootState) => state.preRelacionCargo)




  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues:IPreRelacionCargosGetDto = {
        codigoRelacionCargo:0,
        ano: 0,
        escenario: 0,
        codigoIcp: 0,
        denominacionIcp:'',
        codigoCargo:0,
        denominacionCargo: '',
        descripcionTipoCargo:'',
        descripcionTipoPersonal: '',
        cantidad: 0,
        sueldo: 0,
        compensacion: 0,
        prima: 0,
        otro: 0,
        extra1: '',
        extra2: '',
        extra3: '',
        codigoPresupuesto: 0,
        totalMensual: '',
        totalAnual: '',
        icpConcat:'',
        searchText:''
      }

      dispatch(setPreRelacionCargoSeleccionado(defaultValues))
    }
    dispatch(setVerPreRelacionCargoActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verPreRelacionCargoActive}
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
              { operacionCrudPreRelacionCargo===1
              ?  <FormPreRelacionCargoCreateAsync/>
                :<FormPreRelacionCargoUpdateAsync/>
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

export default DialogPreRelacionCargoInfo
