import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Icon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import moment from 'moment';
import FormatNumber from '../../../../../utilities/format-numbers';
import validateAmount from '../../../../../utilities/validateAmount';
import { PreOrdenPagoDto } from '../../../interfaces';

import {
    setIsOpenDialogPreOrdenPago,
    setPreOrdenPagoShow,
    setTypeOperation,
    setIdPreOrdenPAgo
} from 'src/store/apps/preOrdenPago';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const handleEdit = (preOrdenPago: PreOrdenPagoDto) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogPreOrdenPago(true))
        dispatch(setPreOrdenPagoShow(preOrdenPago))
        dispatch(setIdPreOrdenPAgo(preOrdenPago.id))
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
            headerName: 'Nombre del Emisor',
            field: 'nombreEmisor',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombreEmisor === '' ? 'NO DISPONIBLE' : params.row.nombreEmisor}
                </Typography>
            )
        },
        {
            flex: 1.5,
            headerName: 'Dirección del Emisor',
            field: 'direccionEmisor',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.direccionEmisor === '' ? 'NO DISPONIBLE' : params.row.direccionEmisor}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'RIF',
            field: 'rif',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.rif === '' ? 'NO DISPONIBLE' : params.row.rif}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Número de Factura',
            field: 'numeroFactura',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroFactura === '' ? 'NO DISPONIBLE' : params.row.numeroFactura}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Fecha de Emisión',
            field: 'fechaEmision',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaEmision === null ? 'NO DISPONIBLE' : moment(params.row.fechaEmision).format('YYYY-MM-DD')}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Monto Total',
            field: 'montoTotal',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.montoTotal === null ? 'NO DISPONIBLE' : FormatNumber(validateAmount(parseFloat(params.row.montoTotal)))}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid