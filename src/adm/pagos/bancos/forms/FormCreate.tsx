import { Grid, Button, Box } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { useQueryClient, QueryClient } from '@tanstack/react-query';
import { RootState } from 'src/store';
import { setMaestroBancoSeleccionadoDetalle, resetMaestroBancoSeleccionadoDetalle } from 'src/store/apps/pagos/bancos'
import { SisBancoCreateDto } from '../../bancos/interfaces';
import useServices from '../services/useServices';
import FormMaestroBanco from './FormMaestroBanco';

const FormCreate = () => {
    const qc: QueryClient = useQueryClient()
    const dispatch = useDispatch()

    const { maestroBanco, typeOperation } = useSelector((state: RootState) => state.admMaestroBanco)

    const {
        createMaestroBanco,
        message,
        loading
    } = useServices()

    const handleCreateMaestroBanco = async (dataFormMaestroBanco: any) => {
        try {
            const payload: SisBancoCreateDto = {
                codigoBanco: dataFormMaestroBanco.codigoBanco,
                nombre: dataFormMaestroBanco.nombre,
                codigoInterbancario: dataFormMaestroBanco.codigoInterbancario
            }

            const response = await createMaestroBanco(payload)

            if (response) {
                dispatch(setMaestroBancoSeleccionadoDetalle(response.data))
            }
        } catch (e: any) {
            console.error(e)
        } finally {
            qc.invalidateQueries({
                queryKey: ['maestroBancoTable']
            })
        }
    }

    const handleClearMaestroBanco = () => {
        if (typeOperation === 'create') {
            dispatch(resetMaestroBancoSeleccionadoDetalle())
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
                        message={message}
                        loading={loading}
                    />
                </Grid>
            </Grid>
        </>
    )
}

export default FormCreate