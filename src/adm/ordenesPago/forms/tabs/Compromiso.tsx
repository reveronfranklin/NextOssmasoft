import { Grid, TextField } from "@mui/material"

const Compromiso = () => {
    return (
        <Grid container spacing={2} padding={5}>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Nro. de Compromiso'
                    variant='outlined'
                    size='small'
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Fecha de Compromiso'
                    variant='outlined'
                    size='small'
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Nro. de Compromiso'
                    variant='outlined'
                    size='small'
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    fullWidth
                    label='Fecha de Compromiso'
                    variant='outlined'
                    size='small'
                />
            </Grid>
        </Grid>
    )
}

export default Compromiso