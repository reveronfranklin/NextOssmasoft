import { Card, CardContent, CardHeader, Grid } from '@mui/material';
import FilterDate from '../components/filter/FilterDate'

const LayoutFilterDate = () => {
  return (
    <Grid item xs={12} paddingBottom={5}>
        <Card>
            <CardHeader title='Filtrar Por Fechas De Pago ' />
            <CardContent>
                <FilterDate />
            </CardContent>
        </Card>
    </Grid>
  )
}

export default LayoutFilterDate