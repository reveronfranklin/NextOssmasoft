import Box from '@mui/material/Box';
import Icon from 'src/@core/components/icon';
import { styled } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { IconButton, Tooltip, Typography } from '@mui/material';
import { GridRenderCellParams } from '@mui/x-data-grid';
import { CuentaDto, CuentaDeleteDto } from '../../interfaces';
import {
    setIsOpenDialogMaestroBancoDetalle,
    setIsOpenDialogMaestroBancoDelete,
    setMaestroBancoSeleccionadoDetalle,
    setCodigoBanco,
    setTypeOperation
} from 'src/store/apps/pagos/bancos';

function ColumnsDataGrid() {
    const dispatch = useDispatch()

    const handleEdit = (maestroBanco: CuentaDto) => {
        dispatch(setTypeOperation('update'))
        dispatch(setIsOpenDialogMaestroBancoDetalle(true))
        dispatch(setMaestroBancoSeleccionadoDetalle(maestroBanco))
    }

    const handleDelete = (codigoBanco: CuentaDeleteDto) => {
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

    const columns = [
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
                        <StyledIconButton size='small' onClick={() => handleDelete(row.codigoCuentaBanco)}>
                            <Icon icon='mdi:delete' fontSize={20} />
                        </StyledIconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 1,
            headerName: 'Codigo del Banco',
            field: 'codigoBanco',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoBanco === '' ? 'NO DISPONIBLE' : params.row.codigoBanco}
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
        }
    ]

    return columns
}


export default ColumnsDataGrid