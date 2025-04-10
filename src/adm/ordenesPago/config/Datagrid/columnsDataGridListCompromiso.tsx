import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import FormatNumber from 'src/utilities/format-numbers'

function ColumnsDataGrid() {
    return [
        {
            flex: 0,
            minWidth: 300,
            headerName: 'Origen',
            field: 'origenDescripcion',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.origenDescripcion === '' ? 'NO DISPONIBLE' : params.row.origenDescripcion}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 0,
            with: 40,
            headerName: 'Fecha',
            field: 'fechaCompromisoString',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fechaCompromisoString}
                </Typography>
            )
        },
        {
            flex: 1,
            minWidth: 180,
            headerName: '# Compromiso',
            field: 'numeroCompromiso',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numeroCompromiso}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Proveedor',
            field: 'nombreProveedor',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.nombreProveedor === '' ? 'NO DISPONIBLE' : params.row.nombreProveedor}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'Monto',
            field: 'monto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {FormatNumber(params.row?.monto) ?? 0}
                </Typography>
            )
        }
    ]
}

export default ColumnsDataGrid