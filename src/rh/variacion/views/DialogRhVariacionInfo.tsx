import CardContent from '@mui/material/CardContent'
import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import DatePickerWrapper from 'src/@core/styles/libs/react-datepicker'
import { ReactDatePickerProps } from 'react-datepicker'
import FormRhVariacionCreateAsync from '../forms/FormRhVariacionCreateAsync'
import FormRhVariacionUpdateAsync from '../forms/FormRhVariacionUpdateAsync'
import { setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive } from 'src/store/apps/rh-persona-mov-ctrl'
import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto'
import { Box } from '@mui/material'

const DialogRhVariacionInfo = ({ popperPlacement }: { popperPlacement: ReactDatePickerProps['popperPlacement'] })  => {
  const dispatch = useDispatch();
  const {operacionCrudRhPersonaMovCtr,verRhPersonaMovCtrActive} = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const {personaSeleccionado} = useSelector((state: RootState) => state.nomina)

  const handleSetShow= (active:boolean)=>{
    if (active==false) {
      const defaultValues:IRhPersonasMovControlResponseDto = {
        codigoPersonaMovCtrl:0,
        codigoPersona :personaSeleccionado.codigoPersona,
        codigoConcepto :0,
        controlAplica :0,
        descripcionControlAplica:'',
        descripcionConcepto:''
      }

      dispatch(setRhPersonaMovCtrSeleccionado(defaultValues));
    }

    dispatch(setVerRhPersonaMovCtrActive(active))
  }

  return (
    <Box sx={{ position: 'relative', width: '100%', maxWidth: 'md', mx: 'auto' }}>
      <IconButton
        size='small'
        onClick={() => handleSetShow(false)}
        sx={{ position: 'absolute', right: '1rem', top: '1rem', zIndex: 1 }}
      >
        <Icon icon='mdi:close' />
      </IconButton>

      <CardContent sx={{ pb: 8, px: { xs: 4, sm: 8 }, pt: { xs: 8, sm: 10 } }}>
        <DatePickerWrapper>
          {operacionCrudRhPersonaMovCtr === 1 ? (
            <FormRhVariacionCreateAsync popperPlacement={popperPlacement} />
          ) : (
            <FormRhVariacionUpdateAsync popperPlacement={popperPlacement} />
          )}
        </DatePickerWrapper>
      </CardContent>
    </Box>
  )
}

export default DialogRhVariacionInfo
