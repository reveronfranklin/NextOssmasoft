import Grid from '@mui/material/Grid'
import { CardContent } from '@mui/material'
import Layout from 'src/adm/pagos/bancos/views/Layout'

const Bancos = () => {
    return (
        <Grid item xs={12}>
            <CardContent title='Maestro de Bancos'>
            </CardContent>
            <Layout />
        </Grid>
    )
}

export default Bancos