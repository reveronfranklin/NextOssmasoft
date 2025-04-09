import { useMemo } from 'react';
import Box from '@mui/material/Box';
import Icon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { GridRenderCellParams, GridColDef } from '@mui/x-data-grid';
import { SisBancoUpdateDto, SisBancoDeleteDto } from '../../interfaces'
import {
    setIsOpenDialogMaestroBancoDetalle,
    setIsOpenDialogMaestroBancoDelete,
    setMaestroBancoSeleccionadoDetalle,
    setCodigoBanco,
    setTypeOperation
} from 'src/store/apps/pagos/bancos';

const useColumnsDataGrid = (): GridColDef[] => {
    const dispatch = useDispatch()

    const handleEdit = (maestroBanco: SisBancoUpdateDto) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogMaestroBancoDetalle(true))
        dispatch(setMaestroBancoSeleccionadoDetalle(maestroBanco))
    }

    const handleDelete = (codigoBanco: SisBancoDeleteDto) => {
        dispatch(setTypeOperation('delete'))
        dispatch(setIsOpenDialogMaestroBancoDelete(true))
        dispatch(setCodigoBanco(codigoBanco))
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
                    <Tooltip title='Delete'>
                        <StyledIconButton size='small' onClick={() => handleDelete(row.codigoBanco)}>
                            <Icon icon='mdi:delete' fontSize={20} />
                        </StyledIconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 1,
            headerName: 'Nombre del Banco',
            field: 'nombre',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombre === '' ? 'NO DISPONIBLE' : params.row.nombre}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Codigo Interbancario',
            field: 'codigoInterbancario',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoInterbancario === '' ? 'NO DISPONIBLE' : params.row.codigoInterbancario}
                </Typography>
            )
        }
    ], [dispatch])

    return columns
}


export default useColumnsDataGrid