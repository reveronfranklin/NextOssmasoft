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


import FormRhConceptosFormulaCreateAsync from '../forms/FormRhConceptosFormulaCreateAsync'
import FormRhConceptosFormulaUpdateAsync from '../forms/FormRhConceptosFormulaUpdateAsync'

import { setRhConceptosFormulaSeleccionado, setVerRhConceptosFormulaActive } from 'src/store/apps/rh-conceptos-formula'
import { IRhConceptosFormulaResponseDto } from 'src/interfaces/rh/ConceptosFormula/RhConceptosFormulaResponseDto'


// ** Custom Component Imports

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />
})



const DialogRhConceptoFormulaInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {


  // ** States
  const dispatch = useDispatch();

  const {operacionCrudRhConceptosFormula,verRhConceptosFormulaActive} = useSelector((state: RootState) => state.rhConceptosFormula)
  const {rhConceptosSeleccionado} = useSelector((state: RootState) => state.rhConceptos)


  const handleSetShow= (active:boolean)=>{

    if(active==false){

      const defaultValues:IRhConceptosFormulaResponseDto = {

        codigoFormulaConcepto :0,
        codigoConcepto:rhConceptosSeleccionado.codigoConcepto,
        porcentaje:0,
        montoTope:0,
        porcentajePatronal:0,
        tipoSueldo:'',
        tipoSueldoDescripcion:'',
        fechaDesde:null,
        fechaDesdeString:'',
        fechaDesdeObj:null,
        fechaHasta:null,
        fechaHastaString :'',
        fechaHastaObj :null,

      }
      dispatch(setRhConceptosFormulaSeleccionado(defaultValues));

    }
    dispatch(setVerRhConceptosFormulaActive(active))


  }







    return (
      <Card>

        <Dialog
          fullWidth

          open={verRhConceptosFormulaActive}
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
              { operacionCrudRhConceptosFormula===1
              ?  <FormRhConceptosFormulaCreateAsync popperPlacement={popperPlacement}/>
                :<FormRhConceptosFormulaUpdateAsync popperPlacement={popperPlacement} />
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

export default DialogRhConceptoFormulaInfo
