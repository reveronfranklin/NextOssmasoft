import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'
import Box from '@mui/material/Box'
import { } from "src/store/apps/adm"

function ColumnsDataGridListPucByOrden() {
    return [
        {
            flex: 1,
            headerName: 'codigoPucOrdenPago',
            field: 'codigoPucOrdenPago',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.codigoPucOrdenPago}
                </Typography>
            )
        },
        {
            flex: 1,
            headerName: 'descripcionIcp',
            field: 'descripcionIcp',
            renderCell: (params: GridRenderCellParams) => {
                return (
                    <Box sx={{ display: 'flex', alignItems: 'left' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body2' sx={{ color: 'text.primary' }}>
                                {params.row.descripcionIcp === '' ? 'NO DISPONIBLE' : params.row.descripcionIcp}
                            </Typography>
                        </Box>
                    </Box>
                )
            }
        },
        {
            flex: 1,
            headerName: 'descripcionPuc',
            field: 'descripcionPuc',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.descripcionPuc}
                </Typography>
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
            headerName: 'monto',
            field: 'monto',
            renderCell: (params: GridRenderCellParams) => (
                <Typography variant='body2' sx={{ color: 'text.primary' }}>
                    {params.row.monto}
                </Typography>
            )
        }
    ]
}


export default ColumnsDataGridListPucByOrden