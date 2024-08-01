import { Box, Typography, Tooltip, IconButton } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Icon from 'src/@core/components/icon'
import { } from "src/store/apps/adm"

// import { useDispatch } from 'react-redux'

function ColumnsListProductsDataGrid() {

    // const dispatch = useDispatch()

    const handleEdit = () => {
        alert('esta seguro de Eliminar este products')

        // dispatch(setSolicitudCompromisoSeleccionadoDetalle(row))
        // dispatch(setVerSolicitudCompromisoDetalleActive(true))
    }

    return [
        {
            flex: 1,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: () => (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Tooltip title='Eliminar'>
                        <IconButton size='small' onClick={() => handleEdit()}>
                            <Icon icon='mdi:delete' fontSize={20} />
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
                    {params.row.codigo}
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