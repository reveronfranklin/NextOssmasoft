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
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <Typography variant='body2' sx={{ color: color }}>
                        {params.row.cantidad}
                    </Typography>

                )
            }
        },
        {
            flex: 1,
            headerName: 'descripcionUnidad',
            field: 'descripcionUnidad',
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <Typography variant='body2' sx={{ color: color }}>
                        {params.row.descripcionUnidad}
                    </Typography>

                )
            }
        },
        {
            flex: 1,
            headerName: 'descripcion',
            field: 'descripcion',
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <Typography
                        variant='body2'
                        sx={{
                            color: color,
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                        }}
                    >
                        {params.row.descripcion}
                    </Typography>

                )
            }
        },
        {
            flex: 1,
            headerName: 'precioUnitario',
            field: 'precioUnitario',
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: color }}
                        >
                            { formatNumber(params.row.precioUnitario) }
                        </Typography>
                    </div>
                )
            }
        },
        {
            flex: 1,
            headerName: 'total',
            field: 'total',
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: color }}
                        >
                            { formatNumber(params.row.total) }
                        </Typography>
                    </div>
                )
            }
        },
        {
            flex: 1,
            headerName: 'impuesto',
            field: 'impuesto',
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: color }}
                        >
                            {formatNumber(params.row.montoImpuesto) }
                        </Typography>
                    </div>
                )
            }
        },
        {
            flex: 1,
            headerName: 'totalMasImpuesto',
            field: 'totalMasImpuesto',
            renderCell: (params: GridRenderCellParams) => {
                const color = params.row.lineaImpuesto ? 'green' : '#3A3541DE'

                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: color }}
                        >
                            { formatNumber(params.row.totalMasImpuesto) }
                        </Typography>
                    </div>
                )
            }
        },
    ]
}

export default ColumnsDetalleDataGrid