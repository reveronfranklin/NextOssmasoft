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

import { IPrePlanUnicoCuentasGetDto } from 'src/interfaces/Presupuesto/i-pre-plan-unico-cuentas-get-dto'
import { setPucSeleccionado, setVerPucActive } from 'src/store/apps/PUC'

//import FormPucCreateAsync from '../forms/FormPucCreateAsync'
import FormPucUpdateAsync from '../forms/FormPucUpdateAsync'
import FormPucCreateAsync from '../forms/FormPucCreateAsync'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogPrePucInfo = ()  => {


  // ** States
  const dispatch = useDispatch();
  const {verPucActive,operacionCrudPuc} = useSelector((state: RootState) => state.puc)
  const {listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)




  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues:IPrePlanUnicoCuentasGetDto = {
        codigoPuc: 0,
        codigoGrupo:'0',
        codigoNivel1:'00',
        codigoNivel2:'00',
        codigoNivel3:'00',
        codigoNivel4:'00',
        codigoNivel5:'00',
        codigoNivel6:'',
        denominacion:'',
        descripcion:'',
        codigoPucPadre:0,
        codigoPucConcat:'',
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,
      }
      dispatch(setPucSeleccionado(defaultValues))
    }
    dispatch(setVerPucActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verPucActive}
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
              { operacionCrudPuc===1
              ?  <FormPucCreateAsync/>
                :<FormPucUpdateAsync/>
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

export default DialogPrePucInfo
