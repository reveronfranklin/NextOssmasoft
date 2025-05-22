import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Icon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import FormatNumber from '../../../../../../utilities/format-numbers';
import { PagoDto } from '../../../interfaces';
import {
    setTypeOperation,
    setIsOpenDialogPago,
    setPagoShow,
    setCodigoPago
} from 'src/store/apps/pagos/lote-pagos';
import { parse } from 'path';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const handleEdit = (pago: PagoDto) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogPago(true))
        dispatch(setPagoShow(pago))
        dispatch(setCodigoPago(pago.codigoPago))
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
            flex: 1,
            minWidth: 40,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: ({ row }: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='Editar'>
                        <StyledIconButton size='small' onClick={() => handleEdit(row)}>
                            <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                        </StyledIconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 1,
            headerName: 'Número Orden Pago',
            field: 'numeroOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroOrdenPago === '' ? 'NO DISPONIBLE' : params.row.numeroOrdenPago}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Código de pago',
            field: 'codigoPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoPago === '' ? 'NO DISPONIBLE' : params.row.codigoPago}
                </Typography>
            )
        },
        {
            flex: 2,
            headerName: 'Nombre Proveedor',
            field: 'nombreProveedor',
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant='body2'
                    sx={{
                        color: 'text.primary',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px'
                    }}>
                    {params.row.nombreProveedor === '' ? 'NO DISPONIBLE' : params.row.nombreProveedor}
                </Typography>
            )
        },
        {
            flex: 2,
            headerName: 'Motivo',
            field: 'motivo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography
                    variant='body2'
                    sx={{
                        color: 'text.primary',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '300px'
                    }}>
                    {params.row.motivo === '' ? 'NO DISPONIBLE' : params.row.motivo}
                </Typography>
            )
        },
        {
            flex: 2,
            headerName: 'Monto',
            field: 'monto',
            editable: true,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.monto === null ? 'NO DISPONIBLE' : FormatNumber(parseFloat(params.row.monto))}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid