import { useMemo } from 'react';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import FormatNumber from '../../../../utilities/format-numbers';
import validateAmount from '../../../../utilities/validateAmount';
/* import { SisBancoUpdateDto } from '../../../interfaces'; */

import {
    setIsOpenDialogMaestroBancoDetalle,
    setMaestroBancoSeleccionadoDetalle,
    setTypeOperation
} from 'src/store/apps/pagos/bancos';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const handleEdit = (maestroBanco: any /* SisBancoUpdateDto */) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogMaestroBancoDetalle(true))
        dispatch(setMaestroBancoSeleccionadoDetalle(maestroBanco))
    }

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        '&:hover': {
            color: theme.palette.primary.main,
            transform: 'scale(1.5)',
            transition: 'transform 0.2s ease-in-out',
        },
    }))

    const columns = useMemo<GridColDef[]>(() => [
        {
            flex: 0.5,
            headerName: 'Código concepto',
            field: 'codigoConcepto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoConcepto === 0 ? 'NO DISPONIBLE' : params.row.codigoConcepto}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Denominación del concepto',
            field: 'denominacion',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.denominacion === '' ? 'NO DISPONIBLE' : params.row.denominacion}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'complemento del concepto',
            field: 'complementoConcepto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.complementoConcepto === '' ? 'NO DISPONIBLE' : params.row.complementoConcepto}
                </Typography>
            )
        },
        {
            flex: 0.5,
            headerName: 'Tipo de movimiento',
            field: 'tipo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.tipo === '' ? 'NO DISPONIBLE' : params.row.tipo}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Frecuencia de pago',
            field: 'descripcionFrecuencia',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionFrecuencia === '' ? 'NO DISPONIBLE' : params.row.descripcionFrecuencia}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Monto',
            field: 'monto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.monto === null ? 'NO DISPONIBLE' : FormatNumber(validateAmount(parseFloat(params.row.monto)))}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid