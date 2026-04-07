import { Card, CardContent, Grid, CardHeader, Chip, Box } from '@mui/material';
import DataGridComponent from '../components/dataGrid/GridEmployees';
import LayoutAccordionComponent from './LayoutAccordion';
import Icon from 'src/@core/components/icon';
import SearchCriteriaDialog from '../components/dialogs/SearchCriteriaDialog';

const LayoutComponent = () => {
  const dateToday = new Date().toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })

	return (
    <>
      <Card>
        <CardHeader
          title='Movimientos Masivos (Empleados)'
          subheader='Panel de asignaciones masivas de variaciones.'
          action={
            <Box>
              <Chip
                label={`Fecha: ${dateToday}`}
                variant='outlined'
                color='primary'
                size='small'
                icon={<Icon icon='mdi:calendar-month-outline' fontSize={18} />}
                sx={{ fontWeight: 500, borderRadius: '8px' }}
              />
            </Box>
          }
        />
        <CardContent>
          <LayoutAccordionComponent />
        </CardContent>
        <CardContent>
          <Grid item sm={12} xs={12} sx={{ padding: '5px' }}>
            <DataGridComponent />
          </Grid>
        </CardContent>
      </Card>
      <SearchCriteriaDialog />
    </>
	)
}

export default LayoutComponent