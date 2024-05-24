import { Button, Card, CardActions, CardHeader, DialogActions, Grid } from "@mui/material"

const FormCreateSolCompromiso = () => {
    return (
        <Grid item xs={12}>
            <Card>
                <CardHeader title='Añadir Nueva Solicitud' />
                <CardActions>
                    <DialogActions sx={{ pb: { xs: 8, sm: 12.5 }, justifyContent: 'center' }}>
                        <Button variant='outlined' color='secondary'>
                            Guardar
                        </Button>
                    </DialogActions>
                </CardActions>
            </Card>
        </Grid>
    )
}

export default FormCreateSolCompromiso