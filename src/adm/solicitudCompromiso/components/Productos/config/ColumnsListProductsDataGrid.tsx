import { Box, Typography, Tooltip, IconButton } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { setProductSeleccionado, setVerDialogUpdateProductsInfoActive } from "src/store/apps/adm"
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'

function ColumnsListProductsDataGrid() {

    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setProductSeleccionado(row))
        dispatch(setVerDialogUpdateProductsInfoActive(true))
    }

    return [
        {
            flex: 1,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: ({ row }: any) => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='Editar'>
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                            <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 1,
            sortable: true,
            headerName: 'Codigo',
            field: 'Codigo',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigo ? params.row.codigo : 'No tiene codigo'}
                </Typography>
            )
        },
        {
            flex: 1,
            sortable: true,
            headerName: 'codigoReal',
            field: 'codigoReal',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoReal ? params.row.codigoReal : 'No tiene codigo real'}
                </Typography>
            )
        },
        {
            flex: 1,
            sortable: true,
            headerName: 'descripcion',
            field: 'descripcion',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcion}
                </Typography>
            )
        },
        {
            flex: 1,
            sortable: true,
            headerName: 'descripcionReal',
            field: 'descripcionReal',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionReal ? params.row.descripcionReal : 'No tiene descripcion'}
                </Typography>
            )
        },
        {
            flex: 1,
            sortable: true,
            headerName: 'codigoConcat',
            field: 'codigoConcat',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoConcat}
                </Typography>
            )
        }
    ]
}

export default ColumnsListProductsDataGrid