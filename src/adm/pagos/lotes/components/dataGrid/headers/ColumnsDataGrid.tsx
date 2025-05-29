import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Icon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import { LoteDto } from '../../../interfaces';
import {
    setIsOpenDialogLote,
    setLoteShow,
    setTypeOperation,
    setCodigoLote
} from 'src/store/apps/pagos/lotes';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const handleEdit = (lote: LoteDto) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogLote(true))
        dispatch(setLoteShow(lote))
        dispatch(setCodigoLote(lote.codigoLotePago))
    }

    const StyledIconButton = styled(IconButton)(({ theme }) => ({
        '&:hover': {
            color: theme.palette.primary.main,
            transform: 'scale(1.5)',
            transition: 'transform 0.2s ease-in-out',
        },
    }))

    const getStatusDescription = (status: string): string => {
        let estatus = ''

        switch (status) {
            case 'PE':
                estatus = 'Pendiente'
                break;

            case 'AN':
                estatus = 'Anulada'
                break;

            case 'AP':
                estatus = 'Aprobada'
                break;
        }

        return estatus
    }

    const columns = useMemo<GridColDef[]>(() => [
        {
            flex: 0,
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
            headerName: 'Descripción',
            field: 'descripcionTipoPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoPago === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoPago}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Fecha de pago',
            field: 'fechaPagoString',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaPagoString === '' ? 'NO DISPONIBLE' : params.row.fechaPagoString}
                </Typography>
            )
        },
        {
            flex: 1.5,
            headerName: 'Número de cuenta',
            field: 'numeroCuenta',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroCuenta === '' ? 'NO DISPONIBLE' : params.row.numeroCuenta}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Nombre de banco',
            field: 'nombreBanco',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombreBanco === '' ? 'NO DISPONIBLE' : params.row.nombreBanco}
                </Typography>
            )
        },
        {
            flex: 2,
            headerName: 'Titulo',
            field: 'titulo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.titulo === null ? 'NO DISPONIBLE' : params.row.titulo}
                </Typography>
            )
        },
        {
            flex: 0.5,
            headerName: 'Estatus',
            field: 'status',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.status === null ? 'NO DISPONIBLE' : getStatusDescription(params.row.status)}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid