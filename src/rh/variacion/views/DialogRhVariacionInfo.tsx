import IconButton from '@mui/material/IconButton'
import Icon from 'src/@core/components/icon'
import { useDispatch } from 'react-redux'
import { RootState } from 'src/store'
import { useSelector } from 'react-redux'
import FormRhVariacionCreateAsync from '../forms/FormRhVariacionCreateAsync'
import FormRhVariacionUpdateAsync from '../forms/FormRhVariacionUpdateAsync'
import { setRhPersonaMovCtrSeleccionado, setVerRhPersonaMovCtrActive, setIsExpandedAccordion } from 'src/store/apps/rh-persona-mov-ctrl'
import { IRhPersonasMovControlResponseDto } from 'src/interfaces/rh/RhPersonasMovControlResponseDto'

import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Tooltip
} from '@mui/material';

const DialogRhVariacionInfo = ()  => {
  const dispatch = useDispatch();

  const { operacionCrudRhPersonaMovCtr, isExpandedAccordion } = useSelector((state: RootState) => state.rhPersonaMovCtrl)
  const { personaSeleccionado } = useSelector((state: RootState) => state.nomina)

  const handleSetShow= (active:boolean)=>{
    if (active == false) {
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

  const handleAdd = () => {
    handleSetShow(true)
    dispatch(setIsExpandedAccordion(true))
  }

  const handleEdit = () => {
    console.log('Edit button clicked for row:')
  }

  return (
    <Accordion
      expanded={isExpandedAccordion}
      onChange={(event, expanded) => dispatch(setIsExpandedAccordion(expanded))}
      sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
    >
      <AccordionSummary
        expandIcon={
          operacionCrudRhPersonaMovCtr === 1
            ? (
              <Tooltip title='Agregar'>
                <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
                  <Icon icon='ci:add-row' fontSize={20} />
                </IconButton>
              </Tooltip>
            )
            : (
              <Tooltip title='Editar'>
                <IconButton size='small' onClick={() => handleEdit()}>
                  <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                </IconButton>
              </Tooltip>
            )
        }
        sx={{ backgroundColor: 'action.hover', borderRadius: 1 }}
      >
        <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
          {operacionCrudRhPersonaMovCtr === 1 ? 'RH - Crear Variación' : 'RH - Modificar Variación'}
        </Typography>
      </AccordionSummary>

      <AccordionDetails sx={{ pt: 2 }}>
        {operacionCrudRhPersonaMovCtr === 1 ? (
          <FormRhVariacionCreateAsync />
        ) : (
          <FormRhVariacionUpdateAsync />
        )}
      </AccordionDetails>
    </Accordion>
  )
}

export default DialogRhVariacionInfo
