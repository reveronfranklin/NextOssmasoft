import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import FormatNumber from 'src/utilities/format-numbers'

function ColumnsDataGridListCompromisoByOrden() {
    return [
        {
            flex: 1,
            headerName: 'origenDescripcion',
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
            flex: 1,
            headerName: 'numero',
            field: 'numero',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.numero === '' ? 'NO DISPONIBLE' : params.row.numero}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'fecha',
            field: 'fecha',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.fecha === '' ? 'NO DISPONIBLE' : params.row.fecha}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'descripcion',
            field: 'descripcion',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcion === '' ? 'NO DISPONIBLE' : params.row.descripcion}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'monto',
            field: 'monto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.monto === '' ? 'NO DISPONIBLE' : FormatNumber(params.row.monto)}
                </Typography>
            )
        }
    ]
}


export default ColumnsDataGridListCompromisoByOrden