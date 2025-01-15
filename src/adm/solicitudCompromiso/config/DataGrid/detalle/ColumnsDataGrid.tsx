import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import { CellType } from '../../../interfaces/cellType.interfaces'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import formatNumber from '../../../helpers/formateadorNumeros'
import { useTheme } from '@mui/material/styles'
import {
    setSolicitudCompromisoSeleccionadoDetalle,
    setVerSolicitudCompromisoDetalleActive
} from "src/store/apps/adm"

function ColumnsDetalleDataGrid() {
    const dispatch = useDispatch()
    const theme = useTheme()

    const handleEdit = (row: any) => {
        dispatch(setSolicitudCompromisoSeleccionadoDetalle(row))
        dispatch(setVerSolicitudCompromisoDetalleActive(true))
    }

    const getRowColor = (row: any) => {
        if (row.lineaImpuesto) {
            return theme.palette.mode === 'dark' ? '#ADFF2F' : '#5a8933'
        } else if (row.tieneDiferencia) {
            return theme.palette.mode === 'dark' ? '#FF5555' : '#DC143C'
        } else {
            return theme.palette.mode === 'dark' ? '#E7E3FC99' : '#3A3541DE'
        }
    }

    return [
        {
            flex: 0,
            minWidth: 80,
            sortable: false,
            headerName: 'Acciones',
            field: 'actions',
            renderCell: ({ row }: CellType) => (
                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title='Editar'>
                        <IconButton size='small' onClick={() => handleEdit(row)}>
                            <Icon icon='mdi:file-document-edit-outline' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 0,
            headerName: 'cantidad',
            field: 'cantidad',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Typography variant='body2' sx={{ color: getRowColor(params.row) }}>
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
                return (
                    <Typography variant='body2' sx={{ color: getRowColor(params.row) }}>
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
                return (
                    <Typography
                        variant='body2'
                        sx={{
                            color: getRowColor(params.row),
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
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: getRowColor(params.row) }}
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
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: getRowColor(params.row) }}
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
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: getRowColor(params.row) }}
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
                return (
                    <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                        <Typography
                            variant='body2'
                            sx={{ color: getRowColor(params.row) }}
                        >
                            { formatNumber(params.row.totalMasImpuesto) }
                        </Typography>
                    </div>
                )
            }
        },
        {
            flex: 1,
            headerName: 'puc',
            field: 'totalPuc',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Typography variant='body2' sx={{ color: getRowColor(params.row) }}>
                        { formatNumber(params.row.totalPuc) }
                    </Typography>
                )
            }
        },
    ]
}

export default ColumnsDetalleDataGrid