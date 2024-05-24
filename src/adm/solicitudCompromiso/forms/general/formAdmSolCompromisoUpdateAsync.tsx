import { useSelector } from 'react-redux'
import { RootState } from 'src/store';
import { useDispatch } from "react-redux"

import { Card, CardContent, CardHeader } from '@mui/material';

const FormUpdateSolCompromiso = () => {
    const dispatch = useDispatch()
    const { verSolicitudCompromisosActive } = useSelector((state: RootState) => state.admSolicitudCompromiso)

    return (
        <Card>
            <CardHeader title='Adm - Modificar solicitud Compromiso' />
            <CardContent>
                {
                    verSolicitudCompromisosActive
                }
            </CardContent>
        </Card>
    )
}

export default FormUpdateSolCompromiso