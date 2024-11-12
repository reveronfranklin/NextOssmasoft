import Box from '@mui/material/Box'
import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'

function ColumnsDataGridRetenciones() {
  return [
    {
      flex: 1,
      headerName: 'tipo',
      field: 'descripcionTipoRetencion',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.descripcionTipoRetencion === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoRetencion }
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'concepto',
      field: 'conceptoPago',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.conceptoPago === '' ? 'NO DISPONIBLE' : params.row.conceptoPago }
              </Typography>
            </Box>
          </Box>
        )
      }
    },
    {
      flex: 0,
      headerName: '%',
      field: 'porRetencion',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.porRetencion === 0 ? 0 : params.row.porRetencion}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto retencion',
      field: 'montoRetencion',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoRetencion === 0 ? 0 : params.row.montoRetencion }
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'monto Retenido',
      field: 'montoRetenido',
      editable: true,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.montoRetenido === 0 ? 0 : params.row.montoRetenido }
        </Typography>
      )
    }
  ]
}


export default ColumnsDataGridRetenciones