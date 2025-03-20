import Box from '@mui/material/Box'
import { Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'

function ColumnsDataGridRetenciones() {
  return [
    {
      flex: 1,
      headerName: 'concepto',
      field: 'conceptoPago',
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.conceptoPago === '' ? 'NO DISPONIBLE' : params.row.conceptoPago}
        </Typography>
      )
    },
    {
      flex: 1,
      headerName: 'description',
      field: 'descripcionTipoRetencion',
      renderCell: (params: GridRenderCellParams) => {
        return (
          <Box sx={{ display: 'flex', alignItems: 'left' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Typography variant='body2' sx={{ color: 'text.primary' }}>
                {params.row.descripcionTipoRetencion === '' ? 'NO DISPONIBLE' : params.row.descripcionTipoRetencion}
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
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.porRetencion === 0 ? 0 : params.row.porRetencion}
        </Typography>
      )
    },
    {
      flex: 0,
      headerName: 'CodigoRetencion',
      field: 'CodigoRetencion',
      editable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Typography variant='body2' sx={{ color: 'text.primary' }}>
          {params.row.codigoRetencion === 0 ? 0 : params.row.codigoRetencion}
        </Typography>
      )
    }
  ]
}


export default ColumnsDataGridRetenciones