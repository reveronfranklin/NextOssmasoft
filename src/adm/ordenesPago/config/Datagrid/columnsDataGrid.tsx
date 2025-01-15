import { useDispatch } from 'react-redux'
import { IconButton, Tooltip, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import Icon from 'src/@core/components/icon'
import { } from "src/store/apps/adm"
import {
    setIsOpenDialogOrdenPagoDetalle,
    setTypeOperation,
    setCompromisoSeleccionadoDetalle
} from 'src/store/apps/ordenPago'
import HandleReport from 'src/utilities/generateReport/download-report'

function ColumnsDataGrid() {
    const dispatch = useDispatch()

    const handleEdit = (row: any) => {
        dispatch(setCompromisoSeleccionadoDetalle(row))
        dispatch(setIsOpenDialogOrdenPagoDetalle(true))
        dispatch(setTypeOperation('update'))
    }

    const handleReportOrderPago = async (row: any) => {
        try {
            await HandleReport({ CodigoOrdenPago: row.codigoOrdenPago })
        } catch (e: any) {
            console.error(e)
        }
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
                    <Tooltip title="Reporte Orden de Pago">
                        <IconButton
                            size='small'
                            onClick={() => handleReportOrderPago(row)}
                        >
                            <Icon icon='mdi:download' fontSize={20} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'codigoOrdenPago',
            field: 'codigoOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoOrdenPago}
                </Typography>
            )
        },
        {
            flex: 0,
            with: 40,
            headerName: 'Fecha',
            field: 'fechaOrdenPagoString',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaOrdenPagoString}
                </Typography>
            )
        },
        {
            flex: 0,
            minWidth: 180,
            headerName: 'Tipo Orden',
            field: 'descripcionTipoOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoOrdenPago === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoOrdenPago}
                </Typography>
            )
        },
        {
            flex: 0.25,
            minWidth: 300,
            headerName: 'Frecuencia',
            field: 'descripcionFrecuencia',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.descripcionFrecuencia === '' ? 'NO DISPONIBLE' : params.row.descripcionFrecuencia}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 1,
            headerName: 'Tipo Pago',
            field: 'descripcionTipoPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionTipoPago === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoPago}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Estado',
            field: 'descripcionStatus',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionStatus === '' ? 'NO DISPONIBLE' : params.row.descripcionStatus.toLowerCase()}
                </Typography>
            )
        }
    ]
}


export default ColumnsDataGrid