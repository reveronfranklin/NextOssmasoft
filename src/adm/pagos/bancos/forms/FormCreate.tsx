import { Grid, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from "src/store"
import FormMaestroBanco from './FormMaestroBanco';


const FormCreate = () => {

    const { maestroBanco, typeOperation } = useSelector((state: RootState) => state.admMaestroBanco)

    const handleCreateMaestroBanco = async (dataFormOrder: any) => {
        try {
        } catch (e: any) {
            console.error(e)
        } finally {
        }
    }

    const handleClearMaestroBanco = () => {
        if (typeOperation === 'create') {
            /* dispatch(resetCompromisoSeleccionadoDetalle()) */
        }
    }

    return (
        <>
            <Grid container spacing={5} paddingTop={1}>
                <Grid
                    sm={12}
                    xs={12}
                    sx={{
                        overflow: 'auto',
                        padding: '0 1rem',
                    }}
                >
                    <FormMaestroBanco
                        maestroBanco={maestroBanco}
                        onFormData={handleCreateMaestroBanco}
                        onFormClear={handleClearMaestroBanco}
                        titleButton={'Crear'}
                        message={''}
                        loading={true}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormCreate