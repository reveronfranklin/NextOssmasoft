import { CardContent } from '@mui/material';
import Grid from '@mui/material/Grid'
import Layout from 'src/adm/pagos/bancos/views/Layout'

const Bancos = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Maestro Bancos'>
                <Layout />
            </CardContent>
        </Grid>
    )
}

export default Bancos