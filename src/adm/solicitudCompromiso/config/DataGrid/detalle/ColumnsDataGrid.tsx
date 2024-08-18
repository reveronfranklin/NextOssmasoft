import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { CellType } from '../../../interfaces/cellType.interfaces'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import formatNumber from '../../../helpers/formateadorNumeros'

import {
    setSolicitudCompromisoSeleccionadoDetalle,
    setVerSolicitudCompromisoDetalleActive
} from "src/store/apps/adm"

function ColumnsDetalleDataGrid() {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setSolicitudCompromisoSeleccionadoDetalle(row))
        dispatch(setVerSolicitudCompromisoDetalleActive(true))
    }

    return [
        {
            flex: 0,
            minWidth: 80,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}> {/* Center content horizontally */}
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
            headerName: 'cantidad',
            field: 'cantidad',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.cantidad}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'descripcionUnidad',
            field: 'descripcionUnidad',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionUnidad}
                </Typography>
            )
        },
        {
            flex: 1,
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
            headerName: 'precioUnitario',
            field: 'precioUnitario',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    { formatNumber(params.row.precioUnitario) }
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'totalMasImpuesto',
            field: 'totalMasImpuesto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    { formatNumber(params.row.totalMasImpuesto) }
                </Typography>
            )
        },
    ]
}

export default ColumnsDetalleDataGrid