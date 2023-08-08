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


import FormPreDescriptivaCreateAsync from '../forms/FormPreDescriptivaCreateAsync'
import FormPreDescriptivaUpdateAsync from '../forms/FormPreDescriptivaUpdateAsync'
import { IPreDescriptivasGetDto } from 'src/interfaces/Presupuesto/i-pre-descriptivas-get-dto'
import { setPreDescriptivaSeleccionado, setVerPreDescriptivaActive } from 'src/store/apps/pre-descriptiva'



// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogPreDescriptivaInfo = ()  => {


  // ** States
  const dispatch = useDispatch();
  const {verPreDescriptivaActive,operacionCrudPreDescriptiva} = useSelector((state: RootState) => state.preDescriptiva)




  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues:IPreDescriptivasGetDto = {
        descripcionId: 0,
        descripcionIdFk:0,
        tituloId:0,
        descripcionTitulo:'',
        descripcion:'',
        codigo:'',
        extra1:'',
        extra2:'',
        extra3:'',
        listaDescriptiva:[]

      }
      dispatch(setPreDescriptivaSeleccionado(defaultValues))
    }
    dispatch(setVerPreDescriptivaActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verPreDescriptivaActive}
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
              { operacionCrudPreDescriptiva===1
              ?  <FormPreDescriptivaCreateAsync/>
                :<FormPreDescriptivaUpdateAsync/>
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

export default DialogPreDescriptivaInfo
