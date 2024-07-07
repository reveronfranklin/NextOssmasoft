import { useDispatch } from 'react-redux'

import { CrudOperation } from '../../../enums/CrudOperations.enum'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { CellType } from '../../../interfaces/cellType.interfaces'

import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import dayjs from 'dayjs'

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
            minWidth: 30,
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
            Width: 15,
            headerName: 'cantidad',
            field: 'cantidad',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.cantidad}
                </Typography>
            )
        },
        {
            Width: 15,
            headerName: 'descripcionUnidad',
            field: 'descripcionUnidad',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionUnidad}
                </Typography>
            )
        },
        {
            flex: 0,
            Width: 150,
            headerName: 'descripcion',
            field: 'descripcion',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcion}
                </Typography>
            )
        },
        {
            Width: 15,
            headerName: 'precioUnitario',
            field: 'precioUnitario',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.precioUnitario}
                </Typography>
            )
        },
        {
            Width: 15,
            headerName: 'precioTotal',
            field: 'precioTotal',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoProducto}
                </Typography>
            )
        },
    ]
}

export default ColumnsDetalleDataGrid