import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Icon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import { CuentaDto } from '../../../interfaces';
import {
    setIsOpenDialogCuenta,
    setMaestroCuentaShow,
    setTypeOperation
} from 'src/store/apps/pagos/cuentas';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const handleEdit = (maestroCuenta: CuentaDto) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogCuenta(true))
        dispatch(setMaestroCuentaShow(maestroCuenta))
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
            field: 'descripcionBanco',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionBanco === '' ? 'NO DISPONIBLE' : params.row.descripcionBanco}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Tipo de cuenta',
            field: 'descripcionTipoCuenta',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoCuenta === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoCuenta}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Numero de cuenta',
            field: 'noCuenta',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.noCuenta === '' ? 'NO DISPONIBLE' : params.row.noCuenta}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Denominación Funcional',
            field: 'descripcionDenominacionFuncional',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionDenominacionFuncional === '' ? 'NO DISPONIBLE' : params.row.descripcionDenominacionFuncional}
                </Typography>
            )
        },
        {
            flex: 0.5,
            headerName: 'Código',
            field: 'codigo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigo === null ? 'NO DISPONIBLE' : params.row.codigo}
                </Typography>
            )
        },
        {
            flex: 0.5,
            headerName: 'Cuenta Principal',
            field: 'principal',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.principal ? 'SI' :'NO'}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid