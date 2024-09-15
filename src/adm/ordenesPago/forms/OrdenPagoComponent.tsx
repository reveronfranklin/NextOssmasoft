import { Grid } from "@mui/material"

import TabsComponent from '../components/Tabs'
import FormOrdenPago from '../forms/FormOrdenPago'

const OrdenPagoComponent = () => {
    return (
        <>
            <Grid container spacing={5} paddingTop={5}>
                <Grid sm={6} xs={12} sx={{
                    overflow: 'auto',
                    padding: '0 1rem',
                    borderRight: '1px solid #e0e0e0',
                }}>
                    <FormOrdenPago />
                </Grid>
                <Grid sm={6} xs={12}>
                    <TabsComponent />
                </Grid>
            </Grid>
        </>
    )
}

export default OrdenPagoComponent