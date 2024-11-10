import { Typography, Tooltip, IconButton } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { setIsOpenDialogListPucOrdenPagoEdit, setPucSeleccionado } from "src/store/apps/ordenPago"
import { useDispatch } from 'react-redux'
import Icon from 'src/@core/components/icon'
import Box from '@mui/material/Box'

function ColumnsDataGridListPucByOrden() {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setIsOpenDialogListPucOrdenPagoEdit(true))
        dispatch(setPucSeleccionado(row))
    }

    return [
        {
            flex: 0,
            minWidth: 40,
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
            headerName: 'descripcionFinanciado',
            field: 'descripcionFinanciado',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionFinanciado}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'icpConcat',
            field: 'icpConcat',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.icpConcat === '' ? 'NO DISPONIBLE' : params.row.icpConcat}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 1,
            headerName: 'pucConcat',
            field: 'pucConcat',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.pucConcat === '' ? 'NO DISPONIBLE' : params.row.pucConcat}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'monto',
            field: 'monto',
            editable: true,
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.monto === '' ? 'NO DISPONIBLE' : params.row.monto}
                </Typography>
            )
        }
    ]
}


export default ColumnsDataGridListPucByOrden