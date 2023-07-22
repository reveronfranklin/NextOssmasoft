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

import { setIcpSeleccionado, setVerIcpActive } from 'src/store/apps/ICP';
import FormIcpUpdateAsync from 'src/views/forms/icp/maestro/FormIcpUpdateAsync'
import FormIcpCreateAsync from 'src/views/forms/icp/maestro/FormIcpCreateAsync'
import { IPreIndiceCategoriaProgramaticaGetDto } from 'src/interfaces/Presupuesto/i-pre-indice-categoria-programatica-get-dto'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogPreIcpInfo = ()  => {


  // ** States
  const dispatch = useDispatch();
  const {verIcpActive,operacionCrudIcp} = useSelector((state: RootState) => state.icp)
  const {listpresupuestoDtoSeleccionado} = useSelector((state: RootState) => state.presupuesto)




  const handleSetShow= (active:boolean)=>{

    if(active==false){
      const defaultValues:IPreIndiceCategoriaProgramaticaGetDto = {
        codigoIcp: 0,
        ano:listpresupuestoDtoSeleccionado.ano,
        codigoSector:'00',
        codigoPrograma:'00',
        codigoSubPrograma:'00',
        codigoProyecto:'00',
        codigoActividad:'00',
        codigoOficina:'00',
        unidadEjecutora:'',
        denominacion:'',
        descripcion:'',
        codigoFuncionario:0,
        codigoIcpPadre:0,
        codigoIcpConcat:'',
        searchText:'',
        codigoPresupuesto:listpresupuestoDtoSeleccionado.codigoPresupuesto,

      }

      dispatch(setIcpSeleccionado(defaultValues))
    }
    dispatch(setVerIcpActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth
          open={verIcpActive}
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
              { operacionCrudIcp===1
              ?  <FormIcpCreateAsync/>
                :<FormIcpUpdateAsync/>
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

export default DialogPreIcpInfo
