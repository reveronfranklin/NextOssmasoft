import { Grid, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "src/store"
import FormMaestroBanco from './FormMaestroBanco';

const FormUpdate = () => {

    const { maestroBanco } = useSelector((state: RootState) => state.admMaestroBanco)

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid
                    sm={12}
                    xs={12}
                    sx={{
                    overflow: 'auto',
                    padding: '0 1rem',
                }}>
                    <FormMaestroBanco
                        maestroBanco={maestroBanco}
                        onFormData={''}
                        onFormClear={''}
                        titleButton = {'Crear'}
                        message = {''}
                        loading = {true}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormUpdate