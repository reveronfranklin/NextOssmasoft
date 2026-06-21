import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'src/store';
import IconButton from '@mui/material/IconButton';
import Icon from 'src/@core/components/icon';

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Tooltip,
    Chip,
    Box
} from '@mui/material';

import FormCreate from '../components/forms/FormCreate';
import { setIsExpandedAccordion } from 'src/store/apps/rh-variaciones_masivas';

const LayoutAccordionComponent = ()  => {
  const dispatch = useDispatch();

  const { isExpandedAccordion, listEmployeeCodes } = useSelector((state: RootState) => state.rhVariacionesMasivas)

  const handleAdd = () => {
    dispatch(setIsExpandedAccordion(true))
  }

  return (
    <Accordion
      expanded={isExpandedAccordion}
      onChange={(event, expanded) => dispatch(setIsExpandedAccordion(expanded))}
      sx={{ boxShadow: 'none', '&:before': { display: 'none' } }}
    >
      <AccordionSummary
        expandIcon={
          <Tooltip title='Agregar Variación'>
            <IconButton  color='primary' size='small' onClick={() => handleAdd()}>
              <Icon icon='ci:add-row' fontSize={20} />
            </IconButton>
          </Tooltip>
        }
        sx={{ backgroundColor: 'action.hover', borderRadius: 2}}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Typography sx={{ fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
            { 'RH - Crear Variación' }
          </Typography>

          <Chip
            label={`Empleados Seleccionados: ${listEmployeeCodes.length}`}
            variant='outlined'
            color='primary'
            size='small'
            icon={<Icon icon='mdi:account-group' fontSize={18} />}
            sx={{ fontWeight: 500, borderRadius: '8px' }}
          />
        </Box>
      </AccordionSummary>

      <AccordionDetails sx={{ mt: 3 }}>
        <FormCreate />
      </AccordionDetails>
    </Accordion>
  )
}

export default LayoutAccordionComponent